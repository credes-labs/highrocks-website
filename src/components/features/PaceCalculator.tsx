"use client";

import { useId, useState, type FormEvent } from "react";
import { calculatePacing, clock } from "@/lib/pacing";
import "./PaceCalculator.css";

export function PaceCalculator() {
  const id = useId();
  const [goal, setGoal] = useState("70");
  const [pace, setPace] = useState("04:05");
  const [plan, setPlan] = useState(() => calculatePacing(70, "04:05"));
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState("");
  const [updated, setUpdated] = useState(false);
  const rows = expanded ? plan.rows : [plan.rows[0], plan.rows[1], plan.rows[2], plan.rows[15]];
  const longest = Math.max(...plan.rows.map(r => r.seconds));

  function calculate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setPlan(calculatePacing(Number(goal), pace));
      setError("");
      setUpdated(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Check your goal and pace.");
    }
  }

  return <section id="pace-calculator" className="pace-analytics" aria-labelledby={`${id}-heading`}>
    <div className="pace-grid" aria-hidden="true" />
    <svg className="pace-arc" viewBox="0 0 1200 900" fill="none" aria-hidden="true"><path d="M20 420 470 100Q670-40 830 180L1170 530 760 850Q580 950 430 730Z" /><path d="M30 425h1150M680 0v900" strokeOpacity=".25" /></svg>
    <div className="pace-shell">
      <header className="pace-section-heading"><svg viewBox="0 0 28 28" aria-hidden="true"><path d="M2 23h6v-6h6v-6h6V5h6M3 4h4v4H3m17 13h4v4h-4" /></svg><span>Pace analytics</span><i /></header>
      <div className="pace-layout">
        <div className="pace-overview">
          <p className="pace-eyebrow"><span />Training overview<i /></p>
          <h2 id={`${id}-heading`}>Pace <span>Calculator</span></h2>
          <p className="pace-intro">Every run. Every station. A plan for your finish.<br />Turn your target time into 16 clear splits.</p>
          <form onSubmit={calculate} className="pace-form" aria-describedby={`${id}-help`}>
            <div className="pace-inputs">
              <label htmlFor={`${id}-goal`}>Goal finish <span>minutes</span><input id={`${id}-goal`} type="number" min="30" max="240" step="1" required value={goal} onChange={e=>setGoal(e.target.value)} /></label>
              <label htmlFor={`${id}-run`}>Run pace <span>/ km</span><input id={`${id}-run`} type="text" inputMode="text" maxLength={5} required placeholder="04:05" value={pace} onChange={e=>setPace(e.target.value)} aria-invalid={!!error} /></label>
              <button type="submit">Calculate <span aria-hidden="true">&#8599;</span></button>
            </div>
            <p id={`${id}-help`} className="pace-help">8 km running + 8 stations. Station budgets include transitions.</p>
            <p className="pace-error" role="alert">{error}</p>
          </form>
          <dl className="pace-summary">
            <div><dt>Total run / 8 km</dt><dd>{clock(plan.running)}</dd></div>
            <div><dt>Stations</dt><dd>{clock(plan.stations)}</dd></div>
            <div><dt>Finish target</dt><dd>{clock(plan.total, true)}</dd></div>
          </dl>
          <p className="pace-status" role="status">{updated ? `Plan updated. Target finish ${clock(plan.total, true)}.` : "Illustrative pacing plan. Adjust to your own station performance."}</p>
        </div>
        <div className="pace-ledger-frame">
          <div className="pace-ledger">
            <header className="pace-ledger-heading"><div><h3>Split ledger</h3><p>/ 16 segments</p></div><span>{clock(plan.total, true)}</span></header>
            <table id={`${id}-ledger`} className="pace-table"><caption className="sr-only">{expanded ? "All 16 target splits" : "Preview of target splits 1, 2, 3 and 16"}</caption><colgroup><col /><col /><col /><col /></colgroup><thead className="sr-only"><tr><th scope="col">Split</th><th scope="col">Segment</th><th scope="col">Relative duration</th><th scope="col">Target time</th></tr></thead><tbody>
              {rows.map(row=><tr key={row.number}><td>{String(row.number).padStart(2, "0")}</td><th scope="row">{row.label}</th><td><span className="pace-bar" aria-hidden="true"><span style={{width:`${row.seconds / longest * 100}%`}} /></span></td><td>{clock(row.seconds)}</td></tr>)}
            </tbody></table>
            <button className="pace-expand" type="button" aria-expanded={expanded} aria-controls={`${id}-ledger`} onClick={()=>setExpanded(!expanded)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3v18h18M7 17v-6h3v6m3 0V6h3v11m3 0v-9h3v9" /></svg><span>{expanded ? "Show split preview" : "View all 16 splits in ledger"}</span><span aria-hidden="true">{expanded ? "\u2191" : "\u2192"}</span></button>
          </div>
        </div>
      </div>
      <footer className="pace-section-footer"><span>Analyse / Improve / Perform</span><i /><span>Higher. Stronger. Longer.</span></footer>
    </div>
  </section>;
}
