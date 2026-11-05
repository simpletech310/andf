import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Donate",
  description: "Make a tax-deductible gift to A New Day Foundation, a 501(c)(3) nonprofit (EIN 82-1965126). Donate by card, PayPal, or mail.",
  path: "/donate",
  image: { url: "/images/experiences/nmaahc-2025.jpg", alt: "Donate" },
  type: "website",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
