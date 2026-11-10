import type { Metadata } from "next";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { JoinCta } from "@/components/sections/JoinCta";
import { FaqBrowser } from "@/components/faq/FaqBrowser";
import { gutter } from "@/lib/design";
import { Reveal } from "@/components/motion/Reveal";
import { faqGroups } from "@/lib/content";

export const metadata: Metadata = {
  title: "Hyrox FAQs: Race Format, Stations, Pacing & Training",
  description:
    "Answers to common Hyrox questions: what the race is, the 8 stations and divisions, good finish times, how to pace it, and how the HighRocks app helps you train.",
  alternates: { canonical: "/faqs" },
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
        <section className={`pb-16 pt-[140px] lg:pb-24 lg:pt-[calc(220*var(--d))] ${gutter}`}>
          <Reveal>
            <h1 className="display text-[clamp(56px,11vw,200px)]">Hyrox FAQs</h1>
            <p className="lede mt-6">
              The Hyrox race format, the 8 stations and divisions, good finish times, how to pace a
              Hyrox race, and how HighRocks helps you train for one.
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
