import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { mux } from "@/lib/mux/client";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createAdminClient();

    const { data: video, error } = await supabase
      .from("video_library")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json({ video });
  } catch (error) {
    console.error("Video GET error:", error);
    return NextResponse.json({ error: "Failed to fetch video" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const supabase = createAdminClient();

    const updates: Record<string, unknown> = {};
    if (body.title !== undefined) updates.title = body.title;
    if (body.description !== undefined) updates.description = body.description;
    if (body.category !== undefined) updates.category = body.category;
    if (body.featured !== undefined) updates.featured = body.featured;
    if (body.published_at !== undefined) updates.published_at = body.published_at;

    const { data: video, error } = await supabase
      .from("video_library")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ video });
  } catch (error) {
    console.error("Video PATCH error:", error);
    return NextResponse.json({ error: "Failed to update video" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createAdminClient();

    // Get the video to find the Mux asset ID
    const { data: video } = await supabase
      .from("video_library")
      .select("mux_asset_id")
      .eq("id", id)
      .single();

    // Delete from Mux if asset exists
    if (video?.mux_asset_id) {
      try {
        await mux.video.assets.delete(video.mux_asset_id);
      } catch (muxErr) {
        console.error("Mux asset delete error:", muxErr);
      }
    }

    // Delete from database
    const { error } = await supabase
      .from("video_library")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Video DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete video" }, { status: 500 });
  }
}
