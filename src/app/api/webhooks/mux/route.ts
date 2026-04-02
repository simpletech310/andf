import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, data } = body;

    const supabase = createAdminClient();

    switch (type) {
      case "video.live_stream.active": {
        await supabase
          .from("live_streams")
          .update({ status: "active", started_at: new Date().toISOString() })
          .eq("mux_stream_id", data.id);
        break;
      }
      case "video.live_stream.idle": {
        await supabase
          .from("live_streams")
          .update({ status: "idle", ended_at: new Date().toISOString() })
          .eq("mux_stream_id", data.id);
        break;
      }
      case "video.asset.ready": {
        // Handle live stream recording
        if (data.live_stream_id) {
          await supabase
            .from("live_streams")
            .update({ recording_asset_id: data.id })
            .eq("mux_stream_id", data.live_stream_id);
        }

        // Handle video_library assets
        const playbackId = data.playback_ids?.[0]?.id;
        const duration = data.duration;

        if (playbackId) {
          // Check if this asset belongs to video_library (by upload ID or asset ID)
          const { data: libraryVideo } = await supabase
            .from("video_library")
            .select("id")
            .or(`mux_upload_id.eq.${data.upload_id || ""},mux_asset_id.eq.${data.id}`)
            .single();

          if (libraryVideo) {
            await supabase
              .from("video_library")
              .update({
                status: "ready",
                mux_asset_id: data.id,
                mux_playback_id: playbackId,
                duration_seconds: duration || null,
                thumbnail_url: `https://image.mux.com/${playbackId}/thumbnail.webp?width=640&height=360`,
              })
              .eq("id", libraryVideo.id);
          }
        }

        // Handle ad video assets

        if (playbackId) {
          const { data: adSubmission } = await supabase
            .from("ad_submissions")
            .select("id, payment_status, package_id")
            .eq("mux_asset_id", data.id)
            .single();

          if (adSubmission) {
            const updates: Record<string, unknown> = {
              mux_playback_id: playbackId,
              duration_seconds: duration || null,
              thumbnail_url: `https://image.mux.com/${playbackId}/thumbnail.webp?width=640&height=360`,
            };

            // If already paid, activate
            if (adSubmission.payment_status === "paid") {
              const { data: pkg } = await supabase
                .from("ad_packages")
                .select("duration_months")
                .eq("id", adSubmission.package_id)
                .single();

              const startsAt = new Date();
              const expiresAt = new Date();
              expiresAt.setMonth(expiresAt.getMonth() + (pkg?.duration_months || 4));

              updates.status = "active";
              updates.starts_at = startsAt.toISOString();
              updates.expires_at = expiresAt.toISOString();
            }

            await supabase
              .from("ad_submissions")
              .update(updates)
              .eq("id", adSubmission.id);
          }
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Mux webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
