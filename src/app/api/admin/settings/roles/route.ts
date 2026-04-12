import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("role_permissions")
      .select("*")
      .order("role")
      .order("resource")
      .order("action");

    if (error) throw error;
    return NextResponse.json({ permissions: data || [] });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch permissions" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { role, resource, action, allowed } = body;

    if (!role || !resource || !action) {
      return NextResponse.json({ error: "role, resource, and action are required" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("role_permissions")
      .upsert(
        { role, resource, action, allowed },
        { onConflict: "role,resource,action" }
      )
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ permission: data });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update permission" }, { status: 500 });
  }
}
