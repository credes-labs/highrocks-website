import { d } from "@/lib/design";

type DialTicksProps = {
  /** Centre of the dial in design px, relative to the parent stage. */
  cx: number;
  cy: number;
  /** Distance from the centre to the middle of each tick. */
  radius: number;
  tickWidth: number;
  tickHeight: number;
  count?: number;
  /** Angle in degrees clockwise from 12 o'clock. */
  isLit: (angle: number) => boolean;
};

/** Ring of evenly spaced ticks; "lit" ones glow light blue (Figma "Vertical Divider" instances). */
export function DialTicks({ cx, cy, radius, tickWidth, tickHeight, count = 60, isLit }: DialTicksProps) {
  const step = 360 / count;
  return (
    <div className="pointer-events-none absolute" style={{ left: d(cx), top: d(cy) }} aria-hidden>
      {Array.from({ length: count }, (_, i) => {
        const angle = i * step;
        const lit = isLit(angle);
        return (
          <span
            key={angle}
            className={`absolute block ${lit ? "bg-accent-deep shadow-[0_0_8px_rgba(136,159,195,0.4)]" : "bg-line"}`}
            style={{
              width: d(tickWidth),
              height: d(tickHeight),
              left: d(-tickWidth / 2),
              top: d(-tickHeight / 2),
              transform: `rotate(${angle}deg) translateY(${d(-radius)})`,
            }}
          />
        );
      })}
    </div>
  );
}
