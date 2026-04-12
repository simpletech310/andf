import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("video_library")
      .select("id, title, description, category, thumbnail_url, duration_seconds, pay_per_view, minimum_amount, view_count, published_at")
      .eq("status", "ready")
      .not("published_at", "is", null)
      .order("published_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ videos: data || [] });
  } catch (error) {
    return NextResponse.json({ videos: [] });
  }
}
