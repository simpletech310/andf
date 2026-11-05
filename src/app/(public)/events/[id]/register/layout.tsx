import type { Metadata } from "next";
import { getBuiltInEvent } from "@/lib/featured-events";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const e = getBuiltInEvent(id);
  return {
    ...pageMetadata({
      title: `RSVP: ${e?.title ?? "Event"}`,
      description: `RSVP by email for ${e?.title ?? "this A New Day Foundation event"}.`,
      path: `/events/${id}/register`,
    }),
    robots: { index: false, follow: true },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
