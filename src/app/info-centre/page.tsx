import type { Metadata } from "next";
import { Navbar } from "@/components/sections/Navbar";
import { InfoHero } from "@/components/articles/InfoHero";
import { CategoryTrio } from "@/components/articles/CategoryTrio";
import { LatestRows } from "@/components/articles/LatestRows";
import { AllStories } from "@/components/articles/AllStories";
import { JoinCta } from "@/components/sections/JoinCta";
import { Footer } from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Hyrox Info Centre: Stories, Guides & Training Advice",
  description:
    "Hyrox stories, guides and training advice from the HighRocks Info Centre: race prep, station technique, pacing, nutrition and recovery.",
  alternates: { canonical: "/info-centre" },
};

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
    </>
  );
}
