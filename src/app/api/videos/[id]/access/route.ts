import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    if (!email && !token) {
      return NextResponse.json({ hasAccess: false });
    }

    const supabase = createAdminClient();
    let query = supabase
      .from("video_access")
      .select("*")
      .eq("video_id", id)
      .gt("expires_at", new Date().toISOString());

    if (email) query = query.eq("viewer_email", email);
    if (token) query = query.eq("access_token", token);

    const { data } = await query.single();

    return NextResponse.json({
      hasAccess: !!data,
      access: data || null,
    });
  } catch (error) {
    return NextResponse.json({ hasAccess: false });
  }
}
