import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Hyrox pace calculator, drill library and race simulation | HighRocks";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({
    kicker: "HighRocks",
    title: "Hyrox pace calculator",
    subtitle: "Plan all 16 Hyrox splits, train every station, rehearse the race.",
    photo: "/images/pages/features-hero.png",
  });
}
