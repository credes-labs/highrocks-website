import "server-only";
import config from "@payload-config";
import { cacheLife, cacheTag } from "next/cache";
import { getPayload } from "payload";
import type { Article as ArticleDoc, Faq as FaqDoc, FaqCategory, Media } from "@/payload-types";
import { TAGS } from "@/payload/revalidate";
import type { Article, FaqGroup, FaqItem, InfoCentreContent, InfoCentreTile } from "@/lib/cms-types";

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
      src: media?.url ?? "/images/hero-bg.png",
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

const isPublished = (doc: unknown): doc is ArticleDoc =>
  typeof doc === "object" && doc !== null && (doc as ArticleDoc)._status === "published";

/** Published articles, newest first. */
export async function getArticles(): Promise<Article[]> {
  "use cache";
  cacheTag(TAGS.articles);
  cacheLife("days");
  const { docs } = await (await cms()).find({
    collection: "articles",
    where: { _status: { equals: "published" } },
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
  const [global, articles] = await Promise.all([
    (await cms()).findGlobal({ slug: "info-centre", depth: 2 }),
    getArticles(),
  ]);
  const tiles: InfoCentreTile[] = (global.tiles ?? []).flatMap((t) =>
    isPublished(t.article)
      ? [{ heading: t.heading, ctaLabel: t.ctaLabel, ctaLink: t.ctaLink || "/articles", title: "", article: toArticle(t.article) }]
      : [],
  );
  for (const t of tiles) t.title = t.article.shortTitle || t.article.title;
  const picked = (global.latest ?? []).filter(isPublished).map(toArticle);
  return { tiles, latest: picked.length ? picked : articles.slice(0, 3) };
}
