import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data: streams, error } = await supabase
      .from("live_streams")
      .select("*, events(title)")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const formatted = (streams || []).map((s: any) => ({
      ...s,
      event_title: s.events?.title || "No Event",
    }));

    return NextResponse.json({ streams: formatted });
  } catch (error) {
    console.error("Streams list error:", error);
    return NextResponse.json({ error: "Failed to fetch streams" }, { status: 500 });
  }
}
