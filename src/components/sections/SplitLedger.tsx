import { splitLedger } from "@/lib/content";

/** Pace Calculator preview: 16-segment split table. */
export function SplitLedger() {
  return (
    <div className="w-full max-w-[317px]" aria-label="Split ledger preview">
      <div className="flex h-[41px] items-start justify-between border-l-[3px] border-peach pl-[16px]">
        <div>
          <h3 className="font-grotesk text-[22px] font-bold uppercase leading-[22px] tracking-[-0.03em] text-white">
            {splitLedger.title}
          </h3>
          <p className="mt-1 font-grotesk text-[10px] font-normal uppercase leading-[14px] tracking-[0.06em] text-peach">
            {splitLedger.segments}
          </p>
        </div>
        <p className="font-grotesk text-[20px] leading-[26px] text-white">{splitLedger.total}</p>
      </div>

      <ul className="mt-[22px] flex flex-col gap-[1px]">
        {splitLedger.rows.map((row) => (
          <li
            key={row.n}
            className={`grid h-[48.5px] grid-cols-[30px_1fr_59.67px_56.9px] items-center gap-x-0 pl-[15px] pr-[15px] ${
              row.highlight ? "bg-line" : "bg-card"
            }`}
          >
            <span
              className={`font-grotesk text-[10.5px] leading-[14px] ${
                row.bar === "peach" ? "text-peach" : "text-accent"
              }`}
            >
              {row.n}
            </span>
            <span className="font-sans text-[13px] uppercase leading-[18.6px] tracking-[-0.03em] text-[#e3e3e3]">
              {row.label}
            </span>
            <span className="relative h-[5.6px] w-[59.67px] overflow-hidden bg-white/10" aria-hidden>
              <span
                className={`absolute inset-y-0 left-0 ${row.bar === "peach" ? "bg-peach" : "bg-accent"}`}
                style={{ width: row.n === "02" ? "68%" : row.n === "16" ? "95%" : "85%" }}
              />
            </span>
            <span className="text-right text-[14px] leading-[18.6px] text-[#e3e3e3] tabular-nums">
              {row.time}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-[16px] text-center font-grotesk text-[9px] uppercase leading-[13px] tracking-[0.25em] text-muted">
        {splitLedger.footer}
      </p>
    </div>
  );
}
