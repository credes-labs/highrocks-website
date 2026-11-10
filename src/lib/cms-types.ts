/** Shapes the site renders. src/lib/cms.ts maps Payload documents into these. */

export type ArticleCategory = "Guides" | "Articles" | "Blogs";

export type ArticleSection = {
  heading: string;
  paragraphs: readonly string[];
  list?: readonly string[];
};

export type ArticleImage = { src: string; alt: string; width?: number; height?: number };

export type Article = {
  slug: string;
  title: string;
  /** Shorter title for the Info Centre tiles. */
  shortTitle?: string;
  /** One- or two-sentence answer used for cards, meta descriptions and AI summaries. */
  excerpt: string;
  category: ArticleCategory;
  /** ISO date (YYYY-MM-DD). */
  published: string;
  /** ISO date-time of the last edit. */
  updated?: string;
  image: ArticleImage;
  intro: readonly string[];
  sections: readonly ArticleSection[];
  quote: string;
  takeaways: readonly string[];
  keywords: readonly string[];
  /** Derived: "6 min". */
  readTime: string;
  /** Derived: "10 Nov 2026". */
  posted: string;
};

export type FaqItem = { q: string; a: string };
export type FaqGroup = { id: string; label: string; blurb: string; items: readonly FaqItem[] };

export type InfoCentreTile = { heading: string; title: string; ctaLabel: string; ctaLink: string; article: Article };
export type InfoCentreContent = { tiles: InfoCentreTile[]; latest: Article[] };

/** A legal page body block: paragraphs and bullet lists, in order. */
export type LegalBlock = { type: "p"; text: string } | { type: "ul"; items: string[] };
export type LegalPage = {
  slug: "privacy" | "terms";
  title: string;
  summary: string;
  lastUpdated: string;
  sections: { heading: string; id: string; blocks: LegalBlock[] }[];
};
