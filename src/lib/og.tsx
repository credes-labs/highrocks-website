import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { LOGOMARK_PATHS } from "@/lib/logomark";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const MEDIA_PREFIX = "/api/media/file/";

/**
 * Reads a site image as a data URL for an ImageResponse background: either a file in /public
 * or a photo uploaded to the CMS (stored in /media).
 */
async function publicImage(src: string) {
  "use cache";
  const file = src.startsWith(MEDIA_PREFIX)
    ? join(process.cwd(), "media", decodeURIComponent(src.slice(MEDIA_PREFIX.length).split("?")[0]))
    : join(process.cwd(), "public", src);
  const buf = await readFile(file);
  const type = /.jpe?g$/i.test(file) ? "jpeg" : /.webp$/i.test(file) ? "webp" : "png";
  return `data:image/${type};base64,${buf.toString("base64")}`;
}

type OgCard = {
  /** Small label above the title, e.g. "Hyrox guide". */
  kicker: string;
  title: string;
  subtitle?: string;
  /** Path under /public for a darkened photo behind the text. */
  photo?: string;
};

/** Shared branded share card: darkened photo, logo, kicker and title. */
export async function ogImage({ kicker, title, subtitle, photo = "/images/hero-bg.png" }: OgCard) {
  const bg = await publicImage(photo);
  const titleSize = title.length > 60 ? 58 : title.length > 40 ? 68 : 80;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#101113", color: "#f1f1f1" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bg}
          alt=""
          width={1200}
          height={630}
          style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            background: "linear-gradient(90deg, rgba(16,17,19,0.97) 0%, rgba(16,17,19,0.88) 55%, rgba(16,17,19,0.45) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 72px",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <svg width="56" height="56" viewBox="0 0 264 263">
              {LOGOMARK_PATHS.map((d) => (
                <path key={d.slice(0, 16)} d={d} fill="#e5e1e4" />
              ))}
            </svg>
            <span style={{ fontSize: 30, letterSpacing: 6, textTransform: "uppercase" }}>HighRocks</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 900 }}>
            <span style={{ fontSize: 24, letterSpacing: 5, textTransform: "uppercase", color: "#b1c8ee" }}>{kicker}</span>
            <span style={{ marginTop: 18, fontSize: titleSize, lineHeight: 1.05, letterSpacing: -2, fontWeight: 700 }}>{title}</span>
            {subtitle ? <span style={{ marginTop: 22, fontSize: 28, lineHeight: 1.35, color: "#c4c6cc" }}>{subtitle}</span> : null}
          </div>
        </div>
      </div>
    ),
    ogSize,
  );
}

