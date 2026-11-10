import Image from "next/image";
import Link from "next/link";
import { ArticleMeta } from "@/components/ui/ArticleMeta";
import { Button } from "@/components/ui/Button";
import type { Article } from "@/lib/cms-types";

/** Story card: thumbnail, title, meta, excerpt and "Read More". Cards touch to form a ruled grid. */
export function ArticleCard({
  article,
  className = "",
  ruled = false,
}: {
  article: Article;
  className?: string;
  /** Draw only left/top borders so touching cards share one rule (parent adds right/bottom). */
  ruled?: boolean;
}) {
  return (
    <article
      className={`flex flex-col gap-[23px] border-white/20 ${ruled ? "border-l border-t" : "border"} px-[clamp(20px,3vw,52px)] py-[clamp(28px,4.46vw,77px)] ${className}`}
    >
      <Link
        href={`/articles/${article.slug}`}
        className="relative block aspect-[424/233] w-full overflow-hidden"
        aria-label={article.title}
      >
        <Image
          src={article.image.src}
          alt={article.image.alt}
          width={1536}
          height={1024}
          sizes="(min-width: 1024px) 30vw, 90vw"
          className="size-full object-cover"
        />
      </Link>
      <div className="flex flex-col gap-[13px]">
        <h3 className="text-[clamp(22px,1.62vw,28px)] font-normal capitalize leading-[1.2] tracking-[-0.086em] text-accent">
          <Link href={`/articles/${article.slug}`}>{article.title}</Link>
        </h3>
        <ArticleMeta readTime={article.readTime} posted={article.posted} dateTime={article.published} />
        <p className="copy">{article.excerpt}</p>
        <Button href={`/articles/${article.slug}`} className="h-[47px] w-[173px]">
          Read More
        </Button>
      </div>
    </article>
  );
}
