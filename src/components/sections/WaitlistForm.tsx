"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Honeypot, Turnstile } from "@/components/ui/Turnstile";

type Status = "idle" | "submitting" | "success" | "error";

const field =
  "peer h-[52px] w-full rounded-[10px] border border-white/[0.06] bg-[#17191d] px-4 text-[15px] text-ink placeholder:text-[#6b7280] transition-colors duration-200 hover:border-white/[0.12] focus:border-accent/60 focus:bg-[#1a1d22] focus:outline-none";

/** Early-access form: two fields and a button, nothing else. */
export function WaitlistForm({ className = "" }: { className?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    setStatus("submitting");
    setMessage("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Something went wrong. Please try again.");
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className={`rounded-[10px] border border-white/[0.06] bg-[#17191d] px-5 py-6 ${className}`}>
        <p className="text-[17px] text-ink">You&apos;re on the list.</p>
        <p className="mt-1.5 text-[14px] leading-[22px] text-[#8b93a1]">
          We&apos;ll write to {email || "you"} when your spot opens.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={`relative flex flex-col gap-2.5 ${className}`} aria-describedby="waitlist-status">
      <input type="hidden" name="source" value="home" />
      <Honeypot />
      <label className="sr-only" htmlFor="wl-name">
        Name
      </label>
      <input id="wl-name" name="name" required minLength={2} autoComplete="name" placeholder="Name" className={field} />

      <label className="sr-only" htmlFor="wl-email">
        Email
      </label>
      <div className="relative">
        <input
          id="wl-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`${field} pr-20`}
        />
        <span
          className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[11px] text-[#6b7280] transition-opacity duration-200 ${
            email ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden
        >
          Enter ↵
        </span>
      </div>

      <Turnstile />

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-1 h-[52px] w-full rounded-[10px] bg-accent text-[15px] font-medium text-[#0c1420] transition-[filter,transform] duration-200 hover:brightness-105 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-wait disabled:opacity-70"
      >
        {status === "submitting" ? "Joining…" : "Join waitlist"}
      </button>

      <p id="waitlist-status" role="status" aria-live="polite" className="text-[13px] text-peach empty:hidden">
        {message}
      </p>

      <p className="mt-3 text-[12px] text-[#6b7280]">
        By joining, you agree to our{" "}
        <Link href="/terms" className="text-[#9aa3b2] underline underline-offset-2 hover:text-ink">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-[#9aa3b2] underline underline-offset-2 hover:text-ink">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  );
}
