import Link from "next/link";
import { LOGOMARK_PATHS } from "@/lib/logomark";

const C = 300; // centre of the 600 × 600 track
const LANES = [262, 226] as const;
const TICKS = Array.from({ length: 72 }, (_, i) => i * 5);

const LINKS = [
  { label: "Pace Calculator", href: "/pace-calculator" },
  { label: "Info Centre", href: "/info-centre" },
  { label: "FAQs", href: "/faqs" },
] as const;

/** A lap of the race track with the HighRocks mark in the middle and a runner going round. */
function Track() {
  return (
    <svg viewBox="0 0 600 600" className="nf-track h-auto w-full" aria-hidden>
      <defs>
        <radialGradient id="nf-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1e3654" stopOpacity="0.9" />
          <stop offset="70%" stopColor="#1e3654" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="nf-trail" x1="0" x2="1">
          <stop offset="0%" stopColor="#b1c8ee" stopOpacity="0" />
          <stop offset="100%" stopColor="#b1c8ee" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <circle cx={C} cy={C} r={250} fill="url(#nf-glow)" />

      {/* Lane lines and tick marks */}
      {LANES.map((r) => (
        <circle key={r} cx={C} cy={C} r={r} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth={1} />
      ))}
      {TICKS.map((a) => {
        const rad = (a * Math.PI) / 180;
        const major = a % 45 === 0;
        const r1 = LANES[0] + 8;
        const r2 = r1 + (major ? 18 : 9);
        const f = (n: number) => Math.round(n * 100) / 100;
        return (
          <line
            key={a}
            x1={f(C + r1 * Math.sin(rad))}
            y1={f(C - r1 * Math.cos(rad))}
            x2={f(C + r2 * Math.sin(rad))}
            y2={f(C - r2 * Math.cos(rad))}
            stroke={major ? "#b1c8ee" : "rgba(255,255,255,0.22)"}
            strokeWidth={major ? 2 : 1}
          />
        );
      })}

      {/* Runner: a short lit trail and a dot, lapping the inner lane */}
      <g className="nf-runner">
        <path
          d={`M ${C} ${C - 244} A 244 244 0 0 1 ${Math.round(C + 244 * Math.sin(0.9))} ${Math.round(C - 244 * Math.cos(0.9))}`}
          fill="none"
          stroke="url(#nf-trail)"
          strokeWidth={3}
          strokeLinecap="round"
          transform={`rotate(-52 ${C} ${C})`}
        />
        <circle cx={C} cy={C - 244} r={7} fill="#ffb598" />
      </g>

      {/* HighRocks logomark (264 × 263 artwork, centred) */}
      <g transform={`translate(${C - 132 * 0.72} ${C - 131.5 * 0.72}) scale(0.72)`}>
        {LOGOMARK_PATHS.map((d) => (
          <path key={d.slice(0, 16)} d={d} fill="#e5e1e4" />
        ))}
      </g>
    </svg>
  );
}

/** Shared 404 view for unmatched URLs and missing articles. */
export function NotFoundView() {
  return (
    <main className="relative flex min-h-[100svh] items-center overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-[1400px] items-center gap-12 lg:grid-cols-[1fr_minmax(0,560px)] lg:gap-20">
        <div className="order-2 lg:order-1">
          <p className="font-grotesk text-[12px] uppercase tracking-[0.3em] text-accent">Error 404 · Off course</p>
          <h1 className="display mt-5 text-[clamp(64px,11vw,184px)]">
            Wrong
            <br />
            lane.
          </h1>
          <p className="lede mt-6 max-w-[520px]">
            This page isn&apos;t on the race map. It may have moved, or the link has a typo. Head back to the
            start line, or pick up the course from one of these stations.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              href="/"
              className="inline-flex h-[54px] items-center justify-center bg-accent px-8 font-grotesk text-[13px] font-bold uppercase tracking-[0.12em] text-[#0c1420] transition-[filter] hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Back to the start
            </Link>
            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="font-grotesk text-[13px] uppercase tracking-[0.14em] text-ink underline-offset-4 transition-colors hover:text-accent hover:underline"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="order-1 mx-auto w-[min(78vw,520px)] lg:order-2">
          <Track />
        </div>
      </div>
    </main>
  );
}
