import Image from "next/image";
import { d } from "@/lib/design";
import { JoinCtaForm } from "./JoinCtaForm";

/** "Be the First. Be There." — shared sign-up band at the bottom of the inner pages (design canvas 1729 × 864). */
export function JoinCta() {
  return (
    <section
      id="waitlist"
      className="relative grid scroll-mt-24 lg:grid-cols-[856fr_873fr]"
      style={{ minHeight: d(864) }}
    >
      <div className="relative flex flex-col justify-center overflow-hidden px-5 py-16 lg:px-0 lg:py-0 lg:pl-[calc(88*var(--d))]">
        <Image src="/images/polaroid-run.png" alt="" fill sizes="50vw" className="object-cover opacity-[0.23]" />
        <div className="relative">
          <h2 className="text-[clamp(40px,3.7vw,64px)] font-normal capitalize leading-[1.078] tracking-[-0.0375em]">
            <span className="block text-[#f1f1f1]">Be the First.</span>
            <span className="block text-accent">Be There.</span>
          </h2>
          <p className="mt-6 max-w-[413px] text-[clamp(16px,1.16vw,20px)] capitalize leading-[22.75px] tracking-[0.035em] text-muted">
            Sync your data from devices you trust.
            <br />
            All in one place.
          </p>
        </div>
      </div>
      <div className="bg-gradient-to-b from-navy to-bg px-5 py-16 lg:px-0 lg:py-0 lg:pl-[calc(154*var(--d))] lg:pt-[calc(89*var(--d))]">
        <JoinCtaForm className="mx-auto w-full max-w-[571px] lg:mx-0" />
      </div>
    </section>
  );
}
