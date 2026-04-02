import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { createAdminClient } from "@/lib/supabase/admin";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createAdminClient();

  switch (event.type) {
    case "payment_intent.succeeded": {
      const pi = event.data.object as Stripe.PaymentIntent;
      const meta = pi.metadata;

      // Handle ad sponsorship payments
      if (meta.type === "ad_sponsorship") {
        const submissionId = meta.submission_id;
        if (submissionId) {
          // Get package duration
          const { data: submission } = await supabase
            .from("ad_submissions")
            .select("status, package_id, ad_packages(duration_months)")
            .eq("id", submissionId)
            .single();

          const updates: Record<string, unknown> = {
            payment_status: "paid",
            stripe_payment_intent_id: pi.id,
          };

          // If already approved by admin, activate immediately
          if (submission?.status === "approved") {
            const pkg = Array.isArray(submission.ad_packages) ? submission.ad_packages[0] : submission.ad_packages;
            const durationMonths = (pkg as Record<string, number> | null)?.duration_months || 4;
            const startsAt = new Date();
            const expiresAt = new Date();
            expiresAt.setMonth(expiresAt.getMonth() + durationMonths);

            updates.status = "active";
            updates.starts_at = startsAt.toISOString();
            updates.expires_at = expiresAt.toISOString();
          }

          await supabase
            .from("ad_submissions")
            .update(updates)
            .eq("id", submissionId);
        }
        break;
      }

      if (meta.type === "one_time_donation" || meta.type === "event_ticket") {
        // Check for existing donation (idempotency)
        const { data: existing } = await supabase
          .from("donations")
          .select("id")
          .eq("stripe_payment_intent_id", pi.id)
          .single();

        if (!existing) {
          // Insert donation
          await supabase.from("donations").insert({
            donor_name: meta.is_anonymous === "true" ? "Anonymous" : meta.donor_name,
            donor_email: meta.donor_email,
            amount: pi.amount / 100,
            donation_type: "one_time",
            stripe_payment_intent_id: pi.id,
            status: "succeeded",
            is_anonymous: meta.is_anonymous === "true",
            message: meta.message || null,
            program_id: meta.program_id || null,
          });

          // Upsert lead
          if (meta.donor_email) {
            const { data: lead } = await supabase
              .from("leads")
              .upsert(
                {
                  email: meta.donor_email,
                  full_name: meta.donor_name || null,
                  source: "donation",
                  status: "donor",
                  last_interaction_at: new Date().toISOString(),
                },
                { onConflict: "email" }
              )
              .select("id")
              .single();

            if (lead) {
              await supabase.from("lead_interactions").insert({
                lead_id: lead.id,
                interaction_type: "donation",
                description: `Donated $${pi.amount / 100}`,
                metadata: { amount: pi.amount / 100, payment_intent: pi.id },
              });
            }
          }
        }

        // Update registration payment status if event ticket
        if (meta.type === "event_ticket" && meta.registration_id) {
          await supabase
            .from("registrations")
            .update({ payment_status: "paid", amount_paid: pi.amount / 100 })
            .eq("id", meta.registration_id);
        }
      }
      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object as unknown as Record<string, unknown>;
      const subId = typeof invoice.subscription === "string" ? invoice.subscription : null;
      const amountPaid = typeof invoice.amount_paid === "number" ? invoice.amount_paid : 0;

      if (subId && amountPaid > 0) {
        await supabase.from("donations").insert({
          donor_email: typeof invoice.customer_email === "string" ? invoice.customer_email : null,
          amount: amountPaid / 100,
          donation_type: "recurring",
          stripe_payment_intent_id: typeof invoice.payment_intent === "string" ? invoice.payment_intent : null,
          stripe_subscription_id: subId,
          stripe_customer_id: typeof invoice.customer === "string" ? invoice.customer : null,
          status: "succeeded",
        });
      }
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await supabase
        .from("donations")
        .update({ status: "cancelled" })
        .eq("stripe_subscription_id", sub.id)
        .eq("status", "succeeded");
      break;
    }
  }

  return NextResponse.json({ received: true });
}
