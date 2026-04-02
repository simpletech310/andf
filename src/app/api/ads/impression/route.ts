import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const limiter = rateLimit(`ad-impression:${ip}`, { limit: 30, window: 60_000 });
    if (!limiter.success) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    }

    const { submissionId, type, channel, streamId } = await req.json();

    if (!submissionId || !type) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const validTypes = ["view", "click", "skip"];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Log impression
    await supabase.from("ad_impressions").insert({
      submission_id: submissionId,
      stream_id: streamId || null,
      channel: channel || null,
      impression_type: type,
      viewer_session: ip,
    });

    // Increment counter on submission
    if (type === "view") {
      await supabase.rpc("increment_ad_impressions", { ad_id: submissionId });
    } else if (type === "click") {
      await supabase.rpc("increment_ad_clicks", { ad_id: submissionId });
    }

    // Fallback: direct update if RPC not set up yet
    if (type === "view") {
      const { data: sub } = await supabase
        .from("ad_submissions")
        .select("impression_count")
        .eq("id", submissionId)
        .single();
      if (sub) {
        await supabase
          .from("ad_submissions")
          .update({ impression_count: (sub.impression_count || 0) + 1 })
          .eq("id", submissionId);
      }
    } else if (type === "click") {
      const { data: sub } = await supabase
        .from("ad_submissions")
        .select("click_count")
        .eq("id", submissionId)
        .single();
      if (sub) {
        await supabase
          .from("ad_submissions")
          .update({ click_count: (sub.click_count || 0) + 1 })
          .eq("id", submissionId);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ad impression error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
