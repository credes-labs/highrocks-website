/**
 * Past-race import: turns whatever an athlete has into finish / run / roxzone / station times.
 *
 * Accepts:
 *  - Text copied from an official HYROX results page (results.hyrox.com: "Running 1  00:04:58",
 *    "1000m SkiErg  00:04:31", "Roxzone Time  00:07:45", "Overall Time  01:22:00" …), in any order,
 *    tab- or space-separated, with or without the heading rows.
 *  - CSV / TSV exports from results sites and spreadsheets with the same labels.
 *  - HighRocks CSV exports and HighRocks data files (.json), so a plan can move between devices.
 *  - Generic JSON with keys like finish, run, roxzone, skierg, sledPush, … (strings or seconds).
 */

import { STATIONS, formatSplit, formatTotal, type StationSlug } from "./engine";

export type ImportedRace = {
  finish?: number;
  /** Total running time (8 × 1 km). */
  run?: number;
  /** Individual runs when available. */
  runs: (number | undefined)[];
  roxzone?: number;
  stations: (number | undefined)[];
  /** Human summary of what was found. */
  found: string[];
  source: "results" | "highrocks-csv" | "highrocks-json" | "json";
  /** Present when the file was a full HighRocks plan (restores target and profile too). */
  plan?: { target?: number; engineFactor?: number; strengthFactor?: number; teamSize?: 1 | 2; teamEfficiency?: number };
};

const STATION_PATTERNS: [StationSlug, RegExp][] = [
  ["skierg", /ski\s*-?\s*erg/i],
  ["sled-push", /sled\s*push/i],
  ["sled-pull", /sled\s*pull/i],
  ["burpee-broad-jumps", /burpee/i],
  ["rowing", /\brow(ing)?\b/i],
  ["farmers-carry", /farmer/i],
  ["sandbag-lunges", /lunge/i],
  ["wall-balls", /wall\s*ball/i],
];

/** h:mm:ss, mm:ss or m:ss(.d) → seconds. */
function toSeconds(token: string): number | undefined {
  const m = /^(\d{1,2}):(\d{2})(?::(\d{2}))?(?:[.,]\d+)?$/.exec(token.trim());
  if (!m) return undefined;
  const [a, b, c] = [Number(m[1]), Number(m[2]), m[3] === undefined ? undefined : Number(m[3])];
  if (b >= 60 || (c !== undefined && c >= 60)) return undefined;
  return c === undefined ? a * 60 + b : a * 3600 + b * 60 + c;
}

const TIME_RE = /\b\d{1,2}:\d{2}(?::\d{2})?(?:[.,]\d+)?\b/g;

function value(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isFinite(v) && v > 0) return v;
  if (typeof v === "string") return toSeconds(v);
  return undefined;
}

function finalise(r: Omit<ImportedRace, "found">): ImportedRace | null {
  const runsKnown = r.runs.filter((x) => x !== undefined).length;
  if (r.run === undefined && runsKnown === 8) r.run = r.runs.reduce<number>((a, x) => a + (x ?? 0), 0);
  const stationsKnown = r.stations.filter((x) => x !== undefined).length;
  if (r.finish === undefined && r.run !== undefined && stationsKnown === 8 && r.roxzone !== undefined)
    r.finish = r.run + r.roxzone + r.stations.reduce<number>((a, x) => a + (x ?? 0), 0);
  const found: string[] = [];
  if (r.finish !== undefined) found.push(`finish ${formatTotal(r.finish)}`);
  if (r.run !== undefined) found.push(runsKnown === 8 ? `8 runs (${formatSplit(r.run)})` : `run total ${formatSplit(r.run)}`);
  if (stationsKnown) found.push(`${stationsKnown} station${stationsKnown === 1 ? "" : "s"}`);
  if (r.roxzone !== undefined) found.push(`roxzone ${formatSplit(r.roxzone)}`);
  if (!found.length) return null;
  return { ...r, found };
}

/** HighRocks data file (see exportData) or loose JSON. */
function fromJson(text: string): ImportedRace | null {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return null;
  }
  if (!data || typeof data !== "object") return null;
  const o = data as Record<string, unknown>;
  if (o.app === "highrocks" && o.race && typeof o.race === "object") {
    const race = o.race as Record<string, unknown>;
    const stations = Array.isArray(race.stations) ? race.stations.map(value) : STATIONS.map(() => undefined);
    const plan = (o.plan ?? {}) as Record<string, unknown>;
    return finalise({
      source: "highrocks-json",
      finish: value(race.finish),
      run: value(race.run),
      runs: Array(8).fill(undefined),
      roxzone: value(race.roxzone),
      stations,
      plan: {
        target: value(plan.target),
        engineFactor: typeof plan.engineFactor === "number" ? plan.engineFactor : undefined,
        strengthFactor: typeof plan.strengthFactor === "number" ? plan.strengthFactor : undefined,
        teamSize: plan.teamSize === 2 ? 2 : plan.teamSize === 1 ? 1 : undefined,
        teamEfficiency: typeof plan.teamEfficiency === "number" ? plan.teamEfficiency : undefined,
      },
    });
  }
  // Loose JSON: flatten to "key value" lines and reuse the text parser.
  const lines: string[] = [];
  const walk = (v: unknown, key: string) => {
    if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) walk(x, `${key} ${k}`);
    else if (typeof v === "string") lines.push(`${key}\t${v}`);
    else if (typeof v === "number") lines.push(`${key}\t${formatTotal(v)}`);
  };
  walk(o, "");
  const r = fromText(lines.join("\n").replace(/([a-z])([A-Z])/g, "$1 $2"));
  return r && { ...r, source: "json" };
}

/** HighRocks CSV export ("#","Segment","Split",…): reads the Split column, re-imported as a race. */
function fromHighRocksCsv(text: string): ImportedRace | null {
  if (!/^"?#"?,"?Segment"?/m.test(text)) return null;
  const r: Omit<ImportedRace, "found"> = { source: "highrocks-csv", runs: Array(8).fill(undefined), stations: STATIONS.map(() => undefined) };
  let run = 0;
  for (const line of text.split(/\r?\n/).slice(1)) {
    const cells = (line.match(/("([^"]|"")*"|[^,]*)(,|$)/g) ?? []).map((c) => c.replace(/,$/, "").replace(/^"|"$/g, "").replace(/""/g, '"').trim());
    const label = (cells[1] ?? "").toLowerCase();
    const t = toSeconds(cells[2] ?? "");
    if (t === undefined) continue;
    if (/^run\b/.test(label)) r.runs[run++] = t;
    else if (/transition/.test(label)) r.roxzone = t;
    else if (/final|finish/.test(label)) r.finish = t;
    else {
      const station = STATION_PATTERNS.find(([, re]) => re.test(label));
      if (station) r.stations[STATIONS.findIndex((x) => x.slug === station[0])] = t;
    }
  }
  return finalise(r);
}

/** Labelled lines: a label, then the first time on the line (or on the next line, as some pages render). */
function fromText(text: string): ImportedRace | null {
  const rows = text
    .split(/\r?\n/)
    .map((l) => l.replace(/["']/g, " ").trim())
    .filter(Boolean);
  const r: Omit<ImportedRace, "found"> = { source: "results", runs: Array(8).fill(undefined), stations: STATIONS.map(() => undefined) };
  let runCounter = 0;

  for (let i = 0; i < rows.length; i++) {
    const line = rows[i];
    const label = line.replace(TIME_RE, " ").toLowerCase();
    let tokens = line.match(TIME_RE);
    if (!tokens && rows[i + 1] && !/[a-z]{3}/i.test(rows[i + 1].replace(TIME_RE, ""))) tokens = rows[i + 1].match(TIME_RE);
    if (!tokens) continue;
    // Ignore times of day and anything longer than a race. Segment rows can also carry a cumulative
    // time, so segments take the shortest plausible value and totals the longest.
    const times = tokens.map(toSeconds).filter((x): x is number => x !== undefined && x >= 20 && x <= 4 * 3600);
    if (!times.length) continue;
    const isTotal = /\b(overall|total|finish|net time|final|race time)\b/.test(label);
    const t = isTotal ? Math.max(...times) : Math.min(...times);

    if (/\b(best|fastest|avg|average|pace|rank|place)\b/.test(label)) continue;
    if (/rox\s*zone|transition/.test(label)) {
      r.roxzone ??= t;
      continue;
    }
    if (/\b(overall|total time|finish|net time|final|race time)\b/.test(label) || /^\s*total\s*$/.test(label)) {
      r.finish ??= t;
      continue;
    }
    if (/\brun(ning)?\s*total|total\s*run/.test(label)) {
      r.run ??= t;
      continue;
    }
    const station = STATION_PATTERNS.find(([, re]) => re.test(label));
    if (station) {
      const idx = STATIONS.findIndex((s) => s.slug === station[0]);
      r.stations[idx] ??= t;
      continue;
    }
    if (/\brun(ning)?\b/.test(label)) {
      const n = /\brun(?:ning)?\s*(?:lap\s*)?#?(\d)\b(?!\s*(?:km|k\b|,?000))/.exec(label)?.[1];
      const idx = n ? Number(n) - 1 : runCounter;
      if (idx >= 0 && idx < 8 && r.runs[idx] === undefined) r.runs[idx] = t;
      runCounter = Math.min(8, idx + 1);
    }
  }
  return finalise(r);
}

/** Parses pasted text or a file's contents. Returns null when nothing usable was found. */
export function parseRace(text: string): ImportedRace | null {
  const trimmed = text.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) return fromJson(trimmed);
  return fromHighRocksCsv(trimmed) ?? fromText(trimmed);
}

/** HighRocks data file: the plan inputs plus the past race, to move between devices or keep a record. */
export function exportData(input: {
  target: number;
  engineFactor: number;
  strengthFactor: number;
  teamSize: 1 | 2;
  teamEfficiency: number;
  race?: { finish?: number; run?: number; roxzone?: number; stations?: (number | null | undefined)[] };
}) {
  const race = input.race;
  return JSON.stringify(
    {
      app: "highrocks",
      version: 1,
      exportedAt: new Date().toISOString(),
      plan: {
        target: formatTotal(input.target),
        engineFactor: input.engineFactor,
        strengthFactor: input.strengthFactor,
        teamSize: input.teamSize,
        teamEfficiency: input.teamEfficiency,
      },
      race: race
        ? {
            finish: race.finish ? formatTotal(race.finish) : undefined,
            run: race.run ? formatTotal(race.run) : undefined,
            roxzone: race.roxzone ? formatTotal(race.roxzone) : undefined,
            stations: STATIONS.map((_, i) => (race.stations?.[i] ? formatSplit(race.stations[i] as number) : null)),
          }
        : null,
    },
    null,
    2,
  );
}
