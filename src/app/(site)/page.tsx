import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Pacing } from "@/components/sections/Pacing";
import { Waitlist } from "@/components/sections/Waitlist";
import { TrainCircle } from "@/components/sections/TrainCircle";
import { Features } from "@/components/sections/Features";
import { Ecosystem } from "@/components/sections/Ecosystem";
import { Faq } from "@/components/sections/Faq";
import { Footer } from "@/components/sections/Footer";
import { featureStory } from "@/lib/content";
import { getHomeFaqs } from "@/lib/cms";
import type { FaqItem } from "@/lib/cms-types";
import { HYROX_DEFINITION, SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";
import { APP_ID, ORG_ID, WEBSITE_ID } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

/** Structured data so search engines and AI answer engines can describe HighRocks accurately. */
const jsonLd = (faqs: FaqItem[]) => [
  {
    "@type": "WebPage",
    "@id": `${SITE_URL}/#webpage`,
    url: SITE_URL,
    name: `${SITE_NAME}: ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": APP_ID },
    inLanguage: "en",
  },
  {
    "@type": "MobileApplication",
    "@id": APP_ID,
    name: SITE_NAME,
    applicationCategory: "HealthApplication",
    applicationSubCategory: "Hyrox training",
    operatingSystem: "iOS, Android",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    publisher: { "@id": ORG_ID },
    featureList: featureStory.map((s) => `${s.feature}: ${s.title}`),
    about: { "@type": "Thing", name: "Hyrox", description: HYROX_DEFINITION, sameAs: "https://en.wikipedia.org/wiki/Hyrox" },
  },
  {
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  },
];

export default async function Home() {
  const faqs = await getHomeFaqs();
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Pacing />
        <Waitlist />
        <TrainCircle />
        <Features />
        <Ecosystem />
        <Faq faqs={faqs} />
      </main>
      <Footer />
      <JsonLd data={jsonLd(faqs)} />
    </>
  );
}
