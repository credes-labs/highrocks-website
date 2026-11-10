import Image from "next/image";
import { d, gutter } from "@/lib/design";

/** "Stories" hero (design canvas 1728 × 1044). */
export function InfoHero() {
  return (
    <section className="relative overflow-hidden" style={{ minHeight: "max(440px, calc(1044 * var(--d)))" }}>
      <div className="absolute inset-x-0 top-0 opacity-[0.6]" style={{ height: d(999) }}>
        <Image
          src="/images/pages/info-hero.png"
          alt=""
          width={1024}
          height={684}
          priority
          unoptimized
          className="size-full object-cover object-bottom"
        />
      </div>
      <Image
        src="/images/hero-fade.png"
        alt=""
        width={1024}
        height={211}
        className="pointer-events-none absolute inset-x-0 bottom-0 w-full object-cover mix-blend-luminosity"
        style={{ height: d(356) }}
      />

      <div
        className={`relative z-10 flex flex-col justify-end gap-6 pb-12 pt-[150px] lg:pb-[calc(90*var(--d))] ${gutter}`}
        style={{ minHeight: "inherit" }}
      >
        <h1 className="headline text-[clamp(56px,11vw,200px)]">Hyrox stories</h1>
        <p className="lede">
          Guides, race reports and training advice for Hyrox athletes: from your first race to chasing
          a podium in your age group.
        </p>
      </div>
    </section>
  );
}
