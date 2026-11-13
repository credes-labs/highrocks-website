"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  RANGES,
  STATIONS,
  clampTo,
  computeEngineFactor,
  computeSplits,
  computeStrengthFactor,
  parseTime,
  type PaceConfig,
  type TeamSize,
  type Tier,
} from "@/lib/pacing/engine";

/** How the profile is set: wizard answers, direct sliders, or a past race. */
export type ProfileMode = "wizard" | "tune" | "race";
export type Confidence = "low" | "medium" | "high";

/** A past race used to calibrate the profile (times as typed, e.g. "1:22:00"). */
export type PastRace = { finish: string; run: string; roxzone: string; stations: string[] };

/** Wizard answers and position, kept with the plan so they survive switching tabs. */
export type WizardState = {
  answers: Partial<Record<"running" | "stations" | "format" | "sync", Tier<number>>>;
  step: number;
};

export type PaceInputs = {
  target: number;
  engineFactor: number;
  strengthFactor: number;
  teamSize: TeamSize;
  teamEfficiency: number;
  mode: ProfileMode;
  race: PastRace;
  wizard: WizardState;
};

export const DEFAULT_INPUTS: PaceInputs = {
  target: 75 * 60,
  engineFactor: 1,
  strengthFactor: 1,
  teamSize: 1,
  teamEfficiency: 0.9,
  mode: "wizard",
  race: { finish: "", run: "", roxzone: "", stations: STATIONS.map(() => "") },
  wizard: { answers: {}, step: 0 },
};

export const TARGET_MIN = 40 * 60;
export const TARGET_MAX = 3 * 3600;

const round2 = (v: number) => Math.round(v * 100) / 100;
const num = (v: string | null) => (v == null || v === "" ? NaN : Number(v));

/** Back-calculated factors from a past race (kept inside the model's ranges) + how much to trust them. */
export function calibrate(race: PastRace) {
  const finish = parseTime(race.finish);
  const run = parseTime(race.run);
  if (!(finish > 0) || !(run > 0) || run >= finish) return null;
  const splits = race.stations.map((s) => (s.trim() ? parseTime(s) : NaN)).map((s) => (s > 0 ? s : null));
  const known = splits.filter((s) => s != null).length;
  const rox = race.roxzone.trim() ? parseTime(race.roxzone) : NaN;
  const stationTotal = finish - run - (rox > 0 ? rox : finish * 0.04);
  if (known === 0 && stationTotal <= 0) return null;
  const rawEngine = computeEngineFactor(run, finish);
  const rawStrength = known > 0 ? computeStrengthFactor(splits, finish) : computeStrengthFactor(stationTotal, finish);
  const confidence: Confidence = known === STATIONS.length ? "high" : known > 0 ? "medium" : "low";
  return {
    finish,
    run,
    splits,
    known,
    confidence,
    engineFactor: clampTo("engineFactor", rawEngine),
    strengthFactor: clampTo("strengthFactor", rawStrength),
    clamped: rawEngine !== clampTo("engineFactor", rawEngine) || rawStrength !== clampTo("strengthFactor", rawStrength),
  };
}

/** ?t=4500&ef=0.97&sf=1.04&n=2&te=0.9 → inputs. */
function fromSearch(search: string): Partial<PaceInputs> {
  const q = new URLSearchParams(search);
  const out: Partial<PaceInputs> = {};
  const t = num(q.get("t"));
  if (Number.isFinite(t)) out.target = Math.round(Math.min(TARGET_MAX, Math.max(TARGET_MIN, t)));
  const ef = num(q.get("ef"));
  if (Number.isFinite(ef)) out.engineFactor = clampTo("engineFactor", ef);
  const sf = num(q.get("sf"));
  if (Number.isFinite(sf)) out.strengthFactor = clampTo("strengthFactor", sf);
  if (q.get("n") === "2") out.teamSize = 2;
  const te = num(q.get("te"));
  if (Number.isFinite(te)) out.teamEfficiency = clampTo("teamEfficiency", te);
  // A shared plan already has its profile: open it in the fine-tune view.
  if (q.has("ef") || q.has("sf") || q.has("n")) out.mode = "tune";
  return out;
}

export function planQuery(c: Pick<PaceConfig, "targetTime" | "engineFactor" | "strengthFactor" | "teamSize" | "teamEfficiency">) {
  const q = new URLSearchParams({ t: String(Math.round(c.targetTime)) });
  if (round2(c.engineFactor) !== 1) q.set("ef", String(round2(c.engineFactor)));
  if (round2(c.strengthFactor) !== 1) q.set("sf", String(round2(c.strengthFactor)));
  if (c.teamSize === 2) {
    q.set("n", "2");
    q.set("te", String(round2(c.teamEfficiency)));
  }
  return q.toString();
}

/**
 * Calculator state → engine config → SplitResult, recomputed on every change.
 * With `syncUrl`, the plan is mirrored into the address bar so it can be shared or bookmarked.
 */
export function usePacePlan({ syncUrl = false }: { syncUrl?: boolean } = {}) {
  const [inputs, setInputs] = useState<PaceInputs>(DEFAULT_INPUTS);
  const hydrated = useRef(false);

  useEffect(() => {
    if (!syncUrl) return;
    const restored = fromSearch(window.location.search);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of the URL after hydration
    if (Object.keys(restored).length) setInputs((s) => ({ ...s, ...restored }));
    hydrated.current = true;
  }, [syncUrl]);

  const calibration = useMemo(() => (inputs.mode === "race" ? calibrate(inputs.race) : null), [inputs.mode, inputs.race]);

  const config: PaceConfig = useMemo(
    () => ({
      targetTime: inputs.target,
      engineFactor: calibration?.engineFactor ?? inputs.engineFactor,
      strengthFactor: calibration?.strengthFactor ?? inputs.strengthFactor,
      teamSize: inputs.teamSize,
      teamEfficiency: inputs.teamEfficiency,
    }),
    [inputs.target, inputs.engineFactor, inputs.strengthFactor, inputs.teamSize, inputs.teamEfficiency, calibration],
  );
  const plan = useMemo(() => computeSplits(config), [config]);
  const query = planQuery(config);

  useEffect(() => {
    if (!syncUrl || !hydrated.current) return;
    const id = window.setTimeout(() => window.history.replaceState(null, "", `${window.location.pathname}?${query}`), 250);
    return () => window.clearTimeout(id);
  }, [query, syncUrl]);

  const set = <K extends keyof PaceInputs>(key: K, value: PaceInputs[K]) => setInputs((s) => ({ ...s, [key]: value }));
  const patch = (p: Partial<PaceInputs>) => setInputs((s) => ({ ...s, ...p }));
  const setRace = (p: Partial<PastRace>) => setInputs((s) => ({ ...s, race: { ...s.race, ...p } }));
  const reset = () => setInputs(DEFAULT_INPUTS);

  return { inputs, set, patch, setRace, reset, config, plan, calibration, query };
}

export { RANGES };
