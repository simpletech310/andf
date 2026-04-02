import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  try {
    const supabase = createAdminClient();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    let query = supabase
      .from("events")
      .select("*, registrations(count)")
      .order("start_date", { ascending: false });

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    const { data: events, error } = await query;

    if (error) throw error;

    const formatted = (events || []).map((event: any) => ({
      ...event,
      registration_count: event.registrations?.[0]?.count || 0,
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

    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") + "-" + Date.now().toString(36);

    const { data: event, error } = await supabase
      .from("events")
      .insert({
        title: body.title,
        slug,
        description: body.description || null,
        short_description: body.short_description || null,
        program_id: body.program_id || null,
        event_type: body.event_type || "in_person",
        start_date: body.start_date,
        end_date: body.end_date || null,
        location_name: body.location_name || body.location || null,
        location_address: body.location_address || null,
        max_capacity: body.capacity ? parseInt(body.capacity) : null,
        ticket_price: body.ticket_price ? parseFloat(body.ticket_price) : 0,
        status: body.status || "draft",
        cover_image_url: body.cover_image_url || null,
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
