import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Events",
  description: "Upcoming A New Day Foundation events in Los Angeles and beyond, including Topgolf experiences, Drone Experience at LATTC, and Focused N F.I.T. RSVP by email.",
  path: "/events",
  image: { url: "/images/experiences/topgolf-2024.jpg", alt: "Events" },
  type: "website",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
