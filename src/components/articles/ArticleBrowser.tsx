"use client";

import { useState } from "react";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { Button } from "@/components/ui/Button";
import { Svg } from "@/components/ui/Svg";
import { articles } from "@/lib/content";

const LAYOUTS = [2, 3, 4] as const;
type Cols = (typeof LAYOUTS)[number];

const colClass: Record<Cols, string> = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-2 lg:grid-cols-3",
  4: "md:grid-cols-2 lg:grid-cols-4",
};

/** Layout switcher (2/3/4 columns), the story grid and "Load More". */
export function ArticleBrowser() {
  const [cols, setCols] = useState<Cols>(3);
  const [visible, setVisible] = useState(6);
  const shown = articles.slice(0, visible);

  return (
    <section aria-label="All articles" className="px-5 lg:px-[calc(71*var(--d))]">
      <div className="flex justify-end gap-[19px]" role="group" aria-label="Grid layout">
        {LAYOUTS.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setCols(n)}
            aria-pressed={cols === n}
            aria-label={`${n} columns`}
            className={`transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
              cols === n ? "opacity-100" : "opacity-40 hover:opacity-70"
            }`}
          >
            <Svg name={`pages/columns-${n}`} width={35.0204} height={35.0204} />
          </button>
        ))}
      </div>

      <div className={`mt-[clamp(20px,2.3vw,40px)] grid grid-cols-1 border-b border-r border-white/20 ${colClass[cols]}`}>
        {shown.map((a) => (
          <ArticleCard key={a.slug} article={a} ruled />
        ))}
      </div>

      {visible < articles.length && (
        <div className="mt-[clamp(32px,3.9vw,68px)] flex justify-center">
          <Button onClick={() => setVisible((v) => Math.min(v + 6, articles.length))} className="h-[54px] w-[203px]">
            Load More
          </Button>
        </div>
      )}
    </section>
  );
}
