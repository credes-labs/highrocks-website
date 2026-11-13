"use client";

import Link from "next/link";
import { useId } from "react";
import { formatSplit, formatTotal, type TeamSize } from "@/lib/pacing/engine";
import { Key, RaceStrip, StationBars, chartColors as C } from "./charts";
import { Segmented, TimeField } from "./PaceTool";
import { usePacePlan } from "./usePacePlan";
import "./pace.css";

/** Compact, live version of the calculator for the Features page. Opens the full tool with the same plan. */
export function PacePreview() {
  const id = useId();
  const { inputs, set, plan, query } = usePacePlan();

  return (
    <section id="pace-calculator" className="pc-preview" aria-labelledby={`${id}-h`}>
      <div className="pc-preview-shell">
        <div className="pc-preview-intro">
          <p className="pc-eyebrow">Pace analytics</p>
          <h2 id={`${id}-h`}>
            Pace <span>Calculator</span>
          </h2>
          <p className="pc-lede">
            Every run. Every station. A plan for your finish. Set a goal and see all 16 splits update as you type.
          </p>
          <form className="pc-preview-form" onSubmit={(e) => e.preventDefault()}>
            <div className="pc-field">
              <div className="pc-field-head">
                <label htmlFor={`${id}-t`}>Target finish</label>
                <span className="pc-hint">h:mm:ss</span>
              </div>
              <TimeField id={`${id}-t`} value={inputs.target} onCommit={(s) => set("target", s)} />
            </div>
            <div className="pc-field">
              <div className="pc-field-head">
                <span>Format</span>
              </div>
              <Segmented<TeamSize>
                label="Format"
                options={[
                  [1, "Solo"],
                  [2, "Doubles"],
                ]}
                value={inputs.teamSize}
                onChange={(v) => set("teamSize", v)}
              />
            </div>
          </form>
          <Link href={`/pace-calculator?${query}`} className="pc-cta">
            Open full analysis <span aria-hidden="true">→</span>
          </Link>
          <p className="pc-small">Answer three quick questions about how you race, calibrate from a past result, see the change against base per station and download the splits.</p>
        </div>

        <div className="pc-preview-board">
          <dl className="pc-kpis pc-kpis-compact" aria-live="polite">
            <div className="pc-kpi-main">
              <dt>Finish</dt>
              <dd>{formatTotal(plan.finalTime)}</dd>
            </div>
            <div>
              <dt>Run pace</dt>
              <dd>
                {formatSplit(plan.runSplit)}
                <small>/km</small>
              </dd>
            </div>
            <div>
              <dt>Stations</dt>
              <dd>{formatSplit(plan.stationTime)}</dd>
            </div>
          </dl>
          <section className="pc-panel">
            <header className="pc-panel-head">
              <h3>Race timeline</h3>
            </header>
            <div className="pc-legend">
              <Key color={C.run} label="Run" />
              <Key color={C.station} label="Station" />
              <Key color={C.rox} label="Transition" />
            </div>
            <RaceStrip plan={plan} compact />
          </section>
          <section className="pc-panel">
            <header className="pc-panel-head">
              <h3>Station budget</h3>
              <p>Run splits {formatSplit(plan.runSplit)} × 8</p>
            </header>
            <StationBars plan={plan} compact />
          </section>
        </div>
      </div>
    </section>
  );
}
