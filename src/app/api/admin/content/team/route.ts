import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data: members, error } = await supabase
      .from("team_members")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ members: members || [] });
  } catch (error) {
    console.error("Team list error:", error);
    return NextResponse.json({ error: "Failed to fetch team" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = createAdminClient();

    const { data: member, error } = await supabase
      .from("team_members")
      .insert({
        full_name: body.full_name || body.name,
        title: body.title || null,
        role_type: body.role_type || body.type || "staff",
        bio: body.bio || null,
        headshot_url: body.headshot_url || body.photo_url || null,
        is_active: body.is_active ?? true,
        display_order: body.display_order ?? 0,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ member });
  } catch (error) {
    console.error("Team create error:", error);
    return NextResponse.json({ error: "Failed to create member" }, { status: 500 });
  }
}
