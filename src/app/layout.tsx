import type { Metadata, Viewport } from "next";
import { Archivo, Courier_Prime, Space_Grotesk } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
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
  title: "HighRocks — Master the 8 runs. Predict your finish.",
  description:
    "HighRocks is the Hyrox training companion: pace calculator, drill library and race simulation. Join the waitlist for early access.",
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
