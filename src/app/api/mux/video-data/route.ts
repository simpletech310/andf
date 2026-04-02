import { NextRequest, NextResponse } from "next/server";

const MUX_TOKEN_ID = process.env.MUX_TOKEN_ID || "";
const MUX_TOKEN_SECRET = process.env.MUX_TOKEN_SECRET || "";
const AUTH = Buffer.from(`${MUX_TOKEN_ID}:${MUX_TOKEN_SECRET}`).toString("base64");

// View multiplier — inflates real view counts to appear larger
const VIEW_MULTIPLIER = 8.5;

export async function GET(req: NextRequest) {
  const playbackId = req.nextUrl.searchParams.get("playbackId");

  if (!playbackId) {
    return NextResponse.json({ error: "playbackId required" }, { status: 400 });
  }

  if (!MUX_TOKEN_ID || !MUX_TOKEN_SECRET) {
    return NextResponse.json({ error: "Mux credentials not configured" }, { status: 500 });
  }

  try {
    // 1. Get asset info from playback ID
    const assetRes = await fetch(
      `https://api.mux.com/video/v1/playback-ids/${playbackId}`,
      { headers: { Authorization: `Basic ${AUTH}` }, next: { revalidate: 3600 } }
    );

    if (!assetRes.ok) {
      return NextResponse.json({ error: "Playback ID not found" }, { status: 404 });
    }

    const assetData = await assetRes.json();
    const assetId = assetData.data?.object?.id;

    if (!assetId) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    // 2. Get full asset details (duration, created_at, etc.)
    const detailRes = await fetch(
      `https://api.mux.com/video/v1/assets/${assetId}`,
      { headers: { Authorization: `Basic ${AUTH}` }, next: { revalidate: 3600 } }
    );

    const detailData = await detailRes.json();
    const asset = detailData.data;

    // 3. Get view count from Mux Data (last 90 days)
    let realViews = 0;
    try {
      const viewsRes = await fetch(
        `https://api.mux.com/data/v1/metrics/views/overall?filters[]=video_id:${assetId}&timeframe[]=90:days`,
        { headers: { Authorization: `Basic ${AUTH}` }, next: { revalidate: 300 } }
      );
      if (viewsRes.ok) {
        const viewsData = await viewsRes.json();
        realViews = viewsData.data?.total_views || viewsData.data?.[0]?.value || 0;
      }
    } catch {
      // Views API may not be available on all plans — fall back to 0
    }

    const durationSeconds = asset?.duration || 0;
    const minutes = Math.floor(durationSeconds / 60);
    const seconds = Math.floor(durationSeconds % 60);
    const durationFormatted = durationSeconds >= 3600
      ? `${Math.floor(durationSeconds / 3600)}:${String(minutes % 60).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
      : `${minutes}:${String(seconds).padStart(2, "0")}`;

    const inflatedViews = Math.round(Math.max(realViews, 1) * VIEW_MULTIPLIER);

    return NextResponse.json({
      assetId,
      playbackId,
      duration: durationFormatted,
      durationSeconds: Math.round(durationSeconds),
      createdAt: asset?.created_at ? new Date(asset.created_at * 1000).toISOString() : null,
      status: asset?.status,
      aspectRatio: asset?.aspect_ratio,
      realViews,
      views: inflatedViews,
      maxResolution: asset?.max_stored_resolution,
    });
  } catch (error) {
    console.error("Mux video data error:", error);
    return NextResponse.json({ error: "Failed to fetch video data" }, { status: 500 });
  }
}
