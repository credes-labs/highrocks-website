"use client";

import { useRef } from "react";
import { useInView } from "motion/react";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { AppleWatch, FitbitWatch, FitStage, GarminWatch, Rig, WhoopBand, useLive } from "@/components/ecosystem/Watches";
import { type Live } from "@/components/ecosystem/Screens";
import { wearables } from "@/lib/content";

type Wearable = (typeof wearables)[number];

function Heading() {
  return (
    <>
      <h2 className="text-center text-[clamp(30px,3.01vw,52px)] font-normal capitalize leading-[1.154] tracking-[-0.046em] text-accent">
        <span className="text-[#f1f1f1]">Connect your </span>ecosystem.
      </h2>
      <p className="mt-3 text-center text-[clamp(16px,1.16vw,20px)] capitalize leading-[22.75px] tracking-[0.035em] text-muted">
        Sync your data from devices you trust.
      </p>
    </>
  );
}

function Watch({ id, live }: { id: Wearable["id"]; live: Live }) {
  if (id === "apple") return <AppleWatch live={live} />;
  if (id === "garmin") return <GarminWatch live={live} />;
  if (id === "fitbit") return <FitbitWatch live={live} />;
  return <WhoopBand live={live} />;
}

/** One wearable lying flat on the ground — just the model and its interactions. */
function WearableRow({ item }: { item: Wearable }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const [live, advance] = useLive(inView);
  return (
    <Reveal amount={0.2} y={56}>
      <div ref={ref}>
        <FitStage>
          <Rig onActivate={advance} label={`${item.name} — click to switch screen`}>
            <Watch id={item.id} live={live} />
          </Rig>
        </FitStage>
      </div>
    </Reveal>
  );
}

/**
 * "Connect your ecosystem." — each supported wearable is drawn as a laid-flat 2.5D model
 * (CSS 3D, no WebGL needed) that tilts with the pointer, sways when idle and tilts with scroll.
 * Screens cycle through live pace / heart / station views; click a watch to switch.
 */
export function Ecosystem() {
  return (
    <section id="ecosystem" className="relative py-20 lg:py-[calc(110*var(--d))]">
      <div className="mx-auto max-w-[1516px] px-5 lg:px-[clamp(20px,6.13vw,106px)]">
        <Reveal className="mx-auto max-w-[547px]">
          <Eyebrow align="center" fill={163}>
            Coming soon
          </Eyebrow>
          <div className="mt-[17px]">
            <Heading />
          </div>
        </Reveal>
      </div>
      <div className="mt-4 flex flex-col gap-2 overflow-x-clip lg:mt-8 lg:gap-6">
        {wearables.map((w) => (
          <WearableRow key={w.id} item={w} />
        ))}
      </div>
    </section>
  );
}
