import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("event_sessions")
      .select("*, session_checkins(count)")
      .eq("event_id", id)
      .order("display_order", { ascending: true });

    if (error) throw error;

    const sessions = (data || []).map((s: any) => ({
      ...s,
      checkinCount: s.session_checkins?.[0]?.count || 0,
    }));

    return NextResponse.json({ sessions });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("event_sessions")
      .insert({
        event_id: id,
        title: body.title,
        description: body.description || null,
        start_time: body.start_time || null,
        end_time: body.end_time || null,
        location: body.location || null,
        capacity: body.capacity || null,
        display_order: body.display_order || 0,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ session: data });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
}
