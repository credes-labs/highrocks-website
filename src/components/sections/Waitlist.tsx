import Image from "next/image";
import { d } from "@/lib/design";
import { Reveal } from "@/components/motion/Reveal";
import { WaitlistForm } from "./WaitlistForm";

/** "Be the first one to join HighRocks." (design canvas 1728 × 955, glow at the bottom edge) */
export function Waitlist() {
  return (
    <section
      id="waitlist"
      className="relative scroll-mt-24"
      style={{
        minHeight: d(955),
        backgroundImage: "linear-gradient(180deg, #101113 0%, #19212b 48%, #1c2632 68%, #161c24 84%, #121519 94%, #101113 100%)",
      }}
    >
      {/* Fade the phone into the section before its bottom edge. */}
      <Reveal
        x={90}
        y={0}
        duration={1.2}
        amount={0.1}
        className="pointer-events-none absolute right-0 hidden overflow-hidden lg:block"
        style={{
          bottom: 0,
          width: d(1159),
          height: d(1232),
          maskImage: "linear-gradient(to bottom, #000 0%, #000 72%, #000e 80%, #0008 89%, #0002 96%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, #000 0%, #000 72%, #000e 80%, #0008 89%, #0002 96%, transparent 100%)",
        }}
      >
        <Image
          src="/images/waitlist-phone.png"
          alt=""
          width={1024}
          height={1536}
          sizes="67vw"
          className="absolute top-0 h-auto max-w-none"
          style={{ left: "-0.1%", width: "100.08%" }}
        />
      </Reveal>

      {/* Mobile: the phone render becomes a cropped banner that melts into the page */}
      <div
        className="relative mx-auto h-[clamp(420px,115vw,620px)] max-w-[620px] overflow-hidden lg:hidden"
        style={{
          maskImage: "linear-gradient(180deg, transparent 0%, #000 18%, #000 55%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 18%, #000 55%, transparent 100%)",
        }}
        aria-hidden
      >
        <Image
          src="/images/waitlist-phone.png"
          alt=""
          width={1024}
          height={1536}
          sizes="100vw"
          className="absolute left-1/2 top-[-12%] h-auto w-full max-w-none -translate-x-1/2"
        />
      </div>

      <div
        className="relative mx-auto -mt-8 max-w-[1728px] px-5 pb-16 lg:mt-0 lg:px-0 lg:pb-24"
        style={{ minHeight: d(955) }}
      >
        <Reveal
          className="mx-auto w-full max-w-[564px] lg:mx-0 lg:pt-[var(--wl-top)] lg:ml-[var(--wl-left)] [--wl-left:calc(132*var(--d))] [--wl-top:calc(255*var(--d))]"
          y={44}
        >
          <p className="font-grotesk text-[11px] uppercase tracking-[0.22em] text-[#8b93a1]">Early access</p>
          <h2 className="mt-4 text-[clamp(36px,3.2vw,54px)] font-[480] leading-[1.05] tracking-[-0.045em] text-ink">
            Be the first to <span className="text-accent">join HighRocks.</span>
          </h2>
          <p className="mt-4 max-w-[420px] text-[16px] font-[450] leading-[24px] text-[#8b93a1]">
            Every session, every metric, every improvement. Built for training Hyrox with intention.
          </p>
          <WaitlistForm className="mt-9 max-w-[420px]" />
        </Reveal>
      </div>
    </section>
  );
}
