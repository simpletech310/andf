import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import QRCode from "qrcode";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(req.url);
    const registrationId = searchParams.get("registrationId");

    if (!registrationId) {
      return NextResponse.json(
        { error: "registrationId query parameter is required" },
        { status: 400 }
      );
    }

    const { id: eventId } = await params;
    const supabase = createAdminClient();

    // Fetch the registration and verify it belongs to this event
    const { data: registration, error } = await supabase
      .from("registrations")
      .select("qr_code_token")
      .eq("id", registrationId)
      .eq("event_id", eventId)
      .single();

    if (error || !registration) {
      return NextResponse.json(
        { error: "Registration not found" },
        { status: 404 }
      );
    }

    if (!registration.qr_code_token) {
      return NextResponse.json(
        { error: "QR code not available for this registration" },
        { status: 404 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://andf.org";
    const checkinUrl = `${appUrl}/checkin/${registration.qr_code_token}`;

    const qrCodeUrl = await QRCode.toDataURL(checkinUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    return NextResponse.json({ qrCodeUrl });
  } catch (error) {
    console.error("QR code generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate QR code" },
      { status: 500 }
    );
  }
}
