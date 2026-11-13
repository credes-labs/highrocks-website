"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import {
  formatGap,
  formatSplit,
  formatTotal,
  type Segment,
  type SplitResult,
} from "@/lib/pacing/engine";

/* Shared palette (mirrors pace.css) */
const C = {
  run: "#b1c8ee",
  station: "#ffb598",
  rox: "#4a515c",
  grid: "#24272d",
  axis: "#3a3f47",
  label: "#7d8794",
  ink: "#e5e1e4",
  target: "#8a94a3",
};

/** Measures an element's width so SVGs render at real pixels (crisp text, no scaling). */
function useWidth<T extends HTMLElement>(initial = 640) {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(initial);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.max(240, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

/** "Nice" tick step in seconds for a time axis spanning `span` seconds. */
function timeStep(span: number, maxTicks: number) {
  const steps = [60, 120, 300, 600, 900, 1200, 1800, 3600];
  return steps.find((s) => span / s <= maxTicks) ?? 3600;
}
const tickLabel = (s: number) => (s >= 3600 ? formatTotal(s).replace(/:00$/, "") : `${Math.round(s / 60)}′`);

export function ChartFrame({ title, meta, children, legend }: { title: string; meta?: ReactNode; legend?: ReactNode; children: ReactNode }) {
  return (
    <section className="pc-panel">
      <header className="pc-panel-head">
        <h3>{title}</h3>
        {meta ? <p>{meta}</p> : null}
      </header>
      {legend ? <div className="pc-legend">{legend}</div> : null}
      {children}
    </section>
  );
}

export const Key = ({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) => (
  <span className="pc-key">
    <i style={dashed ? { borderTop: `1.5px dashed ${color}`, background: "none", height: 0 } : { background: color }} />
    {label}
  </span>
);

/* ------------------------------------------------------------------------------------------------
 * Race timeline: all 16 segments on one time axis, width = duration.
 * ---------------------------------------------------------------------------------------------- */
export function RaceStrip({ plan, compact = false }: { plan: SplitResult; compact?: boolean }) {
  const [ref, w] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<Segment | null>(null);
  const total = Math.max(1, plan.finalTime);
  const barH = compact ? 34 : 44;
  const top = 6;
  const axisY = top + barH + 14;
  const h = axisY + 14;
  const x = (s: number) => (s / total) * w;
  const step = timeStep(total, w < 480 ? 5 : 9);
  const ticks = Array.from({ length: Math.floor(total / step) + 1 }, (_, i) => i * step);
  const active = hover ?? null;

  return (
    <div ref={ref} className="pc-strip">
      <p className="pc-readout" aria-live="polite">
        {active ? (
          <>
            <b>{String(active.index).padStart(2, "0")}</b> {active.label}
            <span>{formatSplit(active.time)}</span>
            <em>
              {formatTotal(active.start)} → {formatTotal(active.end)}
            </em>
          </>
        ) : (
          <>
            <b>16</b> segments · hover or tap a block for its split
          </>
        )}
      </p>
      <svg width={w} height={h} role="img" aria-label={`Race timeline: ${formatTotal(plan.finalTime)} across 8 runs and 8 stations`}>
        <rect x={0} y={top} width={w} height={barH} fill={C.rox} opacity={0.45} />
        {plan.segments.map((s) => {
          const on = active?.index === s.index;
          return (
            <rect
              key={s.index}
              x={x(s.start) + 0.5}
              y={top}
              width={Math.max(1, x(s.end) - x(s.start) - 1)}
              height={barH}
              fill={s.kind === "run" ? C.run : C.station}
              opacity={active && !on ? 0.35 : s.kind === "run" ? 0.85 : 0.9}
              onPointerEnter={() => setHover(s)}
              onPointerDown={() => setHover(s)}
              onPointerLeave={() => setHover(null)}
            />
          );
        })}
        {!compact &&
          plan.segments
            .filter((s) => s.kind === "station")
            .map((s) => {
              const cx = (x(s.start) + x(s.end)) / 2;
              return x(s.end) - x(s.start) > 34 ? (
                <text key={s.index} x={cx} y={top + barH / 2 + 4} textAnchor="middle" className="pc-svg-in">
                  {s.kind === "station" ? s.station.short.slice(0, Math.floor((x(s.end) - x(s.start)) / 7)) : ""}
                </text>
              ) : null;
            })}
        <line x1={0} x2={w} y1={axisY - 8} y2={axisY - 8} stroke={C.axis} />
        {ticks.map((t) => (
          <g key={t}>
            <line x1={x(t)} x2={x(t)} y1={axisY - 8} y2={axisY - 4} stroke={C.axis} />
            <text x={Math.min(w - 2, Math.max(2, x(t)))} y={axisY + 6} textAnchor={t === 0 ? "start" : x(t) > w - 20 ? "end" : "middle"} className="pc-svg-tick">
              {tickLabel(t)}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Cumulative race clock vs. an even pace to the target.
 * ---------------------------------------------------------------------------------------------- */
export function CumulativeChart({ plan }: { plan: SplitResult }) {
  const [ref, w] = useWidth<HTMLDivElement>();
  const h = 300;
  const m = { l: 52, r: 16, t: 14, b: 30 };
  const iw = w - m.l - m.r;
  const ih = h - m.t - m.b;
  const ratio = plan.finalTime > 0 ? plan.targetTime / plan.finalTime : 1;
  const ends = [0, ...plan.segments.map((s) => s.end)];
  const projected = ends.map((t, i) => ({ i, t }));
  const target = ends.map((t, i) => ({ i, t: t * ratio }));
  const maxT = Math.max(plan.finalTime, plan.targetTime, 1);
  const step = timeStep(maxT, 6);
  const yMax = Math.ceil(maxT / step) * step;
  const X = (i: number) => m.l + (i / 16) * iw;
  const Y = (t: number) => m.t + ih - (t / yMax) * ih;
  const line = (pts: { i: number; t: number }[]) => pts.map((p, k) => `${k ? "L" : "M"}${X(p.i).toFixed(1)},${Y(p.t).toFixed(1)}`).join("");
  const area = `${line(projected)}${[...target].reverse().map((p) => `L${X(p.i).toFixed(1)},${Y(p.t).toFixed(1)}`).join("")}Z`;
  const over = plan.gap > 0;

  return (
    <div ref={ref}>
      <svg width={w} height={h} role="img" aria-label={`Race clock: projected ${formatTotal(plan.finalTime)} against target ${formatTotal(plan.targetTime)}`}>
        {Array.from({ length: yMax / step + 1 }, (_, k) => k * step).map((t) => (
          <g key={t}>
            <line x1={m.l} x2={w - m.r} y1={Y(t)} y2={Y(t)} stroke={C.grid} />
            <text x={m.l - 8} y={Y(t) + 4} textAnchor="end" className="pc-svg-tick">
              {tickLabel(t)}
            </text>
          </g>
        ))}
        {plan.segments.map((s) =>
          s.kind === "station" ? <rect key={s.index} x={X(s.index - 1)} y={m.t} width={iw / 16} height={ih} fill={C.station} opacity={0.035} /> : null,
        )}
        {[0, 4, 8, 12, 16].map((i) => (
          <text key={i} x={X(i)} y={h - 10} textAnchor={i === 0 ? "start" : i === 16 ? "end" : "middle"} className="pc-svg-tick">
            {i === 0 ? "Start" : i === 16 ? "Finish" : `Seg ${i}`}
          </text>
        ))}
        <path d={area} fill={over ? C.station : C.run} opacity={0.14} />
        <path d={line(target)} fill="none" stroke={C.target} strokeWidth={1.25} strokeDasharray="4 4" />
        <path d={line(projected)} fill="none" stroke={C.run} strokeWidth={2} />
        {projected.slice(1).map((p) => (
          <circle key={p.i} cx={X(p.i)} cy={Y(p.t)} r={2.25} fill={plan.segments[p.i - 1].kind === "run" ? C.run : C.station} />
        ))}
        <circle cx={X(16)} cy={Y(plan.finalTime)} r={4.5} fill="none" stroke={C.ink} />
        <text x={X(16) - 10} y={Y(plan.finalTime) - 10} textAnchor="end" className="pc-svg-val">
          {formatTotal(plan.finalTime)}
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Station budget: horizontal bars with the drill goal marked.
 * ---------------------------------------------------------------------------------------------- */
export function StationBars({ plan, compact = false }: { plan: SplitResult; compact?: boolean }) {
  const [ref, w] = useWidth<HTMLDivElement>();
  const rowH = compact ? 26 : 34;
  const labelW = w < 420 ? 74 : 132;
  const valW = compact ? 44 : 104;
  const barX = labelW + 8;
  const barW = Math.max(40, w - barX - valW - 8);
  const max = Math.max(...plan.stations.map((s) => s.time), 1);
  const h = plan.stations.length * rowH + 4;

  return (
    <div ref={ref}>
      <svg width={w} height={h} role="img" aria-label="Target time for each station, with drill goals">
        {plan.stations.map((s, i) => {
          const y = i * rowH + 2;
          const bw = (s.time / max) * barW;
          const gx = barX + (s.drillGoal / max) * barW;
          return (
            <g key={s.slug}>
              <text x={0} y={y + rowH / 2 + 4} className="pc-svg-label">
                {w < 420 ? s.short : s.name}
              </text>
              <rect x={barX} y={y + rowH / 2 - 5} width={barW} height={10} fill={C.grid} />
              <rect x={barX} y={y + rowH / 2 - 5} width={bw} height={10} fill={C.station} opacity={0.88} />
              {!compact && <line x1={gx} x2={gx} y1={y + rowH / 2 - 9} y2={y + rowH / 2 + 9} stroke={C.ink} strokeWidth={1.5} />}
              <text x={w} y={y + rowH / 2 + 4} textAnchor="end" className="pc-svg-val">
                {formatSplit(s.time)}
                {!compact && <tspan className="pc-svg-dim"> · {(s.share * 100).toFixed(0)}%</tspan>}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Time allocation: run / stations / roxzone as one 100% bar.
 * ---------------------------------------------------------------------------------------------- */
export function AllocationBar({ plan }: { plan: SplitResult }) {
  const parts = [
    { label: "Running", pct: plan.runPct, time: plan.runTime, color: C.run },
    { label: "Stations", pct: plan.workPct, time: plan.stationTime, color: C.station },
    { label: "Transitions", pct: plan.transitionPct, time: plan.transitionTime, color: C.rox },
  ];
  return (
    <div className="pc-alloc">
      <div className="pc-alloc-bar" aria-hidden="true">
        {parts.map((p) => (
          <span key={p.label} style={{ width: `${p.pct * 100}%`, background: p.color }} />
        ))}
      </div>
      <dl>
        {parts.map((p) => (
          <div key={p.label}>
            <dt>
              <i style={{ background: p.color }} />
              {p.label}
            </dt>
            <dd>
              {(p.pct * 100).toFixed(1)}%<span>{formatSplit(p.time)}</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Delta vs base: how the athlete and format modifiers expanded or shrank each component
 * against its unmodified allocation.
 * ---------------------------------------------------------------------------------------------- */
export function DeltaChart({ plan }: { plan: SplitResult }) {
  const [ref, w] = useWidth<HTMLDivElement>();
  const rows = [
    { key: "runs", label: "Runs (8 km)", short: "Runs", base: plan.runBase, delta: plan.runDelta, run: true },
    ...plan.stations.map((s) => ({ key: s.slug, label: s.name, short: s.short, base: s.baseTime, delta: s.delta, run: false })),
  ];
  const rowH = 26;
  const labelW = w < 420 ? 64 : 132;
  const valW = 58;
  const barX = labelW + 8;
  const barW = Math.max(60, w - barX - valW - 8);
  const mid = barX + barW / 2;
  const max = Math.max(...rows.map((r) => Math.abs(r.delta)), 1);
  const h = rows.length * rowH + 4;
  const flat = rows.every((r) => Math.abs(r.delta) < 0.5);

  return (
    <div ref={ref}>
      <svg width={w} height={h} role="img" aria-label="Change in each component against its unmodified allocation">
        <line x1={mid} x2={mid} y1={0} y2={h} stroke={C.axis} />
        {rows.map((r, i) => {
          const y = i * rowH + 2;
          const bw = (Math.abs(r.delta) / max) * (barW / 2);
          const over = r.delta > 0;
          return (
            <g key={r.key}>
              <text x={0} y={y + rowH / 2 + 4} className="pc-svg-label">
                {w < 420 ? r.short : r.label}
              </text>
              <rect x={over ? mid : mid - bw} y={y + rowH / 2 - 5} width={bw} height={10} fill={over ? C.station : "#9fd8b5"} opacity={0.85} />
              <text x={w} y={y + rowH / 2 + 4} textAnchor="end" className="pc-svg-val">
                {Math.abs(r.delta) < 0.5 ? "0:00" : formatGap(r.delta)}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="pc-note">
        {flat
          ? "Average profile: every component matches its base allocation. Change your profile to see what shifts."
          : "Left of the line is time your profile saves against the base allocation; right is time it adds."}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Gap breakdown (calibrated from a past race with station splits).
 * ---------------------------------------------------------------------------------------------- */
export function GapBreakdown({ plan, splits, runTime }: { plan: SplitResult; splits: (number | null)[]; runTime: number }) {
  const rows = plan.stations
    .map((s, i) => ({ s, actual: splits[i], gap: splits[i] != null ? (splits[i] as number) - s.time : null }))
    .filter((r): r is { s: (typeof plan.stations)[number]; actual: number; gap: number } => r.gap != null)
    .sort((a, b) => b.gap - a.gap);
  const max = Math.max(...rows.map((r) => Math.abs(r.gap)), 1);
  const perKm = (runTime - plan.runTime) / 8;
  const focus = rows.filter((r) => r.gap > 0).slice(0, 2);

  return (
    <div className="pc-gaps">
      <table>
        <thead>
          <tr>
            <th scope="col">Station</th>
            <th scope="col">Last race</th>
            <th scope="col">Target</th>
            <th scope="col" className="pc-gaps-bar-col">
              <span className="sr-only">Gap</span>
            </th>
            <th scope="col">Gap</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ s, actual, gap }) => (
            <tr key={s.slug}>
              <th scope="row">{s.name}</th>
              <td>{formatSplit(actual)}</td>
              <td>{formatSplit(s.time)}</td>
              <td className="pc-gaps-bar-col" aria-hidden="true">
                <span className="pc-diverge">
                  <span
                    className={gap > 0 ? "is-over" : "is-under"}
                    style={{ width: `${(Math.abs(gap) / max) * 50}%`, [gap > 0 ? "left" : "right"]: "50%" }}
                  />
                </span>
              </td>
              <td className={gap > 0 ? "is-over" : "is-under"}>{formatGap(gap)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="pc-note">
        Runs: {perKm > 0 ? `${formatSplit(perKm)} faster per km` : `${formatSplit(-perKm)} per km in hand`} ({formatSplit(runTime / 8)} → {formatSplit(plan.runSplit)} /km).
        {focus.length ? ` Focus on ${focus.map((r) => r.s.name).join(" and ")} first.` : " Every station you entered is already on target."}
      </p>
    </div>
  );
}

export { C as chartColors };
