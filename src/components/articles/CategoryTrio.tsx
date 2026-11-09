import Image from "next/image";
import Link from "next/link";
import { d } from "@/lib/design";
import { Button } from "@/components/ui/Button";
import { Svg } from "@/components/ui/Svg";

const ORIGIN_Y = 1044; // top of this block on the Figma canvas

const categories = [
  {
    id: "articles",
    heading: "Articles",
    headingColor: "text-accent",
    centerX: 315,
    image: "category-articles",
    box: { x: 141, y: 1521, w: 348, h: 268 },
    title: "Running - Indoors or outdoors?",
    titleY: 1852,
    timeY: 1834.5,
    timeRight: 489,
    cta: { label: "Explore Articles", x: 141, y: 1913, w: 173 },
    href: "/articles",
  },
  {
    id: "blogs",
    heading: "Blogs",
    headingColor: "text-[#f1f1f1]",
    centerX: 865.5,
    image: "category-blogs",
    box: { x: 690, y: 1521, w: 348, h: 191 },
    title: "Sled-push was tough until?",
    titleY: 1770,
    timeY: 1753.5,
    timeRight: 1038,
    cta: { label: "Explore Blogs", x: 690, y: 1829, w: 174 },
    href: "/articles",
  },
  {
    id: "guides",
    heading: "Guides",
    headingColor: "text-[#f1f1f1]",
    centerX: 1414,
    image: "category-guides",
    box: { x: 1240, y: 1521, w: 348, h: 268 },
    title: "How to do SkiErg efficiently",
    titleY: 1852,
    timeY: 1834.5,
    timeRight: 1588,
    cta: { label: "Read Guides", x: 1240, y: 1913, w: 175 },
    href: "/articles",
  },
] as const;

/** Articles / Blogs / Guides entry points (design canvas 1728 wide, staggered middle column). */
export function CategoryTrio() {
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
            <h2 className={`text-[44px] leading-[1.2] tracking-[-0.044em] capitalize ${c.headingColor}`}>{c.heading}</h2>
            <Image
              src={`/images/pages/${c.image}.png`}
              alt=""
              width={1448}
              height={1086}
              sizes="(min-width: 640px) 30vw, 90vw"
              className="aspect-[348/268] w-full object-cover"
            />
            <p className="text-[26px] capitalize leading-[1.28] tracking-[-0.075em] text-ink">{c.title}</p>
            <Button href={c.href} className="w-fit px-6">
              {c.cta.label}
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
              className={`absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap capitalize tracking-[-0.044em] ${c.headingColor}`}
              style={{
                left: d(c.centerX),
                top: d(1450.5 - ORIGIN_Y),
                fontSize: d(54),
                lineHeight: d(69),
              }}
            >
              {c.heading}
            </h2>

            <Link
              href={c.href}
              className="absolute block"
              style={{ left: d(c.box.x), top: d(c.box.y - ORIGIN_Y), width: d(c.box.w), height: d(c.box.h) }}
              aria-label={`${c.heading}: ${c.title}`}
            >
              <Image
                src={`/images/pages/${c.image}.png`}
                alt=""
                width={1448}
                height={1086}
                sizes="25vw"
                className="size-full object-cover"
              />
            </Link>

            <p
              className="absolute -translate-y-1/2 capitalize tracking-[-0.075em] text-ink"
              style={{
                left: d(c.box.x - (c.id === "blogs" ? 3 : 0)),
                top: d(c.titleY - ORIGIN_Y),
                width: d(224),
                fontSize: d(32),
                lineHeight: d(41),
              }}
            >
              {c.title}
            </p>
            <p
              className="absolute -translate-x-full -translate-y-1/2 text-right capitalize tracking-[0.035em] text-muted"
              style={{
                left: d(c.timeRight),
                top: d(c.timeY - ORIGIN_Y),
                width: d(74),
                fontSize: d(20),
                lineHeight: d(22.75),
              }}
            >
              10 min
            </p>

            <Button
              href={c.href}
              className="absolute h-auto"
              style={{
                left: d(c.cta.x),
                top: d(c.cta.y - ORIGIN_Y),
                width: d(c.cta.w),
                height: d(47),
                fontSize: d(12.691),
              }}
            >
              {c.cta.label}
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
