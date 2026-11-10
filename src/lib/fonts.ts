import { Archivo, Courier_Prime, Space_Grotesk } from "next/font/google";

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
  // Only the features page uses it, so do not preload it everywhere.
  preload: false,
});

/** Class names that expose the site fonts as CSS variables; put on <html>. */
export const fontVars = `${archivo.variable} ${spaceGrotesk.variable} ${courierPrime.variable}`;
