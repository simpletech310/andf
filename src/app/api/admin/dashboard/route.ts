import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    // Run all queries in parallel
    const [
      donationsThisMonth,
      allDonationsMonth,
      totalLeads,
      newLeadsMonth,
      activeEvents,
      registrationsMonth,
      recentDonations,
      recentLeads,
      upcomingEvents,
      totalDonationsAllTime,
    ] = await Promise.all([
      // Sum of donations this month
      supabase
        .from("donations")
        .select("amount")
        .eq("status", "succeeded")
        .gte("created_at", startOfMonth),

      // Count of donations this month
      supabase
        .from("donations")
        .select("id", { count: "exact", head: true })
        .eq("status", "succeeded")
        .gte("created_at", startOfMonth),

      // Total leads count
      supabase
        .from("leads")
        .select("id", { count: "exact", head: true }),

      // New leads this month
      supabase
        .from("leads")
        .select("id", { count: "exact", head: true })
        .gte("created_at", startOfMonth),

      // Active events (published, future)
      supabase
        .from("events")
        .select("id", { count: "exact", head: true })
        .eq("status", "published")
        .gte("start_date", now.toISOString()),

      // Registrations this month
      supabase
        .from("registrations")
        .select("id", { count: "exact", head: true })
        .gte("created_at", startOfMonth),

      // Recent donations (last 5)
      supabase
        .from("donations")
        .select("id, donor_name, amount, donation_type, status, created_at")
        .eq("status", "succeeded")
        .order("created_at", { ascending: false })
        .limit(5),

      // Recent leads (last 5)
      supabase
        .from("leads")
        .select("id, full_name, email, source, status, created_at")
        .order("created_at", { ascending: false })
        .limit(5),

      // Upcoming events with registration data
      supabase
        .from("events")
        .select("id, title, start_date, end_date, max_capacity, current_registrations")
        .eq("status", "published")
        .gte("start_date", now.toISOString())
        .order("start_date", { ascending: true })
        .limit(4),

      // Total donations all time
      supabase
        .from("donations")
        .select("amount")
        .eq("status", "succeeded"),
    ]);

    // Calculate total donations this month
    const totalDonationsMonth = donationsThisMonth.data?.reduce(
      (sum, d) => sum + Number(d.amount),
      0
    ) ?? 0;

    // Calculate total raised all time
    const totalRaisedAllTime = totalDonationsAllTime.data?.reduce(
      (sum, d) => sum + Number(d.amount),
      0
    ) ?? 0;

    // Format relative time
    function relativeTime(dateStr: string): string {
      const diff = now.getTime() - new Date(dateStr).getTime();
      const minutes = Math.floor(diff / 60000);
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    }

    return NextResponse.json({
      stats: {
        totalDonationsMonth,
        donationCountMonth: allDonationsMonth.count ?? 0,
        totalLeads: totalLeads.count ?? 0,
        newLeadsMonth: newLeadsMonth.count ?? 0,
        activeEvents: activeEvents.count ?? 0,
        registrationsMonth: registrationsMonth.count ?? 0,
        totalRaisedAllTime,
      },
      recentDonations: (recentDonations.data ?? []).map((d) => ({
        id: d.id,
        name: d.donor_name || "Anonymous",
        amount: Number(d.amount),
        type: d.donation_type === "recurring" ? "Monthly" : "One-time",
        date: relativeTime(d.created_at),
      })),
      recentLeads: (recentLeads.data ?? []).map((l) => ({
        id: l.id,
        name: l.full_name || "Unknown",
        email: l.email,
        source: l.source,
        status: l.status,
        date: relativeTime(l.created_at),
      })),
      upcomingEvents: (upcomingEvents.data ?? []).map((e) => ({
        id: e.id,
        title: e.title,
        date: formatEventDate(e.start_date, e.end_date),
        registrations: e.current_registrations,
        capacity: e.max_capacity ?? 100,
      })),
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}

function formatEventDate(start: string | null, end: string | null): string {
  if (!start) return "TBD";
  const s = new Date(start);
  const month = s.toLocaleString("en-US", { month: "short" });
  const day = s.getDate();
  if (end) {
    const e = new Date(end);
    if (s.getMonth() === e.getMonth()) {
      return `${month} ${day}-${e.getDate()}`;
    }
    return `${month} ${day} - ${e.toLocaleString("en-US", { month: "short" })} ${e.getDate()}`;
  }
  return `${month} ${day}`;
}
