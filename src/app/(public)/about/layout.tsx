import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About Dawnn Lewis and A New Day Foundation",
  description: "Meet founder Dawnn Lewis, the Grammy Award-winning artist and star of A Different World and Star Trek: Lower Decks, and the board leading A New Day Foundation since 2017.",
  path: "/about",
  image: { url: "/images/team/dawnn-lewis.jpg", alt: "About Dawnn Lewis and A New Day Foundation" },
  type: "profile",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
