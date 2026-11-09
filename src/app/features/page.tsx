import type { Metadata } from "next";
import Image from "next/image";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { DialTicks } from "@/components/features/DialTicks";
import { SandbagCard, SkiErgCard, WallBallCard } from "@/components/features/DrillPhoneCards";
import { SplitLedgerPanel } from "@/components/features/SplitLedgerPanel";
import { d } from "@/lib/design";

export const metadata: Metadata = {
  title: "Features — HighRocks",
  description: "Drill guidance, pace calculator and split ledger — everything you need to train properly for Hyrox.",
};

const DIAL_ORIGIN = 1044; // canvas y where the dial block starts
const PACE_ORIGIN = 3224; // canvas y where the pace block starts

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
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden" style={{ minHeight: "max(560px, calc(1044 * var(--d)))" }}>
          <Image
            src="/images/pages/features-hero.png"
            alt=""
            width={1536}
            height={1024}
            priority
            unoptimized
            className="absolute left-[-0.28%] top-[-0.02%] h-[110.33%] w-[100.02%] max-w-none object-cover"
          />
          <Image
            src="/images/hero-fade.png"
            alt=""
            width={1024}
            height={211}
            className="pointer-events-none absolute inset-x-0 bottom-0 w-full object-cover mix-blend-luminosity"
            style={{ height: d(356) }}
          />
          <h1 className="absolute inset-x-0 top-[max(190px,calc(259*var(--d)))] px-5 text-center text-[clamp(34px,3.01vw,52px)] font-normal capitalize leading-[1.154] tracking-[-0.046em] text-ink">
            Powerful <span className="text-accent">Features.</span>
            <br />
            Designed to perform.
          </h1>
        </section>

        {/* Dial + drill previews */}
        <section aria-label="Drill guidance" className="relative">
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
          <div className="relative mx-auto hidden lg:block" style={{ width: d(1728), height: d(PACE_ORIGIN - DIAL_ORIGIN) }}>
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

        {/* Pace calculator */}
        <section id="pace-calculator" className="relative scroll-mt-24">
          <div
            className="pointer-events-none absolute inset-x-0 hidden lg:block"
            style={{
              top: d(3424 - PACE_ORIGIN),
              height: d(336),
              backgroundImage: "linear-gradient(to right, rgba(30,54,84,0.23), rgba(16,17,19,0.23))",
            }}
            aria-hidden
          />

          {/* Mobile / tablet */}
          <div className="mx-auto flex max-w-3xl flex-col gap-10 px-5 py-16 lg:hidden">
            <div>
              <h2 className="text-[clamp(40px,10vw,64px)] font-normal capitalize leading-[1.08] tracking-[-0.0375em] text-[#f1f1f1]">
                Pace Calculator
              </h2>
              <p className="mt-6 max-w-[553px] text-[16px] capitalize leading-[22.75px] tracking-[0.044em] text-muted">
                Our features help you to train, breathe and maintain proper form to be your best self and athlete.
              </p>
            </div>
            <SplitSummary fluid={false} />
            <div style={{ "--d": "min(calc((100vw - 40px) / 717), 1px)" } as React.CSSProperties}>
              <SplitLedgerPanel />
            </div>
          </div>

          {/* Desktop */}
          <div className="relative mx-auto hidden lg:block" style={{ width: d(1728), height: d(4162 - PACE_ORIGIN) }}>
            <div className="absolute flex flex-col" style={{ left: d(79), top: d(3519 - PACE_ORIGIN), width: d(553), gap: d(30) }}>
              <h2
                className="font-normal capitalize text-[#f1f1f1]"
                style={{ fontSize: d(64), lineHeight: d(69), letterSpacing: "-0.0375em" }}
              >
                Pace Calculator
              </h2>
              <p className="capitalize text-muted" style={{ fontSize: d(20), lineHeight: d(22.75), letterSpacing: "0.035em" }}>
                Our features help you to train, breathe and maintain proper form to be your best self and athlete.
              </p>
            </div>
            <div className="absolute" style={{ left: d(79), top: d(3729 - PACE_ORIGIN), width: d(340) }}>
              <SplitSummary fluid />
            </div>
            <div className="absolute" style={{ left: d(874), top: d(3243 - PACE_ORIGIN) }}>
              <SplitLedgerPanel />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function SplitSummary({ fluid }: { fluid: boolean }) {
  const u = (n: number) => (fluid ? d(n) : `${n}px`);
  const stats = [
    { label: "Total run", value: "32:45", accent: false },
    { label: "Stations", value: "35:15", accent: false },
    { label: "T_final", value: "01:08:00", accent: true },
  ];
  return (
    <dl className="grid grid-cols-3" style={{ gap: u(1), backgroundColor: "rgba(67,71,78,0.2)", maxWidth: fluid ? undefined : 340 }}>
      {stats.map((s) => (
        <div key={s.label} className="bg-card" style={{ padding: u(16) }}>
          <dt className="font-grotesk uppercase" style={{ color: s.accent ? "#ffb598" : "#889fc3", fontSize: u(10), lineHeight: u(15) }}>
            {s.label}
          </dt>
          <dd className="text-white" style={{ marginTop: u(4), color: s.accent ? "#ffb598" : undefined, fontSize: u(20), lineHeight: u(28) }}>
            {s.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
