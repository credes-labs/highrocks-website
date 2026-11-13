/** Past-race import tests. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { computeSplits, formatGap, formatSplit, formatTotal } from "../src/lib/pacing/engine";
import { exportData, parseRace } from "../src/lib/pacing/import";

const RESULTS_PAGE = `
Workout Splits
Split	Time
Running 1	00:04:58
1000m SkiErg	00:04:31
Running 2	00:05:12
50m Sled Push	00:03:40
Running 3	00:05:20
50m Sled Pull	00:04:44
Running 4	00:05:18
80m Burpee Broad Jump	00:05:02
Running 5	00:05:15
1000m Row	00:04:39
Running 6	00:05:22
200m Farmers Carry	00:02:05
Running 7	00:05:30
100m Sandbag Lunges	00:04:31
Running 8	00:05:40
Wall Balls	00:06:02
Roxzone Time	00:07:45
Run Total	00:42:35
Best Run Lap	00:04:58
Overall Time	01:24:54
`;

test("official results page text", () => {
  const r = parseRace(RESULTS_PAGE)!;
  assert.equal(r.source, "results");
  assert.equal(r.finish, 5094);
  assert.equal(r.run, 2555);
  assert.equal(r.roxzone, 465);
  assert.deepEqual(r.runs, [298, 312, 320, 318, 315, 322, 330, 340]);
  assert.deepEqual(r.stations, [271, 220, 284, 302, 279, 125, 271, 362]);
});

test("rows with a cumulative time and time of day pick the split", () => {
  const r = parseRace("Running 1  10:02:11  00:04:58  00:04:58\nSkiErg  10:06:40  00:09:29  00:04:31\nOverall 01:24:54")!;
  assert.equal(r.runs[0], 298);
  assert.equal(r.stations[0], 271);
  assert.equal(r.finish, 5094);
});

test("label and time on separate lines", () => {
  const r = parseRace("Overall Time\n1:24:54\nRun Total\n42:35")!;
  assert.equal(r.finish, 5094);
  assert.equal(r.run, 2555);
});

test("finish is derived when every part is present", () => {
  const r = parseRace(RESULTS_PAGE.replace(/Overall Time.*\n/, ""))!;
  assert.equal(r.finish, 2555 + 465 + [271, 220, 284, 302, 279, 125, 271, 362].reduce((a, b) => a + b));
});

test("HighRocks CSV round trip", () => {
  const plan = computeSplits({ targetTime: 4500, engineFactor: 1, strengthFactor: 1, teamSize: 1, teamEfficiency: 0.9 });
  const rows = [["#", "Segment", "Split", "Base", "Delta", "Start", "End", "Drill goal"]];
  for (const s of plan.segments) rows.push([String(s.index), s.label, formatSplit(s.time), formatSplit(s.time), formatGap(16), formatTotal(s.start), formatTotal(s.end), ""]);
  rows.push(["", "Transitions (total)", formatSplit(plan.transitionTime), "", "", "", "", ""]);
  rows.push(["", "Final total", formatTotal(plan.finalTime), "", "", "", "", ""]);
  const r = parseRace(rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\r\n"))!;
  assert.equal(r.source, "highrocks-csv");
  assert.equal(r.finish, 4500);
  assert.equal(r.roxzone, 180);
  assert.equal(r.runs.filter(Boolean).length, 8);
  assert.equal(r.stations.filter(Boolean).length, 8);
});

test("HighRocks data file round trip restores the plan", () => {
  const json = exportData({ target: 4500, engineFactor: 0.97, strengthFactor: 1.1, teamSize: 2, teamEfficiency: 0.82, race: { finish: 5094, run: 2555, stations: [271] } });
  const r = parseRace(json)!;
  assert.equal(r.source, "highrocks-json");
  assert.equal(r.finish, 5094);
  assert.equal(r.stations[0], 271);
  assert.deepEqual(r.plan, { target: 4500, engineFactor: 0.97, strengthFactor: 1.1, teamSize: 2, teamEfficiency: 0.82 });
});

test("loose JSON keys", () => {
  const r = parseRace(JSON.stringify({ finishTime: "1:24:54", runTotal: "42:35", splits: { skiErg: "4:31", wallBalls: "6:02" } }))!;
  assert.equal(r.finish, 5094);
  assert.equal(r.run, 2555);
  assert.equal(r.stations[0], 271);
  assert.equal(r.stations[7], 362);
});

test("nothing usable → null", () => {
  assert.equal(parseRace("hello world"), null);
  assert.equal(parseRace(""), null);
});
