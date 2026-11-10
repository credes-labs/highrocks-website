import type { Metadata } from "next";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { JoinCta } from "@/components/sections/JoinCta";
import { FaqBrowser } from "@/components/faq/FaqBrowser";
import { gutter } from "@/lib/design";
import { Reveal } from "@/components/motion/Reveal";
import { getFaqGroups } from "@/lib/cms";
import { WEBSITE_ID, breadcrumbLd, pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = pageMetadata({
  title: "Hyrox FAQs: Race Format, Stations, Pacing & Training",
  description:
    "Answers to common Hyrox questions: what the race is, the 8 stations and divisions, good finish times, how to pace it, and how the HighRocks app helps you train.",
  path: "/faqs",
  keywords: ["Hyrox FAQ", "what is Hyrox", "Hyrox stations", "good Hyrox time", "Hyrox divisions"],
});

export default async function FaqsPage() {
  const faqGroups = await getFaqGroups();
  const jsonLd = [
    breadcrumbLd([{ name: "FAQs", path: "/faqs" }]),
    {
    "@type": "FAQPage",
    "@id": absoluteUrl("/faqs#faq"),
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: faqGroups.flatMap((g) =>
      g.items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
    ),
    },
  ];
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
            <FaqBrowser groups={faqGroups} />
          </div>
        </section>
        <div className="mt-8 lg:mt-[calc(120*var(--d))]">
          <JoinCta />
        </div>
      </main>
      <Footer overlap={176} />
      <JsonLd data={jsonLd} />
    </>
  );
}
