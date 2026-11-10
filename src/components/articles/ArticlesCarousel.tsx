"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArticleMeta } from "@/components/ui/ArticleMeta";
import { Button } from "@/components/ui/Button";
import type { Article } from "@/lib/cms-types";


/** Featured stories carousel: centred slide with the neighbours peeking in, plus dot navigation. */
export function ArticlesCarousel({ articles }: { articles: Article[] }) {
  const slides = articles.slice(0, 3);
  const [active, setActive] = useState(Math.min(1, articles.length - 1));

  return (
    <section aria-roledescription="carousel" aria-label="Featured stories">
      <div
        className="overflow-hidden [--cg:16px] [--cw:88vw] lg:[--cg:calc(31*var(--d))] lg:[--cw:calc(753*var(--d))]"
      >
        <ul
          className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
          style={{
            gap: "var(--cg)",
            paddingLeft: "calc(50% - var(--cw) / 2)",
            transform: `translateX(calc(-1 * ${active} * (var(--cw) + var(--cg))))`,
          }}
        >
          {slides.map((article, i) => (
            <li
              key={article.slug}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slides.length}`}
              aria-hidden={i !== active}
              className="flex shrink-0 flex-col gap-6 bg-[#11171f] p-4 sm:flex-row sm:gap-[calc(42*var(--d))] sm:p-[calc(24*var(--d))] lg:min-h-[calc(334*var(--d))]"
              style={{ width: "var(--cw)" }}
            >
              <Link
                href={`/articles/${article.slug}`}
                tabIndex={i === active ? 0 : -1}
                className="relative block aspect-[239/294] w-full shrink-0 overflow-hidden sm:w-[calc(239*var(--d))] sm:min-w-[140px]"
                aria-label={article.title}
              >
                <Image
                  src={article.image.src}
                  alt=""
                  width={1024}
                  height={576}
                  sizes="30vw"
                  className="absolute inset-0 size-full object-cover"
                />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col justify-between gap-6">
                <div className="flex flex-col gap-[22px]">
                  <h2 className="text-[clamp(22px,1.85vw,32px)] font-semibold leading-[1.15] tracking-[-0.025em] text-ink">
                    {article.title}
                  </h2>
                  <ArticleMeta readTime={article.readTime} posted={article.posted} dateTime={article.published} />
                </div>
                <Button
                  href={`/articles/${article.slug}`}
                  tabIndex={i === active ? 0 : -1}
                  className="h-[47px] w-[173px]"
                >
                  Read More
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex items-center justify-center gap-[13px] lg:mt-[calc(28*var(--d))]" role="group" aria-label="Choose slide">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Show slide ${i + 1}`}
            aria-current={i === active}
            className={`size-2 rounded-full transition-colors ${i === active ? "bg-accent" : "bg-line hover:bg-accent-deep"}`}
          />
        ))}
      </div>
    </section>
  );
}
