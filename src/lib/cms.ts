import "server-only";
import config from "@payload-config";
import { cacheLife, cacheTag } from "next/cache";
import { draftMode } from "next/headers";
import { getPayload } from "payload";
import type { Article as ArticleDoc, Faq as FaqDoc, FaqCategory, Media } from "@/payload-types";
import { TAGS } from "@/payload/revalidate";
import type { Article, FaqGroup, FaqItem, InfoCentreContent, InfoCentreTile, LegalBlock, LegalPage } from "@/lib/cms-types";

/**
 * Read-side of the CMS. Every fetcher is cached and tagged; the collection hooks in
 * src/payload/revalidate.ts invalidate the tags when an editor saves, so pages stay static
 * but update on the next visit after a change.
 */

const cms = () => getPayload({ config });

const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

/** Textarea → paragraphs (blank line separated). */
const paragraphs = (text: string | null | undefined) =>
  (text ?? "")
    .split(/\r?\n\s*\r?\n/)
    .map((p) => p.replace(/\s*\r?\n\s*/g, " ").trim())
    .filter(Boolean);

function toArticle(doc: ArticleDoc): Article {
  const media = typeof doc.image === "object" ? (doc.image as Media) : null;
  const intro = paragraphs(doc.intro);
  const sections = (doc.sections ?? []).map((s) => ({
    heading: s.heading,
    paragraphs: paragraphs(s.body),
    list: s.list?.length ? s.list.map((l) => l.text) : undefined,
  }));
  const takeaways = (doc.takeaways ?? []).map((t) => t.text);
  const words = [...intro, ...sections.flatMap((s) => [s.heading, ...s.paragraphs, ...(s.list ?? [])]), ...takeaways]
    .join(" ")
    .split(/\s+/).length;
  return {
    slug: doc.slug,
    title: doc.title,
    shortTitle: doc.shortTitle ?? undefined,
    excerpt: doc.excerpt,
    category: doc.category,
    published: doc.publishedAt.slice(0, 10),
    updated: doc.updatedAt,
    image: {
      src: media?.url ?? "/images/hero-bg.webp",
      alt: media?.alt ?? "",
      width: media?.width ?? undefined,
      height: media?.height ?? undefined,
    },
    intro,
    sections,
    quote: doc.quote ?? "",
    takeaways,
    keywords: doc.keywords ?? [],
    readTime: `${Math.max(3, Math.round(words / 200))} min`,
    posted: dateFmt.format(new Date(doc.publishedAt)),
  };
}

const isPublished = (doc: unknown, preview = false): doc is ArticleDoc =>
  typeof doc === "object" && doc !== null && (preview || (doc as ArticleDoc)._status === "published");

/** Published articles, newest first. In draft mode (editor preview) drafts are included too. */
export async function getArticles(): Promise<Article[]> {
  "use cache";
  cacheTag(TAGS.articles);
  cacheLife("days");
  const preview = (await draftMode()).isEnabled;
  const { docs } = await (await cms()).find({
    collection: "articles",
    draft: preview,
    where: preview ? {} : { _status: { equals: "published" } },
    sort: "-publishedAt",
    limit: 0,
    depth: 1,
  });
  return docs.map(toArticle);
}

export async function getArticle(slug: string): Promise<Article | undefined> {
  return (await getArticles()).find((a) => a.slug === slug);
}

/** Up to `n` other articles, same category first. */
export async function getRelatedArticles(article: Article, n = 3): Promise<Article[]> {
  const others = (await getArticles()).filter((a) => a.slug !== article.slug);
  return [...others.filter((a) => a.category === article.category), ...others.filter((a) => a.category !== article.category)].slice(0, n);
}

/** FAQ page groups, in category order, each with its questions in order. */
export async function getFaqGroups(): Promise<FaqGroup[]> {
  "use cache";
  cacheTag(TAGS.faqs);
  cacheLife("days");
  const payload = await cms();
  const [cats, faqs] = await Promise.all([
    payload.find({ collection: "faq-categories", sort: "order", limit: 0, depth: 0 }),
    payload.find({ collection: "faqs", sort: "order", limit: 0, depth: 0 }),
  ]);
  const catId = (f: FaqDoc) => (typeof f.category === "object" ? (f.category as FaqCategory).id : f.category);
  return cats.docs
    .map((c) => ({
      id: c.slug,
      label: c.label,
      blurb: c.blurb ?? "",
      items: faqs.docs.filter((f) => catId(f) === c.id).map((f) => ({ q: f.question, a: f.answer })),
    }))
    .filter((g) => g.items.length > 0);
}

/** The questions ticked “Show on home page”. */
export async function getHomeFaqs(): Promise<FaqItem[]> {
  "use cache";
  cacheTag(TAGS.faqs);
  cacheLife("days");
  const { docs } = await (await cms()).find({
    collection: "faqs",
    where: { featuredOnHome: { equals: true } },
    sort: "order",
    limit: 3,
    depth: 0,
  });
  return docs.map((f) => ({ q: f.question, a: f.answer }));
}

/** Info Centre highlights: the three tiles and the “Latest” rows (falls back to the newest). */
export async function getInfoCentre(): Promise<InfoCentreContent> {
  "use cache";
  cacheTag(TAGS.infoCentre, TAGS.articles);
  cacheLife("days");
  const preview = (await draftMode()).isEnabled;
  const [global, articles] = await Promise.all([
    (await cms()).findGlobal({ slug: "info-centre", depth: 2, draft: preview }),
    getArticles(),
  ]);
  const tiles: InfoCentreTile[] = (global.tiles ?? []).flatMap((t) =>
    isPublished(t.article, preview)
      ? [{ heading: t.heading, ctaLabel: t.ctaLabel, ctaLink: t.ctaLink || "/articles", title: "", article: toArticle(t.article) }]
      : [],
  );
  for (const t of tiles) t.title = t.article.shortTitle || t.article.title;
  const picked = (global.latest ?? []).filter((a) => isPublished(a, preview)).map(toArticle);
  return { tiles, latest: picked.length ? picked : articles.slice(0, 3) };
}

/** Body text → paragraphs and bullet lists (lines starting with "- "). */
function legalBlocks(text: string): LegalBlock[] {
  const blocks: LegalBlock[] = [];
  for (const chunk of text.split(/\r?\n\s*\r?\n/)) {
    let para: string[] = [];
    let list: string[] | null = null;
    const flush = () => {
      if (para.length) blocks.push({ type: "p", text: para.join(" ") });
      para = [];
    };
    for (const line of chunk.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)) {
      if (line.startsWith("- ")) {
        flush();
        if (!list) blocks.push({ type: "ul", items: (list = []) });
        list.push(line.slice(2));
      } else {
        list = null;
        para.push(line);
      }
    }
    flush();
  }
  return blocks;
}

export async function getLegalPage(slug: LegalPage["slug"]): Promise<LegalPage | undefined> {
  "use cache";
  cacheTag(TAGS.legal);
  cacheLife("days");
  const { docs } = await (await cms()).find({ collection: "legal-pages", where: { slug: { equals: slug } }, limit: 1, depth: 0 });
  const doc = docs[0];
  if (!doc) return undefined;
  return {
    slug,
    title: doc.title,
    summary: doc.summary ?? "",
    lastUpdated: doc.lastUpdated,
    sections: (doc.sections ?? []).map((s) => ({
      heading: s.heading,
      id: s.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      blocks: legalBlocks(s.body),
    })),
  };
}
