import type { MetadataRoute } from "next";
import { PROGRAMS } from "@/lib/programs";
import { getBuiltInEvents } from "@/lib/featured-events";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "", priority: 1, freq: "weekly" },
    { path: "/about", priority: 0.9, freq: "monthly" },
    { path: "/leadership", priority: 0.8, freq: "monthly" },
    { path: "/programs", priority: 0.9, freq: "monthly" },
    { path: "/events", priority: 0.8, freq: "weekly" },
    { path: "/donate", priority: 0.9, freq: "monthly" },
    { path: "/sponsor", priority: 0.8, freq: "monthly" },
    { path: "/live", priority: 0.7, freq: "weekly" },
    { path: "/gallery", priority: 0.6, freq: "monthly" },
    { path: "/contact", priority: 0.6, freq: "yearly" },
  ];
  return [
    ...pages.map((p) => ({ url: `${SITE_URL}${p.path}`, lastModified: now, changeFrequency: p.freq, priority: p.priority })),
    ...PROGRAMS.map((p) => ({ url: `${SITE_URL}/programs/${p.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...getBuiltInEvents().map((e) => ({
      url: `${SITE_URL}/events/${e.id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: e.status === "published" ? 0.7 : 0.4,
    })),
  ];
}
