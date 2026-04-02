import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { content } = await req.json();

    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Note content is required" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Add interaction of type 'note'
    const { data, error } = await supabase
      .from("lead_interactions")
      .insert({
        lead_id: id,
        interaction_type: "note",
        description: content.trim(),
        metadata: {},
      })
      .select()
      .single();

    if (error) throw error;

    // Update last_interaction_at on the lead
    await supabase
      .from("leads")
      .update({ last_interaction_at: new Date().toISOString() })
      .eq("id", id);

    return NextResponse.json({ success: true, interaction: data });
  } catch (error) {
    console.error("Add note error:", error);
    return NextResponse.json({ error: "Failed to add note" }, { status: 500 });
  }
}
