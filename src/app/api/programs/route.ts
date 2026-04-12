import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    const supabase = createAdminClient();

    if (slug) {
      // Single program by slug
      const { data: program, error } = await supabase
        .from("programs")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();

      if (error || !program) {
        return NextResponse.json({ error: "Program not found" }, { status: 404 });
      }

      // Also fetch upcoming events for this program
      const { data: events } = await supabase
        .from("events")
        .select("id, title, date, location")
        .eq("program_id", program.id)
        .gte("date", new Date().toISOString())
        .order("date", { ascending: true })
        .limit(5);

      return NextResponse.json({ program, events: events || [] });
    }

    // All active programs
    const { data: programs, error } = await supabase
      .from("programs")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ programs: programs || [] });
  } catch (error) {
    console.error("Public programs error:", error);
    return NextResponse.json({ error: "Failed to fetch programs" }, { status: 500 });
  }
}
