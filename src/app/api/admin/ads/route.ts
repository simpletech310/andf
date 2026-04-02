import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data: submissions, error } = await supabase
      .from("ad_submissions")
      .select(`
        *,
        ad_sponsors (*),
        ad_packages (*)
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Calculate stats
    const all = submissions || [];
    const totalRevenue = all
      .filter((s: any) => s.payment_status === "paid")
      .reduce((sum: number, s: any) => sum + (s.ad_packages?.price_cents || 0), 0) / 100;
    const activeAds = all.filter((s: any) => s.status === "active").length;
    const pendingReview = all.filter((s: any) => s.status === "pending_review").length;
    const totalImpressions = all.reduce((sum: number, s: any) => sum + (s.impressions || 0), 0);

    const formatted = all.map((sub: any) => ({
      id: sub.id,
      title: sub.title,
      sponsorName: sub.ad_sponsors?.company_name || "Unknown",
      sponsorEmail: sub.ad_sponsors?.email || "",
      packageName: sub.ad_packages?.name || "Unknown",
      duration: sub.ad_packages?.duration_months
        ? `${sub.ad_packages.duration_months} months`
        : "N/A",
      priceCents: sub.ad_packages?.price_cents || 0,
      status: sub.status,
      paymentStatus: sub.payment_status || "unpaid",
      submittedAt: sub.created_at?.split("T")[0] || "",
      startsAt: sub.starts_at || null,
      expiresAt: sub.expires_at || null,
      videoUrl: sub.original_video_url || "#",
      impressions: sub.impressions || 0,
      clicks: sub.clicks || 0,
      rejectionReason: sub.rejection_reason || null,
    }));

    return NextResponse.json({
      submissions: formatted,
      stats: { totalRevenue, activeAds, pendingReview, totalImpressions },
    });
  } catch (error) {
    console.error("Ads list error:", error);
    return NextResponse.json({ error: "Failed to fetch ads" }, { status: 500 });
  }
}
