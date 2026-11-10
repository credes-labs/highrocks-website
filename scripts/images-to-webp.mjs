#!/usr/bin/env node
/**
 * Converts every PNG/JPEG under public/images to WebP (sharp), rewrites references in src/,
 * then deletes the originals. Safe to re-run: it only touches files that still need converting.
 *
 *   npm run images:webp            convert + rewrite + delete originals
 *   npm run images:webp -- --dry   report only
 */
import { readdir, readFile, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const IMAGES = path.join(ROOT, "public", "images");
const SRC = path.join(ROOT, "src");
const DRY = process.argv.includes("--dry");
const MAX_WIDTH = 2560; // nothing on the site renders wider than this
const RASTER = /\.(png|jpe?g)$/i;
const CODE = /\.(tsx?|css|mjs)$/;

async function walk(dir, match) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p, match)));
    else if (match.test(e.name)) out.push(p);
  }
  return out;
}

const kb = (n) => `${Math.round(n / 1024)} KB`;

const files = await walk(IMAGES, RASTER);
let before = 0;
let after = 0;
const renamed = new Map(); // "/images/a.png" -> "/images/a.webp"

for (const file of files) {
  const input = await readFile(file);
  const img = sharp(input);
  const meta = await img.metadata();
  const out = file.replace(RASTER, ".webp");
  const webp = await img
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: 80, alphaQuality: 90, effort: 6, smartSubsample: true })
    .toBuffer();
  before += input.length;
  after += webp.length;
  const rel = "/" + path.relative(path.join(ROOT, "public"), file).split(path.sep).join("/");
  renamed.set(rel, rel.replace(RASTER, ".webp"));
  console.log(`${rel.padEnd(42)} ${String(meta.width).padStart(5)}px  ${kb(input.length).padStart(8)} → ${kb(webp.length).padStart(7)}`);
  if (!DRY) await writeFile(out, webp);
}

// Rewrite references: exact paths, plus template paths like `/images/pages/${bg}.png`.
let edited = 0;
for (const file of await walk(SRC, CODE)) {
  if (file.includes(`${path.sep}migrations${path.sep}`) || file.endsWith("payload-types.ts")) continue;
  const text = await readFile(file, "utf8");
  let next = text;
  for (const [from, to] of renamed) next = next.split(from).join(to);
  next = next.replace(/(\/images\/[^"'`\s]*\$\{[^}]+\})\.(png|jpe?g)/g, "$1.webp");
  if (next !== text) {
    edited++;
    console.log(`updated ${path.relative(ROOT, file)}`);
    if (!DRY) await writeFile(file, next);
  }
}

if (!DRY) for (const file of files) if ((await stat(file.replace(RASTER, ".webp"))).size > 0) await unlink(file);

console.log(`\n${files.length} images: ${kb(before)} → ${kb(after)} (${Math.round((1 - after / before) * 100)}% smaller). ${edited} source files updated.${DRY ? " (dry run)" : " Originals deleted."}`);
