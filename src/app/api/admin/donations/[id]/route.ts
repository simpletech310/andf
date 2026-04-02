import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createAdminClient();

    // Fetch donation with program info
    const { data: donation, error } = await supabase
      .from("donations")
      .select("*, programs(title, slug)")
      .eq("id", id)
      .single();

    if (error || !donation) {
      return NextResponse.json({ error: "Donation not found" }, { status: 404 });
    }

    // Fetch donor history (all donations from same email) and donor notes in parallel
    const [donorHistory, donorNotes, lead] = await Promise.all([
      donation.donor_email
        ? supabase
            .from("donations")
            .select("id, amount, donation_type, status, created_at, programs(title)")
            .eq("donor_email", donation.donor_email)
            .neq("id", id)
            .order("created_at", { ascending: false })
        : Promise.resolve({ data: [] }),
      supabase
        .from("donor_notes")
        .select("*")
        .eq("donor_email", donation.donor_email || "")
        .order("created_at", { ascending: false }),
      donation.lead_id
        ? supabase
            .from("leads")
            .select("id, full_name, status")
            .eq("id", donation.lead_id)
            .single()
        : Promise.resolve({ data: null }),
    ]);

    return NextResponse.json({
      donation: {
        id: donation.id,
        donor: donation.donor_name || "Anonymous",
        email: donation.donor_email,
        amount: Number(donation.amount),
        currency: donation.currency,
        type: donation.donation_type,
        frequency: donation.frequency,
        status: donation.status,
        isAnonymous: donation.is_anonymous,
        message: donation.message,
        program: (donation.programs as { title: string; slug: string } | null)?.title || null,
        stripePaymentIntentId: donation.stripe_payment_intent_id,
        stripeSubscriptionId: donation.stripe_subscription_id,
        thankYouSent: donation.thank_you_sent,
        thankYouSentAt: donation.thank_you_sent_at,
        leadId: donation.lead_id,
        createdAt: donation.created_at,
      },
      donorHistory: (donorHistory.data ?? []).map((d) => ({
        id: d.id,
        amount: Number(d.amount),
        type: d.donation_type,
        status: d.status,
        program: (Array.isArray(d.programs) ? d.programs[0]?.title : (d.programs as { title: string } | null)?.title) || null,
        date: d.created_at,
      })),
      donorNotes: (donorNotes.data ?? []).map((n) => ({
        id: n.id,
        type: n.note_type,
        content: n.content,
        date: n.created_at,
      })),
      lead: lead.data
        ? { id: lead.data.id, name: lead.data.full_name, status: lead.data.status }
        : null,
    });
  } catch (error) {
    console.error("Donation detail API error:", error);
    return NextResponse.json({ error: "Failed to fetch donation" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const supabase = createAdminClient();

    // Handle thank_you_sent update
    if (body.thank_you_sent !== undefined) {
      const updates: Record<string, unknown> = {
        thank_you_sent: body.thank_you_sent,
      };
      if (body.thank_you_sent) {
        updates.thank_you_sent_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from("donations")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    }

    // Handle adding a donor note
    if (body.note) {
      // Get donation email first
      const { data: donation } = await supabase
        .from("donations")
        .select("donor_email")
        .eq("id", id)
        .single();

      if (donation?.donor_email) {
        const { error } = await supabase.from("donor_notes").insert({
          donor_email: donation.donor_email,
          donation_id: id,
          note_type: body.note_type || "note",
          content: body.note,
        });
        if (error) throw error;
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Donation update error:", error);
    return NextResponse.json({ error: "Failed to update donation" }, { status: 500 });
  }
}
