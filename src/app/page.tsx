import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Pacing } from "@/components/sections/Pacing";
import { Waitlist } from "@/components/sections/Waitlist";
import { TrainCircle } from "@/components/sections/TrainCircle";
import { Features } from "@/components/sections/Features";
import { Ecosystem } from "@/components/sections/Ecosystem";
import { Faq } from "@/components/sections/Faq";
import { Footer } from "@/components/sections/Footer";
import { faqs, featureStory } from "@/lib/content";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

/** Structured data so search engines and AI answer engines can describe HighRocks accurately. */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#org`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/icons/logo.svg`,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      publisher: { "@id": `${SITE_URL}/#org` },
    },
    {
      "@type": "SoftwareApplication",
      name: SITE_NAME,
      applicationCategory: "HealthApplication",
      operatingSystem: "iOS, Android",
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      publisher: { "@id": `${SITE_URL}/#org` },
      featureList: featureStory.map((s) => `${s.feature}: ${s.title}`),
      about: { "@type": "Thing", name: "Hyrox", description: "Indoor fitness race of 8 × 1 km runs and 8 functional workout stations." },
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function Home() {
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
        <Faq />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
