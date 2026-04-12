import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-03-31.basil" as any });

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { email, amount } = body;

    if (!email || !amount) {
      return NextResponse.json({ error: "Email and amount are required" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Get video details
    const { data: video, error } = await supabase
      .from("video_library")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    if (!video.pay_per_view) {
      return NextResponse.json({ error: "This video is free to watch" }, { status: 400 });
    }

    if (amount < (video.minimum_amount || 0)) {
      return NextResponse.json({ error: `Minimum donation is $${video.minimum_amount}` }, { status: 400 });
    }

    // Check if user already has access
    const { data: existing } = await supabase
      .from("video_access")
      .select("id")
      .eq("video_id", id)
      .eq("viewer_email", email)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (existing) {
      return NextResponse.json({ error: "You already have access to this video" }, { status: 400 });
    }

    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      metadata: {
        type: "video_access",
        video_id: id,
        video_title: video.title,
        viewer_email: email,
      },
      receipt_email: email,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: any) {
    console.error("Video purchase error:", error);
    return NextResponse.json({ error: error.message || "Purchase failed" }, { status: 500 });
  }
}
