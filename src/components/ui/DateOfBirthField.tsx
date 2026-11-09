"use client";

import { useId, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { CalendarIcon } from "./LineIcons";
import "./DateOfBirthField.css";

function formDate(date: Date | undefined) {
  if (!date) return "";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function DateOfBirthField({ onValue }: { onValue: (name: string, filled: boolean) => void }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Date>();
  // Resolve today's date when opening, rather than freezing it at build time.
  const [today, setToday] = useState<Date>();

  function select(date: Date | undefined) {
    setSelected(date);
    onValue("dob", !!date);
    setOpen(false);
  }

  return (
    <div>
      <label htmlFor={id} className={`mb-2 flex items-center gap-2 font-grotesk text-[10px] uppercase tracking-[0.2em] ${selected ? "text-accent" : "text-[#889fc3]"}`}>
        <span className="tabular-nums opacity-60">04</span>Date of birth
      </label>
      <input type="hidden" name="dob" value={formDate(selected)} />
      <Popover.Root open={open} onOpenChange={(next) => { if (next) setToday(new Date()); setOpen(next); }}>
        <Popover.Trigger asChild>
          <button
            id={id}
            type="button"
            className={`group flex h-14 w-full items-stretch border bg-white/[0.05] text-left transition-colors hover:bg-white/[0.09] focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent data-[state=open]:border-accent ${selected ? "border-accent/50" : "border-white/20"}`}
          >
            <span className={`flex w-12 shrink-0 items-center justify-center border-r border-white/15 ${selected ? "bg-accent/10 text-accent" : "text-[#889fc3]"}`}><CalendarIcon /></span>
            <span className={`flex min-w-0 flex-1 items-center px-4 text-base font-light ${selected ? "text-ink" : "text-ink/45"}`}>
              {selected ? new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(selected) : "DD / MM / YYYY"}
            </span>
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content align="end" sideOffset={8} collisionPadding={12} className="hr-dob-panel" aria-label="Choose your date of birth">
            <div className="hr-dob-header">
              <div><p className="hr-dob-eyebrow">Your race profile</p><p className="hr-dob-title">Date of birth</p></div>
              <Popover.Close type="button" aria-label="Close calendar" className="hr-dob-close">&times;</Popover.Close>
            </div>
            <p className="hr-dob-hint">Choose your month and year, then a day.</p>
            {today && <DayPicker
              className="hr-dob-calendar"
              mode="single"
              selected={selected}
              onSelect={select}
              defaultMonth={selected ?? new Date(today.getFullYear() - 25, today.getMonth(), 1)}
              startMonth={new Date(1900, 0, 1)}
              endMonth={today}
              disabled={{ after: today }}
              captionLayout="dropdown"
              navLayout="after"
              reverseYears
              autoFocus
              fixedWeeks
              weekStartsOn={1}
              today={today}
            />}
            <div className="hr-dob-footer">
              <span>Optional. Used for your age group.</span>
              {selected && <button type="button" onClick={() => select(undefined)}>Clear</button>}
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
