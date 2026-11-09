import Link from "next/link";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { Svg } from "@/components/ui/Svg";
import { articles } from "@/lib/content";

/** "All Stories" — heading, "Blogs" link and a ruled 3 × 2 grid of cards. */
export function AllStories() {
  return (
    <section aria-labelledby="all-stories-heading" className="px-5 lg:px-[calc(71*var(--d))]">
      <div className="flex items-center justify-between gap-6">
        <h2
          id="all-stories-heading"
          className="text-[clamp(40px,3.7vw,64px)] font-normal capitalize leading-[1.06] tracking-[-0.0375em] text-ink"
        >
          All Stories
        </h2>
        <Link
          href="/articles"
          className="flex h-[60px] items-center justify-center gap-3 border border-[#f1f1f1] px-10 font-grotesk text-sm font-bold capitalize tracking-[0.1em] text-[#f1f1f1] transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Blogs
          <Svg name="pages/arrow-right" width={4.01026} height={7.07693} />
        </Link>
      </div>

      <div className="mt-[clamp(24px,3.1vw,53px)] grid grid-cols-1 border-b border-r border-white/20 md:grid-cols-2 lg:grid-cols-3">
        {articles.slice(0, 6).map((a) => (
          <ArticleCard key={a.slug} article={a} ruled />
        ))}
      </div>
    </section>
  );
}
