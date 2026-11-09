import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { faqs } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";
import { FaqCard } from "./FaqCard";

/** FAQs header + three question cards. */
export function Faq() {
  return (
    <section
      id="faqs"
      className="relative z-0 mx-auto max-w-[1728px] scroll-mt-24 px-5 py-16 lg:pl-[clamp(20px,6.13vw,106px)] lg:pr-[clamp(20px,5.09vw,88px)] lg:pb-0 lg:pt-[calc(66*var(--d))]"
    >
      <Reveal className="max-w-[572px]">
        <Eyebrow>Early access</Eyebrow>
        <h2 className="mt-3 text-[clamp(32px,3.01vw,52px)] font-normal leading-[1.154] tracking-[-0.046em] text-accent">
          FAQs
        </h2>
        <p className="mt-3 text-[clamp(16px,1.16vw,20px)] capitalize leading-[22.75px] tracking-[0.035em] text-muted">
          Every Session. Every Metric. Every Improvement.
        </p>
        <Button href="/faqs" className="mt-[30px] w-[183px]">
          All Questions
        </Button>
      </Reveal>

      <ul className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-6 lg:mt-[33px] lg:gap-[clamp(16px,2.03vw,35px)]">
        {faqs.map((f, i) => (
          <Reveal as="li" key={i} delay={i * 0.12} y={44} className="flex">
            <FaqCard q={f.q} a={f.a} defaultOpen={i === 0} />
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
