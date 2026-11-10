import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "HighRocks: Hyrox training app and pace calculator";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({
    kicker: "Hyrox training app",
    title: "Master the 8 runs. Predict your Hyrox finish.",
    subtitle: "Pace calculator, station drills and full race simulations.",
  });
}
