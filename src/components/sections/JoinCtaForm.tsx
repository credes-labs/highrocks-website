"use client";

import { useState, type FormEvent } from "react";
import { Svg } from "@/components/ui/Svg";

type Status = "idle" | "submitting" | "success" | "error";

const label = "font-grotesk text-[16.794px] uppercase leading-[25px] tracking-[0.15em] text-[#f8f8f8]";
const input =
  "h-[54px] w-full bg-[#f8f8f8] pl-[54px] pr-6 font-light text-base text-[#1b1b1d] placeholder:text-[#1b1b1d] focus:outline-2 focus:outline-accent";

function Field({
  name,
  title,
  placeholder,
  type = "text",
  autoComplete,
  required,
}: {
  name: string;
  title: string;
  placeholder: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-[13px]">
      <span className={label}>{title}</span>
      <span className="relative block">
        <input
          name={name}
          type={type}
          required={required}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={input}
        />
        <Svg
          name="pages/search"
          width={17.1922}
          height={17.1922}
          className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2"
        />
      </span>
    </label>
  );
}

export function JoinCtaForm({ className = "" }: { className?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
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
      setMessage("You're on the list. We'll be in touch soon.");
      form.reset();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className={`flex flex-col gap-[35px] ${className}`}>
      <div className="flex flex-col gap-[26px]">
        <Field name="name" title="Your Name" placeholder="Type your name" autoComplete="name" required />
        <Field name="phone" title="Phone Number" placeholder="+91 97..." type="tel" autoComplete="tel" />
        <Field name="email" title="Email" placeholder="xxx@gmail.com" type="email" autoComplete="email" required />

        <div className="flex flex-col gap-2">
          <label htmlFor="birth-year" className={`${label} pb-2 text-[15px] tracking-[0.09em]`}>
            Birth year
          </label>
          <div className="relative flex h-16 items-center bg-[#f8f8f8] px-4">
            <input
              id="birth-year"
              name="birthYear"
              inputMode="numeric"
              pattern="(19|20)[0-9]{2}"
              maxLength={4}
              autoComplete="bday-year"
              placeholder="YYYY"
              className="h-12 w-full bg-transparent px-3 text-2xl font-semibold text-[#1b1b1d] placeholder:text-[#808287] focus:outline-none"
            />
            <Svg name="pages/calendar-year" width={18} height={20} className="shrink-0" />
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#808287]" aria-hidden />
          </div>
          <p className="text-[10px] font-light leading-[15px] text-[#f8f8f8] opacity-60">
            We use this to calculate your competition age bracket.
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="flex h-16 w-full items-center justify-center bg-navy font-grotesk text-[12.691px] font-bold capitalize tracking-[0.1em] text-ink transition-[filter] hover:brightness-125 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60"
      >
        {status === "submitting" ? "Joining…" : "Join Waitlist"}
      </button>

      <p
        role="status"
        aria-live="polite"
        className={`-mt-4 text-center text-sm empty:hidden ${status === "error" ? "text-peach" : "text-accent"}`}
      >
        {message}
      </p>

      <p className="text-center text-sm font-light text-[#f8f8f8]">
        By joining, you agree to our{" "}
        <a href="#terms" className="underline underline-offset-2">
          Terms &amp; Conditions
        </a>
      </p>
      <p className="text-center font-grotesk text-[16.629px] uppercase leading-[25px] tracking-[0.15em] text-[#f8f8f8]">
        We&apos;ll send you early access updates.
      </p>
    </form>
  );
}
