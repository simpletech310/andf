import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 10 tracking calls per minute per IP
    const ip = getClientIp(req);
    const limiter = rateLimit(`lead:${ip}`, { limit: 10, window: 60_000 });
    if (!limiter.success) {
      return NextResponse.json(
        { error: "Too many requests." },
        { status: 429 }
      );
    }

    const { email, name, phone, interactionType, description, metadata } = await req.json();

    const supabase = createAdminClient();

    let leadId: string | null = null;

    if (email) {
      const { data: lead } = await supabase
        .from("leads")
        .upsert(
          {
            email,
            full_name: name || undefined,
            phone: phone || undefined,
            source: "website",
            last_interaction_at: new Date().toISOString(),
          },
          { onConflict: "email", ignoreDuplicates: false }
        )
        .select("id")
        .single();

      leadId = lead?.id || null;
    }

    if (leadId && interactionType) {
      await supabase.from("lead_interactions").insert({
        lead_id: leadId,
        interaction_type: interactionType,
        description: description || null,
        metadata: metadata || {},
      });
    }

    return NextResponse.json({ success: true, leadId });
  } catch (error) {
    console.error("Lead tracking error:", error);
    return NextResponse.json({ error: "Tracking failed" }, { status: 500 });
  }
}
