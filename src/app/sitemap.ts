import type { MetadataRoute } from "next";
import { getArticles } from "@/lib/cms";
import { SITE_URL } from "@/lib/site";

/** Date the landing and product pages last changed meaningfully. Bump it when they do. */
const SITE_UPDATED = new Date("2026-11-10");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getArticles();
  const latestArticle = articles[0] ? new Date(articles[0].updated ?? articles[0].published) : SITE_UPDATED;
  const pages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: SITE_UPDATED, changeFrequency: "weekly", priority: 1, images: [`${SITE_URL}/images/hero-bg.webp`] },
    { url: `${SITE_URL}/features`, lastModified: SITE_UPDATED, changeFrequency: "monthly", priority: 0.9, images: [`${SITE_URL}/images/pages/features-hero.webp`] },
    { url: `${SITE_URL}/pace-calculator`, lastModified: new Date("2026-11-12"), changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/faqs`, lastModified: SITE_UPDATED, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/info-centre`, lastModified: latestArticle, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/articles`, lastModified: latestArticle, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/privacy`, lastModified: SITE_UPDATED, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/terms`, lastModified: SITE_UPDATED, changeFrequency: "yearly", priority: 0.2 },
  ];
  return [
    ...pages,
    ...articles.map((a) => ({
      url: `${SITE_URL}/articles/${a.slug}`,
      lastModified: new Date(a.updated ?? a.published),
      changeFrequency: "monthly" as const,
      priority: 0.6,
      images: [`${SITE_URL}${a.image.src}`],
    })),
  ];
}
