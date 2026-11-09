"use client";

import { useState } from "react";
import { d } from "@/lib/design";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { featureTabs, stationsMore } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";
import { DrillLibrary } from "./DrillLibrary";
import { RaceSimulation } from "./RaceSimulation";
import { SplitLedger } from "./SplitLedger";

/** "Powerful Features. Designed to Perform." with four selectable feature columns. */
export function Features() {
  const [active, setActive] = useState(1);

  return (
    <section
      id="features"
      className="relative scroll-mt-24 px-5 pb-20 pt-24 lg:px-0 lg:pb-0"
      style={{
        backgroundImage: "linear-gradient(180deg, #101113 0%, #1c2632 24%, #19212b 52%, #101113 100%)",
      }}
    >
      <div className="mx-auto max-w-[1728px] lg:pl-[clamp(20px,6.13vw,106px)] lg:pr-[clamp(20px,5.09vw,88px)]">
        <Reveal className="lg:pt-[calc(55*var(--d))]">
          <div className="max-w-[476px]">
            <Eyebrow>Coming soon</Eyebrow>
            <h2 className="mt-[17px] text-[clamp(32px,3.01vw,52px)] font-normal capitalize leading-[1.154] tracking-[-0.046em]">
              <span className="block text-accent">Powerful Features.</span>
              <span className="block text-ink-soft">Designed to Perform.</span>
            </h2>
            <Button href="/features" className="mt-[17px] w-[183px]">
              Explore Features
            </Button>
          </div>
        </Reveal>

        {/* Mobile / tablet: swipeable tab bar, one panel at a time */}
        <div
          className="-mx-5 mt-10 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] xl:hidden [&::-webkit-scrollbar]:hidden"
          role="group"
          aria-label="Feature previews"
        >
          {featureTabs.map((tab, i) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={i === active}
              className={`shrink-0 border px-4 py-2.5 font-grotesk text-[11px] uppercase tracking-[0.15em] transition-colors ${
                i === active
                  ? "border-accent bg-accent text-navy"
                  : "border-white/20 text-muted hover:border-accent/60"
              }`}
            >
              {tab.short}
            </button>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 xl:mt-[calc(86*var(--d))] xl:grid-cols-4">
          {featureTabs.map((tab, i) => {
            const isActive = i === active;
            return (
              <Reveal key={tab.id} delay={i * 0.1} y={48} className={`${isActive ? "flex" : "hidden"} xl:flex`}>
              <div
                onMouseEnter={() => setActive(i)}
                className={`flex w-full flex-col px-[26px] pb-8 pt-[27px] xl:min-h-[545px] xl:pb-0 transition-colors duration-300 ${
                  isActive
                    ? "border border-accent bg-gradient-to-b from-card from-[61.5%] to-navy"
                    : "border-l border-[#747474]"
                }`}
              >
                <button
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="block text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                  <span
                    className={`flex h-[50px] items-center text-[32px] capitalize leading-[60px] tracking-[-0.075em] text-accent transition-opacity ${
                      isActive ? "" : "opacity-60"
                    }`}
                  >
                    {tab.title}
                  </span>
                  <span
                    className={`mt-0.5 block max-w-[325px] text-[18px] capitalize leading-[22.75px] tracking-[0.039em] text-muted transition-opacity ${
                      isActive ? "" : "opacity-60"
                    }`}
                  >
                    {tab.blurb}
                  </span>
                </button>

                <div className="mt-[82px]">
                  {tab.id === "pace" && <SplitLedger />}
                  {tab.id === "drills" && <DrillLibrary />}
                  {tab.id === "race" && <RaceSimulation />}
                  {tab.id === "drills-2" && <DrillLibrary items={stationsMore} />}
                </div>
              </div>
              </Reveal>
            );
          })}
        </div>
      </div>
      <div className="hidden lg:block" style={{ height: d(157) }} aria-hidden />
    </section>
  );
}
