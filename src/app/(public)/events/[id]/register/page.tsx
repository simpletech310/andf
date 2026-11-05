"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { EmailForm } from "@/components/shared/email-form";
import { getBuiltInEvent } from "@/lib/featured-events";
import { ORG } from "@/lib/contact";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "America/Los_Angeles" });
}

export default function EventRegisterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const event = getBuiltInEvent(id);
  const title = event?.title ?? "an ANDF event";
  const date = event ? formatDate(event.start_date) : "";

  return (
    <div className="bg-neutral-50 min-h-screen">
      <section className="bg-primary-900 text-white">
        <div className="mx-auto max-w-4xl px-6 pt-32 pb-12">
          <Link href={event ? `/events/${id}` : "/events"} className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to {event ? "event details" : "events"}
          </Link>
          <h1 className="mt-6 font-display font-bold text-3xl sm:text-5xl tracking-tight">RSVP: {title}</h1>
          {event ? (
            <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-6 text-white/80">
              <span className="inline-flex items-center gap-2"><Calendar className="h-4 w-4" /> {date}</span>
              {event.location_name ? (
                <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" /> {event.location_name}</span>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white border border-neutral-200 p-6 sm:p-10">
          <p className="mb-8 text-foreground-muted">
            Send us your RSVP and we&apos;ll email you a confirmation with the time and details.
          </p>
          <EmailForm
            fields={[
              { name: "name", label: "Participant's full name", required: true, half: true },
              { name: "age", label: "Participant's age", type: "number", half: true },
              { name: "email", label: "Email", type: "email", required: true, half: true },
              { name: "phone", label: "Phone", type: "tel", required: true, half: true },
              { name: "guardian", label: "Parent or guardian (if under 18)", half: true },
              { name: "guests", label: "Number attending", type: "number", defaultValue: "1", half: true },
              { name: "emergency", label: "Emergency contact (name and phone)", required: true },
              { name: "notes", label: "Accessibility needs, dietary needs, or questions", type: "textarea" },
            ]}
            subject={(v) => `RSVP: ${title}${date ? ` (${date})` : ""} for ${v.name}`}
            intro={`Hello ANDF team, I'd like to RSVP for ${title}${date ? ` on ${date}` : ""}.`}
            submitLabel="Send RSVP"
            note={`This opens your email app with your RSVP addressed to ${ORG.email}. Press send to complete it.`}
          />
        </div>
      </section>
    </div>
  );
}
