import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;
    const supabase = createAdminClient();

    // Get event details
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("id, title, max_capacity, checked_in_count")
      .eq("id", eventId)
      .single();

    if (eventError || !event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Get all registrations with check-in status
    const { data: registrations, error: regError } = await supabase
      .from("registrations")
      .select(`
        id,
        registrant_name,
        registrant_email,
        registrant_phone,
        status,
        payment_status,
        amount_paid,
        checked_in,
        checked_in_at
      `)
      .eq("event_id", eventId)
      .order("registrant_name", { ascending: true });

    if (regError) throw regError;

    return NextResponse.json({
      event,
      registrations: registrations || [],
    });
  } catch (error) {
    console.error("Check-in GET error:", error);
    return NextResponse.json({ error: "Failed to fetch check-in data" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;
    const { registrationId } = await req.json();

    if (!registrationId) {
      return NextResponse.json({ error: "registrationId is required" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const now = new Date().toISOString();

    // Update registration
    const { error: regError } = await supabase
      .from("registrations")
      .update({ checked_in: true, checked_in_at: now })
      .eq("id", registrationId);

    if (regError) throw regError;

    // Increment event checked_in_count
    const { data: event } = await supabase
      .from("events")
      .select("checked_in_count")
      .eq("id", eventId)
      .single();

    await supabase
      .from("events")
      .update({ checked_in_count: (event?.checked_in_count || 0) + 1 })
      .eq("id", eventId);

    return NextResponse.json({ success: true, checked_in_at: now });
  } catch (error) {
    console.error("Check-in POST error:", error);
    return NextResponse.json({ error: "Failed to check in" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;
    const { registrationId } = await req.json();

    if (!registrationId) {
      return NextResponse.json({ error: "registrationId is required" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Update registration
    const { error: regError } = await supabase
      .from("registrations")
      .update({ checked_in: false, checked_in_at: null })
      .eq("id", registrationId);

    if (regError) throw regError;

    // Decrement event checked_in_count
    const { data: event } = await supabase
      .from("events")
      .select("checked_in_count")
      .eq("id", eventId)
      .single();

    await supabase
      .from("events")
      .update({ checked_in_count: Math.max((event?.checked_in_count || 1) - 1, 0) })
      .eq("id", eventId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Check-in DELETE error:", error);
    return NextResponse.json({ error: "Failed to undo check-in" }, { status: 500 });
  }
}
