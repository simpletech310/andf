import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient();

    const now = new Date().toISOString();

    const { data: ads, error } = await supabase
      .from("ad_submissions")
      .select(`
        id,
        title,
        mux_playback_id,
        duration_seconds,
        thumbnail_url,
        target_channels,
        click_count,
        impression_count,
        ad_sponsors (
          business_name,
          website_url,
          logo_url
        ),
        ad_packages (
          placement_priority,
          name
        )
      `)
      .eq("status", "active")
      .eq("payment_status", "paid")
      .not("mux_playback_id", "is", null)
      .lte("starts_at", now)
      .gte("expires_at", now)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Shape response for the player
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedAds = (ads || []).map((ad: any) => {
      const sponsor = Array.isArray(ad.ad_sponsors) ? ad.ad_sponsors[0] : ad.ad_sponsors;
      const pkg = Array.isArray(ad.ad_packages) ? ad.ad_packages[0] : ad.ad_packages;
      return {
        id: ad.id,
        title: ad.title,
        muxPlaybackId: ad.mux_playback_id,
        durationSeconds: ad.duration_seconds,
        thumbnailUrl: ad.thumbnail_url,
        targetChannels: ad.target_channels,
        sponsorName: sponsor?.business_name || "",
        sponsorUrl: sponsor?.website_url || "",
        sponsorLogo: sponsor?.logo_url || "",
        priority: pkg?.placement_priority || 1,
        packageName: pkg?.name || "",
      };
    });

    // Sort by priority (highest first)
    formattedAds.sort((a, b) => b.priority - a.priority);

    return NextResponse.json({ ads: formattedAds });
  } catch (error) {
    console.error("Fetch active ads error:", error);
    return NextResponse.json({ ads: [] });
  }
}
