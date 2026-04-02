import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  try {
    const supabase = createAdminClient();
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const type = searchParams.get("type") || "";
    const dateRange = searchParams.get("dateRange") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const offset = (page - 1) * limit;
    const format = searchParams.get("format") || "";

    // CSV export
    if (format === "csv") {
      const { data: allDonations } = await supabase
        .from("donations")
        .select("*, programs(title)")
        .order("created_at", { ascending: false });

      const csvRows = [
        ["Donor", "Email", "Amount", "Type", "Status", "Program", "Date"].join(","),
        ...(allDonations ?? []).map((d) =>
          [
            `"${(d.donor_name || "Anonymous").replace(/"/g, '""')}"`,
            d.donor_email || "",
            d.amount,
            d.donation_type,
            d.status,
            `"${(d.programs as { title: string } | null)?.title || "General"}"`,
            d.created_at,
          ].join(",")
        ),
      ].join("\n");

      return new NextResponse(csvRows, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="donations-${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      });
    }

    // Build query
    let query = supabase
      .from("donations")
      .select("*, programs(title)", { count: "exact" });

    if (search) {
      query = query.or(`donor_name.ilike.%${search}%,donor_email.ilike.%${search}%`);
    }
    if (status) {
      query = query.eq("status", status);
    }
    if (type) {
      query = query.eq("donation_type", type);
    }
    if (dateRange) {
      const now = new Date();
      let startDate: Date | null = null;
      if (dateRange === "7d") startDate = new Date(now.getTime() - 7 * 86400000);
      else if (dateRange === "30d") startDate = new Date(now.getTime() - 30 * 86400000);
      else if (dateRange === "90d") startDate = new Date(now.getTime() - 90 * 86400000);
      else if (dateRange === "1y") startDate = new Date(now.getTime() - 365 * 86400000);
      if (startDate) {
        query = query.gte("created_at", startDate.toISOString());
      }
    }

    const { data, count, error } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    // Compute stats from all succeeded donations
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const [monthDonations, allDonations] = await Promise.all([
      supabase
        .from("donations")
        .select("amount, donor_email, donation_type")
        .eq("status", "succeeded")
        .gte("created_at", startOfMonth),
      supabase
        .from("donations")
        .select("donor_email, donation_type")
        .eq("status", "succeeded"),
    ]);

    const totalRaisedMonth = (monthDonations.data ?? []).reduce(
      (sum, d) => sum + Number(d.amount),
      0
    );
    const donationCountMonth = monthDonations.data?.length ?? 0;
    const avgDonation = donationCountMonth > 0
      ? Math.round(totalRaisedMonth / donationCountMonth)
      : 0;

    const uniqueDonors = new Set((allDonations.data ?? []).map((d) => d.donor_email)).size;
    const recurringCount = (allDonations.data ?? []).filter(
      (d) => d.donation_type === "recurring"
    ).length;

    // Map donations
    const donations = (data ?? []).map((d) => ({
      id: d.id,
      donor: d.donor_name || "Anonymous",
      email: d.donor_email || "",
      amount: Number(d.amount),
      type: d.donation_type,
      status: d.status,
      program: (d.programs as { title: string } | null)?.title || null,
      date: d.created_at,
      thankYouSent: d.thank_you_sent,
      isAnonymous: d.is_anonymous,
    }));

    return NextResponse.json({
      donations,
      total: count ?? 0,
      page,
      limit,
      stats: {
        totalRaisedMonth,
        avgDonation,
        uniqueDonors,
        recurringCount,
      },
    });
  } catch (error) {
    console.error("Donations API error:", error);
    return NextResponse.json({ error: "Failed to fetch donations" }, { status: 500 });
  }
}
