import Image from "next/image";
import Link from "next/link";
import { d } from "@/lib/design";
import { Button } from "@/components/ui/Button";
import { Svg } from "@/components/ui/Svg";
import type { InfoCentreTile } from "@/lib/cms-types";

const ORIGIN_Y = 1044; // top of this block on the Figma canvas

/** Fixed design positions for the three tiles; their content comes from the CMS. */
const SLOTS = [
  {
    id: "articles",
    headingColor: "text-accent",
    centerX: 315,
    box: { x: 141, y: 1521, w: 348, h: 268 },
    titleY: 1852,
    timeY: 1834.5,
    timeRight: 489,
    cta: { x: 141, y: 1913, w: 173 },
  },
  {
    id: "blogs",
    headingColor: "text-[#f1f1f1]",
    centerX: 865.5,
    box: { x: 690, y: 1521, w: 348, h: 191 },
    titleY: 1770,
    timeY: 1753.5,
    timeRight: 1038,
    cta: { x: 690, y: 1829, w: 174 },
  },
  {
    id: "guides",
    headingColor: "text-[#f1f1f1]",
    centerX: 1414,
    box: { x: 1240, y: 1521, w: 348, h: 268 },
    titleY: 1852,
    timeY: 1834.5,
    timeRight: 1588,
    cta: { x: 1240, y: 1913, w: 175 },
  },
] as const;

/** Articles / Blogs / Guides entry points (design canvas 1728 wide, staggered middle column). */
export function CategoryTrio({ tiles }: { tiles: InfoCentreTile[] }) {
  const categories = SLOTS.slice(0, tiles.length).map((slot, i) => ({ ...slot, tile: tiles[i] }));
  return (
    <section aria-label="Browse by type" className="relative">
      {/* Glow behind the block */}
      <div
        className="pointer-events-none absolute inset-x-0 opacity-[0.74]"
        style={{
          top: d(1167 - ORIGIN_Y),
          height: d(1042),
          backgroundImage: `radial-gradient(${d(829)} ${d(409)} at 50% 50%, #1e3654 0%, #172434 50%, #141a23 75%, #101113 100%)`,
        }}
        aria-hidden
      />

      {/* Mobile / tablet */}
      <div className="relative mx-auto grid max-w-3xl gap-14 px-5 py-16 sm:grid-cols-3 lg:hidden">
        {categories.map((c) => (
          <div key={c.id} className="flex flex-col gap-4">
            <h2 className="headline text-[56px]">{c.tile.heading}</h2>
            <Image
              src={c.tile.article.image.src}
              alt=""
              width={1448}
              height={1086}
              sizes="(min-width: 640px) 30vw, 90vw"
              className="aspect-[348/268] w-full object-cover"
            />
            <p className="text-[22px] leading-[1.25] tracking-[-0.03em] text-ink">{c.tile.title}</p>
            <Button href={c.tile.ctaLink} className="w-fit px-6">
              {c.tile.ctaLabel}
            </Button>
          </div>
        ))}
      </div>

      {/* Desktop */}
      <div className="relative mx-auto hidden lg:block" style={{ width: d(1728), height: d(2397 - ORIGIN_Y) }}>
        {([428, 962] as const).map((x) => (
          <Svg
            key={x}
            name="pages/hairline-340"
            width={340}
            height={1}
            className="absolute h-px max-w-none"
            style={{ left: d(x), top: d(1449 - ORIGIN_Y), width: d(340) }}
          />
        ))}

        {categories.map((c) => (
          <div key={c.id}>
            <h2
              className="headline absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap"
              style={{
                left: d(c.centerX),
                top: d(1450.5 - ORIGIN_Y),
                fontSize: d(54),
                lineHeight: d(69),
              }}
            >
              {c.tile.heading}
            </h2>

            <Link
              href={`/articles/${c.tile.article.slug}`}
              className="absolute block"
              style={{ left: d(c.box.x), top: d(c.box.y - ORIGIN_Y), width: d(c.box.w), height: d(c.box.h) }}
              aria-label={`${c.tile.heading}: ${c.tile.article.title}`}
            >
              <Image
                src={c.tile.article.image.src}
                alt=""
                width={1448}
                height={1086}
                sizes="25vw"
                className="size-full object-cover"
              />
            </Link>

            <p
              className="absolute -translate-y-1/2 tracking-[-0.05em] text-ink"
              style={{
                left: d(c.box.x - (c.id === "blogs" ? 3 : 0)),
                top: d(c.titleY - ORIGIN_Y),
                width: d(224),
                fontSize: d(32),
                lineHeight: d(41),
              }}
            >
              {c.tile.title}
            </p>
            <p
              className="absolute -translate-x-full -translate-y-1/2 text-right text-ink/70"
              style={{
                left: d(c.timeRight),
                top: d(c.timeY - ORIGIN_Y),
                width: d(74),
                fontSize: d(20),
                lineHeight: d(22.75),
              }}
            >
              {c.tile.article.readTime}
            </p>

            <Button
              href={c.tile.ctaLink}
              className="absolute h-auto"
              style={{
                left: d(c.cta.x),
                top: d(c.cta.y - ORIGIN_Y),
                width: d(c.cta.w),
                height: d(47),
                fontSize: d(12.691),
              }}
            >
              {c.tile.ctaLabel}
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
