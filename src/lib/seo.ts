import type { Metadata } from "next";
import { ORG } from "@/lib/contact";

/** Public URL of the site. Set NEXT_PUBLIC_SITE_URL in Vercel when a custom domain is connected. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://andf-website.vercel.app").replace(/\/$/, "");

export const DEFAULT_OG_IMAGE = {
  url: "/images/og/andf-og.jpg",
  width: 1200,
  height: 630,
  alt: "A New Day Foundation: every young person deserves a new day. Founded by Dawnn Lewis.",
};

/** Per-page metadata with canonical URL, Open Graph, and Twitter card. */
export function pageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  image?: { url: string; width?: number; height?: number; alt?: string };
  type?: "website" | "article" | "profile";
}): Metadata {
  const images = [image ?? DEFAULT_OG_IMAGE];
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type, url: path, title: `${title} | ${ORG.name}`, description, siteName: ORG.name, images, locale: "en_US" },
    twitter: { card: "summary_large_image", title: `${title} | ${ORG.name}`, description, images: images.map((i) => i.url) },
  };
}

/** Organization structured data (schema.org NGO) for search engines. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "NGO",
    "@id": `${SITE_URL}/#organization`,
    name: ORG.name,
    alternateName: ORG.shortName,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo/andf-logo.png`,
    image: `${SITE_URL}${DEFAULT_OG_IMAGE.url}`,
    description:
      "A New Day Foundation empowers underserved youth ages 13–19 with the tools, guidance, and support they need to succeed, through real-world experiences, mentorship, and financial and technology literacy.",
    foundingDate: "2017",
    founder: {
      "@type": "Person",
      name: "Dawnn Lewis",
      jobTitle: "Founder & President",
      url: `${SITE_URL}/about#founder`,
      sameAs: ["https://en.wikipedia.org/wiki/Dawnn_Lewis"],
    },
    nonprofitStatus: "Nonprofit501c3",
    taxID: ORG.ein,
    email: ORG.email,
    telephone: "+1-424-241-3623",
    address: {
      "@type": "PostalAddress",
      streetAddress: ORG.address.street,
      addressLocality: ORG.address.city,
      addressRegion: ORG.address.region,
      postalCode: ORG.address.postalCode,
      addressCountry: "US",
    },
    areaServed: ["Los Angeles", "Atlanta", "Chicago", "Washington, D.C.", "Indianapolis"],
    sameAs: [ORG.youtube, ORG.facebook, ORG.instagram, ORG.officialSite],
  };
}
