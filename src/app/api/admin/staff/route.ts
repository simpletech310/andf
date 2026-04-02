import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data: staff, error } = await supabase
      .from("profiles")
      .select("id, full_name, email, role, avatar_url, updated_at")
      .order("role", { ascending: true })
      .order("full_name", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ staff: staff || [] });
  } catch (error) {
    console.error("Staff list error:", error);
    return NextResponse.json({ error: "Failed to fetch staff" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, role } = await req.json();

    if (!email || !role) {
      return NextResponse.json({ error: "Email and role are required" }, { status: 400 });
    }

    if (!["admin", "editor", "viewer"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data: invitation, error } = await supabase
      .from("staff_invitations")
      .insert({
        email,
        role,
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, invitation });
  } catch (error) {
    console.error("Staff invite error:", error);
    return NextResponse.json({ error: "Failed to invite staff" }, { status: 500 });
  }
}
