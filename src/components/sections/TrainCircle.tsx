"use client";

import Image from "next/image";
import { useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useMemo, useRef, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";

type Station = { id: string; name: string; metric?: string; image: string };

const STATIONS: Station[] = [
  { id: "run-out", name: "Running", metric: "8 Kms", image: "/images/polaroid-run.png" },
  { id: "sled", name: "Sled Push", metric: "12.5m", image: "/images/polaroid-sled.png" },
  { id: "endurance", name: "Endurance", image: "/images/journey/endurance.webp" },
  { id: "run-back", name: "Running", metric: "8 Kms", image: "/images/polaroid-run.png" },
  { id: "wallballs", name: "Wall Balls", metric: "100 R", image: "/images/polaroid-wallballs.png" },
  { id: "nutrition", name: "Nutrition", image: "/images/journey/nutrition.webp" },
];

/** Arc in viewBox units. Angles in degrees, 0° = right, clockwise positive. */
type Arc = { cx: number; cy: number; r: number; from: number; to: number };

type Copy = { x: number; y: number; w: number; align: "left" | "center" };

type Layout = {
  w: number;
  h: number;
  arcs: [Arc, Arc];
  /** Where each station sits: arc index + angle on that arc. */
  cards: { arc: 0 | 1; at: number; dx?: number; dy?: number; rot: number }[];
  card: number;
  /** Title block and closing line: anchor point, width, alignment (viewBox units). */
  copy: [Copy, Copy];
  tick: number;
  step: number;
};

const DESKTOP: Layout = {
  w: 1600,
  h: 1860,
  arcs: [
    { cx: 150, cy: 480, r: 400, from: 232, to: 488 },
    { cx: 1450, cy: 1320, r: 400, from: -52, to: -308 },
  ],
  cards: [
    { arc: 0, at: 300, rot: 0 },
    { arc: 0, at: 4, rot: 0 },
    { arc: 0, at: 76, rot: 0 },
    { arc: 1, at: -120, rot: 0 },
    { arc: 1, at: -180, rot: 0 },
    { arc: 1, at: -245, rot: 0 },
  ],
  card: 236,
  copy: [
    { x: 900, y: 470, w: 600, align: "left" },
    { x: 200, y: 1320, w: 560, align: "left" },
  ],
  tick: 26,
  step: 4.4,
};

const MOBILE: Layout = {
  w: 500,
  h: 1950,
  // Half-circles cut by the screen edges, like desktop: the first opens to the left, the second to the right.
  arcs: [
    { cx: 10, cy: 560, r: 410, from: -100, to: 100 },
    { cx: 490, cy: 1480, r: 410, from: 280, to: 80 },
  ],
  cards: [
    { arc: 0, at: -62, rot: 0 },
    { arc: 0, at: -4, rot: 0 },
    { arc: 0, at: 56, rot: 0 },
    { arc: 1, at: 242, rot: 0 },
    { arc: 1, at: 184, rot: 0 },
    { arc: 1, at: 124, rot: 0 },
  ],
  card: 150,
  copy: [
    { x: 36, y: 560, w: 290, align: "left" },
    { x: 178, y: 1480, w: 290, align: "left" },
  ],
  tick: 18,
  step: 4,
};

const rad = (deg: number) => (deg * Math.PI) / 180;
const round = (n: number) => Math.round(n * 100) / 100;

function ticksFor(l: Layout) {
  const out: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (const a of l.arcs) {
    const dir = a.to > a.from ? 1 : -1;
    const n = Math.floor(Math.abs(a.to - a.from) / l.step);
    for (let i = 0; i <= n; i++) {
      const t = rad(a.from + dir * i * l.step);
      const c = Math.cos(t);
      const s = Math.sin(t);
      out.push({
        x1: round(a.cx + (a.r - l.tick / 2) * c),
        y1: round(a.cy + (a.r - l.tick / 2) * s),
        x2: round(a.cx + (a.r + l.tick / 2) * c),
        y2: round(a.cy + (a.r + l.tick / 2) * s),
      });
    }
  }
  return out;
}

function Card({ s, size, priority }: { s: Station; size: string; priority?: boolean }) {
  return (
    <figure className="bg-[#1b1c1f] p-[5%] pb-0 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.9)]" style={{ width: size }}>
      <div className="relative aspect-square overflow-hidden bg-[#121316]">
        <Image
          src={s.image}
          alt=""
          fill
          sizes="(max-width: 768px) 30vw, 16vw"
          priority={priority}
          className="object-cover grayscale-[0.35] contrast-[1.05]"
        />
      </div>
      <figcaption className="flex items-baseline justify-between py-[0.7em] text-[clamp(10px,1.05vw,17px)] tracking-[-0.03em] text-ink-soft">
        <span>{s.name}</span>
        {s.metric && <span className="text-[#9aa3b2]">{s.metric}</span>}
      </figcaption>
    </figure>
  );
}

/** One full layout (desktop or mobile) of the S-curve: two tick-mark arcs lit by scroll, six cards on them. */
function Track({ l, className }: { l: Layout; className: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const ticks = useMemo(() => ticksFor(l), [l]);
  const [lit, setLit] = useState(reduce ? ticks.length : 0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 70%"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (reduce) return;
    const n = Math.round(Math.min(1, Math.max(0, p)) * ticks.length);
    setLit((v) => (v === n ? v : n));
  });

  const pct = (v: number, of: number) => `${(v / of) * 100}%`;
  const [c1, c2] = l.copy;
  const place = (c: Copy) => ({
    left: pct(c.x, l.w),
    top: pct(c.y, l.h),
    width: pct(c.w, l.w),
    transform: c.align === "center" ? "translate(-50%, -50%)" : "translateY(-50%)",
  });

  return (
    <div ref={ref} className={`relative mx-auto w-full ${className}`} style={{ aspectRatio: `${l.w} / ${l.h}` }}>
      <svg viewBox={`0 0 ${l.w} ${l.h}`} className="absolute inset-0 size-full" aria-hidden>
        {ticks.map((t, i) => (
          <line
            key={i}
            {...t}
            stroke={i < lit ? "#b1c8ee" : "#3a3f47"}
            strokeWidth={l.w > 1000 ? 2.4 : 2}
            strokeLinecap="round"
            style={{ transition: "stroke 400ms ease" }}
          />
        ))}
      </svg>

      {/* Copy sits in the hollow of each arc */}
      <div className={`absolute ${c1.align === "center" ? "text-center" : ""}`} style={place(c1)}>
        <Reveal>
        <h2 id={l.w > 1000 ? "journey-heading" : undefined} className="display text-[clamp(44px,7vw,128px)]">
          Train in full circle.
        </h2>
        <p className={`lede mt-4 ${c1.align === "center" ? "mx-auto text-[15px]" : ""}`}>
          A Hyrox race is 8 km of running and 8 functional stations. Train all of it, then fuel and
          recover for the next one.
        </p>
        </Reveal>
      </div>
      <div className={`absolute ${c2.align === "center" ? "text-center" : ""}`} style={place(c2)}>
        <Reveal>
        <p className="display text-[clamp(34px,4.6vw,84px)]">Train. Fuel. Recover. Repeat.</p>
        <p className={`copy mt-4 max-w-[40ch] ${c2.align === "center" ? "mx-auto text-[14px]" : ""}`}>
          Running, sled push, wall balls, endurance, nutrition and recovery in one loop that keeps you
          performing and growing.
        </p>
        </Reveal>
      </div>

      <ul aria-label="Training, nutrition and recovery">
        {STATIONS.map((s, i) => {
          const c = l.cards[i];
          const a = l.arcs[c.arc];
          const x = a.cx + a.r * Math.cos(rad(c.at)) + (c.dx ?? 0);
          const y = a.cy + a.r * Math.sin(rad(c.at)) + (c.dy ?? 0);
          return (
            <li
              key={s.id}
              className="absolute"
              style={{ left: pct(x, l.w), top: pct(y, l.h), transform: `translate(-50%, -50%) rotate(${c.rot}deg)` }}
            >
              <Reveal y={40} scale={0.94} amount={0.4} delay={(i % 3) * 0.08}>
                <Card s={s} size={`calc(${(l.card / l.w) * 100} * var(--track-w) / 100)`} priority={i === 0} />
              </Reveal>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** "Train in full circle." — an S of two tick-mark arcs spanning two screens, lit as you scroll. */
export function TrainCircle() {
  return (
    <section
      id="info-centre"
      aria-labelledby="journey-heading"
      className="relative overflow-hidden py-10 md:py-16 [--track-w:100vw] md:[--track-w:min(100vw,1728px)]"
    >
      <Track l={MOBILE} className="md:hidden" />
      <Track l={DESKTOP} className="hidden max-w-[1728px] md:block" />
    </section>
  );
}
