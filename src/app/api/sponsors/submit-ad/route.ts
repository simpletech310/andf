import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { sanitizeString, truncate } from "@/lib/sanitize";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const limiter = rateLimit(`submit-ad:${ip}`, { limit: 5, window: 60_000 });
    if (!limiter.success) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    }

    const body = await req.json();
    const sponsorId = body.sponsorId;
    const packageId = body.packageId;
    const title = truncate(sanitizeString(body.title || ""), 200);
    const description = truncate(sanitizeString(body.description || ""), 1000);
    const videoUrl = body.videoUrl; // Supabase Storage URL

    if (!sponsorId || !packageId || !title || !videoUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Verify sponsor exists and is active
    const { data: sponsor } = await supabase
      .from("ad_sponsors")
      .select("id, status")
      .eq("id", sponsorId)
      .single();

    if (!sponsor || sponsor.status !== "active") {
      return NextResponse.json({ error: "Invalid or inactive sponsor" }, { status: 400 });
    }

    // Verify package exists
    const { data: pkg } = await supabase
      .from("ad_packages")
      .select("id")
      .eq("id", packageId)
      .eq("is_active", true)
      .single();

    if (!pkg) {
      return NextResponse.json({ error: "Invalid package" }, { status: 400 });
    }

    const { data: submission, error } = await supabase
      .from("ad_submissions")
      .insert({
        sponsor_id: sponsorId,
        package_id: packageId,
        title,
        description,
        original_video_url: videoUrl,
        status: "pending_review",
        payment_status: "unpaid",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, submission });
  } catch (error) {
    console.error("Ad submission error:", error);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}
