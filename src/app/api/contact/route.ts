import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { sanitizeString, sanitizeEmail, sanitizePhone, truncate } from "@/lib/sanitize";

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 3 contact submissions per minute per IP
    const ip = getClientIp(req);
    const limiter = rateLimit(`contact:${ip}`, { limit: 3, window: 60_000 });
    if (!limiter.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const name = truncate(sanitizeString(body.name || ""), 100);
    const email = sanitizeEmail(body.email || "");
    const phone = body.phone ? sanitizePhone(body.phone) : null;
    const subject = truncate(sanitizeString(body.subject || ""), 100);
    const message = truncate(sanitizeString(body.message || ""), 2000);

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Upsert lead
    const { data: lead } = await supabase
      .from("leads")
      .upsert(
        {
          email,
          full_name: name,
          phone: phone || null,
          source: "website",
          interest_areas: [subject],
          last_interaction_at: new Date().toISOString(),
        },
        { onConflict: "email" }
      )
      .select("id")
      .single();

    if (lead) {
      await supabase.from("lead_interactions").insert({
        lead_id: lead.id,
        interaction_type: "contact_form",
        description: `Contact form: ${subject}`,
        metadata: { subject, message, phone },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}
