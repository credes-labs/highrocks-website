"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { RectScreen, RoundScreen, WhoopHud, type Live } from "./Screens";

export const STAGE_W = 760;
export const STAGE_H = 300;

/* -------------------------------------------------------------------------- */
/* Live data                                                                   */
/* -------------------------------------------------------------------------- */

/** One-second ticker + auto-cycling screen page (click to advance). */
export function useLive(running: boolean): [Live, () => void] {
  const [t, setT] = useState(0);
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setT((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, [running]);
  const page = (Math.floor(t / 4) + offset) % 3;
  const bpm = Math.round(152 + 8 * Math.sin(t * 0.9) + 3 * Math.sin(t * 2.3));
  return [{ t, page, bpm }, () => setOffset((o) => o + 1)];
}

/* -------------------------------------------------------------------------- */
/* 2.5D rig: pointer tilt, idle sway, scroll-linked pitch                      */
/* -------------------------------------------------------------------------- */

const GlareCtx = createContext<{ x: MotionValue<number>; y: MotionValue<number> } | null>(null);

/** Glossy highlight that follows the pointer; place it over any glass surface. */
function Glass({ style }: { style?: CSSProperties }) {
  const g = useContext(GlareCtx)!;
  const bg = useMotionTemplate`radial-gradient(circle at ${g.x}% ${g.y}%, rgba(255,255,255,0.28), rgba(255,255,255,0.04) 42%, transparent 62%)`;
  return <motion.div className="pointer-events-none absolute inset-0" style={{ background: bg, ...style }} />;
}

export function Rig({ children, onActivate, label }: { children: ReactNode; onActivate: () => void; label: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 55, damping: 24, mass: 0.9 });
  const sy = useSpring(my, { stiffness: 55, damping: 24, mass: 0.9 });
  const rotY = useTransform(sx, [-0.5, 0.5], [-3.5, 3.5]);
  const rotX = useTransform(sy, [-0.5, 0.5], [35, 31]);
  const gx = useTransform(sx, [-0.5, 0.5], [15, 85]);
  const gy = useTransform(sy, [-0.5, 0.5], [10, 90]);


  return (
    <GlareCtx.Provider value={{ x: gx, y: gy }}>
      <div
        ref={ref}
        role="button"
        tabIndex={0}
        aria-label={label}
        onClick={onActivate}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onActivate())}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width - 0.5);
          my.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onPointerLeave={() => { mx.set(0); my.set(0); }}
        className="relative cursor-pointer select-none outline-none focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-accent"
        style={{ width: STAGE_W, height: STAGE_H, perspective: 1300, touchAction: "pan-y" }}
      >
        <motion.div
          className="absolute inset-0"
          style={{ transformStyle: "preserve-3d", rotateX: reduce ? 32 : rotX, rotateY: reduce ? 0 : rotY }}
        >
          <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
            {/* soft contact shadow on the "table" */}
            <div className="absolute rounded-[40px] bg-black blur-[9px]" style={{ left: -900, top: 96, width: 2560, height: 124, opacity: 0.8, transform: "translateZ(-1px)" }} />
            {children}
          </div>
        </motion.div>
      </div>
    </GlareCtx.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/* Drawing helpers                                                             */
/* -------------------------------------------------------------------------- */

type BoxStyle = { left: number; top: number; width: number; height: number; borderRadius?: number | string };

/** A flat shape given real thickness by stacking darker copies along Z. */
function Slab({
  box,
  z = 0,
  depth = 8,
  layers = 6,
  edge = "#1c1d20",
  face,
  children,
}: {
  box: BoxStyle;
  z?: number;
  depth?: number;
  layers?: number;
  edge?: string;
  face: CSSProperties;
  children?: ReactNode;
}) {
  return (
    <>
      {Array.from({ length: layers }, (_, i) => (
        <div key={i} className="absolute" style={{ ...box, background: edge, transform: `translateZ(${z + (i / layers) * depth}px)` }} />
      ))}
      <div className="absolute" style={{ ...box, ...face, transform: `translateZ(${z + depth}px)` }}>
        {children}
      </div>
    </>
  );
}

const strapFace = (extra: CSSProperties = {}): CSSProperties => ({
  background: "linear-gradient(180deg,#232427 0%,#141517 55%,#0c0d0e 100%)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -2px 6px rgba(0,0,0,0.6)",
  ...extra,
});

const Hole = ({ x, y, s = 9 }: { x: number; y: number; s?: number }) => (
  <span className="absolute rounded-full bg-black" style={{ left: x, top: y, width: s, height: s, boxShadow: "inset 0 1px 2px rgba(0,0,0,1), 0 1px 0 rgba(255,255,255,0.08)" }} />
);

const Z = (n: number): CSSProperties => ({ transform: `translateZ(${n}px)` });

/* -------------------------------------------------------------------------- */
/* Watches                                                                     */
/* -------------------------------------------------------------------------- */

export function AppleWatch({ live }: { live: Live }) {
  const cx = 380;
  return (
    <>
      <Slab box={{ left: -1100, top: 92, width: 1444, height: 116, borderRadius: 14 }} depth={6} face={strapFace()}>
        <span className="absolute right-12 top-1/2 size-[46px] -translate-y-1/2 rounded-full" style={{ background: "conic-gradient(from 20deg,#7d8087,#2b2d31,#a9adb4,#2b2d31,#7d8087)", boxShadow: "0 2px 6px rgba(0,0,0,0.7)" }} />
      </Slab>
      <Slab box={{ left: 416, top: 92, width: 1444, height: 116, borderRadius: 14 }} depth={6} face={strapFace()}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Hole key={i} x={150 + i * 28} y={53} s={9} />
        ))}
      </Slab>
      {/* crown + side button */}
      <div className="absolute rounded-[3px]" style={{ left: cx + 84, top: 96, width: 14, height: 34, background: "repeating-linear-gradient(180deg,#53565c 0 2px,#17181a 2px 4px)", ...Z(20) }} />
      <div className="absolute rounded-[3px] border-2 border-[#ff3b30]/80" style={{ left: cx + 90, top: 104, width: 8, height: 18, ...Z(22) }} />
      <Slab
        box={{ left: cx - 86, top: 50, width: 172, height: 200, borderRadius: 50 }}
        z={2}
        depth={34}
        layers={22}
        edge="#2b2d31"
        face={{ background: "linear-gradient(145deg,#3a3c41,#111214 60%,#26282c)", boxShadow: "inset 0 0 0 2px #4a4d53, inset 0 0 0 4px #0b0b0c" }}
      >
        <div className="absolute overflow-hidden" style={{ left: 11, top: 11, width: 150, height: 178, borderRadius: 40 }}>
          <RectScreen variant="apple" live={live} />
          <Glass />
        </div>
      </Slab>
    </>
  );
}

export function GarminWatch({ live }: { live: Live }) {
  const strapBands: CSSProperties = {
    backgroundImage: "repeating-linear-gradient(90deg,transparent 0 16px,rgba(0,0,0,0.55) 16px 19px,rgba(255,255,255,0.05) 19px 20px)",
  };
  return (
    <>
      <Slab box={{ left: -1100, top: 98, width: 1432, height: 104, borderRadius: 8 }} depth={7} face={strapFace(strapBands)} />
      <Slab box={{ left: 428, top: 98, width: 1432, height: 104, borderRadius: 8 }} depth={7} face={strapFace(strapBands)}>
        {[0, 1, 2, 3, 4].map((i) => (
          <Hole key={i} x={150 + i * 26} y={47} s={10} />
        ))}
      </Slab>
      {/* keeper loop */}
      <Slab box={{ left: 612, top: 90, width: 30, height: 120, borderRadius: 6 }} z={6} depth={12} layers={6} face={strapFace({ background: "linear-gradient(90deg,#2a2b2f,#121315)" })} />
      {/* buttons */}
      {[-58, 0, 58].map((y) => (
        <div key={`l${y}`} className="absolute rounded-[3px]" style={{ left: 252, top: 150 + y - 11, width: 18, height: 22, background: "linear-gradient(90deg,#2e3035,#6d7077)", ...Z(22) }} />
      ))}
      {[-58, 0, 58].map((y) => (
        <div key={`r${y}`} className="absolute rounded-[3px]" style={{ left: 490, top: 150 + y - 11, width: 18, height: 22, background: "linear-gradient(270deg,#2e3035,#6d7077)", ...Z(22) }} />
      ))}
      <Slab
        box={{ left: 271, top: 41, width: 218, height: 218, borderRadius: "50%" }}
        z={2}
        depth={32}
        layers={20}
        edge="#202226"
        face={{
          background: "radial-gradient(circle at 30% 25%,#5a5d63,#1c1d20 65%)",
          boxShadow: "inset 0 0 0 3px #8c9097, inset 0 0 0 7px #17181a",
        }}
      >
        <div className="absolute rounded-full" style={{ inset: 9, background: "repeating-conic-gradient(from -1deg,#b4b7bd 0 2deg,transparent 2deg 15deg)", WebkitMask: "radial-gradient(circle,transparent 71%,#000 72%,#000 88%,transparent 89%)", mask: "radial-gradient(circle,transparent 71%,#000 72%,#000 88%,transparent 89%)", opacity: 0.55 }} />
        <div className="absolute overflow-hidden rounded-full" style={{ left: 24, top: 24, width: 170, height: 170 }}>
          <RoundScreen live={live} />
          <Glass />
        </div>
      </Slab>
    </>
  );
}

export function FitbitWatch({ live }: { live: Live }) {
  return (
    <>
      <Slab box={{ left: -1100, top: 100, width: 1448, height: 100, borderRadius: 30 }} depth={6} face={strapFace()} />
      <Slab box={{ left: 430, top: 94, width: 1430, height: 112, borderRadius: 30 }} depth={6} face={strapFace()}>
        {[0, 1, 2, 3].map((i) => (
          <Hole key={i} x={158 + i * 30} y={51} s={10} />
        ))}
        <span className="absolute right-5 top-1/2 h-14 w-3 -translate-y-1/2 rounded-full bg-black/60" />
      </Slab>
      <div className="absolute rounded-[3px]" style={{ left: 466, top: 124, width: 10, height: 52, background: "linear-gradient(90deg,#8e9198,#3a3c41)", ...Z(22) }} />
      <Slab
        box={{ left: 290, top: 50, width: 180, height: 200, borderRadius: 62 }}
        z={2}
        depth={30}
        layers={19}
        edge="#3a3d42"
        face={{ background: "linear-gradient(145deg,#9a9da4,#2c2e33 40%,#6c6f76)", boxShadow: "inset 0 0 0 3px #15161a" }}
      >
        <div className="absolute overflow-hidden" style={{ left: 10, top: 10, width: 160, height: 180, borderRadius: 52 }}>
          <RectScreen variant="fitbit" live={live} />
          <Glass />
        </div>
      </Slab>
    </>
  );
}

export function WhoopBand({ live }: { live: Live }) {
  const weave: CSSProperties = {
    background:
      "radial-gradient(rgba(255,255,255,0.07) 1px,transparent 1.6px) 0 0/4px 4px, linear-gradient(180deg,#2c2d31,#18191b 60%,#101113)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -3px 8px rgba(0,0,0,0.6)",
  };
  return (
    <>
      <Slab box={{ left: -1100, top: 86, width: 2960, height: 128, borderRadius: 4 }} depth={8} layers={5} face={weave} />
      {/* metal slider */}
      <Slab box={{ left: 250, top: 82, width: 44, height: 136, borderRadius: 4 }} z={10} depth={6} layers={4} edge="#0a0a0b" face={{ background: "linear-gradient(90deg,#17181a,#2d2f33 50%,#111214)", boxShadow: "inset 0 0 0 1px #3a3c41" }}>
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap font-grotesk text-[11px] tracking-[0.3em] text-[#9da0a6]">WHOOP</span>
      </Slab>
      {/* sensor pod */}
      <Slab
        box={{ left: 340, top: 62, width: 84, height: 176, borderRadius: 42 }}
        z={8}
        depth={28}
        layers={18}
        edge="#08090a"
        face={{ background: "linear-gradient(100deg,#2b2d31,#08090a 45%,#1f2024)", boxShadow: "inset 0 0 0 2px #3b3d42" }}
      >
        <span className="absolute left-1/2 top-[22px] h-[132px] w-[34px] -translate-x-1/2 rounded-full bg-[#050506]" />
        <span className="whoop-led absolute left-1/2 top-1/2 h-24 w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: "linear-gradient(180deg,#b1c8ee,#7be0a5)" }} />
        <Glass style={{ borderRadius: 42 }} />
      </Slab>
      {/* floating HUD */}
      <div className="absolute rounded-lg border border-white/15 bg-black/55 px-5 py-3 backdrop-blur-sm" style={{ left: 470, top: 108, width: 190, height: 86, ...Z(52) }}>
        <WhoopHud live={live} />
      </div>
      <span className="absolute h-px bg-gradient-to-r from-white/40 to-transparent" style={{ left: 426, top: 150, width: 44, ...Z(58) }} />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Fit-to-width wrapper                                                        */
/* -------------------------------------------------------------------------- */

/** Scales the fixed 760 × 300 stage down to whatever width the layout gives it. */
export function FitStage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [k, setK] = useState<number | null>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setK(Math.min(1.55, el.clientWidth / (el.clientWidth < 640 ? 400 : 1000)));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const s = k ?? 1;
  return (
    <div ref={ref} className="relative w-full overflow-x-clip" style={{ height: STAGE_H * s + 40 * s }}>
      <div
        className="absolute left-1/2 top-[20px] origin-top transition-opacity duration-300"
        style={{ width: STAGE_W, height: STAGE_H, transform: `translateX(-50%) scale(${s})`, opacity: k === null ? 0 : 1 }}
      >
        {children}
      </div>
    </div>
  );
}
