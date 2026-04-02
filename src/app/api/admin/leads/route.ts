import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  try {
    const supabase = createAdminClient();
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const source = searchParams.get("source") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const offset = (page - 1) * limit;
    const format = searchParams.get("format") || "";

    // Build query
    let query = supabase
      .from("leads")
      .select("*, lead_interactions(id)", { count: "exact" });

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    }
    if (status) {
      query = query.eq("status", status);
    }
    if (source) {
      query = query.eq("source", source);
    }

    // CSV export - fetch all
    if (format === "csv") {
      const { data: allLeads } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      const csvRows = [
        ["Name", "Email", "Phone", "Status", "Source", "Interest Areas", "Total Donated", "Created At"].join(","),
        ...(allLeads ?? []).map((l) =>
          [
            `"${(l.full_name || "").replace(/"/g, '""')}"`,
            l.email,
            l.phone || "",
            l.status,
            l.source,
            `"${(l.interest_areas || []).join("; ")}"`,
            l.total_donated,
            l.created_at,
          ].join(",")
        ),
      ].join("\n");

      return new NextResponse(csvRows, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      });
    }

    // Paginated query
    const { data, count, error } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    // Funnel stats
    const { data: funnelData } = await supabase
      .from("leads")
      .select("status");

    const funnel: Record<string, number> = {
      new: 0,
      contacted: 0,
      engaged: 0,
      donor: 0,
      volunteer: 0,
      inactive: 0,
    };
    (funnelData ?? []).forEach((l) => {
      if (l.status in funnel) funnel[l.status]++;
    });

    // Map leads with interaction count
    const leads = (data ?? []).map((l) => ({
      id: l.id,
      name: l.full_name || "Unknown",
      email: l.email,
      phone: l.phone,
      source: l.source,
      status: l.status,
      interests: l.interest_areas || [],
      totalDonated: Number(l.total_donated),
      interactionCount: Array.isArray(l.lead_interactions)
        ? l.lead_interactions.length
        : 0,
      lastInteraction: l.last_interaction_at,
      createdAt: l.created_at,
    }));

    return NextResponse.json({
      leads,
      total: count ?? 0,
      page,
      limit,
      funnel,
    });
  } catch (error) {
    console.error("Leads API error:", error);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}
