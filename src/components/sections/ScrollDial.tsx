"use client";

import { useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useRef, useState } from "react";
import { d } from "@/lib/design";

const TICKS = Array.from({ length: 60 }, (_, i) => i * 6);

/**
 * The 60-tick dial around "Train in Full Circle". The lower half lights up clockwise
 * (from 3 o'clock round to 9 o'clock) as the section scrolls through the viewport.
 */
export function ScrollDial({ cx, cy, radius }: { cx: number; cy: number; radius: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 95%", "end 35%"] });
  const [sweep, setSweep] = useState(reduce ? 180 : 0);

  // Quantise to whole ticks so React only re-renders when another tick lights up.
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (reduce) return;
    const next = Math.round(Math.min(Math.max(v, 0), 1) * 30) * 6;
    setSweep((prev) => (prev === next ? prev : next));
  });

  return (
    <div ref={ref} className="pointer-events-none absolute" style={{ left: d(cx), top: d(cy) }} aria-hidden>
      {TICKS.map((deg) => {
        const lit = deg >= 90 && deg <= 90 + sweep && deg <= 270;
        return (
          <span
            key={deg}
            className={`absolute block transition-[background-color,box-shadow] duration-300 ${
              lit ? "bg-accent-deep shadow-[0_0_8px_rgba(136,159,195,0.4)]" : "bg-line"
            }`}
            style={{
              width: d(2.646),
              height: d(18.523),
              left: d(-1.323),
              top: d(-9.26),
              transform: `rotate(${deg}deg) translateY(${d(-radius)})`,
            }}
          />
        );
      })}
    </div>
  );
}
