import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data: testimonials, error } = await supabase
      .from("testimonials")
      .select("*, programs(title)")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const formatted = (testimonials || []).map((t: any) => ({
      ...t,
      program_name: t.programs?.title || null,
    }));

    return NextResponse.json({ testimonials: formatted });
  } catch (error) {
    console.error("Testimonials list error:", error);
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = createAdminClient();

    const { data: testimonial, error } = await supabase
      .from("testimonials")
      .insert({
        author_name: body.author_name || body.author,
        title: body.title || null,
        quote: body.quote,
        program_id: body.program_id || null,
        is_featured: body.is_featured ?? false,
        is_active: body.is_active ?? true,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ testimonial });
  } catch (error) {
    console.error("Testimonial create error:", error);
    return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 });
  }
}
