import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: videoId } = await params;
    const supabase = createAdminClient();

    const { data: cuepoints, error } = await supabase
      .from("video_ad_cuepoints")
      .select(`
        id,
        video_id,
        trigger_at_seconds,
        ad_submission_id,
        is_active,
        created_at,
        ad_submissions (
          id,
          title,
          sponsor_id,
          status
        )
      `)
      .eq("video_id", videoId)
      .order("trigger_at_seconds", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ cuepoints: cuepoints || [] });
  } catch (error) {
    console.error("Cuepoints GET error:", error);
    return NextResponse.json({ error: "Failed to fetch cue points" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: videoId } = await params;
    const { triggerAtSeconds, adSubmissionId } = await req.json();

    if (triggerAtSeconds === undefined || !adSubmissionId) {
      return NextResponse.json(
        { error: "triggerAtSeconds and adSubmissionId are required" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data: cuepoint, error } = await supabase
      .from("video_ad_cuepoints")
      .insert({
        video_id: videoId,
        trigger_at_seconds: triggerAtSeconds,
        ad_submission_id: adSubmissionId,
        is_active: true,
      })
      .select(`
        id,
        video_id,
        trigger_at_seconds,
        ad_submission_id,
        is_active,
        created_at,
        ad_submissions (
          id,
          title,
          sponsor_id,
          status
        )
      `)
      .single();

    if (error) throw error;

    return NextResponse.json({ cuepoint });
  } catch (error) {
    console.error("Cuepoint POST error:", error);
    return NextResponse.json({ error: "Failed to add cue point" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await params;
    const { cuePointId } = await req.json();

    if (!cuePointId) {
      return NextResponse.json({ error: "cuePointId is required" }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { error } = await supabase
      .from("video_ad_cuepoints")
      .delete()
      .eq("id", cuePointId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cuepoint DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete cue point" }, { status: 500 });
  }
}
