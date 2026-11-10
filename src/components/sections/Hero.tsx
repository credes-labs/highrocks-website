import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { ParallaxLayer, ScrollFade } from "@/components/motion/ScrollEffects";

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex h-[100svh] max-h-[900px] min-h-[600px] justify-center overflow-hidden md:h-[clamp(640px,64.64vw,1117px)] md:max-h-none"
    >
      {/* Track photo, slightly zoomed like the Figma crop; drifts slower than the page */}
      <ParallaxLayer className="absolute inset-0">
      <Image
        src="/images/hero-bg.webp"
        alt=""
        width={1536}
        height={1024}
        fetchPriority="high"
        loading="eager"
        sizes="(min-width: 768px) 115vw, 100vw"
        className="absolute left-0 top-[-13%] h-full w-full max-w-none object-cover object-[50%_90%] md:left-[-7.21%] md:top-[-18.02%] md:h-[117.99%] md:w-[114.41%] md:object-center"
      />
      </ParallaxLayer>
      {/* Fade into the page background */}
      <Image
        src="/images/hero-fade.webp"
        alt=""
        width={1024}
        height={211}
        sizes="100vw"
        className="pointer-events-none absolute bottom-0 left-0 h-[32%] w-full object-cover mix-blend-darken"
      />

      <ScrollFade className="relative z-10 flex h-full w-full max-w-[711px] flex-col items-center px-5 pb-12 pt-[112px] text-center md:h-auto md:pb-0 md:pt-[max(150px,calc(299*var(--d)))]">
        <h1 className="text-[clamp(34px,4.6vw,52px)] font-[480] capitalize leading-[1.154] tracking-[-0.046em] text-accent">
          Master <span className="text-ink">the 8 runs.</span>
          <br />
          Predict <span className="text-ink">your finish.</span>
        </h1>
        <p className="mt-[26px] text-[clamp(14px,1.4vw,16px)] font-[450] capitalize leading-[22.75px] tracking-[0.044em] text-muted">
          Training logs are boring. Race day surprises are worse. HighRocks fixes both.
        </p>
        <div className="mt-auto flex w-full flex-col gap-3 md:mt-14 md:w-auto md:flex-row md:flex-wrap md:items-center md:justify-center md:gap-[26px]">
          <Button href="#waitlist" variant="light" className="hero-cta hero-cta-primary group w-full md:w-[210px]">
            <span className="hero-cta-lanes" aria-hidden><i /><i /><i /></span>
            <span>Join Waitlist</span>
            <span aria-hidden className="hero-cta-arrow">↗</span>
          </Button>
          <Button href="#features" className="hero-cta hero-cta-secondary group w-full md:w-[210px]">
            <span className="hero-cta-index" aria-hidden>01—08</span>
            <span>Explore Features</span>
            <span aria-hidden className="hero-cta-arrow">↓</span>
          </Button>
        </div>
      </ScrollFade>
    </section>
  );
}
