import type { Metadata } from "next";
import { PROGRAMS_BY_SLUG } from "@/lib/programs";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = PROGRAMS_BY_SLUG[slug];
  return {
    ...pageMetadata({
      title: `Apply for ${p?.title ?? "a program"}`,
      description: `Apply for ${p?.title ?? "an A New Day Foundation program"} for youth ages 13–19. Your application is sent by email to A New Day Foundation.`,
      path: `/programs/${slug}/apply`,
    }),
    robots: { index: false, follow: true },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
