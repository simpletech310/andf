import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact Us",
  description: "Email info@anewdayfoundation.net or call (424) 241-3623. Write to 20058 Ventura Blvd., Suite 326, Woodland Hills, CA 91364.",
  path: "/contact",
  type: "website",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
