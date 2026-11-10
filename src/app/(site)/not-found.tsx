import type { Metadata } from "next";
import { Navbar } from "@/components/sections/Navbar";
import { NotFoundView } from "@/components/NotFoundView";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

/** Shown when a page calls notFound(), e.g. an article that is unpublished or removed. */
export default function NotFound() {
  return (
    <>
      <Navbar />
      <NotFoundView />
    </>
  );
}
