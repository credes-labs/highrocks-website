import Image from "next/image";
import { d } from "@/lib/design";
import { Eyebrow } from "@/components/ui/Eyebrow";
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
        backgroundImage: "linear-gradient(180deg, #101113 0%, #19212b 55%, #1c2632 78%, #101113 100%)",
      }}
    >
      {/* Phone render: bleeds above the section and is cropped by its bottom edge */}
      <Reveal
        x={90}
        y={0}
        duration={1.2}
        amount={0.1}
        className="pointer-events-none absolute right-0 hidden overflow-hidden lg:block"
        style={{ bottom: 0, width: d(1159), height: d(1232) }}
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
      <div className="relative mx-auto h-[clamp(420px,115vw,620px)] max-w-[620px] overflow-hidden lg:hidden" aria-hidden>
        <Image
          src="/images/waitlist-phone.png"
          alt=""
          width={1024}
          height={1536}
          sizes="100vw"
          className="absolute left-1/2 top-[-12%] h-auto w-full max-w-none -translate-x-1/2"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#101113_0%,transparent_22%,transparent_65%,#101113_100%)]" />
      </div>

      <div
        className="relative mx-auto -mt-8 max-w-[1728px] px-5 pb-16 lg:mt-0 lg:px-0 lg:pb-24"
        style={{ minHeight: d(955) }}
      >
        <Reveal
          className="mx-auto w-full max-w-[564px] lg:mx-0 lg:pt-[var(--wl-top)] lg:ml-[var(--wl-left)] [--wl-left:calc(132*var(--d))] [--wl-top:calc(255*var(--d))]"
          y={44}
        >
          <Eyebrow>Early access</Eyebrow>
          <h2 className="mt-[17px] -ml-1 text-[clamp(34px,3.01vw+8px,52px)] font-normal capitalize leading-[1.154] tracking-[-0.046em] text-accent">
            Be the first one to
            <br />
            <span className="text-ink-soft">Join HighRocks.</span>
          </h2>
          <p className="mt-[31px] max-w-[492px] text-[clamp(16px,1.16vw,20px)] capitalize leading-[22.75px] tracking-[0.035em] text-muted">
            Every Session. Every Metric. Every Improvement. Designed to help you train in Hyrox
            with intention.
          </p>
          <WaitlistForm className="mt-[40px] max-w-[522px] lg:max-w-[max(420px,calc(522*var(--d)))]" />
        </Reveal>
      </div>
    </section>
  );
}
