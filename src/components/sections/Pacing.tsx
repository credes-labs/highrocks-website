"use client";

import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef } from "react";
import { d } from "@/lib/design";

/** A 1px-wide column holding a hairline that draws itself downwards. */
function VerticalHairline({ top, progress }: { top: number; progress: MotionValue<number> }) {
  const scaleY = useTransform(progress, [0.5, 0.78], [0, 1]);
  return (
    <div className="absolute left-1/2 hidden w-px md:block" style={{ top: d(top), height: d(278) }} aria-hidden>
      <div
        className="absolute left-1/2 top-1/2 h-px -translate-x-1/2 -translate-y-1/2 -rotate-90"
        style={{ width: d(278) }}
      >
        <motion.img
          src="/icons/pacing-vline.svg"
          alt=""
          width={278}
          height={1}
          className="block h-px w-full max-w-none"
          style={{ scaleX: scaleY, transformOrigin: "right center" }}
        />
      </div>
    </div>
  );
}

/**
 * "Built for Better Pacing." — a brief scroll pin while the brand mark is swept into view
 * by the scroll position: it fades up out of blur, scales and un-tilts, and a diagonal wipe
 * follows the slash of the mark; the hairlines then draw themselves and the heading settles in.
 * (Design canvas 1728 × 955.)
 */
export function Pacing() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end end"] });
  // A touch of spring makes wheel steps feel continuous instead of stepped.
  const p = useSpring(scrollYProgress, { stiffness: 180, damping: 30, mass: 0.3 });

  const markOpacity = useTransform(p, [0, 0.28], [0, 1]);
  const markScale = useTransform(p, [0, 0.62], [0.5, 1]);
  const markRotate = useTransform(p, [0, 0.62], [-14, 0]);
  const markBlur = useTransform(p, [0, 0.34], [18, 0]);
  const filter = useMotionTemplate`blur(${markBlur}px)`;
  const sweep = useTransform(p, [0.04, 0.62], [-20, 125]);
  const mask = useMotionTemplate`linear-gradient(145deg, #000 ${sweep}%, transparent calc(${sweep}% + 22%))`;
  const hlineScale = useTransform(p, [0.58, 0.84], [0, 1]);
  const headingOpacity = useTransform(p, [0.18, 0.46], [0, 1]);
  const headingY = useTransform(p, [0.18, 0.46], [48, 0]);
  const headingTracking = useTransform(p, [0.18, 0.6], ["0.12em", "-0.046em"]);
  const glow = useTransform(p, [0.5, 0.75, 1], [0, 0.55, 0.3]);

  const heading = (
    <h2 className="whitespace-nowrap text-center text-[clamp(28px,3.01vw,52px)] font-[480] capitalize leading-[1.154] text-accent">
      <span className="text-ink">Built for </span>Better Pacing.
    </h2>
  );

  return (
    <section
      id="pacing"
      ref={ref}
      className="relative w-full [--mt:50%] [--mw:min(96vw,520px)] [--pin:50vh] [--sh:100svh] md:[--mt:calc(87*var(--d))] md:[--mw:calc(865*var(--d))] md:[--pin:65vh] md:[--sh:max(420px,calc(955*var(--d)))]"
      style={{ height: reduce ? "var(--sh)" : "calc(var(--sh) + var(--pin))" }}
    >
      <div
        className="sticky mx-auto w-full max-w-[1728px] overflow-hidden"
        style={{ top: "max(0px, calc((100vh - var(--sh)) / 2))", height: "var(--sh)" }}
      >
        {/* Soft blue bloom that appears behind the mark once it has landed */}
        <motion.div
          className="pointer-events-none absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: "calc(var(--mw) * 1.1)",
            height: "calc(var(--mw) * 1.1)",
            opacity: reduce ? 0 : glow,
            background: "radial-gradient(closest-side, rgba(30,54,84,0.55), rgba(30,54,84,0) 70%)",
          }}
          aria-hidden
        />

        <motion.img
          src="/icons/pacing-mark.svg"
          alt=""
          width={865}
          height={868}
          className="absolute left-1/2 max-w-none -translate-x-1/2 -translate-y-1/2 md:translate-y-0"
          style={{
            top: "var(--mt)",
            width: "var(--mw)",
            height: "calc(var(--mw) * 868 / 865)",
            ...(reduce
              ? {}
              : { opacity: markOpacity, scale: markScale, rotate: markRotate, filter, WebkitMaskImage: mask, maskImage: mask }),
          }}
        />

        <VerticalHairline top={124} progress={p} />
        <VerticalHairline top={588} progress={p} />
        <motion.img
          src="/icons/pacing-hline.svg"
          alt=""
          width={460}
          height={1}
          className="absolute hidden h-px max-w-none md:block"
          style={{
            top: d(495),
            left: `calc(50% + ${d(311)})`,
            width: d(460),
            transformOrigin: "left center",
            ...(reduce ? {} : { scaleX: hlineScale }),
          }}
        />

        <motion.div
          className="absolute left-1/2 top-[51.8%] w-full -translate-x-1/2 -translate-y-1/2"
          style={
            reduce
              ? { letterSpacing: "-0.046em" }
              : { opacity: headingOpacity, y: headingY, letterSpacing: headingTracking }
          }
        >
          {heading}
        </motion.div>
      </div>
    </section>
  );
}
