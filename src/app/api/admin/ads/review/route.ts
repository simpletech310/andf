import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { mux } from "@/lib/mux/client";
import { requireAdmin } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if ("error" in auth) return auth.error;

    const { submissionId, action, rejectionReason } = await req.json();

    if (!submissionId || !action) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Get submission
    const { data: submission } = await supabase
      .from("ad_submissions")
      .select("*")
      .eq("id", submissionId)
      .single();

    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    if (action === "reject") {
      await supabase
        .from("ad_submissions")
        .update({
          status: "rejected",
          rejection_reason: rejectionReason || "Does not meet guidelines",
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", submissionId);

      return NextResponse.json({ success: true, status: "rejected" });
    }

    // Approve: upload to Mux
    const asset = await mux.video.assets.create({
      inputs: [{ url: submission.original_video_url }],
      playback_policy: ["public"],
      encoding_tier: "baseline",
    });

    const playbackId = asset.playback_ids?.[0]?.id || null;

    await supabase
      .from("ad_submissions")
      .update({
        status: "approved",
        mux_asset_id: asset.id,
        mux_playback_id: playbackId,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", submissionId);

    // If already paid, activate immediately
    if (submission.payment_status === "paid") {
      const pkg = await supabase
        .from("ad_packages")
        .select("duration_months")
        .eq("id", submission.package_id)
        .single();

      const startsAt = new Date();
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + (pkg.data?.duration_months || 4));

      await supabase
        .from("ad_submissions")
        .update({
          status: "active",
          starts_at: startsAt.toISOString(),
          expires_at: expiresAt.toISOString(),
        })
        .eq("id", submissionId);
    }

    return NextResponse.json({
      success: true,
      status: "approved",
      muxAssetId: asset.id,
      muxPlaybackId: playbackId,
    });
  } catch (error) {
    console.error("Ad review error:", error);
    return NextResponse.json({ error: "Review failed" }, { status: 500 });
  }
}
