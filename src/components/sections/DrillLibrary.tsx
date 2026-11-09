import { Svg } from "@/components/ui/Svg";
import { stations as defaultStations, type Station } from "@/lib/content";

/** Drill Library preview: three station cards. */
export function DrillLibrary({ items = defaultStations }: { items?: readonly Station[] }) {
  return (
    <ul className="flex w-full max-w-[326px] flex-col gap-3" aria-label="Drill library preview">
      {items.map((s) => (
        <li
          key={s.id}
          className={`flex h-24 ${s.active ? "border-l-2 border-accent bg-[#201f21] pl-0.5" : "bg-[#151618]"}`}
        >
          <div className="flex w-24 shrink-0 items-center justify-center">
            <Svg
              name={s.icon}
              width={s.w}
              height={s.h}
              className={`${s.id === "skierg" || s.flip ? "-scale-x-100" : ""} ${s.icon === "logo" ? "opacity-30" : ""}`}
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-between p-4">
            <div>
              <h4
                className={`text-[14px] font-semibold uppercase leading-5 tracking-[-0.025em] ${
                  s.active ? "text-ink" : "text-ink/40"
                }`}
              >
                {s.name}
              </h4>
              <p className="mt-1 font-mono text-[9px] uppercase leading-[13.5px] tracking-[0.05em] text-[#71717a]">
                {s.tag}
              </p>
            </div>
            <div className="flex items-end justify-between">
              <p className="font-mono text-[11px] uppercase leading-[16.5px] tracking-[0.1em] text-accent">
                {s.goal}
              </p>
              <p className="font-mono text-[9px] leading-[13.5px] text-[#52525b]">{s.code}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
