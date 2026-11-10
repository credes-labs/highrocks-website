import type { Metadata } from "next";
import { Navbar } from "@/components/sections/Navbar";
import { InfoHero } from "@/components/articles/InfoHero";
import { CategoryTrio } from "@/components/articles/CategoryTrio";
import { LatestRows } from "@/components/articles/LatestRows";
import { AllStories } from "@/components/articles/AllStories";
import { JoinCta } from "@/components/sections/JoinCta";
import { Footer } from "@/components/sections/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { WEBSITE_ID, breadcrumbLd, pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Hyrox Info Centre: Stories, Guides & Training Advice",
  description:
    "Hyrox guides and training advice from the HighRocks Info Centre: race pacing, station technique, running, transitions and your first Hyrox race.",
  path: "/info-centre",
  keywords: ["Hyrox guides", "Hyrox training advice", "Hyrox tips", "Hyrox blog"],
});

const jsonLd = [
  {
    "@type": "CollectionPage",
    "@id": absoluteUrl("/info-centre#webpage"),
    url: absoluteUrl("/info-centre"),
    name: "Hyrox Info Centre",
    isPartOf: { "@id": WEBSITE_ID },
    breadcrumb: breadcrumbLd([{ name: "Info Centre", path: "/info-centre" }]),
  },
];

export default function InfoCentrePage() {
  return (
    <>
      <Navbar />
      <main>
        <InfoHero />
        <CategoryTrio />
        <LatestRows />
        <div className="mt-20 lg:mt-[calc(344*var(--d))]">
          <AllStories />
        </div>
        <div className="mt-20 lg:mt-[calc(228*var(--d))]">
          <JoinCta />
        </div>
      </main>
      <Footer overlap={176} />
      <JsonLd data={jsonLd} />
    </>
  );
}
