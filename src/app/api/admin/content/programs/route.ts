import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data: programs, error } = await supabase
      .from("programs")
      .select("*, events(count)")
      .order("display_order", { ascending: true });

    if (error) throw error;

    const formatted = (programs || []).map((p: any) => ({
      ...p,
      eventsCount: p.events?.[0]?.count || 0,
    }));

    return NextResponse.json({ programs: formatted });
  } catch (error) {
    console.error("Programs list error:", error);
    return NextResponse.json({ error: "Failed to fetch programs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = createAdminClient();

    const { data: program, error } = await supabase
      .from("programs")
      .insert({
        title: body.title,
        slug: body.slug,
        tagline: body.tagline || null,
        description: body.description || null,
        hero_image_url: body.hero_image_url || null,
        is_active: body.is_active ?? true,
        display_order: body.display_order ?? 0,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ program });
  } catch (error) {
    console.error("Program create error:", error);
    return NextResponse.json({ error: "Failed to create program" }, { status: 500 });
  }
}
