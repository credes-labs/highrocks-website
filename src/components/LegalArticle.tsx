import type { LegalPage } from "@/lib/cms-types";
import { gutter } from "@/lib/design";

const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/** Privacy policy / terms layout: title, summary, contents list and numbered sections. */
export function LegalArticle({ page }: { page: LegalPage }) {
  return (
    <article className={`pb-24 pt-[140px] lg:pb-[calc(160*var(--d))] lg:pt-[calc(220*var(--d))] ${gutter}`}>
      <header className="max-w-[1100px]">
        <h1 className="display text-[clamp(52px,9vw,160px)]">{page.title}</h1>
        <p className="mt-6 font-grotesk text-[12px] uppercase tracking-[0.2em] text-accent">
          Last updated <time dateTime={page.lastUpdated.slice(0, 10)}>{dateFmt.format(new Date(page.lastUpdated))}</time>
        </p>
        {page.summary && <p className="lede mt-6 max-w-[760px]">{page.summary}</p>}
      </header>

      <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-[260px_minmax(0,760px)] lg:gap-20">
        <nav aria-label="On this page" className="lg:sticky lg:top-28 lg:self-start">
          <p className="font-grotesk text-[11px] uppercase tracking-[0.2em] text-[#889fc3]">On this page</p>
          <ol className="mt-4 flex flex-col gap-2.5 border-l border-white/15 pl-4 text-[14px] text-muted">
            {page.sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="transition-colors hover:text-ink">
                  <span className="mr-2 font-grotesk text-[11px] text-accent/70">{String(i + 1).padStart(2, "0")}</span>
                  {s.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="flex flex-col gap-12">
          {page.sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-28 border-t border-white/15 pt-6">
              <h2 className="headline text-[clamp(28px,2.4vw,40px)]">
                <span className="mr-3 font-grotesk text-[14px] tracking-[0.15em] text-accent align-middle">{String(i + 1).padStart(2, "0")}</span>
                {s.heading}
              </h2>
              <div className="copy mt-5 flex flex-col gap-4">
                {s.blocks.map((b, j) =>
                  b.type === "p" ? (
                    <p key={j}>{b.text}</p>
                  ) : (
                    <ul key={j} className="flex list-disc flex-col gap-2 pl-5 marker:text-accent">
                      {b.items.map((it) => (
                        <li key={it}>{it}</li>
                      ))}
                    </ul>
                  ),
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
