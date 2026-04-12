import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "25");

    const supabase = createAdminClient();

    // Query registrations grouped by email
    let query = supabase
      .from("registrations")
      .select("registrant_email, registrant_name, registrant_phone, event_id, checked_in, created_at, events(title)", { count: "exact" })
      .order("created_at", { ascending: false });

    if (search) {
      query = query.or(`registrant_name.ilike.%${search}%,registrant_email.ilike.%${search}%,registrant_phone.ilike.%${search}%`);
    }

    const from = (page - 1) * limit;
    query = query.range(from, from + limit - 1);

    const { data, error, count } = await query;
    if (error) throw error;

    // Group by email to build participant summaries
    const participantMap = new Map<string, any>();
    for (const reg of data || []) {
      const key = reg.registrant_email;
      if (!participantMap.has(key)) {
        participantMap.set(key, {
          email: reg.registrant_email,
          name: reg.registrant_name,
          phone: reg.registrant_phone,
          events: [],
          checkins: 0,
          lastRegistration: reg.created_at,
        });
      }
      const p = participantMap.get(key)!;
      p.events.push({ event_id: reg.event_id, title: (reg as any).events?.title, checked_in: reg.checked_in });
      if (reg.checked_in) p.checkins++;
    }

    return NextResponse.json({
      participants: Array.from(participantMap.values()),
      total: count || 0,
      page,
    });
  } catch (error) {
    console.error("Participants error:", error);
    return NextResponse.json({ error: "Failed to fetch participants" }, { status: 500 });
  }
}
