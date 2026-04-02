import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { mux } from "@/lib/mux/client";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createAdminClient();

    // 1. Fetch the stream record to get the Mux stream ID
    const { data: stream, error: fetchError } = await supabase
      .from("live_streams")
      .select("id, mux_stream_id")
      .eq("id", id)
      .single();

    if (fetchError || !stream) {
      return NextResponse.json(
        { error: "Stream not found" },
        { status: 404 }
      );
    }

    // 2. Delete the live stream from Mux
    if (stream.mux_stream_id) {
      try {
        await mux.video.liveStreams.delete(stream.mux_stream_id);
      } catch (muxError: any) {
        // If Mux returns 404, the stream was already deleted — continue cleanup
        if (muxError?.status !== 404) {
          console.error("Mux deletion error:", muxError);
          return NextResponse.json(
            { error: "Failed to delete stream from Mux" },
            { status: 502 }
          );
        }
      }
    }

    // 3. Delete the record from Supabase
    const { error: deleteError } = await supabase
      .from("live_streams")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Supabase deletion error:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete stream record" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Stream delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete stream" },
      { status: 500 }
    );
  }
}
