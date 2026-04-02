import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import {
  sanitizeString,
  sanitizeEmail,
  sanitizePhone,
  truncate,
} from "@/lib/sanitize";

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 3 requests per minute per IP
    const ip = getClientIp(req);
    const limiter = rateLimit(`application:${ip}`, {
      limit: 3,
      window: 60_000,
    });
    if (!limiter.success) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    const body = await req.json();

    // Sanitize inputs
    const programSlug = truncate(sanitizeString(body.programSlug || ""), 100);
    const applicantName = truncate(sanitizeString(body.applicantName || ""), 200);
    const applicantEmail = sanitizeEmail(body.applicantEmail || "");
    const applicantPhone = body.applicantPhone
      ? sanitizePhone(body.applicantPhone)
      : null;
    const applicantAge = body.applicantAge
      ? Math.min(Math.max(Number(body.applicantAge), 1), 120)
      : null;
    const guardianName = body.guardianName
      ? truncate(sanitizeString(body.guardianName), 200)
      : null;
    const guardianEmail = body.guardianEmail
      ? sanitizeEmail(body.guardianEmail)
      : null;
    const guardianPhone = body.guardianPhone
      ? sanitizePhone(body.guardianPhone)
      : null;

    // Sanitize form_data object
    const rawFormData = body.formData || {};
    const formData: Record<string, string> = {};
    for (const [key, value] of Object.entries(rawFormData)) {
      if (typeof value === "string") {
        formData[sanitizeString(key)] = truncate(sanitizeString(value), 2000);
      }
    }

    // Validate required fields
    if (!programSlug || !applicantName || !applicantEmail) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, and program are required." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Look up program by slug
    const { data: program } = await supabase
      .from("programs")
      .select("id, title")
      .eq("slug", programSlug)
      .single();

    if (!program) {
      return NextResponse.json(
        { error: "Program not found." },
        { status: 404 }
      );
    }

    // Insert application
    const { data: application, error: insertError } = await supabase
      .from("program_applications")
      .insert({
        program_id: program.id,
        program_slug: programSlug,
        applicant_name: applicantName,
        applicant_email: applicantEmail,
        applicant_phone: applicantPhone,
        applicant_age: applicantAge,
        guardian_name: guardianName,
        guardian_email: guardianEmail,
        guardian_phone: guardianPhone,
        form_data: formData,
        status: "submitted",
      })
      .select("id, status")
      .single();

    if (insertError) throw insertError;

    // Upsert lead
    const { data: lead } = await supabase
      .from("leads")
      .upsert(
        {
          email: applicantEmail,
          full_name: applicantName,
          phone: applicantPhone,
          source: "website",
          status: "new",
          last_interaction_at: new Date().toISOString(),
        },
        { onConflict: "email" }
      )
      .select("id")
      .single();

    // Log lead interaction
    if (lead) {
      await supabase.from("lead_interactions").insert({
        lead_id: lead.id,
        interaction_type: "form_submission",
        description: `Applied to program: ${program.title}`,
        metadata: { application_id: application.id, program_slug: programSlug },
      });
    }

    return NextResponse.json({
      application: { id: application.id, status: application.status },
    });
  } catch (error) {
    console.error("Application submission error:", error);
    return NextResponse.json(
      { error: "Application submission failed. Please try again." },
      { status: 500 }
    );
  }
}
