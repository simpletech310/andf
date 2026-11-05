import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Board & Team",
  description:
    "Meet A New Day Foundation's Board of Directors, Advisory Board, and team, led by founder and president Dawnn Lewis.",
  path: "/leadership",
  image: { url: "/images/team/dawnn-lewis.jpg", alt: "Dawnn Lewis, founder and president of A New Day Foundation" },
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
