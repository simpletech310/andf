import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Youth Programs",
  description: "Focused N F.I.T., Band Camp, Topgolf Family Experiences, MenTORS, Sisters Hangout, and HBCU Heroes: ANDF programs for teens ages 13–19.",
  path: "/programs",
  image: { url: "/images/experiences/fnf-2025.jpg", alt: "Youth Programs" },
  type: "website",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
