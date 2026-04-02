import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin-auth";
import { sanitizeString, truncate } from "@/lib/sanitize";

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if ("error" in auth) return auth.error;

    const body = await req.json();
    const { ids, action, reason } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "No application IDs provided" },
        { status: 400 }
      );
    }

    const validActions = ["accept", "reject", "waitlist"];
    if (!action || !validActions.includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be: accept, reject, or waitlist" },
        { status: 400 }
      );
    }

    const statusMap: Record<string, string> = {
      accept: "accepted",
      reject: "rejected",
      waitlist: "waitlisted",
    };

    const supabase = createAdminClient();

    const updates: Record<string, unknown> = {
      status: statusMap[action],
      reviewed_at: new Date().toISOString(),
      reviewed_by: auth.user.id,
    };

    if (reason) {
      updates.reviewer_notes = truncate(sanitizeString(reason), 5000);
    }

    const { data, error } = await supabase
      .from("program_applications")
      .update(updates)
      .in("id", ids)
      .select("id, status");

    if (error) throw error;

    return NextResponse.json({
      success: true,
      updated: data?.length || 0,
      status: statusMap[action],
    });
  } catch (error) {
    console.error("Bulk application update error:", error);
    return NextResponse.json(
      { error: "Bulk update failed" },
      { status: 500 }
    );
  }
}
