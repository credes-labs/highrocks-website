"use client";

import { useEffect, useId, useState } from "react";
import {
  FORMAT_TIERS,
  RANGES,
  RUNNING_TIERS,
  STATIONS,
  STATION_TIERS,
  SYNC_TIERS,
  computeSplits,
  formatGap,
  formatSplit,
  formatTotal,
  parseTime,
  type SplitResult,
  type TeamSize,
  type Tier,
} from "@/lib/pacing/engine";
import { AllocationBar, ChartFrame, CumulativeChart, DeltaChart, GapBreakdown, Key, RaceStrip, StationBars, chartColors as C } from "./charts";
import { TARGET_MAX, TARGET_MIN, usePacePlan, type PaceInputs, type ProfileMode, type WizardState } from "./usePacePlan";
import { exportData, parseRace, type ImportedRace } from "@/lib/pacing/import";
import { ShareCardDialog } from "./ShareCardDialog";
import "./pace.css";

/** "0.97" → "3% faster runs". */
const factorNote = (v: number, faster: string, slower: string) => {
  const d = Math.round((v - 1) * 100);
  return d === 0 ? "average" : `${Math.abs(d)}% ${d < 0 ? faster : slower}`;
};

const saveFile = (content: string, type: string, name: string) => {
  const url = URL.createObjectURL(new Blob([content], { type }));
  Object.assign(document.createElement("a"), { href: url, download: name }).click();
  URL.revokeObjectURL(url);
};

function advisory(plan: SplitResult, calibrated: boolean) {
  if (plan.gap > 15 * 60) return `Your profile projects ${formatGap(plan.gap)} over this goal. Consider a stepping-stone target first.`;
  if (plan.gap > 60) return `About ${formatGap(plan.gap)} to find. Delta vs base shows where it comes from.`;
  if (plan.gap < -120) return calibrated ? "Your last race already supports this goal. Try a faster target." : "Your profile beats this goal comfortably. Try a faster target.";
  return "Your profile and this goal line up. Race the splits below.";
}

/* ------------------------------------------------------------------------------------------------
 * Inputs
 * ---------------------------------------------------------------------------------------------- */

/** Time field that accepts h:mm:ss / mm:ss / minutes and commits when the value is valid. */
export function TimeField({ id, value, onCommit, min = TARGET_MIN, max = TARGET_MAX }: { id: string; value: number; onCommit: (s: number) => void; min?: number; max?: number }) {
  const [text, setText] = useState(formatTotal(value));
  const [focused, setFocused] = useState(false);
  const [bad, setBad] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reflect outside changes (steppers, sliders, shared URL) while not typing
    if (!focused) setText(formatTotal(value));
  }, [value, focused]);
  const commit = (raw: string) => {
    const s = parseTime(raw);
    const ok = s >= min && s <= max;
    setBad(!ok && raw.trim() !== "");
    if (ok) onCommit(s);
  };
  const step = (d: number) => {
    const next = Math.min(max, Math.max(min, value + d));
    onCommit(next);
    setText(formatTotal(next));
  };
  return (
    <div className="pc-time">
      <button type="button" aria-label="One minute less" onClick={() => step(-60)}>
        −
      </button>
      <input
        id={id}
        inputMode="numeric"
        autoComplete="off"
        spellCheck={false}
        value={text}
        aria-invalid={bad}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          setText(formatTotal(value));
          setBad(false);
        }}
        onChange={(e) => {
          setText(e.target.value);
          commit(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            e.preventDefault();
            step(e.key === "ArrowUp" ? 60 : -60);
          }
        }}
      />
      <button type="button" aria-label="One minute more" onClick={() => step(60)}>
        +
      </button>
    </div>
  );
}

/** Range slider with a matching number field (or a text readout). */
export function Slider({
  id,
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
  numeric,
  ends,
  note,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  display?: string;
  /** Show an editable number field instead of a text readout. */
  numeric?: boolean;
  ends?: [string, string];
  /** Plain-language reading of the value, shown beside the label. */
  note?: string;
}) {
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  return (
    <div className="pc-field">
      <div className="pc-field-head">
        <label htmlFor={id}>
          {label}
          {note && <span className="pc-note-inline">{note}</span>}
        </label>
        {numeric ? (
          <input
            className="pc-num"
            type="number"
            aria-label={`${label} value`}
            min={min}
            max={max}
            step={step}
            value={Number(value.toFixed(2))}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (Number.isFinite(v) && e.target.value !== "") onChange(clamp(v));
            }}
          />
        ) : (
          <output htmlFor={id}>{display}</output>
        )}
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ "--fill": `${((value - min) / (max - min)) * 100}%` } as React.CSSProperties}
      />
      {ends && (
        <div className="pc-ends" aria-hidden="true">
          <span>{ends[0]}</span>
          <span>{ends[1]}</span>
        </div>
      )}
    </div>
  );
}

export function Segmented<T extends string | number>({ label, options, value, onChange }: { label: string; options: [T, string][]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="pc-seg" role="radiogroup" aria-label={label}>
      {options.map(([v, l]) => (
        <button key={String(v)} type="button" role="radio" aria-checked={value === v} onClick={() => onChange(v)}>
          {l}
        </button>
      ))}
    </div>
  );
}

/** Target slider in minutes (the time field above it handles exact seconds). */
const TargetSlider = ({ id, value, onChange }: { id: string; value: number; onChange: (s: number) => void }) => (
  <Slider
    id={id}
    label="Drag to adjust"
    value={Math.round(value / 60)}
    min={TARGET_MIN / 60}
    max={TARGET_MAX / 60}
    step={1}
    onChange={(m) => onChange(m * 60)}
    display={`${Math.round(value / 60)} min`}
  />
);

/* ------------------------------------------------------------------------------------------------
 * Onboarding wizard: plain-English answers → engine parameters, never a raw number.
 * ---------------------------------------------------------------------------------------------- */

type Answers = WizardState["answers"];

function Wizard({
  target,
  onTarget,
  onGenerate,
  state,
  onState,
}: {
  target: number;
  onTarget: (s: number) => void;
  onGenerate: (p: Partial<PaceInputs>) => void;
  state: WizardState;
  onState: (s: WizardState) => void;
}) {
  const id = useId();
  const { answers, step } = state;
  const setStep = (n: number) => onState({ answers, step: n });
  const doubles = answers.format?.value === 2;
  const steps = [
    { key: "running", q: "How are your running legs?", tiers: RUNNING_TIERS },
    { key: "stations", q: "How do you handle stations?", tiers: STATION_TIERS },
    { key: "format", q: "Solo or Doubles?", tiers: FORMAT_TIERS },
    ...(doubles ? [{ key: "sync", q: "How in sync are you?", tiers: SYNC_TIERS }] : []),
  ] as { key: keyof Answers; q: string; tiers: Tier<number>[] }[];
  const total = steps.length;
  const summary = step >= total;

  const params = {
    engineFactor: answers.running?.value ?? 1,
    strengthFactor: answers.stations?.value ?? 1,
    teamSize: (answers.format?.value ?? 1) as TeamSize,
    teamEfficiency: answers.sync?.value ?? 0.9,
  };
  const preview = computeSplits({ targetTime: target, ...params });

  if (summary)
    return (
      <div className="pc-wizard">
        <p className="pc-step">Summary</p>
        <dl className="pc-derived">
          <div>
            <dt>Engine factor</dt>
            <dd>
              {params.engineFactor.toFixed(2)} <span>{answers.running?.label}</span>
            </dd>
          </div>
          <div>
            <dt>Strength factor</dt>
            <dd>
              {params.strengthFactor.toFixed(2)} <span>{answers.stations?.label}</span>
            </dd>
          </div>
          <div>
            <dt>Team</dt>
            <dd>
              {params.teamSize === 2 ? `2 × ${params.teamEfficiency.toFixed(2)}` : "1"} <span>{params.teamSize === 2 ? answers.sync?.label : "Solo"}</span>
            </dd>
          </div>
        </dl>
        <div className="pc-field">
          <div className="pc-field-head">
            <label htmlFor={`${id}-t`}>Target finish</label>
          </div>
          <TimeField id={`${id}-t`} value={target} onCommit={onTarget} />
        </div>
        <TargetSlider id={`${id}-ts`} value={target} onChange={onTarget} />
        <dl className="pc-preview3">
          <div>
            <dt>Runs</dt>
            <dd>{formatSplit(preview.runTime)}</dd>
          </div>
          <div>
            <dt>Stations</dt>
            <dd>{formatSplit(preview.stationTime)}</dd>
          </div>
          <div>
            <dt>Finish</dt>
            <dd>{formatTotal(preview.finalTime)}</dd>
          </div>
        </dl>
        <button type="button" className="pc-primary" onClick={() => onGenerate({ ...params, mode: "tune" })}>
          Generate my plan <span aria-hidden="true">→</span>
        </button>
        <button type="button" className="pc-back" onClick={() => setStep(total - 1)}>
          ← Change answers
        </button>
      </div>
    );

  const current = steps[step];
  const chosen = answers[current.key]?.id;
  return (
    <div className="pc-wizard">
      <p className="pc-step">
        Step {step + 1} of {total}
        <span className="pc-dots" aria-hidden="true">
          {steps.map((s, i) => (
            <i key={s.key} className={i <= step ? "is-on" : undefined} />
          ))}
        </span>
      </p>
      <fieldset className="pc-q">
        <legend>{current.q}</legend>
        <div className="pc-tiers">
          {current.tiers.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-pressed={chosen === t.id}
              onClick={() => {
                const next = { ...answers, [current.key]: t };
                if (current.key === "format" && t.value !== 2) delete next.sync;
                onState({ answers: next, step: step + 1 });
              }}
            >
              <b>{t.label}</b>
              <span>{t.hint}</span>
            </button>
          ))}
        </div>
      </fieldset>
      {step > 0 && (
        <button type="button" className="pc-back" onClick={() => setStep(step - 1)}>
          ← Back
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Page tool
 * ---------------------------------------------------------------------------------------------- */

function csv(plan: SplitResult) {
  const rows = [["#", "Segment", "Split", "Base", "Delta", "Start", "End", "Drill goal"]];
  for (const s of plan.segments) {
    const base = s.kind === "station" ? s.station.baseTime : plan.runBase / 8;
    rows.push([String(s.index), s.label, formatSplit(s.time), formatSplit(base), formatGap(s.time - base), formatTotal(s.start), formatTotal(s.end), s.kind === "station" ? formatSplit(s.station.drillGoal) : ""]);
  }
  rows.push(["", "Transitions (total)", formatSplit(plan.transitionTime), formatSplit(plan.transitionTime), "", "", "", ""]);
  rows.push(["", "Final total", formatTotal(plan.finalTime), formatTotal(plan.targetTime), formatGap(plan.gap), "", "", ""]);
  return rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\r\n");
}

const MODES: [ProfileMode, string][] = [
  ["wizard", "3 questions"],
  ["tune", "Set factors"],
  ["race", "Import a race"],
];

export function PaceTool() {
  const id = useId();
  const { inputs, set, patch, setRace, reset, config, plan, calibration, query } = usePacePlan({ syncUrl: true });
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [imports, setImports] = useState(0);
  const gapClass = plan.gap > 60 ? "is-over" : plan.gap < -60 ? "is-under" : "";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?${query}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked: the address bar already holds the link */
    }
  };
  const stamp = formatTotal(plan.targetTime).replace(/:/g, "-");
  const download = () => saveFile(csv(plan), "text/csv", `highrocks-splits-${stamp}.csv`);
  const downloadData = () =>
    saveFile(
      exportData({
        target: config.targetTime,
        engineFactor: config.engineFactor,
        strengthFactor: config.strengthFactor,
        teamSize: config.teamSize,
        teamEfficiency: config.teamEfficiency,
        race: calibration
          ? { finish: calibration.finish, run: calibration.run, roxzone: parseTime(inputs.race.roxzone) || undefined, stations: calibration.splits }
          : undefined,
      }),
      "application/json",
      `highrocks-plan-${stamp}.json`,
    );

  /** Fills the past-race form (and, for a HighRocks data file, the whole plan). */
  const applyImport = (r: ImportedRace) => {
    const hasRace = r.finish !== undefined && r.run !== undefined;
    setImports((n) => n + 1);
    patch({
      ...(r.plan?.target ? { target: Math.min(TARGET_MAX, Math.max(TARGET_MIN, r.plan.target)) } : {}),
      ...(r.plan?.engineFactor ? { engineFactor: r.plan.engineFactor } : {}),
      ...(r.plan?.strengthFactor ? { strengthFactor: r.plan.strengthFactor } : {}),
      ...(r.plan?.teamSize ? { teamSize: r.plan.teamSize } : {}),
      ...(r.plan?.teamEfficiency ? { teamEfficiency: r.plan.teamEfficiency } : {}),
      mode: hasRace || !r.plan ? "race" : "tune",
      race: {
        finish: r.finish ? formatTotal(r.finish) : "",
        run: r.run ? formatTotal(r.run) : "",
        roxzone: r.roxzone ? formatSplit(r.roxzone) : "",
        stations: r.stations.map((x) => (x ? formatSplit(x) : "")),
      },
    });
  };

  return (
    <div className="pc-tool">
      {/* ---------------- Controls ---------------- */}
      <form className="pc-controls" onSubmit={(e) => e.preventDefault()} aria-label="Pace calculator inputs">
        <fieldset className="pc-group">
          <legend>
            <b>1</b> Your goal
          </legend>
          <div className="pc-field">
            <div className="pc-field-head">
              <label htmlFor={`${id}-target`}>Target finish</label>
              <span className="pc-hint">h:mm:ss</span>
            </div>
            <TimeField id={`${id}-target`} value={inputs.target} onCommit={(s) => set("target", s)} />
          </div>
          <TargetSlider id={`${id}-ts`} value={inputs.target} onChange={(s) => set("target", s)} />
        </fieldset>

        <fieldset className="pc-group">
          <legend>
            <b>2</b> How you race
          </legend>
          <div className="pc-seg" role="tablist" aria-label="How to set your profile">
            {MODES.map(([m, l]) => (
              <button key={m} type="button" role="tab" aria-selected={inputs.mode === m} aria-controls={`${id}-profile`} onClick={() => set("mode", m)}>
                {l}
              </button>
            ))}
          </div>
          <div id={`${id}-profile`} role="tabpanel" className="pc-profile">
            {inputs.mode === "wizard" && <Wizard target={inputs.target} onTarget={(s) => set("target", s)} onGenerate={patch} state={inputs.wizard} onState={(w) => set("wizard", w)} />}
            {inputs.mode === "tune" && (
              <>
                <Slider
                  id={`${id}-ef`}
                  label="Engine factor"
                  numeric
                  value={inputs.engineFactor}
                  min={RANGES.engineFactor[0]}
                  max={RANGES.engineFactor[1]}
                  step={0.01}
                  onChange={(v) => set("engineFactor", v)}
                  note={factorNote(inputs.engineFactor, "faster runs", "slower runs")}
                  ends={["Faster runner", "Slower runner"]}
                />
                <Slider
                  id={`${id}-sf`}
                  label="Strength factor"
                  numeric
                  value={inputs.strengthFactor}
                  min={RANGES.strengthFactor[0]}
                  max={RANGES.strengthFactor[1]}
                  step={0.01}
                  onChange={(v) => set("strengthFactor", v)}
                  note={factorNote(inputs.strengthFactor, "faster stations", "slower stations")}
                  ends={["Stronger on stations", "Slower on stations"]}
                />
                <div className="pc-field">
                  <div className="pc-field-head">
                    <span>Team size</span>
                  </div>
                  <Segmented<TeamSize>
                    label="Team size"
                    options={[
                      [1, "Solo"],
                      [2, "Doubles"],
                    ]}
                    value={inputs.teamSize}
                    onChange={(v) => set("teamSize", v)}
                  />
                </div>
                {inputs.teamSize === 2 && (
                  <Slider
                    id={`${id}-te`}
                    label="Team efficiency"
                    numeric
                    value={inputs.teamEfficiency}
                    min={RANGES.teamEfficiency[0]}
                    max={RANGES.teamEfficiency[1]}
                    step={0.01}
                    onChange={(v) => set("teamEfficiency", v)}
                    note={`stations × ${(1 / (2 * inputs.teamEfficiency)).toFixed(2)}`}
                    ends={["First time together", "Perfect handovers"]}
                  />
                )}
              </>
            )}
            {inputs.mode === "race" && (
              <>
                <RaceImport onImport={applyImport} />
                <RaceInputs key={imports} id={id} race={inputs.race} setRace={setRace} />
                <p className="pc-factors">
                  <span>
                    Engine <b>{config.engineFactor.toFixed(2)}</b>
                  </span>
                  <span>
                    Strength <b>{config.strengthFactor.toFixed(2)}</b>
                  </span>
                  <span className={`pc-conf is-${calibration?.confidence ?? "none"}`}>{calibration ? `${calibration.confidence} confidence` : "enter finish + run time"}</span>
                </p>
                {calibration?.clamped && <p className="pc-small">Kept within the model&apos;s range (engine 0.92–1.08, strength 0.85–1.15).</p>}
              </>
            )}
          </div>
        </fieldset>

        <fieldset className="pc-group">
          <legend>
            <b>3</b> Share your plan
          </legend>
          <button type="button" className="pc-primary" onClick={() => setSharing(true)}>
            Create share card <span aria-hidden="true">PNG</span>
          </button>
          <div className="pc-actions">
            <button type="button" onClick={download} title="Every split as a spreadsheet">
              Splits CSV
            </button>
            <button type="button" onClick={downloadData} title="Your plan and past race, to import on another device">
              Data file
            </button>
            <button type="button" onClick={copyLink}>
              {copied ? "Copied" : "Copy link"}
            </button>
          </div>
          <button type="button" onClick={reset} className="pc-back">
            Start over
          </button>
        </fieldset>
      </form>

      {/* ---------------- Results ---------------- */}
      <div className="pc-results">
        {inputs.mode === "wizard" && (
          <p className="pc-banner">
            <b>Showing an average athlete.</b> Answer the 3 questions on the left, or import a past race, to make this plan yours.
          </p>
        )}
        <dl className="pc-kpis" aria-live="polite">
          <div className="pc-kpi-main">
            <dt>Projected finish</dt>
            <dd>{formatTotal(plan.finalTime)}</dd>
          </div>
          <div>
            <dt>Gap to {formatTotal(plan.targetTime)}</dt>
            <dd className={gapClass}>{formatGap(plan.gap)}</dd>
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
          <div>
            <dt>Format</dt>
            <dd className="pc-kpi-word">{config.teamSize === 2 ? `Doubles · ${Math.round(config.teamEfficiency * 100)}%` : "Solo"}</dd>
          </div>
        </dl>
        <p className="pc-advice">{advisory(plan, Boolean(calibration))}</p>

        <ChartFrame
          title="Race timeline"
          meta={`${formatTotal(plan.finalTime)} · 8 runs · 8 stations · 16 transitions`}
          legend={
            <>
              <Key color={C.run} label="Run 1 km" />
              <Key color={C.station} label="Station" />
              <Key color={C.rox} label="Transition" />
            </>
          }
        >
          <RaceStrip plan={plan} />
        </ChartFrame>

        <div className="pc-grid">
          <ChartFrame
            title="Race clock"
            meta="Elapsed time at the end of each segment"
            legend={
              <>
                <Key color={C.run} label="Your plan" />
                <Key color={C.target} label={`Even pace to ${formatTotal(plan.targetTime)}`} dashed />
              </>
            }
          >
            <CumulativeChart plan={plan} />
          </ChartFrame>
          <div className="pc-stack">
            <ChartFrame title="Share of final time">
              <AllocationBar plan={plan} />
            </ChartFrame>
            <ChartFrame title="Delta vs base" meta="Modifiers against the unmodified allocation">
              <DeltaChart plan={plan} />
            </ChartFrame>
          </div>
        </div>

        <div className="pc-grid">
          <ChartFrame
            title="Station budget"
            meta="Target per station"
            legend={
              <>
                <Key color={C.station} label="Race target" />
                <Key color={C.ink} label="Drill goal (90%)" />
              </>
            }
          >
            <StationBars plan={plan} />
          </ChartFrame>
          {calibration && calibration.known > 0 ? (
            <ChartFrame title="Gap breakdown" meta="Your last race vs this plan, biggest gap first">
              <GapBreakdown plan={plan} splits={calibration.splits} runTime={calibration.run} />
            </ChartFrame>
          ) : (
            <ChartFrame title="Split ledger" meta="All 16 segments">
              <Ledger plan={plan} />
            </ChartFrame>
          )}
        </div>
        {calibration && calibration.known > 0 && (
          <ChartFrame title="Split ledger" meta="All 16 segments">
            <Ledger plan={plan} />
          </ChartFrame>
        )}
      </div>
      {sharing && <ShareCardDialog plan={plan} config={config} onClose={() => setSharing(false)} />}
    </div>
  );
}

/** Import a past race: drop or choose a file, or paste text copied from a results page. */
function RaceImport({ onImport }: { onImport: (r: ImportedRace) => void }) {
  const id = useId();
  const [paste, setPaste] = useState(false);
  const [text, setText] = useState("");
  const [drag, setDrag] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  const run = (content: string, from: string) => {
    const r = parseRace(content);
    if (!r) {
      setStatus({ ok: false, msg: `No race times found in ${from}. Paste the splits table, or fill in the fields below.` });
      return;
    }
    onImport(r);
    setStatus({ ok: true, msg: `Imported ${r.found.join(", ")}.` });
    setPaste(false);
    setText("");
  };
  const readFile = async (file: File | undefined) => {
    if (!file) return;
    if (file.size > 2_000_000) return setStatus({ ok: false, msg: "That file is too large. Use a CSV, text or JSON export." });
    run(await file.text(), file.name);
  };

  return (
    <div className="pc-import">
      <label
        className={`pc-drop${drag ? " is-drag" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          void readFile(e.dataTransfer.files[0]);
        }}
      >
        <input type="file" accept=".csv,.tsv,.txt,.json,text/csv,text/plain,application/json" className="sr-only" onChange={(e) => void readFile(e.target.files?.[0])} />
        <b>Drop a results file</b>
        <span>or click to choose · CSV, text or JSON · HighRocks data files too</span>
      </label>
      <button type="button" className="pc-disclose" aria-expanded={paste} aria-controls={`${id}-paste`} onClick={() => setPaste(!paste)}>
        Paste from the official results page <span aria-hidden="true">{paste ? "−" : "+"}</span>
      </button>
      {paste && (
        <div id={`${id}-paste`} className="pc-paste">
          <ol>
            <li>
              Find your race on{" "}
              <a href="https://results.hyrox.com" target="_blank" rel="noopener noreferrer">
                results.hyrox.com
              </a>
              .
            </li>
            <li>Select the splits table (runs, stations, roxzone, overall time) and copy it.</li>
            <li>Paste it here.</li>
          </ol>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            placeholder={"Running 1   00:04:58\n1000m SkiErg   00:04:31\n…\nOverall Time   01:24:54"}
            aria-label="Pasted race results"
          />
          <button type="button" className="pc-primary" disabled={!text.trim()} onClick={() => run(text, "the pasted text")}>
            Read my splits <span aria-hidden="true">→</span>
          </button>
        </div>
      )}
      {status && (
        <p className={`pc-status ${status.ok ? "is-ok" : "is-bad"}`} role="status">
          {status.msg}
        </p>
      )}
    </div>
  );
}

function RaceInputs({ id, race, setRace }: { id: string; race: PaceInputs["race"]; setRace: (p: Partial<PaceInputs["race"]>) => void }) {
  const [open, setOpen] = useState(race.stations.some((s) => s.trim()));
  const field = (key: "finish" | "run" | "roxzone", label: string, ph: string) => {
    const v = race[key];
    return (
      <label className="pc-mini">
        {label}
        <input value={v} placeholder={ph} inputMode="numeric" aria-invalid={v.trim() !== "" && !(parseTime(v) > 0)} onChange={(e) => setRace({ [key]: e.target.value })} />
      </label>
    );
  };
  return (
    <div className="pc-race">
      <div className="pc-race-row">
        {field("finish", "Finish time", "1:22:00")}
        {field("run", "Total run (8 km)", "38:30")}
        {field("roxzone", "Transitions", "optional")}
      </div>
      <button type="button" className="pc-disclose" aria-expanded={open} aria-controls={`${id}-splits`} onClick={() => setOpen(!open)}>
        {open ? "Hide station splits" : "Add station splits"} <span aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div id={`${id}-splits`} className="pc-race-grid">
          {STATIONS.map((s, i) => (
            <label key={s.slug} className="pc-mini">
              {s.short}
              <input
                value={race.stations[i]}
                placeholder="m:ss"
                inputMode="numeric"
                aria-invalid={race.stations[i].trim() !== "" && !(parseTime(race.stations[i]) > 0)}
                onChange={(e) => setRace({ stations: race.stations.map((x, k) => (k === i ? e.target.value : x)) })}
              />
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

function Ledger({ plan }: { plan: SplitResult }) {
  const runBase = plan.runBase / 8;
  return (
    <div className="pc-ledger">
      <table>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Segment</th>
            <th scope="col">Split</th>
            <th scope="col">Δ base</th>
            <th scope="col">Clock</th>
          </tr>
        </thead>
        <tbody>
          {plan.segments.map((s) => {
            const delta = s.time - (s.kind === "station" ? s.station.baseTime : runBase);
            return (
              <tr key={s.index} className={s.kind === "station" ? "is-station" : undefined}>
                <td>{String(s.index).padStart(2, "0")}</td>
                <th scope="row">
                  {s.label}
                  {s.kind === "station" && <small>drill goal {formatSplit(s.station.drillGoal)}</small>}
                </th>
                <td>{formatSplit(s.time)}</td>
                <td className={delta > 0.5 ? "is-over" : delta < -0.5 ? "is-under" : undefined}>{Math.abs(delta) < 0.5 ? "0:00" : formatGap(delta)}</td>
                <td>{formatTotal(s.end)}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td />
            <th scope="row">Transitions, 16 passes</th>
            <td>{formatSplit(plan.transitionTime)}</td>
            <td>0:00</td>
            <td>{formatTotal(plan.finalTime)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
