import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient();

    // Get impression stats
    const { data: impressions, error: impError } = await supabase
      .from("ad_impressions")
      .select("type, ad_submission_id, created_at");

    if (impError) throw impError;

    const views = (impressions || []).filter((i) => i.type === "view").length;
    const clicks = (impressions || []).filter((i) => i.type === "click").length;
    const skips = (impressions || []).filter((i) => i.type === "skip").length;
    const ctr = views > 0 ? ((clicks / views) * 100).toFixed(1) : "0";

    // Get revenue from sponsors
    const { data: submissions } = await supabase
      .from("ad_submissions")
      .select("id, ad_sponsors(business_name), payment_status, payment_amount, campaign_name, start_date, end_date, spent_cents")
      .order("created_at", { ascending: false });

    const totalRevenue = (submissions || [])
      .filter((s: any) => s.payment_status === "paid")
      .reduce((sum: number, s: any) => sum + (Number(s.payment_amount) || 0), 0);

    // Impressions by day (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyData: Record<string, { views: number; clicks: number }> = {};
    for (const imp of impressions || []) {
      const day = new Date(imp.created_at).toISOString().split("T")[0];
      if (!dailyData[day]) dailyData[day] = { views: 0, clicks: 0 };
      if (imp.type === "view") dailyData[day].views++;
      if (imp.type === "click") dailyData[day].clicks++;
    }

    const chartData = Object.entries(dailyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-30)
      .map(([date, data]) => ({ date, ...data }));

    return NextResponse.json({
      summary: { views, clicks, skips, ctr, totalRevenue },
      chartData,
      submissions: submissions || [],
    });
  } catch (error) {
    console.error("Ad analytics error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
