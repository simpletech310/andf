import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { sanitizeString, sanitizeEmail, sanitizeAmount } from "@/lib/sanitize";

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 5 donation attempts per minute per IP
    const ip = getClientIp(req);
    const limiter = rateLimit(`donation:${ip}`, { limit: 5, window: 60_000 });
    if (!limiter.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const amount = sanitizeAmount(body.amount);
    const donorEmail = body.donorEmail ? sanitizeEmail(body.donorEmail) : "";
    const donorName = body.donorName ? sanitizeString(body.donorName) : "";
    const message = body.message ? sanitizeString(body.message).slice(0, 500) : "";
    const isAnonymous = Boolean(body.isAnonymous);
    const programId = body.programId ? sanitizeString(body.programId) : "";

    if (!amount || amount < 1) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      metadata: {
        donor_email: donorEmail || "",
        donor_name: isAnonymous ? "Anonymous" : donorName,
        message,
        is_anonymous: String(isAnonymous),
        program_id: programId,
        type: "one_time_donation",
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Create payment intent error:", error);
    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 });
  }
}
