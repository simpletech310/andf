import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const supabase = createAdminClient();

    const { data: registration, error: regError } = await supabase
      .from("event_registrations")
      .select("id, registrant_name, registrant_email, checked_in, checked_in_at, event_id")
      .eq("qr_code_token", token)
      .single();

    if (regError || !registration) {
      return NextResponse.json({ error: "Invalid check-in token" }, { status: 404 });
    }

    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("id, title, start_date, location")
      .eq("id", registration.event_id)
      .single();

    if (eventError || !event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ registration, event });
  } catch (error) {
    console.error("Check-in token lookup error:", error);
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }
}
