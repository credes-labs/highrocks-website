import type { Metadata } from "next";
import { Navbar } from "@/components/sections/Navbar";
import { ArticlesCarousel } from "@/components/articles/ArticlesCarousel";
import { ArticleBrowser } from "@/components/articles/ArticleBrowser";
import { JoinCta } from "@/components/sections/JoinCta";
import { Footer } from "@/components/sections/Footer";
import { gutter } from "@/lib/design";
import { articles } from "@/lib/content";
import { JsonLd } from "@/components/seo/JsonLd";
import { WEBSITE_ID, breadcrumbLd, pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Hyrox Training Articles, Blogs & Guides",
  description:
    "Hyrox training articles and race guides: pacing, the 8 stations, SkiErg and sled push technique, wall ball strategy, running and your first race.",
  path: "/articles",
  keywords: ["Hyrox articles", "Hyrox guides", "Hyrox training tips", "Hyrox technique"],
});

const jsonLd = [
  {
    "@type": "CollectionPage",
    "@id": absoluteUrl("/articles#webpage"),
    url: absoluteUrl("/articles"),
    name: "Hyrox articles & guides",
    isPartOf: { "@id": WEBSITE_ID },
    breadcrumb: breadcrumbLd([{ name: "Articles", path: "/articles" }]),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: articles.map((a, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(`/articles/${a.slug}`),
        name: a.title,
      })),
    },
  },
];

export default function ArticlesPage() {
  return (
    <>
      <Navbar />
      <main>
        <header className={`pb-10 pt-[140px] lg:pb-16 lg:pt-[calc(220*var(--d))] ${gutter}`}>
          <h1 className="display text-[clamp(56px,11vw,200px)]">Hyrox articles &amp; guides</h1>
          <p className="lede mt-6">
            Race guides, pacing advice, station technique, nutrition and athlete stories for anyone
            training for a Hyrox race.
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
      <JsonLd data={jsonLd} />
    </>
  );
}
