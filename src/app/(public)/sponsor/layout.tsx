import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Partner With Us",
  description: "Sponsor a program, fund scholarships, send your team to mentor, or host an experience. Partner with Dawnn Lewis and A New Day Foundation.",
  path: "/sponsor",
  image: { url: "/images/experiences/fnf-2024.jpg", alt: "Partner With Us" },
  type: "website",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
