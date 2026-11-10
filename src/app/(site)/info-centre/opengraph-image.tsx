import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Hyrox stories, guides and training advice | HighRocks";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({
    kicker: "HighRocks",
    title: "Hyrox Info Centre",
    subtitle: "Guides, station technique, pacing and training advice.",
    photo: "/images/pages/info-hero.png",
  });
}
