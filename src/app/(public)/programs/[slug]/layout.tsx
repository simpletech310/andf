import type { Metadata } from "next";
import { PROGRAMS, PROGRAMS_BY_SLUG } from "@/lib/programs";
import { pageMetadata, SITE_URL } from "@/lib/seo";

export function generateStaticParams() {
  return PROGRAMS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = PROGRAMS_BY_SLUG[slug];
  if (!p) return { title: "Program not found", robots: { index: false } };
  return pageMetadata({
    title: `${p.title}: ${p.tagline}`,
    description: p.description,
    path: `/programs/${p.slug}`,
    image: { url: p.hero_image_url, alt: p.title },
  });
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = PROGRAMS_BY_SLUG[slug];
  const jsonLd = p
    ? {
        "@context": "https://schema.org",
        "@type": "Service",
        name: p.title,
        description: p.description,
        url: `${SITE_URL}/programs/${p.slug}`,
        image: `${SITE_URL}${p.hero_image_url}`,
        audience: { "@type": "PeopleAudience", suggestedMinAge: 13, suggestedMaxAge: 19 },
        provider: { "@id": `${SITE_URL}/#organization` },
      }
    : null;
  return (
    <>
      {jsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /> : null}
      {children}
    </>
  );
}
