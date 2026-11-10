import type { MetadataRoute } from "next";
import { articles } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

const UPDATED = new Date("2026-11-10");

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: UPDATED, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/features`, lastModified: UPDATED, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/faqs`, lastModified: UPDATED, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/info-centre`, lastModified: UPDATED, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/articles`, lastModified: UPDATED, changeFrequency: "weekly", priority: 0.7 },
  ];
  return [
    ...pages,
    ...articles.map((a) => ({
      url: `${SITE_URL}/articles/${a.slug}`,
      lastModified: UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
