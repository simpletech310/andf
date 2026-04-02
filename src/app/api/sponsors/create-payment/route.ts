import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe/client";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const limiter = rateLimit(`sponsor-payment:${ip}`, { limit: 5, window: 60_000 });
    if (!limiter.success) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    }

    const { submissionId, sponsorId } = await req.json();

    if (!submissionId || !sponsorId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Get submission with package info
    const { data: submission } = await supabase
      .from("ad_submissions")
      .select("*, ad_packages(*)")
      .eq("id", submissionId)
      .eq("sponsor_id", sponsorId)
      .single();

    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    if (submission.payment_status === "paid") {
      return NextResponse.json({ error: "Already paid" }, { status: 400 });
    }

    // Get sponsor's Stripe customer
    const { data: sponsor } = await supabase
      .from("ad_sponsors")
      .select("stripe_customer_id, contact_email, business_name")
      .eq("id", sponsorId)
      .single();

    if (!sponsor) {
      return NextResponse.json({ error: "Sponsor not found" }, { status: 404 });
    }

    const pkg = submission.ad_packages;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: pkg.price_cents,
      currency: "usd",
      customer: sponsor.stripe_customer_id || undefined,
      metadata: {
        type: "ad_sponsorship",
        submission_id: submissionId,
        package_id: pkg.id,
        sponsor_id: sponsorId,
        package_name: pkg.name,
        duration_months: String(pkg.duration_months),
        donor_email: sponsor.contact_email,
        donor_name: sponsor.business_name,
      },
    });

    // Link payment intent to submission
    await supabase
      .from("ad_submissions")
      .update({ stripe_payment_intent_id: paymentIntent.id })
      .eq("id", submissionId);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount: pkg.price_cents,
      packageName: pkg.name,
    });
  } catch (error) {
    console.error("Sponsor payment error:", error);
    return NextResponse.json({ error: "Payment creation failed" }, { status: 500 });
  }
}
