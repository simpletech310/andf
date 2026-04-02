import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe/client";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Rate limit: 5 registrations per minute per IP
    const ip = getClientIp(req);
    const limiter = rateLimit(`register:${ip}`, { limit: 5, window: 60_000 });
    if (!limiter.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const { id: eventId } = await params;
    const body = await req.json();
    const { formData, registrantName, registrantEmail, registrantPhone, formTemplateId } = body;

    const supabase = createAdminClient();

    // Get event details
    const { data: event } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single();

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Check capacity
    if (event.max_capacity && event.current_registrations >= event.max_capacity) {
      return NextResponse.json({ error: "Event is full" }, { status: 400 });
    }

    // Create registration
    const { data: registration, error: regError } = await supabase
      .from("registrations")
      .insert({
        event_id: eventId,
        form_template_id: formTemplateId || null,
        form_data: formData || {},
        registrant_name: registrantName,
        registrant_email: registrantEmail,
        registrant_phone: registrantPhone || null,
        payment_status: event.ticket_price > 0 ? "pending" : "none",
        status: "confirmed",
      })
      .select()
      .single();

    if (regError) throw regError;

    // Increment registration count
    await supabase
      .from("events")
      .update({ current_registrations: event.current_registrations + 1 })
      .eq("id", eventId);

    // Upsert lead
    const { data: lead } = await supabase
      .from("leads")
      .upsert(
        {
          email: registrantEmail,
          full_name: registrantName,
          source: "event",
          last_interaction_at: new Date().toISOString(),
        },
        { onConflict: "email" }
      )
      .select("id")
      .single();

    if (lead) {
      await supabase.from("lead_interactions").insert({
        lead_id: lead.id,
        interaction_type: "event_registration",
        description: `Registered for ${event.title}`,
        metadata: { event_id: eventId, registration_id: registration.id },
      });

      // Link lead to registration
      await supabase
        .from("registrations")
        .update({ lead_id: lead.id })
        .eq("id", registration.id);
    }

    // Create payment intent if event has a price
    let clientSecret = null;
    if (event.ticket_price > 0) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(event.ticket_price * 100),
        currency: "usd",
        metadata: {
          type: "event_ticket",
          event_id: eventId,
          registration_id: registration.id,
          donor_email: registrantEmail,
          donor_name: registrantName,
        },
      });
      clientSecret = paymentIntent.client_secret;
    }

    return NextResponse.json({
      registration,
      clientSecret,
      requiresPayment: event.ticket_price > 0,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
