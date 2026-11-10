import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/sections/Navbar";
import { JoinCta } from "@/components/sections/JoinCta";
import { Footer } from "@/components/sections/Footer";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { ArticleMeta } from "@/components/ui/ArticleMeta";
import { getArticle, getArticles, getRelatedArticles } from "@/lib/cms";
import type { Article } from "@/lib/cms-types";
import { JsonLd } from "@/components/seo/JsonLd";
import { ORG_ID, WEBSITE_ID, breadcrumbLd, pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

export async function generateStaticParams() {
  return (await getArticles()).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/articles/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "Article not found", robots: { index: false } };
  return pageMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/articles/${article.slug}`,
    keywords: article.keywords,
    article: { published: article.published, modified: article.updated, section: article.category, tags: article.keywords },
  });
}

function articleLd(article: Article) {
  const url = absoluteUrl(`/articles/${article.slug}`);
  return [
    {
      "@type": "Article",
      "@id": `${url}#article`,
      headline: article.title,
      description: article.excerpt,
      url,
      mainEntityOfPage: url,
      image: [absoluteUrl(article.image.src), absoluteUrl(`/articles/${article.slug}/opengraph-image`)],
      datePublished: article.published,
      dateModified: article.updated ?? article.published,
      articleSection: article.category,
      keywords: article.keywords.join(", "),
      wordCount: [...article.intro, ...article.sections.flatMap((x) => [...x.paragraphs, ...(x.list ?? [])])].join(" ").split(/s+/).length,
      inLanguage: "en",
      about: { "@type": "Thing", name: "Hyrox", sameAs: "https://en.wikipedia.org/wiki/Hyrox" },
      author: { "@id": ORG_ID },
      publisher: { "@id": ORG_ID },
      isPartOf: { "@id": WEBSITE_ID },
      abstract: article.takeaways.join(" "),
    },
    breadcrumbLd([
      { name: "Articles", path: "/articles" },
      { name: article.title, path: `/articles/${article.slug}` },
    ]),
  ];
}

function Prose({ paragraphs, className = "" }: { paragraphs: readonly string[]; className?: string }) {
  return (
    <div
      className={`flex flex-col gap-[22.75px] copy ${className}`}
    >
      {paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}

function Section({ section }: { section: Article["sections"][number] }) {
  return (
    <section className="flex flex-col gap-[22.75px]">
      <h2 className="headline text-[clamp(28px,2.5vw,44px)]">{section.heading}</h2>
      <Prose paragraphs={section.paragraphs} />
      {section.list && (
        <ul className="copy flex list-disc flex-col gap-2 pl-5 marker:text-accent">
          {section.list.map((li) => (
            <li key={li}>{li}</li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Band({ src, w, h }: { src: string; w: number; h: number }) {
  return (
    <div className="relative aspect-[1728/979] w-full overflow-hidden">
      <Image src={src} alt="" width={w} height={h} unoptimized className="absolute inset-0 size-full object-cover" />
    </div>
  );
}

export default async function ArticlePage({ params }: PageProps<"/articles/[slug]">) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const more = await getRelatedArticles(article);
  const [firstHalf, secondHalf] = [article.sections.slice(0, 2), article.sections.slice(2)];

  return (
    <>
      <Navbar />
      <main>
        <article>
        {/* Intro: photo column + title, meta, lead copy and side photo */}
        <section className="relative mx-auto max-w-[1728px] lg:h-[calc(979*var(--d))]">
          <div className="relative aspect-[616/700] w-full lg:absolute lg:left-0 lg:top-0 lg:aspect-auto lg:h-[calc(979*var(--d))] lg:w-[calc(616*var(--d))]">
            <Image
              src={article.image.src}
              alt={article.image.alt}
              width={1536}
              height={1024}
              priority
              sizes="(min-width: 1024px) 36vw, 100vw"
              className="absolute inset-0 size-full object-cover"
            />
          </div>

          {/* One flowing column, so long titles push the meta and intro down instead of overlapping them. */}
          <div className="px-5 py-10 lg:absolute lg:left-[calc(687*var(--d))] lg:top-[calc(200*var(--d))] lg:w-[calc(960*var(--d))] lg:p-0">
            <h1 className="display text-[clamp(40px,4.4vw,80px)]">
              {article.title}
            </h1>
            <ArticleMeta
              readTime={article.readTime}
              posted={article.posted}
              dateTime={article.published}
              className="mt-6 lg:mt-[calc(40*var(--d))]"
            />
            <Prose
              paragraphs={article.intro}
              className="mt-8 lg:-ml-px lg:mt-[calc(44*var(--d))] lg:w-[calc(543*var(--d))]"
            />
          </div>

          <div className="relative mx-5 mb-10 aspect-[425/411] lg:absolute lg:left-[calc(1303*var(--d))] lg:top-[calc(568*var(--d))] lg:m-0 lg:w-[calc(425*var(--d))]">
            <Image
              src="/images/pages/article-side.png"
              alt=""
              width={800}
              height={549}
              sizes="(min-width: 1024px) 25vw, 90vw"
              className="absolute inset-0 size-full object-cover"
            />
          </div>
        </section>

        <div className="lg:mt-[calc(125*var(--d))]">
          <Band src="/images/pages/article-band-1.png" w={900} h={900} />
        </div>

        {/* Long-form body with pull quote */}
        <section className="mx-auto max-w-[1728px] px-5 pt-12 lg:px-0 lg:pt-[calc(66*var(--d))]">
          <div className="lg:ml-[calc(505*var(--d))] lg:w-[calc(717*var(--d))]">
            <div className="flex flex-col gap-12 lg:gap-[calc(56*var(--d))]">
              {firstHalf.map((sec) => (
                <Section key={sec.heading} section={sec} />
              ))}
            </div>
            <blockquote className="mt-10 font-grotesk text-[clamp(26px,2.31vw,40px)] capitalize leading-[1.075] tracking-[0.0175em] text-accent lg:mt-[calc(66*var(--d))]">
              “{article.quote}”
            </blockquote>
          </div>
        </section>

        {/* Two-up photos */}
        <section className="mx-auto mt-12 grid max-w-[1728px] gap-6 lg:mt-[calc(67*var(--d))] lg:grid-cols-[462fr_1223fr] lg:gap-[calc(43*var(--d))]">
          <div className="relative aspect-[462/534] w-full overflow-hidden">
            <Image
              src="/images/pages/article-body-1.png"
              alt=""
              width={1536}
              height={1024}
              sizes="(min-width: 1024px) 27vw, 100vw"
              className="absolute inset-0 size-full object-cover"
            />
          </div>
          <div className="relative aspect-[1223/534] w-full overflow-hidden">
            <Image
              src="/images/pages/article-body-2.png"
              alt=""
              width={1200}
              height={801}
              sizes="(min-width: 1024px) 71vw, 100vw"
              className="absolute inset-0 size-full object-cover"
            />
          </div>
        </section>

        <section className="mx-auto mt-12 grid max-w-[1728px] gap-8 px-5 lg:mt-[calc(66*var(--d))] lg:grid-cols-[462fr_1223fr] lg:gap-[calc(43*var(--d))] lg:px-0">
          <aside aria-labelledby="takeaways" className="lg:pl-[calc(78*var(--d))] lg:pr-[calc(60*var(--d))] lg:pt-[calc(22*var(--d))]">
            <h2 id="takeaways" className="headline text-[clamp(28px,2.5vw,44px)]">Key takeaways</h2>
            <ul className="copy mt-6 flex flex-col gap-3">
              {article.takeaways.map((t) => (
                <li key={t} className="border-t border-white/15 pt-3">{t}</li>
              ))}
            </ul>
          </aside>
          <div className="flex flex-col gap-12 lg:w-[calc(717*var(--d))] lg:gap-[calc(56*var(--d))]">
            {secondHalf.map((sec) => (
              <Section key={sec.heading} section={sec} />
            ))}
          </div>
        </section>

        <div className="mt-12 lg:mt-[calc(66*var(--d))]">
          <Band src="/images/pages/article-band-2.png" w={1500} h={1000} />
        </div>

        </article>

        {/* More stories */}
        <section
          aria-labelledby="more-stories"
          className="mx-auto mt-16 max-w-[1728px] px-5 lg:mt-[calc(94*var(--d))] lg:px-[calc(71*var(--d))]"
        >
          <h2
            id="more-stories"
            className="display text-[clamp(48px,7vw,128px)]"
          >
            More Hyrox guides
          </h2>
          <div className="mt-6 grid grid-cols-1 border-b border-r border-white/20 md:grid-cols-3 lg:mt-[calc(46*var(--d))]">
            {more.map((a) => (
              <ArticleCard key={a.slug} article={a} ruled />
            ))}
          </div>
        </section>

        <div className="mt-20 lg:mt-[calc(116*var(--d))]">
          <JoinCta />
        </div>
      </main>
      <Footer overlap={176} />
      <JsonLd data={articleLd(article)} />
    </>
  );
}
