import { raceSim } from "@/lib/content";

/** Race Simulation preview: projected finish, 16-segment effort profile and three headline stats. */
export function RaceSimulation() {
  return (
    <div className="w-full max-w-[317px]" aria-label="Race simulation preview">
      <div className="flex h-[41px] items-start justify-between border-l-[3px] border-accent pl-[16px]">
        <div>
          <h3 className="font-grotesk text-[22px] font-bold uppercase leading-[22px] tracking-[-0.03em] text-white">
            {raceSim.title}
          </h3>
          <p className="mt-1 font-grotesk text-[10px] font-normal uppercase leading-[14px] tracking-[0.06em] text-accent">
            {raceSim.segments}
          </p>
        </div>
        <p className="font-grotesk text-[20px] leading-[26px] text-white">{raceSim.finish}</p>
      </div>

      {/* Effort profile: runs (blue) alternate with stations (peach) */}
      <div className="mt-[22px] bg-card px-[15px] pb-[14px] pt-[16px]">
        <p className="font-grotesk text-[9px] uppercase tracking-[0.2em] text-[#889fc3]">Projected effort</p>
        <ul className="mt-3 flex h-[84px] items-end gap-[3px]" aria-hidden>
          {raceSim.bars.map((h, i) => (
            <li
              key={i}
              className={`flex-1 ${i % 2 === 0 ? "bg-accent" : "bg-peach"} ${i === raceSim.bars.length - 1 ? "shadow-[0_0_10px_rgba(255,181,152,0.45)]" : ""}`}
              style={{ height: `${h}%`, opacity: 0.55 + (i / raceSim.bars.length) * 0.45 }}
            />
          ))}
        </ul>
        <div className="mt-3 flex items-center justify-between font-grotesk text-[9px] uppercase tracking-[0.15em] text-muted">
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 bg-accent" /> Run
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 bg-peach" /> Station
          </span>
          <span>Seg 16</span>
        </div>
      </div>

      <dl className="mt-[1px] grid grid-cols-3 gap-px bg-[rgba(67,71,78,0.2)]">
        {raceSim.stats.map((s) => (
          <div key={s.label} className="bg-card p-[14px]">
            <dt className={`font-grotesk text-[9px] uppercase ${s.accent ? "text-peach" : "text-[#889fc3]"}`}>{s.label}</dt>
            <dd className={`mt-1 text-[16px] leading-[22px] tabular-nums ${s.accent ? "text-peach" : "text-white"}`}>
              {s.value}
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-[16px] text-center font-grotesk text-[9px] uppercase leading-[13px] tracking-[0.25em] text-muted">
        {raceSim.footer}
      </p>
    </div>
  );
}
