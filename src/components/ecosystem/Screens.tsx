"use client";

/** Live data shared by a watch's screen and the readouts beside it. */
export type Live = { t: number; page: number; bpm: number };

export const mmss = (s: number) => `${String(Math.floor(s / 60) % 100).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

/** Little ECG strip that scrolls endlessly (3 beats wide, translated by one beat). */
export function Ecg({ color, width = 110, height = 34 }: { color: string; width?: number; height?: number }) {
  const path = [0, 100, 200, 300]
    .map((o) => `M${o} 20 L${o + 26} 20 L${o + 38} 5 L${o + 45} 35 L${o + 51} 13 L${o + 57} 20 L${o + 100} 20`)
    .join(" ");
  return (
    <div className="relative overflow-hidden" style={{ width, height }}>
      <svg width={width * 4} height={height} viewBox="0 0 400 40" preserveAspectRatio="none" className="ecg-run absolute left-0 top-0" style={{ width: width * 4 }}>
        <path d={path} fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="absolute inset-y-0 left-0 w-5 bg-gradient-to-r from-black to-transparent" />
      <span className="absolute inset-y-0 right-0 w-5 bg-gradient-to-l from-black to-transparent" />
    </div>
  );
}

function Heart({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className="beat" aria-hidden>
      <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 5 6.3 5c2 0 3.5 1 5.7 3.4C14.2 6 15.7 5 17.7 5 21 5 23.1 8.4 21.6 11.8 19.5 16.4 12 21 12 21z" fill={color} />
    </svg>
  );
}

type Rect = { variant: "apple" | "fitbit" };

const RECT = {
  apple: { a: "#4aa8ff", b: "#ff453a", pace: ["MI", "CAL"], tag: "HIGHROCKS", bar: "linear-gradient(90deg,#4aa8ff,#f5a623 60%,#222)" },
  fitbit: { a: "#ffb598", b: "#ff7a6a", pace: ["PACE", "BPM"], tag: "HIGHROCKS", bar: "linear-gradient(90deg,#2fbfb0,#ffb598 70%,#222)" },
} as const;

const fade = (on: boolean) => ({
  opacity: on ? 1 : 0,
  transform: on ? "translateY(0) scale(1)" : "translateY(8px) scale(0.98)",
  transition: "opacity 300ms ease, transform 500ms cubic-bezier(0.22,1,0.36,1)",
});

/** Rectangular watch face (Apple Watch / Fitbit), designed for roughly 150 × 176 px. */
export function RectScreen({ variant, live }: Rect & { live: Live }) {
  const c = RECT[variant];
  const secs = 285 + live.t;
  const miles = (4.52 + live.t * 0.004).toFixed(2);
  const cal = 521 + live.t * 2;
  const { page, bpm } = live;
  const goalPct = 30 + ((live.t * 3) % 60);
  return (
    <div className="relative size-full overflow-hidden bg-black font-grotesk text-white">
      <p className="absolute left-4 top-3.5 text-[8.5px] font-medium tracking-[0.18em] text-white/80">{c.tag}</p>

      {/* 0 — pace */}
      <div className="absolute inset-0 px-4 pt-9" style={fade(page === 0)}>
        <p className="border-y border-white/15 py-2 text-[40px] font-light leading-none tracking-tight tabular-nums">{mmss(secs)}</p>
        <p className="mt-2.5 flex items-center gap-2 text-[16px] tabular-nums">
          <span className="size-3 rounded-full border-[3px]" style={{ borderColor: c.a, background: "#0b2b52" }} />
          {variant === "apple" ? miles : "6'31\""} <span className="text-[11px] text-white/70">{c.pace[0]}</span>
        </p>
        <p className="mt-1.5 flex items-center gap-2 text-[16px] tabular-nums" style={{ color: variant === "fitbit" ? c.a : "#fff" }}>
          <Heart color={c.b} size={13} />
          {variant === "apple" ? cal : bpm} <span className="text-[11px] opacity-70">{variant === "apple" ? "CAL" : "BPM"}</span>
        </p>
        <span className="absolute inset-x-4 bottom-4 h-[5px] rounded-full bg-white/10">
          <span className="block h-full rounded-full transition-[width] duration-1000" style={{ width: `${goalPct}%`, background: c.bar }} />
        </span>
      </div>

      {/* 1 — heart */}
      <div className="absolute inset-0 flex flex-col items-center px-3 pt-9" style={fade(page === 1)}>
        <Heart color={c.b} size={22} />
        <p className="mt-1 text-[44px] font-light leading-none tabular-nums">{bpm}</p>
        <p className="mt-1 text-[9px] tracking-[0.25em] text-white/60">BPM · ZONE 4</p>
        <div className="mt-3">
          <Ecg color={c.b} width={116} />
        </div>
      </div>

      {/* 2 — station */}
      <div className="absolute inset-0 px-4 pt-9" style={fade(page === 2)}>
        <p className="text-[9px] tracking-[0.22em]" style={{ color: c.a }}>STN_03 · 03/16</p>
        <p className="mt-1 text-[22px] font-semibold uppercase leading-[1.05] tracking-tight">Sled<br />Push</p>
        <p className="mt-3 text-[26px] font-light tabular-nums">{mmss(165 + live.t)}</p>
        <p className="text-[9px] tracking-[0.2em] text-white/55">GOAL 02:45</p>
        <span className="absolute inset-x-4 bottom-5 h-[5px] rounded-full bg-white/10">
          <span className="block h-full rounded-full transition-[width] duration-1000" style={{ width: `${goalPct}%`, background: c.a }} />
        </span>
      </div>

      <Dots page={page} color={c.a} className="absolute right-2 top-1/2 -translate-y-1/2 flex-col" />
    </div>
  );
}

function Dots({ page, color, className = "" }: { page: number; color: string; className?: string }) {
  return (
    <span className={`flex gap-1 ${className}`} aria-hidden>
      {[0, 1, 2].map((i) => (
        <span key={i} className="size-[4px] rounded-full transition-all duration-500" style={{ background: i === page ? color : "rgba(255,255,255,0.22)", transform: i === page ? "scale(1.3)" : "none" }} />
      ))}
    </span>
  );
}

/** Round Garmin face, designed for a 170 px circle. */
export function RoundScreen({ live }: { live: Live }) {
  const { page, bpm, t } = live;
  const R = 78;
  const C = 2 * Math.PI * R;
  const p = 0.62 + 0.18 * Math.sin(t * 0.45);
  return (
    <div className="relative size-full overflow-hidden rounded-full bg-black font-grotesk text-white">
      <svg viewBox="0 0 170 170" className="absolute inset-0 size-full -rotate-90" aria-hidden>
        <circle cx={85} cy={85} r={R} fill="none" stroke="#12303a" strokeWidth={4} />
        <circle
          cx={85}
          cy={85}
          r={R}
          fill="none"
          stroke="#3fc4e6"
          strokeWidth={4}
          strokeLinecap="butt"
          strokeDasharray={`${C * p} ${C}`}
          style={{ transition: "stroke-dasharray 900ms ease" }}
        />
        {Array.from({ length: 60 }, (_, i) => {
          const a = (i * 6 * Math.PI) / 180;
          const r2 = (n: number) => Math.round(n * 100) / 100;
          return (
            <line key={i} x1={r2(85 + 84 * Math.cos(a))} y1={r2(85 + 84 * Math.sin(a))} x2={r2(85 + 80.5 * Math.cos(a))} y2={r2(85 + 80.5 * Math.sin(a))} stroke="#555" strokeWidth={i % 5 ? 0.6 : 1.4} />
          );
        })}
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center" style={fade(page === 0)}>
        <p className="text-[32px] font-normal leading-none tabular-nums">{mmss(285 + t)}</p>
        <p className="mt-1.5 w-28 border-t border-white/25 pt-1.5 text-[20px] leading-none tabular-nums">
          {(6.31 + t * 0.005).toFixed(2)} <span className="text-[12px]">mi</span>
        </p>
        <p className="mt-1.5 flex items-center gap-1.5 text-[15px] tabular-nums">
          <Heart color="#ff3b30" size={12} />
          7:09<span className="text-[10px]">/mi</span>
        </p>
        <p className="mt-1 text-[15px] tabular-nums">{bpm + 12}</p>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center" style={fade(page === 1)}>
        <Heart color="#ff3b30" size={20} />
        <p className="mt-1 text-[40px] font-light leading-none tabular-nums">{bpm}</p>
        <p className="mt-1 text-[9px] tracking-[0.25em] text-white/60">BPM · ZONE 4</p>
        <div className="mt-2">
          <Ecg color="#3fc4e6" width={96} height={30} />
        </div>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center" style={fade(page === 2)}>
        <p className="text-[9px] tracking-[0.22em] text-[#3fc4e6]">STN_01 · 01/16</p>
        <p className="mt-1 text-[22px] font-semibold uppercase leading-none">Wall Balls</p>
        <p className="mt-2 text-[28px] font-light tabular-nums">{mmss(195 + t)}</p>
        <p className="text-[9px] tracking-[0.2em] text-white/55">GOAL 03:15</p>
      </div>

      <Dots page={page} color="#3fc4e6" className="absolute bottom-4 left-1/2 -translate-x-1/2" />
    </div>
  );
}

/** Whoop has no display, so its "screen" is a floating HUD that cycles Strain / HRV / Recovery. */
export function WhoopHud({ live }: { live: Live }) {
  const items = [
    { k: "STRAIN", v: (13.2 + (live.t % 9) * 0.1).toFixed(1), s: "/ 21", c: "#b1c8ee" },
    { k: "HRV", v: String(58 + (live.bpm % 9)), s: "ms", c: "#ffb598" },
    { k: "RECOVERY", v: "87", s: "%", c: "#7be0a5" },
  ];
  return (
    <div className="relative h-full w-full font-grotesk">
      {items.map((it, i) => (
        <div key={it.k} className="absolute inset-0" style={fade(live.page === i)}>
          <p className="text-[9px] tracking-[0.28em] text-white/60">{it.k}</p>
          <p className="mt-1 text-[38px] font-light leading-none tabular-nums" style={{ color: it.c }}>
            {it.v}
            <span className="ml-1 text-[13px] text-white/55">{it.s}</span>
          </p>
        </div>
      ))}
    </div>
  );
}
