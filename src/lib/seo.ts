import type { Metadata } from "next";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

type PageMeta = {
  title: string;
  description: string;
  path: string;
  keywords?: readonly string[];
  /** Article pages pass their dates so link previews and crawlers see them. */
  article?: { published: string; modified?: string; section?: string; tags?: readonly string[] };
};

/**
 * Per-page metadata: canonical URL plus Open Graph and Twitter tags that describe *this* page.
 * Share images come from the nearest opengraph-image file, so they are not set here.
 */
export function pageMetadata({ title, description, path, keywords, article }: PageMeta): Metadata {
  return {
    title,
    description,
    keywords: keywords ? [...keywords] : undefined,
    alternates: { canonical: path },
    openGraph: {
      siteName: SITE_NAME,
      locale: "en_GB",
      url: path,
      title,
      description,
      ...(article
        ? {
            type: "article",
            publishedTime: article.published,
            modifiedTime: article.modified ?? article.published,
            section: article.section,
            tags: article.tags ? [...article.tags] : undefined,
            authors: [absoluteUrl("/")],
          }
        : { type: "website" }),
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export type Crumb = { name: string; path: string };

/** schema.org BreadcrumbList for a trail that starts at Home. */
export function breadcrumbLd(trail: readonly Crumb[]) {
  const items = [{ name: "Home", path: "/" }, ...trail];
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

/** Stable @id references so every page's graph links back to the same organisation and site. */
export const ORG_ID = absoluteUrl("/#org");
export const WEBSITE_ID = absoluteUrl("/#website");
export const APP_ID = absoluteUrl("/#app");
