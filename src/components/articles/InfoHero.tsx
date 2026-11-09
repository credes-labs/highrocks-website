import Image from "next/image";
import { d } from "@/lib/design";

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
        className="relative z-10 mx-auto flex max-w-[1728px] flex-col gap-6 px-5 pt-[150px] lg:block lg:px-0 lg:pt-0"
        style={{ minHeight: "inherit" }}
      >
        <h1 className="text-[clamp(44px,3.7vw,64px)] font-normal capitalize leading-[1.06] tracking-[-0.0375em] text-ink lg:absolute lg:left-[calc(317*var(--d))] lg:top-[calc(805*var(--d))]">
          Stories
        </h1>
        <p className="max-w-[403px] text-[clamp(16px,1.16vw,20px)] capitalize leading-[22.75px] tracking-[0.035em] text-muted lg:absolute lg:left-[calc(1014*var(--d))] lg:top-[calc(805*var(--d))]">
          Our features help you to train, breathe and maintain proper form to be your best self and athlete.
        </p>
      </div>
    </section>
  );
}
