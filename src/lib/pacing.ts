const stationWeights = [230, 150, 210, 270, 250, 120, 270, 410];
const stationNames = ["SkiErg 1 km", "Sled push 50 m", "Sled pull 50 m", "Burpees 80 m", "Row 1 km", "Farmers carry 200 m", "Lunges 100 m", "Wall balls 100"];

export function clock(seconds: number, hours = false) {
  const value = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(value / 60);
  return hours
    ? `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`
    : `${String(minutes).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
}

export function calculatePacing(goalMinutes: number, pace: string) {
  if (!Number.isFinite(goalMinutes) || goalMinutes < 30 || goalMinutes > 240) throw new Error("Choose a finish goal between 30 and 240 minutes.");
  const match = /^(\d{1,2}):([0-5]\d)$/.exec(pace.trim());
  if (!match) throw new Error("Enter your run pace as minutes:seconds, for example 04:05.");
  const run = Number(match[1]) * 60 + Number(match[2]);
  if (run < 120 || run > 900) throw new Error("Choose a run pace between 02:00 and 15:00 per kilometre.");
  const total = Math.round(goalMinutes * 60);
  const running = run * 8;
  const stations = total - running;
  if (stations < 480) throw new Error("Allow at least 8 minutes for stations. Increase your finish goal or choose a faster run pace.");
  const weight = stationWeights.reduce((a, b) => a + b, 0);
  const times = stationWeights.map(w => Math.round(stations * w / weight));
  times[7] += stations - times.reduce((a, b) => a + b, 0);
  const rows = stationNames.flatMap((name, i) => [
    { number: i * 2 + 1, label: "Run 1 km", seconds: run },
    { number: i * 2 + 2, label: name, seconds: times[i] },
  ]);
  return { total, running, stations, rows };
}
