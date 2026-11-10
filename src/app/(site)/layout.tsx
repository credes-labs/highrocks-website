import type { Metadata, Viewport } from "next";
import { Archivo, Courier_Prime, Space_Grotesk } from "next/font/google";
import { SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";
import { ORG_ID, WEBSITE_ID } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
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

const verification = {
  google: process.env.GOOGLE_SITE_VERIFICATION,
  other: process.env.BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION } : undefined,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME}: ${SITE_TAGLINE}`,
    template: "%s | HighRocks",
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "sports",
  alternates: { canonical: "/" },
  formatDetection: { telephone: false, email: false, address: false },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_GB",
    title: "HighRocks: Master the 8 runs. Predict your Hyrox finish.",
    description: SITE_DESCRIPTION,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "HighRocks: Master the 8 runs. Predict your Hyrox finish.",
    description: SITE_DESCRIPTION,
  },
  ...(verification.google || verification.other ? { verification } : {}),
};

/** Organisation and website identity, shared by every page; page graphs point back to these @ids. */
const siteLd = [
  {
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.svg`, width: 512, height: 512 },
    description: SITE_DESCRIPTION,
    knowsAbout: ["Hyrox", "Hyrox training", "Hyrox pacing", "Functional fitness racing", "Endurance training"],
  },
  {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_NAME,
    alternateName: "HighRocks Hyrox Training App",
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "en",
    publisher: { "@id": ORG_ID },
  },
];

export const viewport: Viewport = {
  themeColor: "#101113",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${spaceGrotesk.variable} ${courierPrime.variable} antialiased`}
    >
      <body className="min-h-screen">
        {children}
        <JsonLd data={siteLd} />
      </body>
    </html>
  );
}
