import { d } from "@/lib/design";
import { splitLedger } from "@/lib/content";

const u = d;
const FILL = { "01": 84.98, "02": 70, "03": 81.98, "16": 95 } as const;

/** Large Split Ledger used on the Features page (717 × 706 on the 1728 canvas). */
export function SplitLedgerPanel() {
  return (
    <div
      className="flex flex-col bg-white/10"
      style={{ width: u(717), padding: `${u(38)} ${u(36)}`, gap: u(50.612) }}
      aria-label="Split ledger preview"
    >
      <div className="flex justify-between" style={{ height: u(92.788), borderLeft: `${u(8.435)} solid #ffb598` }}>
        <div style={{ paddingLeft: u(33.74), paddingTop: u(2.11) }}>
          <h3 className="font-grotesk font-bold uppercase text-white" style={{ fontSize: u(50.612), lineHeight: u(50.612) }}>
            {splitLedger.title}
          </h3>
          <p
            className="font-grotesk uppercase"
            style={{ marginTop: u(8.435), color: "#ffdbce", fontSize: u(21.088), lineHeight: u(31.632), letterSpacing: "0.1em" }}
          >
            {splitLedger.segments}
          </p>
        </div>
        <p className="text-right text-white" style={{ fontSize: u(42.176), lineHeight: u(59.047) }}>
          {splitLedger.total}
        </p>
      </div>

      <div className="flex flex-col" style={{ gap: u(2.109) }}>
        {splitLedger.rows.map((row) => {
          const peach = row.bar === "peach";
          return (
            <div
              key={row.n}
              className={`flex items-center justify-between ${row.highlight || row.n === "16" ? "bg-line" : "bg-card"}`}
              style={{ padding: u(33.741) }}
            >
              <div className="flex items-center" style={{ gap: u(33.741) }}>
                <span
                  className="font-grotesk"
                  style={{ width: u(33.741), color: peach ? "#ffb598" : "#b1c8ee", fontSize: u(21.088), lineHeight: u(31.632) }}
                >
                  {row.n}
                </span>
                <span
                  className="font-grotesk uppercase text-white"
                  style={{ fontSize: u(29.524), lineHeight: u(42.176), letterSpacing: "-0.025em" }}
                >
                  {row.label}
                </span>
              </div>
              <div className="flex items-center" style={{ gap: u(50.612) }}>
                <span
                  className="relative block"
                  style={{
                    width: u(134.965),
                    height: u(12.653),
                    backgroundColor: peach ? "rgba(116,56,29,0.3)" : "rgba(177,200,238,0.2)",
                  }}
                  aria-hidden
                >
                  <span
                    className="absolute inset-y-0 left-0"
                    style={{ width: `${FILL[row.n as keyof typeof FILL]}%`, backgroundColor: peach ? "#ffb598" : "#b1c8ee" }}
                  />
                </span>
                <span className="text-white tabular-nums" style={{ width: u(78.322), fontSize: u(29.524), lineHeight: u(42.176) }}>
                  {row.time}
                </span>
              </div>
            </div>
          );
        })}
        <p
          className="text-center font-grotesk uppercase text-muted"
          style={{
            borderTop: `${u(2.109)} solid rgba(53,52,55,0.2)`,
            padding: `${u(35.85)} 0 ${u(33.741)}`,
            fontSize: u(18.979),
            lineHeight: u(28.469),
            letterSpacing: "0.3em",
          }}
        >
          {splitLedger.footer}
        </p>
      </div>
    </div>
  );
}
