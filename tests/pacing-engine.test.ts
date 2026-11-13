/** Pacing engine tests, following the spec's computation steps and design rules. Run with `npm test`. */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  RUNNING_TIERS,
  STATIONS,
  STATION_TIERS,
  SYNC_TIERS,
  computeEngineFactor,
  computeSplits,
  computeStrengthFactor,
  formatGap,
  formatSplit,
  formatTotal,
  parseTime,
  type PaceConfig,
} from "../src/lib/pacing/engine";

const base: PaceConfig = { targetTime: 4500, engineFactor: 1, strengthFactor: 1, teamSize: 1, teamEfficiency: 0.9 };
const close = (a: number, b: number, eps = 1e-9) => assert.ok(Math.abs(a - b) <= eps, `${a} ≉ ${b}`);

test("step 1: base allocation is 58 / 38 / 4", () => {
  const r = computeSplits(base);
  close(r.runTime, 2610);
  close(r.stationTime, 1710);
  close(r.transitionTime, 180);
  close(r.finalTime, 4500);
  close(r.gap, 0);
  close(r.runSplit, 326.25);
});

test("default weights match the spec", () => {
  const w = Object.fromEntries(STATIONS.map((s) => [s.slug, s.baseWeight]));
  assert.deepEqual(w, {
    skierg: 1.1,
    "sled-push": 1.2,
    "sled-pull": 1.2,
    "burpee-broad-jumps": 1.3,
    rowing: 1.0,
    "farmers-carry": 0.9,
    "sandbag-lunges": 1.15,
    "wall-balls": 1.3,
  });
});

test("step 2: station time = normalised weight × work time", () => {
  const r = computeSplits(base);
  const sum = STATIONS.reduce((a, s) => a + s.baseWeight, 0);
  r.stations.forEach((s) => close(s.time, (s.baseWeight / sum) * 1710, 1e-9));
  close(r.stations.reduce((a, s) => a + s.share, 0), 1);
});

test("changing one weight redistributes all stations, total unchanged", () => {
  const before = computeSplits(base);
  const weights = STATIONS.map((s) => s.baseWeight);
  weights[0] *= 2;
  const after = computeSplits({ ...base, weights });
  close(after.stationTime, before.stationTime, 1e-6);
  assert.ok(after.stations[0].time > before.stations[0].time);
  after.stations.slice(1).forEach((s, i) => assert.ok(s.time < before.stations[i + 1].time));
});

test("step 3: engine factor touches runs only", () => {
  const r = computeSplits({ ...base, engineFactor: 1.08 });
  close(r.runTime, 2610 * 1.08, 1e-9);
  close(r.stationTime, 1710, 1e-9);
  close(r.gap, 2610 * 0.08, 1e-6);
});

test("step 3: strength factor touches stations only", () => {
  const r = computeSplits({ ...base, strengthFactor: 0.85 });
  close(r.runTime, 2610);
  close(r.stationTime, 1710 * 0.85, 1e-9);
  assert.ok(r.finalTime < 4500);
});

test("step 4: Doubles at 0.90 → stations ≈ 56% of solo; runs and transitions unchanged", () => {
  const solo = computeSplits(base);
  const duo = computeSplits({ ...base, teamSize: 2, teamEfficiency: 0.9 });
  close(duo.stationTime / solo.stationTime, 1 / 1.8);
  close(duo.runTime, solo.runTime);
  close(duo.transitionTime, solo.transitionTime);
  close(computeSplits({ ...base, teamEfficiency: 0.8 }).stationTime, solo.stationTime);
});

test("step 5: T_final is not renormalised", () => {
  const r = computeSplits({ ...base, engineFactor: 0.97, strengthFactor: 1.1 });
  close(r.finalTime, 2610 * 0.97 + 1710 * 1.1 + 180, 1e-6);
  assert.notEqual(Math.round(r.finalTime), 4500);
});

test("delta vs base per station and for runs", () => {
  const r = computeSplits({ ...base, engineFactor: 1.05, strengthFactor: 0.94 });
  r.stations.forEach((s) => {
    close(s.delta, s.time - s.baseTime);
    assert.ok(s.delta < 0);
  });
  close(r.runDelta, 2610 * 0.05, 1e-6);
});

test("% shares of T_final sum to 1", () => {
  const r = computeSplits({ ...base, engineFactor: 1.04, strengthFactor: 0.9, teamSize: 2, teamEfficiency: 0.82 });
  close(r.runPct + r.workPct + r.transitionPct, 1);
});

test("deterministic: same inputs, same plan", () => {
  assert.deepEqual(computeSplits(base), computeSplits({ ...base }));
});

test("segments run in race order and end at T_final", () => {
  const r = computeSplits(base);
  assert.equal(r.segments.length, 16);
  assert.deepEqual(r.segments.map((s) => s.kind).slice(0, 4), ["run", "station", "run", "station"]);
  close(r.segments.at(-1)!.end, r.finalTime, 1e-6);
});

test("zero target → zeros, no crash", () => {
  const r = computeSplits({ ...base, targetTime: 0 });
  assert.equal(r.finalTime, 0);
  assert.equal(r.runPct, 0);
});

test("drill goals are 90% of station time", () => {
  computeSplits(base).stations.forEach((s) => close(s.drillGoal, s.time * 0.9));
});

test("wizard tiers map to the spec values", () => {
  assert.deepEqual(RUNNING_TIERS.map((t) => t.value), [0.93, 0.97, 1.0, 1.05]);
  assert.deepEqual(STATION_TIERS.map((t) => t.value), [0.87, 0.94, 1.0, 1.1]);
  assert.deepEqual(SYNC_TIERS.map((t) => t.value), [0.97, 0.9, 0.82]);
});

test("back-calculation from a past race", () => {
  const finish = 4920;
  const ef = computeEngineFactor(2780, finish);
  const sf = computeStrengthFactor([270, 190, 240, 300, 270, 130, 250, 300], finish);
  assert.ok(ef >= 0.92 && ef <= 1.08, `ef ${ef}`);
  assert.ok(sf >= 0.85 && sf <= 1.15, `sf ${sf}`);
  const model = computeSplits({ ...base, targetTime: finish });
  close(computeEngineFactor(model.runTime, finish), 1);
  close(computeStrengthFactor(model.stations.map((s) => s.time), finish), 1);
  close(computeStrengthFactor(model.stationTime, finish), 1);
  close(computeStrengthFactor([model.stations[0].time, null, null, null, null, null, null, null], finish), 1);
});

test("formatting and parsing", () => {
  assert.equal(formatSplit(326.25), "5:26");
  assert.equal(formatTotal(4500), "1:15:00");
  assert.equal(formatGap(192), "+3:12");
  assert.equal(formatGap(-65), "−1:05");
  assert.equal(parseTime("1:15:00"), 4500);
  assert.equal(parseTime("75"), 4500);
  assert.ok(Number.isNaN(parseTime("1:75")));
});
