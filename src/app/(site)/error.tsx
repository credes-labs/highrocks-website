"use client"; // Error boundaries must be Client Components

import { Navbar } from "@/components/sections/Navbar";
import { ErrorView } from "@/components/ErrorView";

/** Shown when a page in the site throws (for example the CMS is unreachable). */
export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  return (
    <>
      <title>Something went wrong | HighRocks</title>
      <meta name="robots" content="noindex" />
      <Navbar />
      <ErrorView error={error} retry={retry} />
    </>
  );
}
