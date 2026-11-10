import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Hyrox training articles and guides | HighRocks";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({
    kicker: "HighRocks",
    title: "Hyrox articles and guides",
    subtitle: "Pacing, station technique, running and race-day advice.",
    photo: "/images/pages/category-guides.png",
  });
}
