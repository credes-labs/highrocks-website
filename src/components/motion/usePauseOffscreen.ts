"use client";

import { useEffect, type RefObject } from "react";

/**
 * Pauses looping animations inside `ref` while it is off screen: SVG SMIL animations via
 * pauseAnimations(), CSS animations via [data-offscreen] (see globals.css). Saves main-thread
 * work on phones, where several always-on loops otherwise keep running below the fold.
 */
export function usePauseOffscreen(ref: RefObject<HTMLElement | null>, margin = "200px") {
  useEffect(() => {
    const root = ref.current;
    if (!root || typeof IntersectionObserver === "undefined") return;
    const svgs = () => Array.from(root.querySelectorAll("svg"));
    const io = new IntersectionObserver(
      ([entry]) => {
        const on = entry.isIntersecting;
        if (on) delete root.dataset.offscreen;
        else root.dataset.offscreen = "";
        for (const svg of svgs()) {
          if (on) svg.unpauseAnimations?.();
          else svg.pauseAnimations?.();
        }
      },
      { rootMargin: margin },
    );
    io.observe(root);
    return () => io.disconnect();
  }, [ref, margin]);
}
