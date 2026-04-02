import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  try {
    const supabase = createAdminClient();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    let query = supabase
      .from("events")
      .select("*, event_registrations(count)")
      .order("start_date", { ascending: false });

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    const { data: events, error } = await query;

    if (error) throw error;

    const formatted = (events || []).map((event: any) => ({
      ...event,
      registration_count: event.event_registrations?.[0]?.count || 0,
    }));

    return NextResponse.json({ events: formatted });
  } catch (error) {
    console.error("Events list error:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = createAdminClient();

    const { data: event, error } = await supabase
      .from("events")
      .insert({
        title: body.title,
        description: body.description || null,
        program_id: body.program_id || null,
        event_type: body.event_type || "in_person",
        start_date: body.start_date,
        end_date: body.end_date || null,
        location: body.location || null,
        capacity: body.capacity ? parseInt(body.capacity) : null,
        price_cents: body.price_cents ? Math.round(parseFloat(body.price_cents) * 100) : 0,
        status: body.status || "draft",
        registration_form_schema: body.registration_form_schema || null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ event });
  } catch (error) {
    console.error("Event create error:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
