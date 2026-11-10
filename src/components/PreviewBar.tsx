"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const inPreview = () => document.cookie.split("; ").includes("hr-preview=1");

/** Small bar shown while an editor is previewing drafts. Costs nothing for normal visitors. */
export function PreviewBar() {
  const on = useSyncExternalStore(subscribe, inPreview, () => false);
  const path = usePathname();
  if (!on) return null;
  return (
    <div className="fixed bottom-4 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-4 rounded-full border border-white/15 bg-[#17191d]/95 px-5 py-2.5 text-[13px] text-ink shadow-lg backdrop-blur">
      <span className="size-2 rounded-full bg-peach" aria-hidden />
      Preview: showing drafts
      <a href={`/preview/exit?path=${encodeURIComponent(path)}`} className="font-medium text-accent underline-offset-4 hover:underline">
        Exit
      </a>
    </div>
  );
}
