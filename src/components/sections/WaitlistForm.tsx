"use client";

import { useId, useState, type FormEvent, type ReactNode } from "react";
import { BoltIcon, CheckIcon, MailIcon, PhoneIcon, UserIcon } from "@/components/ui/LineIcons";
import { DateOfBirthField } from "@/components/ui/DateOfBirthField";

type Status = "idle" | "submitting" | "success" | "error";

type FieldProps = {
  index: string;
  label: string;
  name: string;
  icon: ReactNode;
  type?: string;
  placeholder: string;
  autoComplete?: string;
  required?: boolean;
  filled: boolean;
  onValue: (name: string, filled: boolean) => void;
};

/** One tile of the form: numbered micro-label, icon cell, input. Lights up on focus and when filled. */
function Field({ index, label, name, icon, type = "text", placeholder, autoComplete, required, filled, onValue }: FieldProps) {
  const id = useId();
  return (
    <div>
      <label
        htmlFor={id}
        className={`mb-2 flex items-center gap-2 font-grotesk text-[10px] uppercase tracking-[0.2em] transition-colors ${
          filled ? "text-accent" : "text-[#889fc3]"
        }`}
      >
        <span className="tabular-nums opacity-60">{index}</span>
        {label}
        {required && (
          <span className="text-peach" aria-hidden>
            *
          </span>
        )}
      </label>
      <div
        className={`group flex h-14 items-stretch border bg-white/[0.05] transition-colors duration-300 focus-within:border-accent focus-within:bg-white/[0.09] ${
          filled ? "border-accent/50" : "border-white/20"
        }`}
      >
        <span
          className={`flex w-12 shrink-0 items-center justify-center border-r transition-colors duration-300 group-focus-within:bg-accent/15 group-focus-within:text-accent ${
            filled ? "border-accent/50 bg-accent/10 text-accent" : "border-white/15 text-[#889fc3]"
          }`}
        >
          {icon}
        </span>
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          autoComplete={autoComplete}
          placeholder={placeholder}
          onChange={(e) => onValue(name, e.currentTarget.value.trim().length > 0 && e.currentTarget.validity.valid)}
          className="min-w-0 flex-1 bg-transparent px-4 text-base font-light text-ink placeholder:text-ink/45 focus:outline-none"
        />
      </div>
    </div>
  );
}

export function WaitlistForm({ className = "" }: { className?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [filled, setFilled] = useState<Record<string, boolean>>({});

  const done = Object.values(filled).filter(Boolean).length;
  const onValue = (name: string, ok: boolean) => setFilled((f) => (f[name] === ok ? f : { ...f, [name]: ok }));

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
      <div role="status" className={`flex items-start gap-4 border border-accent/40 bg-accent/10 p-5 ${className}`}>
        <span className="flex size-12 shrink-0 items-center justify-center border border-accent/50 bg-accent/15 text-accent">
          <CheckIcon width={22} height={22} />
        </span>
        <div>
          <p className="text-[22px] leading-tight tracking-[-0.04em] text-ink">You&apos;re on the list.</p>
          <p className="mt-2 text-[15px] leading-[22px] text-muted">
            We&apos;ll email you early access updates as soon as your spot opens.
          </p>
          <p className="mt-4 font-grotesk text-[10px] uppercase tracking-[0.25em] text-accent">Intensity rises here</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={className} aria-describedby="waitlist-status">
      {/* Progress: one segment per field */}
      <div className="mb-5 flex items-center gap-3" aria-hidden>
        <span className="font-grotesk text-[10px] uppercase tracking-[0.2em] text-[#889fc3]">Your details</span>
        <div className="grid flex-1 grid-cols-4 gap-1">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={`h-[3px] transition-colors duration-500 ${i < done ? "bg-accent" : "bg-line"}`} />
          ))}
        </div>
        <span className="font-grotesk text-[10px] tabular-nums tracking-[0.2em] text-[#889fc3]">{done}/4</span>
      </div>

      <div className="grid grid-cols-1 gap-x-4 gap-y-[18px] sm:grid-cols-2">
        <Field index="01" label="Name" name="name" icon={<UserIcon />} placeholder="Your name" autoComplete="name" required filled={!!filled.name} onValue={onValue} />
        <Field index="02" label="Email" name="email" icon={<MailIcon />} type="email" placeholder="you@email.com" autoComplete="email" required filled={!!filled.email} onValue={onValue} />
        <Field index="03" label="Phone" name="phone" icon={<PhoneIcon />} type="tel" placeholder="+91 97…" autoComplete="tel" filled={!!filled.phone} onValue={onValue} />
        <DateOfBirthField onValue={onValue} />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="group relative mt-6 flex h-16 w-full items-center justify-center gap-3 overflow-hidden bg-accent font-grotesk text-[12.691px] font-bold capitalize tracking-[0.1em] text-navy transition-[filter] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-70"
      >
        <span
          className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-[20deg] bg-white/40 opacity-0 blur-md transition-[left,opacity] duration-700 group-hover:left-[110%] group-hover:opacity-100"
          aria-hidden
        />
        <span className="relative">{status === "submitting" ? "Joining…" : "Join Waitlist"}</span>
        <BoltIcon
          width={16}
          height={16}
          className={`relative transition-transform duration-300 group-hover:translate-x-0.5 ${status === "submitting" ? "animate-pulse" : ""}`}
        />
      </button>

      <p id="waitlist-status" role="status" aria-live="polite" className="mt-3 text-center text-sm text-peach empty:hidden">
        {message}
      </p>

      <p className="mt-5 text-center text-sm font-light text-[#f8f8f8]">
        By joining, you agree to our{" "}
        <a href="#terms" className="underline underline-offset-2">
          Terms &amp; Conditions
        </a>
      </p>
      <p className="mt-3 text-center font-grotesk text-[10px] uppercase tracking-[0.3em] text-[#889fc3]">
        Intensity rises here
      </p>
    </form>
  );
}
