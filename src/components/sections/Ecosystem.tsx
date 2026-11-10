"use client";

import { useRef } from "react";
import { useInView } from "motion/react";
import { Reveal } from "@/components/motion/Reveal";
import { gutter } from "@/lib/design";
import { AppleWatch, FitbitWatch, FitStage, GarminWatch, Rig, WhoopBand, useLive } from "@/components/ecosystem/Watches";
import { type Live } from "@/components/ecosystem/Screens";
import { wearables } from "@/lib/content";

type Wearable = (typeof wearables)[number];

function Heading() {
  return (
    <>
      <h2 className="display text-[clamp(52px,9.4vw,172px)]">Sync the watch you train with.</h2>
      <p className="lede mt-6">
        Coming soon: connect Apple Watch, Garmin, Whoop and Fitbit. Heart rate, pace and recovery data
        flow straight into your Hyrox training plan, so every split is measured, not guessed.
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
      <div className={gutter}>
        <Reveal>
          <Heading />
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
