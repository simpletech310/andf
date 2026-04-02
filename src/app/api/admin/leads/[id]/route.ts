import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createAdminClient();

    // Fetch lead
    const { data: lead, error } = await supabase
      .from("leads")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // Fetch interactions, donations, registrations in parallel
    const [interactions, donations, registrations] = await Promise.all([
      supabase
        .from("lead_interactions")
        .select("*")
        .eq("lead_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from("donations")
        .select("id, amount, donation_type, status, created_at, program_id")
        .eq("lead_id", id)
        .eq("status", "succeeded")
        .order("created_at", { ascending: false }),
      supabase
        .from("registrations")
        .select("id, event_id, status, created_at, events(title)")
        .eq("lead_id", id)
        .order("created_at", { ascending: false }),
    ]);

    const totalDonated = (donations.data ?? []).reduce(
      (sum, d) => sum + Number(d.amount),
      0
    );

    return NextResponse.json({
      lead: {
        id: lead.id,
        name: lead.full_name || "Unknown",
        email: lead.email,
        phone: lead.phone,
        source: lead.source,
        status: lead.status,
        interests: lead.interest_areas || [],
        notes: lead.notes,
        totalDonated,
        eventsRegistered: registrations.data?.length ?? 0,
        createdAt: lead.created_at,
        lastInteraction: lead.last_interaction_at,
      },
      interactions: (interactions.data ?? []).map((i) => ({
        id: i.id,
        type: i.interaction_type,
        description: i.description,
        metadata: i.metadata,
        date: i.created_at,
      })),
      donations: donations.data ?? [],
      registrations: registrations.data ?? [],
    });
  } catch (error) {
    console.error("Lead detail API error:", error);
    return NextResponse.json({ error: "Failed to fetch lead" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const supabase = createAdminClient();

    const updates: Record<string, unknown> = {};
    if (body.status !== undefined) updates.status = body.status;
    if (body.notes !== undefined) updates.notes = body.notes;
    if (body.interest_areas !== undefined) updates.interest_areas = body.interest_areas;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("leads")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, lead: data });
  } catch (error) {
    console.error("Lead update error:", error);
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
  }
}
