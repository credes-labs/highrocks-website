import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { d } from "@/lib/design";
import type { Article } from "@/lib/cms-types";

/** Fixed design layout for the rows; the article in each comes from the CMS. */
const ROWS = [
  { photoSide: "right", pos: "50% 28%" },
  { photoSide: "left", pos: "50% 72%" },
  { photoSide: "right", pos: "50% 60%" },
] as const;

function TextPanel({ flip, title, href }: { flip: boolean; title: string; href: string }) {
  return (
    <div className="relative flex h-full w-full flex-col justify-center overflow-hidden px-5 py-12 lg:px-[calc(71*var(--d))] lg:py-0">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.69]"
        style={{
          backgroundImage: `radial-gradient(${d(405)} ${d(405)} at ${flip ? "-9.7%" : "109.7%"} 50%, #1e3654 0%, #172434 50%, #141a23 75%, #101113 100%)`,
        }}
        aria-hidden
      />
      <div className="relative flex max-w-[494px] flex-col gap-[clamp(32px,4.75vw,82px)]">
        <h3 className="text-[clamp(30px,2.31vw,40px)] font-normal capitalize leading-[1.35] tracking-[-0.06em] text-ink">
          <Link href={href}>{title}</Link>
        </h3>
        <Button href={href} className="h-[54px] w-[203px]">
          Read More<span className="sr-only">: {title}</span>
        </Button>
      </div>
    </div>
  );
}

/** "Latest" — three full-bleed rows alternating photo / text (design canvas 1728 wide). */
export function LatestRows({ articles }: { articles: Article[] }) {
  const rows = ROWS.slice(0, articles.length).map((row, i) => ({ ...row, article: articles[i] }));
  return (
    <section aria-labelledby="latest-heading">
      <h2
        id="latest-heading"
        className="headline px-4 text-[clamp(48px,7vw,128px)] sm:px-6 lg:px-8"
      >
        Latest
      </h2>
      <div className="mt-8 lg:mt-[calc(36*var(--d))]">
        {rows.map((row, i) => {
          const photoLeft = row.photoSide === "left";
          const { article } = row;
          const href = `/articles/${article.slug}`;
          return (
            <div
              key={i}
              className={`grid lg:min-h-[calc(410*var(--d))] ${
                photoLeft ? "lg:grid-cols-[1114fr_614fr]" : "lg:grid-cols-[614fr_1114fr]"
              }`}
            >
              <Link
                href={href}
                className={`relative block min-h-[240px] overflow-hidden ${photoLeft ? "lg:order-1" : "lg:order-2"}`}
                aria-label={article.title}
              >
                <Image
                  src={article.image.src}
                  alt={article.image.alt}
                  width={article.image.width ?? 1536}
                  height={article.image.height ?? 1024}
                  sizes="(min-width: 1024px) 65vw, 100vw"
                  className="absolute inset-0 size-full object-cover"
                  style={{ objectPosition: row.pos }}
                />
              </Link>
              <div className={`flex ${photoLeft ? "lg:order-2" : "lg:order-1"}`}>
                <TextPanel flip={photoLeft} title={article.title} href={href} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
