/**
 * HighRocks pacing engine.
 *
 * A deterministic weighted allocation: a target race time is split across 8 runs, 8 stations and the
 * transitions using a fixed base split, station difficulty weights and two athlete modifiers.
 *
 *   1. Base allocation: run 58% · work 38% · transitions 4% of T.
 *   2. Normalise station weights: station_i = (w_i / Σw) × work_time.
 *   3. Athlete modifiers: run_time × engine_factor; every station × strength_factor.
 *   4. Format (Doubles only): station_i × 1 / (team_size × team_efficiency).
 *   5. T_final = run + Σ stations + transitions. NOT renormalised back to T.
 *
 * Design rules: no extra inputs, no post-modifier normalisation, no randomness, no cross-fatigue
 * (runs never affect stations). Pure functions only.
 */

export type StationSlug =
  | "skierg"
  | "sled-push"
  | "sled-pull"
  | "burpee-broad-jumps"
  | "rowing"
  | "farmers-carry"
  | "sandbag-lunges"
  | "wall-balls";

export type StationData = {
  slug: StationSlug;
  name: string;
  /** Short label for tight spaces (charts). */
  short: string;
  distance: string;
  /** Relative difficulty weight; higher = larger share of work time. */
  baseWeight: number;
};

/** The 8 stations in race order with their default weights. */
export const STATIONS: readonly StationData[] = [
  { slug: "skierg", name: "SkiErg", short: "SkiErg", distance: "1,000 m", baseWeight: 1.1 },
  { slug: "sled-push", name: "Sled Push", short: "Push", distance: "50 m", baseWeight: 1.2 },
  { slug: "sled-pull", name: "Sled Pull", short: "Pull", distance: "50 m", baseWeight: 1.2 },
  { slug: "burpee-broad-jumps", name: "Burpee Broad Jumps", short: "Burpees", distance: "80 m", baseWeight: 1.3 },
  { slug: "rowing", name: "Rowing", short: "Row", distance: "1,000 m", baseWeight: 1.0 },
  { slug: "farmers-carry", name: "Farmers Carry", short: "Farmers", distance: "200 m", baseWeight: 0.9 },
  { slug: "sandbag-lunges", name: "Sandbag Lunges", short: "Lunges", distance: "100 m", baseWeight: 1.15 },
  { slug: "wall-balls", name: "Wall Balls", short: "Wall balls", distance: "100 reps", baseWeight: 1.3 },
];

export const RUNS = 8;
export const RUN_SHARE = 0.58;
export const WORK_SHARE = 0.38;
export const TRANSITION_SHARE = 0.04;
export const DRILL_GOAL_RATIO = 0.9;

/** Valid ranges for the modifiers. */
export const RANGES = {
  engineFactor: [0.92, 1.08],
  strengthFactor: [0.85, 1.15],
  teamEfficiency: [0.8, 1],
} as const;

export const clampTo = (key: keyof typeof RANGES, v: number) => Math.min(RANGES[key][1], Math.max(RANGES[key][0], v));

export type TeamSize = 1 | 2;

export type PaceConfig = {
  /** Goal finish, seconds. */
  targetTime: number;
  /** Scales run time; below 1.0 = faster runner. */
  engineFactor: number;
  /** Scales every station time; below 1.0 = stronger athlete. */
  strengthFactor: number;
  /** 1 = Solo, 2 = Doubles. */
  teamSize: TeamSize;
  /** Doubles only: how cleanly the pair splits the work (0.80–1.00). */
  teamEfficiency: number;
  /** Optional weight overrides, same order as STATIONS. */
  weights?: readonly number[];
};

export type StationSplit = StationData & {
  /** Normalised weight; sums to 1 across stations. */
  share: number;
  /** Unmodified allocation (normalised weight × work time). */
  baseTime: number;
  /** After athlete and format modifiers. */
  time: number;
  /** time − baseTime: positive = modifiers expanded it. */
  delta: number;
  drillGoal: number;
};

export type Segment =
  | { kind: "run"; index: number; label: string; time: number; start: number; end: number }
  | { kind: "station"; index: number; label: string; time: number; start: number; end: number; station: StationSplit };

export type SplitResult = {
  targetTime: number;
  /** Unmodified run allocation (0.58 × T). */
  runBase: number;
  runTime: number;
  runDelta: number;
  /** One 1 km run. */
  runSplit: number;
  workBase: number;
  stations: StationSplit[];
  stationTime: number;
  transitionTime: number;
  /** One of the 16 roxzone passes. */
  transitionSplit: number;
  finalTime: number;
  /** finalTime − targetTime; positive = slower than target. */
  gap: number;
  /** Shares of T_final. */
  runPct: number;
  workPct: number;
  transitionPct: number;
  /** Race order with start/end; transitions spread evenly between segments. */
  segments: Segment[];
};

const positive = (v: number | undefined, fallback: number) => (v !== undefined && Number.isFinite(v) && v > 0 ? v : fallback);

/** Station multiplier for the race format: 1 for Solo, 1 / (team_size × team_efficiency) for Doubles. */
export function formatModifier({ teamSize, teamEfficiency }: Pick<PaceConfig, "teamSize" | "teamEfficiency">) {
  return teamSize === 2 ? 1 / (2 * positive(teamEfficiency, 0.9)) : 1;
}

export function computeSplits(config: PaceConfig): SplitResult {
  const T = Math.max(0, Number.isFinite(config.targetTime) ? config.targetTime : 0);
  const ef = positive(config.engineFactor, 1);
  const sf = positive(config.strengthFactor, 1);

  // Step 1: base allocation
  const runBase = RUN_SHARE * T;
  const workBase = WORK_SHARE * T;
  const transitionTime = TRANSITION_SHARE * T;

  // Step 2: normalised station weights
  const weights = STATIONS.map((s, i) => positive(config.weights?.[i], s.baseWeight));
  const totalWeight = weights.reduce((a, b) => a + b, 0);

  // Steps 3–4: athlete modifiers, then format
  const runTime = runBase * ef;
  const mod = formatModifier(config);
  const stations: StationSplit[] = STATIONS.map((s, i) => {
    const share = weights[i] / totalWeight;
    const baseTime = share * workBase;
    const time = baseTime * sf * mod;
    return { ...s, baseWeight: weights[i], share, baseTime, time, delta: time - baseTime, drillGoal: time * DRILL_GOAL_RATIO };
  });
  const stationTime = stations.reduce((a, s) => a + s.time, 0);

  // Step 5: final total (not renormalised)
  const finalTime = runTime + stationTime + transitionTime;

  const runSplit = runTime / RUNS;
  const transitionSplit = transitionTime / (RUNS * 2);
  const segments: Segment[] = [];
  let clock = 0;
  stations.forEach((station, i) => {
    clock += transitionSplit;
    segments.push({ kind: "run", index: i * 2 + 1, label: "Run 1 km", time: runSplit, start: clock, end: clock + runSplit });
    clock += runSplit + transitionSplit;
    segments.push({ kind: "station", index: i * 2 + 2, label: `${station.name} ${station.distance}`, time: station.time, start: clock, end: clock + station.time, station });
    clock += station.time;
  });

  const pct = (v: number) => (finalTime > 0 ? v / finalTime : 0);
  return {
    targetTime: T,
    runBase,
    runTime,
    runDelta: runTime - runBase,
    runSplit,
    workBase,
    stations,
    stationTime,
    transitionTime,
    transitionSplit,
    finalTime,
    gap: finalTime - T,
    runPct: pct(runTime),
    workPct: pct(stationTime),
    transitionPct: pct(transitionTime),
    segments,
  };
}

/* ------------------------------------------------------------------------------------------------
 * Onboarding wizard: plain-English answers → engine parameters.
 * ---------------------------------------------------------------------------------------------- */

export type Tier<V> = { id: string; label: string; hint: string; value: V };

export const RUNNING_TIERS: Tier<number>[] = [
  { id: "elite", label: "Elite", hint: "Running is my weapon", value: 0.93 },
  { id: "strong", label: "Strong", hint: "I run well under fatigue", value: 0.97 },
  { id: "average", label: "Average", hint: "Steady, nothing special", value: 1.0 },
  { id: "tough", label: "Tough", hint: "The runs hurt the most", value: 1.05 },
];

export const STATION_TIERS: Tier<number>[] = [
  { id: "specialist", label: "Specialist", hint: "Sleds and wall balls are my thing", value: 0.87 },
  { id: "good", label: "Good", hint: "Strong, few no-reps", value: 0.94 },
  { id: "average", label: "Average", hint: "I get through them", value: 1.0 },
  { id: "grind", label: "Grind", hint: "Stations are where I slow down", value: 1.1 },
];

export const FORMAT_TIERS: Tier<TeamSize>[] = [
  { id: "solo", label: "Solo", hint: "Every rep is mine", value: 1 },
  { id: "doubles", label: "Doubles", hint: "Two of us share the stations", value: 2 },
];

export const SYNC_TIERS: Tier<number>[] = [
  { id: "race-ready", label: "Race-ready", hint: "We've raced together before", value: 0.97 },
  { id: "good", label: "Good", hint: "We train together", value: 0.9 },
  { id: "first-time", label: "First time", hint: "Our first race as a pair", value: 0.82 },
];

/* ------------------------------------------------------------------------------------------------
 * Factor back-calculation from a past race.
 * ---------------------------------------------------------------------------------------------- */

/** engine_factor = actual run time ÷ the model's run time for that finish. */
export function computeEngineFactor(actualRunTime: number, totalTime: number) {
  const model = RUN_SHARE * totalTime;
  return model > 0 ? actualRunTime / model : 1;
}

/**
 * strength_factor = actual station time ÷ the model's station time. Pass all 8 splits, some of them
 * (compared with the model times of those same stations), or just the total as one number.
 */
export function computeStrengthFactor(
  actualStationTimes: readonly (number | null | undefined)[] | number,
  totalTime: number,
  weights: readonly number[] = STATIONS.map((s) => s.baseWeight),
) {
  const modelWork = WORK_SHARE * totalTime;
  if (modelWork <= 0) return 1;
  if (typeof actualStationTimes === "number") return actualStationTimes / modelWork;
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let actual = 0;
  let model = 0;
  actualStationTimes.forEach((t, i) => {
    if (t == null || !Number.isFinite(t) || t <= 0) return;
    actual += t;
    model += (modelWork * weights[i]) / totalWeight;
  });
  return model > 0 ? actual / model : 1;
}

/* ------------------------------------------------------------------------------------------------
 * Time formatting
 * ---------------------------------------------------------------------------------------------- */

/** m:ss, for splits. */
export function formatSplit(seconds: number) {
  const s = Math.max(0, Math.round(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/** h:mm:ss, for finish times. */
export function formatTotal(seconds: number) {
  const s = Math.max(0, Math.round(seconds));
  return `${Math.floor(s / 3600)}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

/** +m:ss / −m:ss. */
export function formatGap(seconds: number) {
  const s = Math.round(seconds);
  if (s === 0) return "±0:00";
  return `${s > 0 ? "+" : "−"}${formatSplit(Math.abs(s))}`;
}

/** "1:15:00", "75:00" or "75" (minutes) → seconds; NaN if invalid. */
export function parseTime(input: string): number {
  const parts = input.trim().split(":");
  if (!parts.length || parts.some((p) => !/^\d{1,3}$/.test(p))) return NaN;
  const n = parts.map(Number);
  if (n.length === 1) return n[0] * 60;
  if (n.length === 2) return n[1] < 60 ? n[0] * 60 + n[1] : NaN;
  if (n.length === 3) return n[1] < 60 && n[2] < 60 ? n[0] * 3600 + n[1] * 60 + n[2] : NaN;
  return NaN;
}
