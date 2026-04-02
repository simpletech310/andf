import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin-auth";
import { sanitizeString, truncate } from "@/lib/sanitize";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin();
    if ("error" in auth) return auth.error;

    const { id } = await params;
    const supabase = createAdminClient();

    const { data: application, error } = await supabase
      .from("program_applications")
      .select("*, programs:program_id(id, title, slug)")
      .eq("id", id)
      .single();

    if (error || !application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ application });
  } catch (error) {
    console.error("Admin application detail error:", error);
    return NextResponse.json(
      { error: "Failed to fetch application" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin();
    if ("error" in auth) return auth.error;

    const { id } = await params;
    const body = await req.json();
    const supabase = createAdminClient();

    const validStatuses = [
      "submitted",
      "under_review",
      "accepted",
      "rejected",
      "waitlisted",
    ];

    const updates: Record<string, unknown> = {};

    if (body.status) {
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json(
          { error: "Invalid status" },
          { status: 400 }
        );
      }
      updates.status = body.status;

      // Set reviewed fields when moving beyond submitted
      if (body.status !== "submitted") {
        updates.reviewed_at = new Date().toISOString();
        updates.reviewed_by = auth.user.id;
      }
    }

    if (body.reviewer_notes !== undefined) {
      updates.reviewer_notes = truncate(
        sanitizeString(body.reviewer_notes),
        5000
      );
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const { data: application, error } = await supabase
      .from("program_applications")
      .update(updates)
      .eq("id", id)
      .select("*, programs:program_id(id, title, slug)")
      .single();

    if (error) throw error;

    return NextResponse.json({ application });
  } catch (error) {
    console.error("Admin application update error:", error);
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin();
    if ("error" in auth) return auth.error;

    const { id } = await params;
    const supabase = createAdminClient();

    const { error } = await supabase
      .from("program_applications")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin application delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete application" },
      { status: 500 }
    );
  }
}
