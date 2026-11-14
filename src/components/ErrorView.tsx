"use client";

import { useEffect } from "react";
import { NotFoundView } from "@/components/NotFoundView";

/** Fallback for unexpected errors (a failed CMS read, a render bug): explains, logs, and offers a retry. */
export function ErrorView({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  const digest = error instanceof Error && "digest" in error ? String((error as { digest?: string }).digest ?? "") : "";
  return (
    <NotFoundView
      eyebrow={digest ? `Error · Ref ${digest}` : "Error · Missed the turn"}
      title={
        <>
          Hit
          <br />
          the wall.
        </>
      }
      body="Something went wrong loading this page. It's on our side, not yours. Try again, or head back to the start line."
      action={
        <button
          type="button"
          onClick={() => retry()}
          className="inline-flex h-[54px] items-center justify-center bg-accent px-8 font-grotesk text-[13px] font-bold uppercase tracking-[0.12em] text-[#0c1420] transition-[filter] hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Try again
        </button>
      }
    />
  );
}
