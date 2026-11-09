import type { Metadata } from "next";
import { Navbar } from "@/components/sections/Navbar";
import { InfoHero } from "@/components/articles/InfoHero";
import { CategoryTrio } from "@/components/articles/CategoryTrio";
import { LatestRows } from "@/components/articles/LatestRows";
import { AllStories } from "@/components/articles/AllStories";
import { JoinCta } from "@/components/sections/JoinCta";
import { Footer } from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Info Centre — HighRocks",
  description: "Stories, articles, blogs and guides to help you train for Hyrox with intention.",
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
