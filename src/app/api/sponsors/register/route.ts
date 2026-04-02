import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe/client";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { sanitizeString, sanitizeEmail, sanitizePhone, truncate } from "@/lib/sanitize";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const limiter = rateLimit(`sponsor-register:${ip}`, { limit: 3, window: 60_000 });
    if (!limiter.success) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    }

    const body = await req.json();
    const businessName = truncate(sanitizeString(body.businessName || ""), 200);
    const contactName = truncate(sanitizeString(body.contactName || ""), 100);
    const contactEmail = sanitizeEmail(body.contactEmail || "");
    const contactPhone = body.contactPhone ? sanitizePhone(body.contactPhone) : null;
    const websiteUrl = body.websiteUrl ? truncate(sanitizeString(body.websiteUrl), 500) : null;

    if (!businessName || !contactName || !contactEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create Stripe customer
    const customer = await stripe.customers.create({
      email: contactEmail,
      name: businessName,
      metadata: { source: "andf_ad_sponsor", contact_name: contactName },
    });

    const supabase = createAdminClient();

    const { data: sponsor, error } = await supabase
      .from("ad_sponsors")
      .insert({
        business_name: businessName,
        contact_name: contactName,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        website_url: websiteUrl,
        stripe_customer_id: customer.id,
        status: "active",
      })
      .select()
      .single();

    if (error) throw error;

    // Track as lead
    const { data: lead } = await supabase
      .from("leads")
      .upsert(
        {
          email: contactEmail,
          full_name: contactName,
          source: "website",
          last_interaction_at: new Date().toISOString(),
        },
        { onConflict: "email" }
      )
      .select("id")
      .single();

    if (lead) {
      await supabase.from("lead_interactions").insert({
        lead_id: lead.id,
        interaction_type: "form_submission",
        description: `Registered as ad sponsor: ${businessName}`,
        metadata: { sponsor_id: sponsor.id },
      });
    }

    return NextResponse.json({ success: true, sponsor });
  } catch (error) {
    console.error("Sponsor registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
