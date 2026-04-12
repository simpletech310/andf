import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const resourceType = searchParams.get("resource_type");
    const action = searchParams.get("action");

    const supabase = createAdminClient();
    let query = supabase
      .from("audit_log")
      .select("*, profiles(full_name, email:id)", { count: "exact" })
      .order("created_at", { ascending: false });

    if (resourceType) query = query.eq("resource_type", resourceType);
    if (action) query = query.eq("action", action);

    const from = (page - 1) * limit;
    query = query.range(from, from + limit - 1);

    const { data, error, count } = await query;
    if (error) throw error;

    return NextResponse.json({
      entries: data || [],
      total: count || 0,
      page,
    });
  } catch (error) {
    console.error("Audit log error:", error);
    return NextResponse.json({ error: "Failed to fetch audit log" }, { status: 500 });
  }
}
