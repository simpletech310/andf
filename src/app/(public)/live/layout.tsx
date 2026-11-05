import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "ANDF Live: Videos on YouTube",
  description: "Watch the latest videos and live streams from A New Day Foundation on our YouTube channel, A New Day Now.",
  path: "/live",
  image: { url: "/images/experiences/band-camp-2025.jpg", alt: "ANDF Live: Videos on YouTube" },
  type: "website",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
