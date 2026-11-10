import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from "payload";

/** Cache tags used by the site's data fetchers in src/lib/cms.ts. */
export const TAGS = {
  faqs: "cms:faqs",
  articles: "cms:articles",
  infoCentre: "cms:info-centre",
  legal: "cms:legal",
} as const;

/**
 * Marks cached pages stale after an edit. `expire: 0` means the next visit rebuilds the page
 * instead of briefly showing the old copy, so editors see their change on the first reload.
 */
async function bust(tags: readonly string[], context: Record<string, unknown>) {
  if (context.disableRevalidate) return;
  // Imported lazily: the Payload CLI loads this file outside Next, where next/cache cannot resolve.
  const { revalidateTag } = await import("next/cache");
  for (const tag of tags) {
    try {
      revalidateTag(tag, { expire: 0 });
    } catch {
      // Outside a request (seed, CLI): there is nothing cached to invalidate.
    }
  }
}

export const revalidateOnChange =
  (...tags: string[]): CollectionAfterChangeHook =>
  async ({ doc, req }) => {
    await bust(tags, req.context);
    return doc;
  };

export const revalidateOnDelete =
  (...tags: string[]): CollectionAfterDeleteHook =>
  async ({ doc, req }) => {
    await bust(tags, req.context);
    return doc;
  };

export const revalidateGlobal =
  (...tags: string[]): GlobalAfterChangeHook =>
  async ({ doc, req }) => {
    await bust(tags, req.context);
    return doc;
  };
