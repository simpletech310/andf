import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if ("error" in auth) return auth.error;

    const { searchParams } = new URL(req.url);
    const program = searchParams.get("program") || "";
    const status = searchParams.get("status") || "";
    const search = searchParams.get("search") || "";
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || 20)));
    const offset = (page - 1) * limit;

    const supabase = createAdminClient();

    // Build query
    let query = supabase
      .from("program_applications")
      .select(
        "*, programs:program_id(id, title, slug)",
        { count: "exact" }
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq("status", status);
    }

    if (program) {
      // Filter by program slug — need to look up program_id first
      const { data: prog } = await supabase
        .from("programs")
        .select("id")
        .eq("slug", program)
        .single();
      if (prog) {
        query = query.eq("program_id", prog.id);
      }
    }

    if (search) {
      query = query.or(
        `applicant_name.ilike.%${search}%,applicant_email.ilike.%${search}%`
      );
    }

    const { data: applications, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      applications: applications || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (error) {
    console.error("Admin applications list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}
