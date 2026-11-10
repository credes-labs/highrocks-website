"use client";

import { useId, useMemo, useState } from "react";
import type { FaqGroup } from "@/lib/cms-types";

function Item({ n, q, a, open, onToggle }: { n: number; q: string; a: string; open: boolean; onToggle: () => void }) {
  const id = useId();
  return (
    <li className={`border-b border-white/10 transition-colors ${open ? "bg-white/[0.04]" : "hover:bg-white/[0.025]"}`}>
      <h3 className="m-0">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={onToggle}
          className="flex w-full items-start gap-4 px-4 py-5 text-left focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-accent md:gap-6 md:px-6 md:py-6"
        >
          <span className={`mt-1.5 w-7 shrink-0 font-grotesk text-[12px] tabular-nums tracking-[0.15em] transition-colors ${open ? "text-accent" : "text-[#889fc3]"}`}>
            {String(n).padStart(2, "0")}
          </span>
          <span className={`flex-1 text-[19px] font-semibold leading-[1.25] tracking-[-0.02em] text-ink transition-colors md:text-[24px]`}>{q}</span>
          <span className="relative mt-2 size-5 shrink-0" aria-hidden>
            <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-accent" />
            <span className={`absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-accent transition-transform duration-300 ${open ? "scale-y-0" : ""}`} />
          </span>
        </button>
      </h3>
      {/* Answers stay in the HTML when closed so search and AI crawlers can read every one. */}
      <div
        id={id}
        role="region"
        inert={!open}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <p className="max-w-[760px] pb-6 pl-[44px] pr-12 text-[16px] leading-[26px] text-muted md:pb-8 md:pl-[76px] md:text-[17px] md:leading-[28px]">{a}</p>
        </div>
      </div>
    </li>
  );
}

/** Category tabs + search + accordion for the full FAQ list. */
export function FaqBrowser({ groups: faqGroups }: { groups: FaqGroup[] }) {
  const [group, setGroup] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [openKey, setOpenKey] = useState<string | null>(`${faqGroups[0]?.id}-0`);

  const sections = useMemo(() => {
    const q = query.trim().toLowerCase();
    let n = 0;
    return faqGroups
      .filter((g) => group === "all" || g.id === group)
      .map((g) => ({
        ...g,
        items: g.items
          .map((it, i) => ({ ...it, key: `${g.id}-${i}` }))
          .filter((it) => !q || `${it.q} ${it.a}`.toLowerCase().includes(q))
          .map((it) => ({ ...it, n: ++n })),
      }))
      .filter((g) => g.items.length > 0);
  }, [faqGroups, group, query]);

  const total = sections.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="max-w-[1280px]">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div role="tablist" aria-label="Question categories" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
          {[{ id: "all", label: "All" }, ...faqGroups].map((g) => {
            const on = group === g.id;
            return (
              <button
                key={g.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setGroup(g.id)}
                className={`shrink-0 whitespace-nowrap border px-4 py-2.5 font-grotesk text-[11px] uppercase tracking-[0.16em] transition-colors ${
                  on ? "border-accent bg-accent text-navy" : "border-white/15 text-ink-soft hover:border-accent/60"
                }`}
              >
                {g.label}
              </button>
            );
          })}
        </div>
        <label className="flex h-11 items-center gap-3 border border-white/20 bg-white/[0.05] px-4 focus-within:border-accent md:w-[280px]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#889fc3" strokeWidth="1.5" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <span className="sr-only">Search questions</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions"
            className="min-w-0 flex-1 bg-transparent text-[15px] font-light text-ink placeholder:text-ink/45 focus:outline-none"
          />
        </label>
      </div>

      <p className="mt-6 font-grotesk text-[11px] uppercase tracking-[0.2em] text-[#889fc3]" aria-live="polite">
        {total} {total === 1 ? "question" : "questions"}
      </p>

      {sections.length === 0 && (
        <p className="mt-10 border border-white/10 bg-white/[0.04] p-8 text-center text-muted">
          Nothing matches &ldquo;{query}&rdquo;. Try a different word, or browse a category.
        </p>
      )}

      {sections.map((g) => (
        <section key={g.id} id={g.id} className="mt-10 scroll-mt-28">
          <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <h2 className="display text-[clamp(40px,5vw,88px)]">{g.label}</h2>
            <p className="text-[15px] text-muted">{g.blurb}</p>
          </div>
          <ul className="border-t border-white/20">
            {g.items.map((it) => (
              <Item key={it.key} n={it.n} q={it.q} a={it.a} open={openKey === it.key} onToggle={() => setOpenKey((k) => (k === it.key ? null : it.key))} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
