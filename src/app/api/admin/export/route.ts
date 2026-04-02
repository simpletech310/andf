import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

function escapeCsv(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toCsv(rows: Record<string, unknown>[], columns: string[]): string {
  const header = columns.join(",");
  const body = rows
    .map((row) => columns.map((col) => escapeCsv(row[col])).join(","))
    .join("\n");
  return `${header}\n${body}`;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const entity = searchParams.get("entity");
    const status = searchParams.get("status");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const eventId = searchParams.get("eventId");
    const program = searchParams.get("program");

    if (!entity || !["leads", "donations", "registrations", "applications"].includes(entity)) {
      return NextResponse.json(
        { error: "Invalid entity. Use: leads, donations, registrations, or applications" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    let rows: Record<string, unknown>[] = [];
    let columns: string[] = [];

    switch (entity) {
      case "leads": {
        let query = supabase
          .from("leads")
          .select("id, full_name, email, phone, source, status, interest_areas, notes, created_at, updated_at")
          .order("created_at", { ascending: false });

        if (status) query = query.eq("status", status);
        if (dateFrom) query = query.gte("created_at", dateFrom);
        if (dateTo) query = query.lte("created_at", dateTo);

        const { data, error } = await query;
        if (error) throw error;
        rows = (data || []) as Record<string, unknown>[];
        columns = ["id", "full_name", "email", "phone", "source", "status", "interest_areas", "notes", "created_at"];
        break;
      }

      case "donations": {
        let query = supabase
          .from("donations")
          .select("id, donor_name, donor_email, amount, currency, donation_type, frequency, status, is_anonymous, program_id, created_at")
          .order("created_at", { ascending: false });

        if (status) query = query.eq("status", status);
        if (dateFrom) query = query.gte("created_at", dateFrom);
        if (dateTo) query = query.lte("created_at", dateTo);
        if (program) query = query.eq("program_id", program);

        const { data, error } = await query;
        if (error) throw error;
        rows = (data || []) as Record<string, unknown>[];
        columns = ["id", "donor_name", "donor_email", "amount", "currency", "donation_type", "frequency", "status", "is_anonymous", "program_id", "created_at"];
        break;
      }

      case "registrations": {
        let query = supabase
          .from("registrations")
          .select("id, registrant_name, registrant_email, registrant_phone, event_id, status, payment_status, amount_paid, checked_in, checked_in_at, created_at")
          .order("created_at", { ascending: false });

        if (status) query = query.eq("status", status);
        if (dateFrom) query = query.gte("created_at", dateFrom);
        if (dateTo) query = query.lte("created_at", dateTo);
        if (eventId) query = query.eq("event_id", eventId);

        const { data, error } = await query;
        if (error) throw error;
        rows = (data || []) as Record<string, unknown>[];
        columns = ["id", "registrant_name", "registrant_email", "registrant_phone", "event_id", "status", "payment_status", "amount_paid", "checked_in", "created_at"];
        break;
      }

      case "applications": {
        let query = supabase
          .from("program_applications")
          .select("id, applicant_name, applicant_email, program_id, status, created_at, reviewed_at")
          .order("created_at", { ascending: false });

        if (status) query = query.eq("status", status);
        if (dateFrom) query = query.gte("created_at", dateFrom);
        if (dateTo) query = query.lte("created_at", dateTo);
        if (program) query = query.eq("program_id", program);

        const { data, error } = await query;
        if (error) throw error;
        rows = (data || []) as Record<string, unknown>[];
        columns = ["id", "applicant_name", "applicant_email", "program_id", "status", "created_at", "reviewed_at"];
        break;
      }
    }

    const csv = toCsv(rows, columns);
    const filename = `${entity}-export-${new Date().toISOString().slice(0, 10)}.csv`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
