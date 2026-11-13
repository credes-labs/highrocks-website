import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Hyrox pace calculator | HighRocks";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({
    kicker: "Free tool",
    title: "Hyrox pace calculator",
    subtitle: "Splits for all 8 runs, 8 stations and the roxzone, calibrated to how you race.",
    photo: "/images/pages/features-hero.webp",
  });
}
