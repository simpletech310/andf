import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Photo and Video Gallery",
  description: "Photos and highlight reels from ANDF experiences: Focused N F.I.T., Band Camp, iFLY, the Smithsonian NMAAHC, the Lakers, and more.",
  path: "/gallery",
  image: { url: "/images/experiences/ifly-2025.jpg", alt: "Photo and Video Gallery" },
  type: "website",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
