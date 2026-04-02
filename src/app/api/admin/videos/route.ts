import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { mux } from "@/lib/mux/client";

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data: videos, error } = await supabase
      .from("video_library")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ videos: videos || [] });
  } catch (error) {
    console.error("Videos list error:", error);
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, category, programId } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Create Mux direct upload
    const upload = await mux.video.uploads.create({
      cors_origin: "*",
      new_asset_settings: {
        playback_policy: ["public"],
      },
    });

    const supabase = createAdminClient();

    const { data: video, error } = await supabase
      .from("video_library")
      .insert({
        title,
        description: description || null,
        category: category || "general",
        program_id: programId || null,
        mux_upload_id: upload.id,
        status: "waiting",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ video, uploadUrl: upload.url });
  } catch (error) {
    console.error("Video create error:", error);
    return NextResponse.json({ error: "Failed to create video" }, { status: 500 });
  }
}
