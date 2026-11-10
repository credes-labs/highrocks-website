import path from "node:path";
import type { Payload } from "payload";
import { seedArticles } from "./articles";
import { faqGroups, homeFaqs } from "./faqs";

/** Home-page questions and the FAQ group each one belongs to. */
const HOME_FAQ_GROUP = ["hyrox", "pacing", "app"] as const;
/** Replaced by the fuller home-page version ("What is a Hyrox race?"). */
const SKIP = new Set(["What is Hyrox?"]);

const ctx = { disableRevalidate: true };

/**
 * Fills an empty database with the site's starting content: FAQ categories and questions,
 * articles (with their photos uploaded to Media) and the Info Centre highlights.
 * Safe to call on every boot; it does nothing once any FAQ or article exists.
 */
export async function seed(payload: Payload) {
  const [faqs, articles] = await Promise.all([
    payload.count({ collection: "faqs" }),
    payload.count({ collection: "articles" }),
  ]);
  if (faqs.totalDocs > 0 || articles.totalDocs > 0) return;

  payload.logger.info("Seeding HighRocks content…");

  // FAQs
  for (const [gi, g] of faqGroups.entries()) {
    const cat = await payload.create({
      collection: "faq-categories",
      data: { label: g.label, slug: g.id, blurb: g.blurb, order: (gi + 1) * 10 },
      context: ctx,
    });
    const home = HOME_FAQ_GROUP.indexOf(g.id as (typeof HOME_FAQ_GROUP)[number]);
    const items = [...(home >= 0 ? [{ ...homeFaqs[home], featured: true }] : []), ...g.items.filter((i) => !SKIP.has(i.q))];
    for (const [i, item] of items.entries()) {
      await payload.create({
        collection: "faqs",
        data: {
          question: item.q,
          answer: item.a,
          category: cat.id,
          order: (i + 1) * 10,
          featuredOnHome: "featured" in item && item.featured,
        },
        context: ctx,
      });
    }
  }

  // Photos: upload each public image once.
  const media = new Map<string, number>();
  for (const a of seedArticles) {
    if (media.has(a.image.src)) continue;
    const doc = await payload.create({
      collection: "media",
      data: { alt: a.image.alt },
      filePath: path.join(process.cwd(), "public", a.image.src),
      context: ctx,
    });
    media.set(a.image.src, doc.id);
  }

  // Articles
  const ids = new Map<string, number>();
  for (const a of seedArticles) {
    const doc = await payload.create({
      collection: "articles",
      data: {
        title: a.title,
        slug: a.slug,
        shortTitle: a.shortTitle,
        category: a.category,
        publishedAt: new Date(a.published).toISOString(),
        excerpt: a.excerpt,
        image: media.get(a.image.src)!,
        intro: a.intro.join("\n\n"),
        sections: a.sections.map((s) => ({
          heading: s.heading,
          body: s.paragraphs.join("\n\n"),
          list: s.list?.map((text) => ({ text })),
        })),
        quote: a.quote,
        takeaways: a.takeaways.map((text) => ({ text })),
        keywords: [...a.keywords],
        _status: "published",
      },
      context: ctx,
    });
    ids.set(a.slug, doc.id);
  }

  // Info Centre highlights, as they were designed.
  const id = (slug: string) => ids.get(slug)!;
  await payload.updateGlobal({
    slug: "info-centre",
    data: {
      tiles: [
        { heading: "Articles", article: id("running-indoors-or-outdoors-for-hyrox"), ctaLabel: "Explore Articles", ctaLink: "/articles" },
        { heading: "Blogs", article: id("sled-push-technique"), ctaLabel: "Explore Blogs", ctaLink: "/articles" },
        { heading: "Guides", article: id("how-to-do-skierg-efficiently"), ctaLabel: "Read Guides", ctaLink: "/articles" },
      ],
      latest: [
        id("walking-jogging-or-running-for-endurance"),
        id("cycling-for-hyrox-conditioning"),
        id("rowing-1000m-in-hyrox"),
      ],
    },
    context: ctx,
  });

  payload.logger.info(`Seeded ${seedArticles.length} articles and ${faqGroups.length} FAQ groups.`);
}
