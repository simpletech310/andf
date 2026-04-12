import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { mux } from "@/lib/mux/client";

/**
 * POST: Create a Mux direct upload for an ad video.
 * Returns uploadUrl that the client uses to upload the video file directly to Mux.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { submissionId } = body;

    // Create Mux direct upload
    const upload = await mux.video.uploads.create({
      cors_origin: "*",
      new_asset_settings: {
        playback_policy: ["public"],
      },
    });

    // If a submission ID is provided, update it with the Mux upload ID
    if (submissionId) {
      const supabase = createAdminClient();
      await supabase
        .from("ad_submissions")
        .update({
          original_video_url: `mux://${upload.id}`,
        })
        .eq("id", submissionId);
    }

    return NextResponse.json({
      uploadUrl: upload.url,
      uploadId: upload.id,
    });
  } catch (error) {
    console.error("Ad video upload error:", error);
    return NextResponse.json({ error: "Failed to create upload" }, { status: 500 });
  }
}
