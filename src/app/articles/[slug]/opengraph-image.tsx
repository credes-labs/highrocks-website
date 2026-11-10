import { articles, getArticle } from "@/lib/content";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "HighRocks Hyrox article";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

const KIND = { Guides: "Hyrox guide", Blogs: "Hyrox blog", Articles: "Hyrox article" } as const;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle(slug);
  return ogImage({
    kicker: a ? KIND[a.category] : "Hyrox Info Centre",
    title: a?.title ?? "Hyrox stories and guides",
    photo: a?.image.src,
  });
}
