"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Svg } from "@/components/ui/Svg";
import { navLinks } from "@/lib/content";

/** Vertical hairline that fades out downwards (Figma "Line 3/4/5/6"). */
function VLine({ name, className }: { name: "vline-fade-a" | "vline-fade-b"; className: string }) {
  return (
    <div className={`pointer-events-none absolute top-[-93px] h-[377px] w-px ${className}`} aria-hidden>
      <Svg
        name={name}
        width={377}
        height={1}
        className="absolute left-1/2 top-1/2 h-px w-[377px] max-w-none -translate-x-1/2 -translate-y-1/2 -rotate-90"
      />
    </div>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => !href.includes("#") && pathname === href;
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="relative h-[88px] lg:h-[191px]">
        {/* Horizontal hairlines (desktop only) */}
        <Svg
          name="line-nav-top"
          width={1728}
          height={1}
          className="pointer-events-none absolute left-0 top-[52px] hidden h-px w-full lg:block"
        />
        <Svg
          name="line-nav-bottom"
          width={1728}
          height={1}
          className="pointer-events-none absolute left-0 top-[140px] hidden h-px w-full lg:block"
        />

        <nav
          aria-label="Primary"
          className="relative mx-auto flex h-full max-w-[1728px] items-center justify-between px-5 lg:px-[53px]"
        >
          {/* Logo cell */}
          <div className="relative flex h-full items-center lg:w-[238px] lg:px-[18px]">
            <VLine name="vline-fade-b" className="left-0 hidden lg:block" />
            <Link href="/" className="flex items-center gap-[7px]" aria-label="HighRocks home">
              <Svg name="logo" width={52.6271} height={52.6271} className="size-[44px] lg:size-[52.627px]" />
              <span className="text-[17px] uppercase tracking-[0.083em] text-white lg:text-[21.051px]">
                Highrocks
              </span>
            </Link>
            <VLine name="vline-fade-a" className="right-0 hidden lg:block" />
          </div>

          {/* Links */}
          <ul className="hidden flex-1 items-center justify-center gap-[clamp(32px,10vw,175px)] lg:flex">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className={`font-grotesk text-[12px] uppercase leading-[18px] tracking-[0.15em] text-white transition-colors hover:text-accent ${
                    isActive(l.href) ? "underline underline-offset-4" : ""
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA cell */}
          <div className="relative hidden h-full items-center lg:flex lg:w-[237px] lg:justify-center">
            <VLine name="vline-fade-b" className="left-0" />
            <Button href="/#waitlist" className="h-[54px] w-[203px]">
              Join Waitlist
            </Button>
            <VLine name="vline-fade-a" className="right-0" />
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="relative z-10 flex size-11 items-center justify-center lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-3 w-6">
              <span
                className={`absolute left-0 h-px w-6 bg-white transition-all ${open ? "top-1.5 rotate-45" : "top-0"}`}
              />
              <span
                className={`absolute left-0 h-px w-6 bg-white transition-all ${open ? "top-1.5 -rotate-45" : "top-3"}`}
              />
            </span>
          </button>
        </nav>

        {/* Mobile menu panel */}
        <div
          id="mobile-menu"
          hidden={!open}
          className="absolute inset-x-0 top-[88px] border-t border-white/20 bg-bg/95 px-5 pb-6 pt-4 backdrop-blur-md lg:hidden"
        >
          <ul className="flex flex-col">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-white/10 py-4 font-grotesk text-[13px] uppercase tracking-[0.15em] text-white"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Button href="/#waitlist" onClick={() => setOpen(false)} className="mt-6 w-full">
            Join Waitlist
          </Button>
        </div>
      </div>
    </header>
  );
}
