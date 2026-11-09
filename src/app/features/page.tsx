import type { Metadata } from "next";
import Image from "next/image";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { DialTicks } from "@/components/features/DialTicks";
import { SandbagCard, SkiErgCard, WallBallCard } from "@/components/features/DrillPhoneCards";
import { PaceCalculator } from "@/components/features/PaceCalculator";
import "./features.css";
import { d } from "@/lib/design";

export const metadata: Metadata = {
  title: "Features — HighRocks",
  description: "Drill guidance, pace calculator and split ledger — everything you need to train properly for Hyrox.",
};

const DIAL_ORIGIN = 1044; // canvas y where the dial block starts
const DIAL_STAGE_HEIGHT = 2020;

/** Scales fixed-size design cards down to fit narrow screens (they are sized in --d pixels). */
const fitMobile = { "--d": "min(calc((100vw - 40px) / 412), 1px)" } as React.CSSProperties;

function DialHeading({ className = "" }: { className?: string }) {
  return (
    <div className={`text-center ${className}`}>
      <h2 className="text-[clamp(34px,3.01vw,52px)] font-normal capitalize leading-[1.154] tracking-[-0.046em] text-ink-soft">
        Don’t just Move.
        <br />
        Train properly for <span className="text-accent">Best Results.</span>
      </h2>
      <p className="mx-auto mt-3 max-w-[413px] text-[clamp(16px,1.16vw,20px)] capitalize leading-[22.75px] tracking-[0.035em] text-muted">
        Our features help you to train, breathe and maintain proper form to be your best self and athlete.
      </p>
    </div>
  );
}

export default function FeaturesPage() {
  return (
    <>
      <Navbar />
      <main className="features-page">
        {/* Hero */}
        <section className="features-hero relative overflow-hidden" style={{ minHeight: "max(560px, calc(1044 * var(--d)))" }}>
          <Image
            src="/images/pages/features-hero.png"
            alt=""
            width={1536}
            height={1024}
            priority
            unoptimized
            className="absolute left-[-0.28%] top-[-0.02%] h-[110.33%] w-[100.02%] max-w-none object-cover"
          />
          <div className="features-hero-fade" aria-hidden />
          <h1 className="absolute inset-x-0 top-[max(190px,calc(259*var(--d)))] px-5 text-center text-[clamp(34px,3.01vw,52px)] font-normal capitalize leading-[1.154] tracking-[-0.046em] text-ink">
            Powerful <span className="text-accent">Features.</span>
            <br />
            Designed to perform.
          </h1>
        </section>

        {/* Dial + drill previews */}
        <section aria-label="Drill guidance" className="features-drills relative">
          {/* Mobile / tablet: heading, then the three drill previews as a swipeable row */}
          <div className="py-16 lg:hidden">
            <div className="px-5" style={fitMobile}>
              <DialHeading />
            </div>
            <p className="mt-8 text-center font-grotesk text-[10px] uppercase tracking-[0.25em] text-[#889fc3]">
              Swipe through the drills <span aria-hidden>→</span>
            </p>
            <div
              className="mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              style={{ "--d": "min(calc((100vw - 72px) / 412), 1px)" } as React.CSSProperties}
            >
              {[SandbagCard, SkiErgCard, WallBallCard].map((Card, i) => (
                <div key={i} className="shrink-0 snap-center first:ml-0">
                  <Card />
                </div>
              ))}
            </div>
          </div>

          {/* Desktop */}
          <div className="relative mx-auto hidden lg:block" style={{ width: d(1728), height: d(DIAL_STAGE_HEIGHT) }}>
            <DialTicks
              cx={863.7}
              cy={1985.7 - DIAL_ORIGIN}
              radius={648}
              tickWidth={5.119}
              tickHeight={35.835}
              isLit={(a) => a <= 90 || a >= 270}
            />
            <div className="absolute" style={{ left: d(658), top: d(1567 - DIAL_ORIGIN), width: d(413) }}>
              <DialHeading />
            </div>
            <div className="absolute" style={{ left: d(129), top: d(1705 - DIAL_ORIGIN) }}>
              <SandbagCard />
            </div>
            <div className="absolute" style={{ left: d(666), top: d(2133 - DIAL_ORIGIN) }}>
              <SkiErgCard />
            </div>
            <div className="absolute" style={{ left: d(1203), top: d(1705 - DIAL_ORIGIN) }}>
              <WallBallCard />
            </div>
          </div>
        </section>

        <PaceCalculator />
      </main>
      <Footer />
    </>
  );
}

