import type { Metadata } from "next";
import { Navbar } from "@/components/sections/Navbar";
import { NotFoundView } from "@/components/NotFoundView";
import { fontVars } from "@/lib/fonts";
import "./(site)/globals.css";

export const metadata: Metadata = {
  title: "Page not found | HighRocks",
  description: "This page isn't on the race map. Head back to HighRocks, the Hyrox training app.",
};

/** 404 for URLs that match no route at all (the app has two root layouts, so it needs its own). */
export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${fontVars} antialiased`}>
      <body className="min-h-screen">
        <Navbar />
        <NotFoundView />
      </body>
    </html>
  );
}
