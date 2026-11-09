import { d } from "@/lib/design";
import { Svg } from "@/components/ui/Svg";
import { footerLinks } from "@/lib/content";

const ORIGIN_Y = 7342; // top of the footer on the Figma canvas
const COLUMN_X = [420, 706, 1076, 1329, 1567] as const;
const SOCIALS = [
  { name: "instagram", label: "Instagram", href: "https://instagram.com" },
  { name: "twitter", label: "Twitter", href: "https://twitter.com" },
  { name: "twitter", label: "X", href: "https://x.com" },
] as const;

function Socials({
  fluid = false,
  compact = false,
  className = "",
  style,
}: {
  fluid?: boolean;
  compact?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const u = (n: number) => (fluid ? d(n) : compact ? `${n * 0.7}px` : `${n}px`);
  return (
    <ul className={`flex items-center ${className}`} style={{ gap: u(27), ...style }}>
      {SOCIALS.map((s, i) => (
        <li key={i} style={{ width: u(53.333) }}>
          <a
            href={s.href}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={s.label}
            className="block transition-opacity hover:opacity-70"
          >
            <Svg name={s.name} width={53.3333} height={54.7845} className="h-auto w-full" />
          </a>
        </li>
      ))}
    </ul>
  );
}

/**
 * @param overlap design pixels the footer's frame lines reach up into the section above
 * (50 on the home page, 176 under the shared sign-up band on the inner pages).
 */
export function Footer({ overlap = 50 }: { overlap?: number }) {
  return (
    <footer
      id="terms"
      className="pointer-events-none relative lg:-mt-[var(--overlap)] [&_a]:pointer-events-auto"
      style={{ "--overlap": d(overlap) } as React.CSSProperties}
    >
      {/* Glow */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{
          height: `max(680px, ${d(677)})`,
          backgroundImage: `radial-gradient(${d(1149)} ${d(655)} at 50% 95.6%, #1e3654 0%, #172434 50%, #141a23 75%, #101113 100%)`,
        }}
        aria-hidden
      />

      {/* Mobile / tablet */}
      <div className="relative mx-auto max-w-3xl px-5 pb-8 pt-16 lg:hidden">
        <div className="flex items-end justify-between gap-6">
          <p className="text-[34px] leading-[40px] tracking-[-0.067em]">
            <span className="block capitalize text-ink">Be the First.</span>
            <span className="block capitalize text-accent">Be There.</span>
          </p>
          <Socials className="shrink-0" style={{ gap: 10 }} compact />
        </div>

        <nav aria-label="Footer" className="mt-10 border-t border-white/15">
          {footerLinks
            .filter((l) => l.label !== "Text")
            .map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="flex items-center justify-between border-b border-white/15 py-5 font-grotesk text-[14px] uppercase tracking-[0.15em] text-white transition-colors active:bg-white/5"
              >
                {l.label}
                <span aria-hidden className="text-accent">
                  →
                </span>
              </a>
            ))}
        </nav>

        <div className="mt-12 grid grid-cols-[22%_1fr] items-center border-y border-white/40" aria-label="Highrocks">
          <div className="border-x border-white/20 p-2 sm:p-3">
            <Svg name="logo-footer" width={264} height={263} className="h-auto w-full" />
          </div>
          <p className="whitespace-nowrap pl-3 text-[clamp(24px,8vw,62px)] uppercase leading-none tracking-[0.04em] text-white" aria-hidden>
            Highrocks
          </p>
        </div>
        <p className="mt-3 text-center font-grotesk text-[10px] uppercase tracking-[0.3em] text-[#889fc3]">
          Intensity rises here
        </p>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/15 pt-6 text-[13px] font-light text-muted">
          <p>© 2026 Highrocks. All rights reserved.</p>
          <div className="flex items-center justify-between">
            <a href="#terms" className="hover:underline">
              Terms &amp; Conditions
            </a>
            <p>
              Built with &lt;3 by C
              <a href="https://credes.in/" target="_blank" rel="noreferrer noopener" className="underline">
                redes
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Desktop: positioned on the 1728px design canvas */}
      <div
        className="relative mx-auto hidden overflow-visible lg:block"
        style={{ width: d(1728), height: d(901) }}
      >
        {/* Frame lines */}
        {[86, 350].map((x) => (
          <div
            key={x}
            className="pointer-events-none absolute"
            style={{ left: d(x), bottom: 0, width: 1, height: d(901) }}
            aria-hidden
          >
            <Svg
              name="footer-vline"
              width={901}
              height={1}
              className="absolute left-1/2 top-1/2 h-px max-w-none -translate-x-1/2 -translate-y-1/2 rotate-90"
              style={{ width: d(901) }}
            />
          </div>
        ))}
        {[7859, 8123].map((y) => (
          <Svg
            key={y}
            name="footer-hline"
            width={1756}
            height={1}
            className="pointer-events-none absolute h-px max-w-none -scale-x-100"
            style={{ left: d(-14), top: d(y - ORIGIN_Y), width: d(1756) }}
          />
        ))}

        {/* Tagline + socials */}
        <p
          className="absolute tracking-[-0.067em]"
          style={{ left: d(109), top: d(7649 - ORIGIN_Y), fontSize: d(36), lineHeight: d(44) }}
        >
          <span className="block capitalize text-ink">Be the First.</span>
          <span className="block capitalize text-accent">Be There.</span>
        </p>
        <Socials fluid className="absolute" style={{ left: d(109), top: d(7767 - ORIGIN_Y) }} />

        {/* Link columns */}
        {footerLinks.map((l, i) => (
          <div key={i} className="absolute" style={{ left: d(COLUMN_X[i]), top: d(7662 - ORIGIN_Y) }}>
            <a
              href={l.href}
              className="block font-grotesk uppercase tracking-[0.15em] text-white transition-colors hover:text-accent"
              style={{ fontSize: d(16.629), lineHeight: d(24.944) }}
            >
              {l.label}
            </a>
            <ul style={{ marginTop: d(40.056) }}>
              {[0, 1, 2].map((r) => (
                <li
                  key={r}
                  className="font-grotesk capitalize tracking-[0.044em] text-muted"
                  style={{ fontSize: d(16), lineHeight: d(22.75), marginBottom: d(13.25) }}
                >
                  <a href={l.href}>Text</a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Logo cell + wordmark */}
        <Svg
          name="logo-footer"
          width={264}
          height={263}
          className="absolute max-w-none"
          style={{ left: d(86), top: d(7859 - ORIGIN_Y), width: d(264), height: d(263) }}
        />
        <p
          className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap uppercase text-white"
          style={{
            left: d(1017.5),
            top: d(7994 - ORIGIN_Y),
            fontSize: d(178.319),
            lineHeight: d(141.169),
            letterSpacing: d(14.86),
          }}
        >
          Highrocks
        </p>

        {/* Bottom row */}
        <a
          href="#terms"
          className="absolute -translate-y-1/2 font-light text-muted hover:underline"
          style={{ left: d(116), top: d(8185.5 - ORIGIN_Y), fontSize: d(14) }}
        >
          Terms &amp; Conditions
        </a>
        <p
          className="absolute -translate-y-1/2 font-light text-muted"
          style={{ left: d(420), top: d(8185.5 - ORIGIN_Y), fontSize: d(14) }}
        >
          © 2026 Highrocks. All rights reserved.
        </p>
        <p
          className="absolute -translate-x-full -translate-y-1/2 whitespace-nowrap text-right font-light text-muted"
          style={{ left: d(1613), top: d(8185.5 - ORIGIN_Y), fontSize: d(14) }}
        >
          Built with &lt;3 by C
          <a href="https://credes.in/" target="_blank" rel="noreferrer noopener" className="underline">
            redes
          </a>
        </p>
      </div>
    </footer>
  );
}
