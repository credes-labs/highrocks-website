import { ImageResponse } from "next/og";
import { LOGOMARK_PATHS } from "@/lib/logomark";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#101113" }}>
        <svg width="112" height="112" viewBox="0 0 264 263">
          {LOGOMARK_PATHS.map((d) => (
            <path key={d.slice(0, 16)} d={d} fill="#e5e1e4" />
          ))}
        </svg>
      </div>
    ),
    size,
  );
}
