"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { usePauseOffscreen } from "@/components/motion/usePauseOffscreen";
import { featureStory } from "@/lib/content";

type Story = (typeof featureStory)[number];

type Layout = {
  w: number;
  h: number;
  r: number;
  hug: number;
  xs: [number, number];
  cy: (i: number) => number;
  /** Text block for row i: anchor (x, y) and width; y is the top of the block. */
  text: (i: number) => { x: number; y: number; w: number; center?: boolean };
  /** "rail": connections run down the side margin (phones) so they never cross the copy. */
  connect: "mid" | "rail";
  figure: number;
  /** How far the line keeps going past the bottom, into the next section's heading. */
  tail: number;
  mobile?: boolean;
};

const ROW_D = 900;
const DESKTOP: Layout = {
  w: 1600,
  h: 80 + 4 * ROW_D + 60,
  r: 220,
  hug: 248,
  xs: [470, 1130],
  cy: (i) => 80 + ROW_D / 2 + i * ROW_D,
  text: (i) => ({ x: i % 2 ? 40 : 790, y: 80 + ROW_D / 2 + i * ROW_D - 240, w: 770 }),
  connect: "mid",
  figure: 0.85,
  tail: 300,
};

const ROW_M = 940;
const MOBILE: Layout = {
  w: 500,
  h: 40 + 4 * ROW_M,
  r: 118,
  hug: 134,
  xs: [190, 310],
  cy: (i) => 40 + 190 + i * ROW_M,
  text: (i) => ({ x: 52, y: 40 + 190 + i * ROW_M + 134 + 56, w: 400 }),
  connect: "rail",
  figure: 0.55,
  tail: 260,
  mobile: true,
};

const cx = (l: Layout, i: number) => l.xs[i % 2];

/** HighRocks logomark (Figma node 1445:1831), drawn around its own centre. */
const MARK_PATHS = [
  "M177.91 30.3091H233.529V85.6511C232.116 85.6511 230.708 85.6487 229.302 85.6511C214.071 85.6827 199.355 88.471 185.18 93.9892C173.642 98.4821 163.253 104.823 154.319 113.441C153.911 113.833 153.441 114.162 153.001 114.523L153.16 114.912H154.512C171.095 114.912 187.676 114.91 204.259 114.922C205.024 114.922 205.809 114.993 206.549 115.173C206.977 115.275 207.334 115.665 207.723 115.923C207.434 116.33 207.229 116.877 206.838 117.119C205.909 117.688 204.904 118.144 203.904 118.592C196.446 121.923 188.837 124.95 181.547 128.613C158.161 140.36 137.347 155.577 119.784 175.037C104.965 191.453 93.6672 209.987 86.1505 230.778C85.9183 231.419 85.7961 232.096 85.5932 232.858H30.2559V177.562H31.6199C37.3643 177.562 43.1136 177.431 48.8532 177.592C58.3059 177.857 67.5214 176.391 76.6294 174.099C90.091 170.71 102.682 165.391 113.895 157.095C118.029 154.036 121.813 150.59 125.257 146.777C125.658 146.331 126.044 145.873 126.401 145.462C124.272 145.462 122.184 145.384 120.104 145.474C108.099 145.993 96.0945 146.55 84.0899 147.098C75.9914 147.468 67.8954 147.855 59.797 148.213C58.7068 148.262 57.5848 148.313 56.5214 148.118C55.1696 147.872 54.8568 146.755 55.8688 145.815C56.5361 145.194 57.3672 144.629 58.2252 144.356C61.9383 143.17 65.6856 142.079 69.4281 140.988C91.4525 134.574 112.037 125.206 130.427 111.376C143.233 101.745 154.116 90.3339 162.505 76.6458C170.523 63.5664 175.544 49.4009 177.883 34.2809C178.079 33.0219 177.91 31.7093 177.91 30.3066V30.3091Z",
  "M85.6983 30.352V85.565H30.2461V30.352H85.6983Z",
  "M178.084 232.847V177.63H233.536V232.847H178.084Z"
];

function Marker({ size }: { size: number }) {
  const k = (size * 0.6) / 203; // the mark spans ~203 units of its 264 × 263 box
  return (
    <>
      <circle r={size / 2} fill="#101113" stroke="#b1c8ee" strokeWidth={size / 30} />
      <g transform={`scale(${k}) translate(-131.9 -131.6)`}>
        {MARK_PATHS.map((d) => (
          <path key={d.slice(0, 12)} d={d} fill="#e5e1e4" />
        ))}
      </g>
    </>
  );
}

/** One continuous line: down onto each circle, around its outer half, then across to the next. */
function buildPath(l: Layout) {
  const k = l.mobile ? 34 : 70;
  const R = l.hug;
  let d = `M ${cx(l, 0)} 0 L ${cx(l, 0)} ${l.cy(0) - R}`;
  for (let i = 0; i < 4; i++) {
    const x = cx(l, i);
    const y = l.cy(i);
    d += ` A ${R} ${R} 0 0 ${i % 2 ? 1 : 0} ${x} ${y + R}`;
    if (i === 3) {
      if (l.connect === "rail") {
        // Leave along the side margin so the line never runs through the last block of copy.
        const rail = x > l.w / 2 ? l.w - 22 : 22;
        const sg = Math.sign(rail - x);
        const y1 = y + R + 26;
        d += ` L ${x} ${y1 - k} Q ${x} ${y1} ${x + sg * k} ${y1} L ${rail - sg * k} ${y1} Q ${rail} ${y1} ${rail} ${y1 + k} L ${rail} ${l.h + l.tail}`;
      } else d += ` L ${x} ${l.h + l.tail}`;
      break;
    }
    const nx = cx(l, i + 1);
    const ny = l.cy(i + 1) - R;
    if (l.connect === "mid") {
      const my = (y + R + ny) / 2;
      const s = Math.sign(nx - x);
      d += ` L ${x} ${my - k} Q ${x} ${my} ${x + s * k} ${my} L ${nx - s * k} ${my} Q ${nx} ${my} ${nx} ${my + k} L ${nx} ${ny}`;
    } else {
      const rail = nx > x ? l.w - 22 : 22;
      const s = Math.sign(rail - x);
      const y1 = y + R + 26;
      const y2 = ny - 26;
      d += ` L ${x} ${y1 - k} Q ${x} ${y1} ${x + s * k} ${y1} L ${rail - s * k} ${y1} Q ${rail} ${y1} ${rail} ${y1 + k}`;
      d += ` L ${rail} ${y2 - k} Q ${rail} ${y2} ${rail - s * k} ${y2} L ${nx + s * k} ${y2} Q ${nx} ${y2} ${nx} ${y2 + k} L ${nx} ${ny}`;
    }
  }
  return d;
}

/* -------------------------------------------------------------------------- */
/* Figures — tiny flat silhouettes, feet at 0,0; each acts out its stage      */
/* -------------------------------------------------------------------------- */

const INK = "#e5e1e4";
const limb = { stroke: INK, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };

/** (1) Plan — standing at the start, checking the goal time on a stopwatch. */
function Timing() {
  return (
    <g>
      <circle cx={0} cy={-90} r={8} fill={INK} />
      <path d="M0 -78 L0 -44" {...limb} strokeWidth={13} />
      <path d="M-3 -44 L-5 0 M3 -44 L5 0" {...limb} strokeWidth={6} />
      <path d="M-5 -74 L-8 -48 M5 -74 L17 -64 L19 -82" {...limb} strokeWidth={4.5} />
      <circle cx={22} cy={-92} r={8} fill="none" stroke={INK} strokeWidth={2.5} />
      <path d="M22 -101 L22 -105" {...limb} strokeWidth={2.5} />
      <path d="M22 -92 L22 -97" {...limb} strokeWidth={1.8}>
        <animateTransform attributeName="transform" type="rotate" from="0 22 -92" to="360 22 -92" dur="3s" repeatCount="indefinite" />
      </path>
    </g>
  );
}

/** (2) Build — a wall ball thrown straight up at the target. */
function WallBall() {
  return (
    <g>
      <circle cx={0} cy={-90} r={8} fill={INK} />
      <path d="M0 -78 L0 -44" {...limb} strokeWidth={13} />
      <path d="M-3 -44 L-7 -20 L-6 0 M3 -44 L7 -20 L6 0" {...limb} strokeWidth={6} />
      <path d="M-5 -74 L-8 -110 M5 -74 L8 -110" {...limb} strokeWidth={4.5} />
      <circle cx={0} cy={-124} r={10} fill={INK} className="story-ball" />
    </g>
  );
}

/** (3) Rehearse — a real running cycle: leaning in, knees and arms swapping, body bobbing. */
const LEGS_A = "M-2 -46 L15 -35 L10 -13 M-2 -46 L-10 -24 L-23 -3";
const LEGS_B = "M-2 -46 L-10 -24 L-23 -3 M-2 -46 L15 -35 L10 -13";
const ARMS_A = "M7 -74 L-5 -63 L-12 -72 M7 -74 L17 -61 L27 -67";
const ARMS_B = "M7 -74 L17 -61 L27 -67 M7 -74 L-5 -63 L-12 -72";
const STRIDE = "0.72s";

function Running() {
  return (
    <g>
      <animateTransform attributeName="transform" type="translate" values="0 0; 0 -5; 0 0; 0 -5; 0 0" dur={STRIDE} repeatCount="indefinite" />
      <circle cx={13} cy={-87} r={8} fill={INK} />
      <path d="M7 -74 L-2 -46" {...limb} strokeWidth={13} />
      <path d={LEGS_A} {...limb} strokeWidth={6}>
        <animate attributeName="d" values={`${LEGS_A};${LEGS_B};${LEGS_A}`} dur={STRIDE} repeatCount="indefinite" />
      </path>
      <path d={ARMS_A} {...limb} strokeWidth={4.5}>
        <animate attributeName="d" values={`${ARMS_A};${ARMS_B};${ARMS_A}`} dur={STRIDE} repeatCount="indefinite" />
      </path>
    </g>
  );
}

/** (4) Finish — arms up at the top, the last wall ball done and at their feet. */
function Finish() {
  return (
    <g>
      <circle cx={0} cy={-90} r={8} fill={INK} />
      <path d="M0 -78 L0 -44" {...limb} strokeWidth={13} />
      <path d="M-3 -44 L-9 0 M3 -44 L9 0" {...limb} strokeWidth={6} />
      <path d="M-5 -74 L-22 -106 M5 -74 L22 -106" {...limb} strokeWidth={4.5} />
      <circle cx={30} cy={-9} r={9} fill={INK} />
    </g>
  );
}

/* -------------------------------------------------------------------------- */

function Stage({ l, i, s, p }: { l: Layout; i: number; s: Story; p: MotionValue<number> }) {
  const x = cx(l, i);
  const y = l.cy(i);
  const r = l.r;
  // Each circle fills while its row passes through the middle of the screen.
  const start = i / 4;
  const level = useTransform(p, [start - 0.04, start + 0.16], [0, s.level], { clamp: true });
  const offset = useTransform(level, (v) => 2 * r * (1 - v));
  const surface = useTransform(level, (v) => y + r - 2 * r * v);
  const show = useTransform(p, [start - 0.06, start + 0.06], [0, 1], { clamp: true });
  const id = `story-clip-${l.mobile ? "m" : "d"}-${i}`;
  const f = l.figure;

  return (
    <g>
      <clipPath id={id}>
        <circle cx={x} cy={y} r={r} />
      </clipPath>
      <g clipPath={`url(#${id})`}>
        <motion.rect x={x - r} y={y - r} width={2 * r} height={2 * r} fill="#b1c8ee" style={{ y: offset }} />
      </g>
      <circle cx={x} cy={y} r={r} fill="none" stroke="#b1c8ee" strokeWidth={l.mobile ? 1.6 : 2} />

      <motion.g style={{ opacity: show }}>
        {(i === 0 || i === 1) && (
          // Standing on the water line, rising as the circle fills.
          <motion.g style={{ x: x - r * (i === 0 ? 0.25 : -0.1), y: surface }}>
            <g transform={`scale(${f})`}>{i === 0 ? <Timing /> : <WallBall />}</g>
          </motion.g>
        )}
        {i === 2 && (
          <g transform={`translate(${x - r * 0.12} ${y - Math.sqrt(r * r - (r * 0.12) ** 2)}) rotate(-4) scale(${f})`}>
            <Running />
          </g>
        )}
        {i === 3 && (
          <g transform={`translate(${x} ${y - r}) scale(${f})`}>
            <Finish />
          </g>
        )}
      </motion.g>
    </g>
  );
}

function Copy({ l, i, s, p }: { l: Layout; i: number; s: Story; p: MotionValue<number> }) {
  const t = l.text(i);
  const start = i / 4;
  const opacity = useTransform(p, [start - 0.05, start + 0.08], [0, 1], { clamp: true });
  const y = useTransform(p, [start - 0.05, start + 0.08], [24, 0], { clamp: true });
  const pct = (v: number, of: number) => `${(v / of) * 100}%`;
  return (
    <motion.div
      className="absolute"
      style={{ left: pct(t.x, l.w), top: pct(t.y, l.h), width: pct(t.w, l.w), opacity, y }}
    >
      <p className="copy">({i + 1}) {s.stage}</p>
      <h3 className="display mt-2 text-[clamp(48px,6vw,112px)]">{s.feature}</h3>
      <p className="mt-5 text-[clamp(19px,1.6vw,28px)] font-semibold leading-[1.2] tracking-[-0.02em] text-ink">{s.title}</p>
      <p className="copy mt-3">{s.body}</p>
      <ul className="copy mt-5 text-ink/90">
        {s.facts.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
    </motion.div>
  );
}

function Track({ l, className }: { l: Layout; className: string }) {
  const ref = useRef<HTMLDivElement>(null);
  usePauseOffscreen(ref);
  const line = useRef<SVGPathElement>(null);
  const dot = useRef<SVGGElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 55%", "end 85%"] });
  const p = useTransform(scrollYProgress, (v) => (reduce ? 1 : v));
  const d = buildPath(l);
  const drawn = useTransform(p, [0, 1], [0, 1]);

  // The HighRocks mark — you — travels the line with the scroll.
  useMotionValueEvent(p, "change", (v) => {
    const path = line.current;
    const c = dot.current;
    if (!path || !c) return;
    const pt = path.getPointAtLength(path.getTotalLength() * Math.min(1, Math.max(0, v)));
    c.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
  });

  return (
    <div ref={ref} className={`relative mx-auto w-full ${className}`} style={{ aspectRatio: `${l.w} / ${l.h}` }}>
      <svg viewBox={`0 0 ${l.w} ${l.h}`} className="absolute inset-0 size-full overflow-visible" aria-hidden>
        <path ref={line} d={d} fill="none" stroke="#2c323b" strokeWidth={l.mobile ? 2 : 2.5} />
        <motion.path d={d} fill="none" stroke="#6f8bb3" strokeWidth={l.mobile ? 2 : 2.5} style={{ pathLength: drawn }} />
        {featureStory.map((s, i) => (
          <Stage key={s.id} l={l} i={i} s={s} p={p} />
        ))}
        <g ref={dot} transform={`translate(${cx(l, 0)} 0)`}>
          <Marker size={l.mobile ? 30 : 46} />
        </g>
      </svg>
      {featureStory.map((s, i) => (
        <Copy key={s.id} l={l} i={i} s={s} p={p} />
      ))}
    </div>
  );
}

/** The feature story: one line, four circles that fill as you climb, one figure at each stage. */
export function StoryPath() {
  return (
    <>
      <Track l={MOBILE} className="md:hidden" />
      <Track l={DESKTOP} className="hidden max-w-[1600px] md:block" />
    </>
  );
}
