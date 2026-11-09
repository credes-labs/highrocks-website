import type { Metadata } from "next";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { JoinCta } from "@/components/sections/JoinCta";
import { FaqBrowser } from "@/components/faq/FaqBrowser";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { faqGroups } from "@/lib/content";

export const metadata: Metadata = {
  title: "FAQs — HighRocks",
  description: "Answers about Hyrox, pacing, drills, wearables and early access to HighRocks.",
};

export default function FaqsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqGroups.flatMap((g) =>
      g.items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
    ),
  };
  return (
    <>
      <Navbar />
      <main>
        <section className="px-5 pb-16 pt-[150px] lg:px-[clamp(20px,6.13vw,106px)] lg:pb-24 lg:pt-[calc(240*var(--d))]">
          <Reveal className="mx-auto max-w-[1100px]">
            <Eyebrow>Early access</Eyebrow>
            <h1 className="mt-4 text-[clamp(44px,3.7vw,64px)] font-normal leading-[1.06] tracking-[-0.0375em] text-accent">FAQs</h1>
            <p className="mt-4 max-w-[560px] text-[clamp(16px,1.16vw,20px)] leading-[1.5] text-muted">
              Everything about the race, the training and the app. Can&apos;t find it? Join the waitlist and ask us directly.
            </p>
          </Reveal>
          <div className="mt-12 lg:mt-16">
            <FaqBrowser />
          </div>
        </section>
        <div className="mt-8 lg:mt-[calc(120*var(--d))]">
          <JoinCta />
        </div>
      </main>
      <Footer overlap={176} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
