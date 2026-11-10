import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // The app has two root layouts (site + Payload admin), so unmatched URLs need app/global-not-found.tsx.
    globalNotFound: true,
  },
  images: {
    // AVIF first (smallest), WebP fallback; one quality level keeps the optimiser cache small.
    formats: ["image/avif", "image/webp"],
    qualities: [75],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Site images in /public plus photos uploaded through the CMS.
    localPatterns: [{ pathname: "/images/**" }, { pathname: "/icons/**" }, { pathname: "/api/media/file/**" }],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

/** Long-lived caching for static assets in /public (file names change when the art does). */
const assetCache = "public, max-age=604800, stale-while-revalidate=2592000";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

nextConfig.headers = async () => [
  { source: "/:path*", headers: securityHeaders },
  { source: "/images/:path*", headers: [{ key: "Cache-Control", value: assetCache }] },
  { source: "/icons/:path*", headers: [{ key: "Cache-Control", value: assetCache }] },
];

export default withPayload(nextConfig, { devBundleServerPackages: false });
