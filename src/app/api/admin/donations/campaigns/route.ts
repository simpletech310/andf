import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("donation_campaigns")
      .select("*, donations(count)")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const campaigns = (data || []).map((c: any) => ({
      ...c,
      donationCount: c.donations?.[0]?.count || 0,
      progressPercent: c.goal_amount > 0 ? Math.min(100, Math.round((c.raised_amount / c.goal_amount) * 100)) : 0,
    }));

    return NextResponse.json({ campaigns });
  } catch (error) {
    console.error("Campaigns list error:", error);
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("donation_campaigns")
      .insert({
        name: body.name,
        description: body.description || null,
        goal_amount: body.goal_amount || 0,
        start_date: body.start_date || null,
        end_date: body.end_date || null,
        status: body.status || "draft",
        cover_image_url: body.cover_image_url || null,
        is_featured: body.is_featured || false,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ campaign: data });
  } catch (error) {
    console.error("Campaign create error:", error);
    return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 });
  }
}
