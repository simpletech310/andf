import { NextRequest, NextResponse } from "next/server";
import { mux } from "@/lib/mux/client";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const { title, description, eventId } = await req.json();

    const liveStream = await mux.video.liveStreams.create({
      playback_policy: ["public"],
      new_asset_settings: { playback_policy: ["public"] },
    });

    const supabase = createAdminClient();

    const { data: stream, error } = await supabase
      .from("live_streams")
      .insert({
        title: title || "Live Stream",
        description: description || null,
        mux_stream_id: liveStream.id,
        mux_stream_key: liveStream.stream_key,
        mux_playback_id: liveStream.playback_ids?.[0]?.id || null,
        status: "idle",
        event_id: eventId || null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ stream });
  } catch (error) {
    console.error("Stream creation error:", error);
    return NextResponse.json({ error: "Failed to create stream" }, { status: 500 });
  }
}
