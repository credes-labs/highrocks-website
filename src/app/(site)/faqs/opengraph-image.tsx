import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Hyrox FAQs | HighRocks";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({
    kicker: "HighRocks",
    title: "Hyrox FAQs",
    subtitle: "Race format, stations, divisions, finish times and pacing, answered.",
    photo: "/images/pages/drill-skierg.webp",
  });
}
