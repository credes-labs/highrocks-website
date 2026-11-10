import type { MetadataRoute } from "next";
import { articles } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

/** Date the landing and product pages last changed meaningfully. Bump it when they do. */
const SITE_UPDATED = new Date("2026-11-10");

export default function sitemap(): MetadataRoute.Sitemap {
  const latestArticle = new Date(articles[0].published);
  const pages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: SITE_UPDATED, changeFrequency: "weekly", priority: 1, images: [`${SITE_URL}/images/hero-bg.png`] },
    { url: `${SITE_URL}/features`, lastModified: SITE_UPDATED, changeFrequency: "monthly", priority: 0.9, images: [`${SITE_URL}/images/pages/features-hero.png`] },
    { url: `${SITE_URL}/faqs`, lastModified: SITE_UPDATED, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/info-centre`, lastModified: latestArticle, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/articles`, lastModified: latestArticle, changeFrequency: "weekly", priority: 0.7 },
  ];
  return [
    ...pages,
    ...articles.map((a) => ({
      url: `${SITE_URL}/articles/${a.slug}`,
      lastModified: new Date(a.published),
      changeFrequency: "monthly" as const,
      priority: 0.6,
      images: [`${SITE_URL}${a.image.src}`],
    })),
  ];
}
