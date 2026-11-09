"use client";

import { useId, useState } from "react";

/**
 * Question card. On phones it is an accordion (tap the question); from `md` up the answer is
 * always visible, exactly as in the desktop design.
 */
export function FaqCard({ q, a, defaultOpen = false }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const panel = useId();
  return (
    <div className="w-full border border-white/20 bg-white/10 shadow-[inset_0_0_12px_rgba(255,255,255,0.04)] transition-colors duration-300 hover:border-accent/50 hover:bg-white/[0.14] md:flex md:flex-col md:gap-6 md:p-6">
      <h3 className="m-0">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panel}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-4 p-5 text-left text-[24px] font-normal capitalize leading-[30px] tracking-[-0.06em] text-accent focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-accent md:pointer-events-none md:p-0 md:text-[clamp(26px,2.08vw,36px)] md:leading-[38px] md:tracking-[-0.067em]"
        >
          {q}
          <span
            className="relative size-5 shrink-0 md:hidden"
            aria-hidden
          >
            <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-accent" />
            <span
              className={`absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-accent transition-transform duration-300 ${open ? "scale-y-0" : ""}`}
            />
          </span>
        </button>
      </h3>
      <div
        id={panel}
        className={`grid transition-[grid-template-rows] duration-300 md:grid-rows-[1fr] ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-[16px] leading-[24px] tracking-[0.044em] text-muted md:p-0 md:text-[clamp(16px,1.05vw,18px)] md:leading-[1.5] md:tracking-[0.01em]">
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}
