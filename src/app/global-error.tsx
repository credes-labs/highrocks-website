"use client"; // Error boundaries must be Client Components

import { ErrorView } from "@/components/ErrorView";
import { fontVars } from "@/lib/fonts";
import "./(site)/globals.css";

/** Last-resort error page when the root layout itself fails; it renders its own document. */
export default function GlobalError({ error, retry }: { error: unknown; retry: () => void }) {
  return (
    <html lang="en" className={`${fontVars} antialiased`}>
      <body className="min-h-screen">
        <title>Something went wrong | HighRocks</title>
        <ErrorView error={error} retry={retry} />
      </body>
    </html>
  );
}
