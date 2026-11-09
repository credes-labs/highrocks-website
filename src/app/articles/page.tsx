import type { Metadata } from "next";
import { Navbar } from "@/components/sections/Navbar";
import { ArticlesCarousel } from "@/components/articles/ArticlesCarousel";
import { ArticleBrowser } from "@/components/articles/ArticleBrowser";
import { JoinCta } from "@/components/sections/JoinCta";
import { Footer } from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Articles — HighRocks",
  description: "Read the latest Hyrox articles, blogs and training guides from HighRocks.",
};

export default function ArticlesPage() {
  return (
    <>
      <Navbar />
      <main>
        <header className="relative mx-auto flex max-w-[1728px] flex-col gap-4 px-5 pb-10 pt-[150px] lg:block lg:h-[calc(396*var(--d))] lg:px-0 lg:pb-0 lg:pt-0">
          <h1 className="text-[clamp(44px,3.7vw,64px)] font-normal capitalize leading-[1.06] tracking-[-0.0375em] text-ink lg:absolute lg:left-[calc(313*var(--d))] lg:top-[calc(254*var(--d))]">
            Articles
          </h1>
          <p className="max-w-[403px] text-[clamp(16px,1.16vw,20px)] capitalize leading-[22.75px] tracking-[0.035em] text-muted lg:absolute lg:left-[calc(1059*var(--d))] lg:top-[calc(303*var(--d))]">
            Our features help you to train, breathe and maintain proper form to be your best self and athlete.
          </p>
        </header>

        <ArticlesCarousel />

        <div className="mt-12 lg:mt-[calc(97*var(--d))]">
          <ArticleBrowser />
        </div>

        <div className="mt-20 lg:mt-[calc(228*var(--d))]">
          <JoinCta />
        </div>
      </main>
      <Footer overlap={176} />
    </>
  );
}
