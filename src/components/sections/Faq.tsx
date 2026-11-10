import { Button } from "@/components/ui/Button";
import { gutter } from "@/lib/design";
import type { FaqItem } from "@/lib/cms-types";
import { Reveal } from "@/components/motion/Reveal";
import { FaqCard } from "./FaqCard";

/** FAQs header + three question cards. */
export function Faq({ faqs }: { faqs: FaqItem[] }) {
  return (
    <section
      id="faqs"
      className={`relative z-0 scroll-mt-24 py-16 lg:pb-0 lg:pt-[calc(90*var(--d))] ${gutter}`}
    >
      <Reveal>
        <h2 className="display text-[clamp(52px,9.4vw,172px)]">Hyrox questions, answered.</h2>
        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <p className="lede">
            What a Hyrox race is, how to pace one, and how HighRocks helps you train for it.
          </p>
          <Button href="/faqs" className="w-[183px] shrink-0">
            All Questions
          </Button>
        </div>
      </Reveal>

      <ul className="mt-10 grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-6 lg:mt-14 lg:gap-[clamp(16px,2.03vw,35px)]">
        {faqs.map((f, i) => (
          <Reveal as="li" key={i} delay={i * 0.12} y={44} className="flex">
            <FaqCard q={f.q} a={f.a} defaultOpen={i === 0} />
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
