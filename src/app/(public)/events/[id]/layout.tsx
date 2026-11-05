import type { Metadata } from "next";
import { getBuiltInEvent, getBuiltInEvents } from "@/lib/featured-events";
import { pageMetadata, SITE_URL } from "@/lib/seo";
import { ORG } from "@/lib/contact";

export function generateStaticParams() {
  return getBuiltInEvents().map((e) => ({ id: e.id }));
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "America/Los_Angeles" });
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const e = getBuiltInEvent(id);
  if (!e) return { title: "Event not found", robots: { index: false } };
  return pageMetadata({
    title: `${e.title}, ${fmt(e.start_date)}`,
    description: `${e.short_description} ${e.location_name ? `${e.location_name}. ` : ""}RSVP by email with A New Day Foundation.`,
    path: `/events/${e.id}`,
    image: e.cover_image_url ? { url: e.cover_image_url, alt: e.title } : undefined,
  });
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ id: string }> }) {
  const { id } = await params;
  const e = getBuiltInEvent(id);
  const jsonLd = e
    ? {
        "@context": "https://schema.org",
        "@type": "Event",
        name: e.title,
        description: e.description,
        startDate: e.start_date.slice(0, 10),
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: {
          "@type": "Place",
          name: e.location_name ?? "TBA",
          address: e.location_address ?? undefined,
        },
        image: e.cover_image_url ? [`${SITE_URL}${e.cover_image_url}`] : undefined,
        url: `${SITE_URL}/events/${e.id}`,
        isAccessibleForFree: (e.ticket_price ?? 0) === 0,
        organizer: { "@type": "NGO", name: ORG.name, url: SITE_URL, email: ORG.email },
        offers: {
          "@type": "Offer",
          price: e.ticket_price ?? 0,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: `${SITE_URL}/events/${e.id}/register`,
        },
      }
    : null;
  return (
    <>
      {jsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /> : null}
      {children}
    </>
  );
}
