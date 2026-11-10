import { mkdtemp, readFile, rm, unlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import type { Payload } from "payload";
import sharp from "sharp";

const MEDIA_DIR = path.resolve(process.cwd(), "media");

/**
 * Re-saves any Media upload that is not WebP yet (e.g. photos uploaded before WebP conversion
 * was switched on). Idempotent: once everything is WebP it does nothing.
 */
export async function convertMediaToWebp(payload: Payload) {
  const { docs } = await payload.find({
    collection: "media",
    where: { mimeType: { not_equals: "image/webp" } },
    limit: 0,
    depth: 0,
  });
  if (!docs.length) return;
  const tmp = await mkdtemp(path.join(tmpdir(), "hr-media-"));
  try {
    for (const doc of docs) {
      if (!doc.filename) continue;
      const original = path.join(MEDIA_DIR, doc.filename);
      const webp = await sharp(await readFile(original)).webp({ quality: 80, alphaQuality: 90, effort: 5 }).toBuffer();
      const file = path.join(tmp, doc.filename.replace(/\.[a-z0-9]+$/i, ".webp"));
      await writeFile(file, webp);
      await payload.update({ collection: "media", id: doc.id, data: {}, filePath: file, context: { disableRevalidate: true } });
      await unlink(original).catch(() => {}); // Payload keeps the old file; remove it.
      payload.logger.info(`Media: ${doc.filename} → WebP`);
    }
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }
}
