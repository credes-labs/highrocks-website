import type { Metadata, Viewport } from "next";
import { Archivo, Courier_Prime, Space_Grotesk } from "next/font/google";
import { SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

// Variable Archivo with the width axis: condensed, heavy display headings + regular body text.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// Nimbus Mono PS (used in the Figma file) is a Courier clone.
const courierPrime = Courier_Prime({
  variable: "--font-courier-prime",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "HighRocks — Hyrox Training App & Pace Calculator",
    template: "%s | HighRocks",
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: "HighRocks — Master the 8 runs. Predict your Hyrox finish.",
    description: SITE_DESCRIPTION,
    url: "/",
    images: [{ url: "/images/hero-bg.png", width: 1536, height: 1024, alt: "Hyrox athletes running on an indoor track" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "HighRocks — Master the 8 runs. Predict your Hyrox finish.",
    description: SITE_DESCRIPTION,
    images: ["/images/hero-bg.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#101113",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${spaceGrotesk.variable} ${courierPrime.variable} antialiased`}
    >
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
