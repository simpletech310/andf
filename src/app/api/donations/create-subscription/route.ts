import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { sanitizeString, sanitizeEmail, sanitizeAmount } from "@/lib/sanitize";

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 3 subscription attempts per minute per IP
    const ip = getClientIp(req);
    const limiter = rateLimit(`subscription:${ip}`, { limit: 3, window: 60_000 });
    if (!limiter.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const amount = sanitizeAmount(body.amount);
    const donorEmail = sanitizeEmail(body.donorEmail || "");
    const donorName = body.donorName ? sanitizeString(body.donorName) : "";
    const frequency = ["monthly", "quarterly", "yearly"].includes(body.frequency)
      ? body.frequency
      : "monthly";

    if (!amount || amount < 1 || !donorEmail) {
      return NextResponse.json({ error: "Invalid amount or email" }, { status: 400 });
    }

    // Create or find customer
    const customers = await stripe.customers.list({ email: donorEmail, limit: 1 });
    let customer = customers.data[0];

    if (!customer) {
      customer = await stripe.customers.create({
        email: donorEmail,
        name: donorName || undefined,
        metadata: { source: "andf_website" },
      });
    }

    // Create price
    const price = await stripe.prices.create({
      unit_amount: Math.round(amount * 100),
      currency: "usd",
      recurring: {
        interval: frequency === "yearly" ? "year" : frequency === "quarterly" ? "month" : "month",
        interval_count: frequency === "quarterly" ? 3 : 1,
      },
      product_data: { name: `ANDF ${frequency || "monthly"} donation` },
    });

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: price.id }],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
      metadata: { type: "recurring_donation", frequency: frequency || "monthly" },
    });

    const invoice = subscription.latest_invoice as Record<string, unknown> | null;
    const paymentIntent = invoice?.payment_intent as Record<string, unknown> | null;
    const clientSecret = paymentIntent?.client_secret as string | null;

    return NextResponse.json({
      subscriptionId: subscription.id,
      clientSecret,
    });
  } catch (error) {
    console.error("Create subscription error:", error);
    return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 });
  }
}
