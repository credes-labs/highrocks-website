/**
 * Branded share card (1080 × 1920 PNG) drawn on a canvas from a SplitResult.
 * Layout follows the app's share card: logo top-left, format badge top-right, finish time in accent,
 * run / station summary with percentages, the race graphs, 8 station rows with dotted leaders, watermark.
 */
import { LOGOMARK_PATHS } from "@/lib/logomark";
import { formatGap, formatSplit, formatTotal, type PaceConfig, type SplitResult } from "@/lib/pacing/engine";

export const CARD_W = 1080;
export const CARD_H = 1920;

const COL = {
  bg: "#101113",
  panel: "#141518",
  border: "#2A2A2F",
  line: "#24262b",
  ink: "#e5e1e4",
  soft: "#c4c6ce",
  dim: "#7d8794",
  run: "#b1c8ee",
  station: "#ffb598",
  rox: "#4a515c",
  good: "#9fd8b5",
};

function fontFamily(varName: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return v ? `${v}, ${fallback}` : fallback;
}

export async function renderShareCard(plan: SplitResult, config: PaceConfig, host: string): Promise<HTMLCanvasElement> {
  const sans = fontFamily("--font-archivo", "Arial, sans-serif");
  const grotesk = fontFamily("--font-space-grotesk", "Arial, sans-serif");
  await Promise.all([document.fonts.load(`400 40px ${sans}`), document.fonts.load(`400 40px ${grotesk}`), document.fonts.load(`700 40px ${grotesk}`)]).catch(() => {});

  const canvas = document.createElement("canvas");
  canvas.width = CARD_W;
  canvas.height = CARD_H;
  const ctx = canvas.getContext("2d")!;
  const M = 72; // side margin
  const W = CARD_W - M * 2;

  const text = (s: string, x: number, y: number, font: string, color: string, align: CanvasTextAlign = "left", spacing = 0) => {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.letterSpacing = `${spacing}px`;
    ctx.fillText(s, x, y);
    ctx.letterSpacing = "0px";
  };
  const label = (s: string, x: number, y: number, align: CanvasTextAlign = "left") => text(s.toUpperCase(), x, y, `400 22px ${grotesk}`, COL.dim, align, 4);
  const rule = (y: number) => {
    ctx.fillStyle = COL.line;
    ctx.fillRect(M, y, W, 2);
  };

  // Background + subtle grid + border
  ctx.fillStyle = COL.bg;
  ctx.fillRect(0, 0, CARD_W, CARD_H);
  ctx.fillStyle = "rgba(112,132,157,0.05)";
  for (let x = M; x <= CARD_W - M; x += W / 6) ctx.fillRect(x, 0, 1, CARD_H);
  ctx.strokeStyle = COL.border;
  ctx.lineWidth = 2;
  ctx.strokeRect(24, 24, CARD_W - 48, CARD_H - 48);

  // Header: logomark + wordmark, format badge
  ctx.save();
  ctx.translate(M, 78);
  ctx.scale(64 / 264, 64 / 264);
  ctx.fillStyle = COL.ink;
  for (const d of LOGOMARK_PATHS) ctx.fill(new Path2D(d));
  ctx.restore();
  text("HIGHROCKS", M + 84, 124, `400 36px ${sans}`, COL.ink, "left", 3);
  const badge = config.teamSize === 2 ? `DOUBLES · ${Math.round(config.teamEfficiency * 100)}%` : "SOLO";
  ctx.font = `400 24px ${grotesk}`;
  ctx.letterSpacing = "3px";
  const bw = ctx.measureText(badge).width + 48;
  ctx.letterSpacing = "0px";
  ctx.fillStyle = COL.run;
  ctx.beginPath();
  ctx.roundRect(CARD_W - M - bw, 84, bw, 52, 26);
  ctx.fill();
  text(badge, CARD_W - M - bw / 2, 119, `400 24px ${grotesk}`, COL.bg, "center", 3);

  // Finish
  label("Hyrox race plan · projected finish", M, 270);
  text(formatTotal(plan.finalTime), M - 6, 430, `400 178px ${grotesk}`, COL.run, "left", -6);
  const gapColor = plan.gap > 60 ? COL.station : plan.gap < -60 ? COL.good : COL.soft;
  text(`Target ${formatTotal(plan.targetTime)}`, M, 500, `400 34px ${sans}`, COL.soft);
  ctx.font = `400 34px ${sans}`;
  const tw = ctx.measureText(`Target ${formatTotal(plan.targetTime)}`).width;
  text(`  ${formatGap(plan.gap)}`, M + tw, 500, `400 34px ${grotesk}`, gapColor);

  // Summary stats
  rule(560);
  const stats = [
    ["Runs · 8 km", formatSplit(plan.runTime), `${(plan.runPct * 100).toFixed(1)}%  ·  ${formatSplit(plan.runSplit)}/km`, COL.run],
    ["Stations", formatSplit(plan.stationTime), `${(plan.workPct * 100).toFixed(1)}%`, COL.station],
    ["Transitions", formatSplit(plan.transitionTime), `${(plan.transitionPct * 100).toFixed(1)}%`, COL.dim],
  ] as const;
  stats.forEach(([l, v, sub, c], i) => {
    const x = M + (W / 3) * i;
    ctx.fillStyle = c;
    ctx.fillRect(x, 604, 14, 14);
    label(l, x + 26, 620);
    text(v, x, 690, `400 58px ${grotesk}`, COL.ink);
    text(sub, x, 730, `400 24px ${grotesk}`, COL.dim);
  });
  rule(770);

  // Race timeline
  label("Race timeline", M, 830);
  const total = Math.max(1, plan.finalTime);
  const sx = (t: number) => M + (t / total) * W;
  ctx.fillStyle = COL.rox;
  ctx.fillRect(M, 856, W, 76);
  for (const s of plan.segments) {
    ctx.fillStyle = s.kind === "run" ? COL.run : COL.station;
    ctx.fillRect(sx(s.start) + 1, 856, Math.max(2, sx(s.end) - sx(s.start) - 2), 76);
  }
  const step = total > 5400 ? 1200 : 600;
  for (let t = 0; t <= total; t += step) {
    ctx.fillStyle = COL.line;
    ctx.fillRect(sx(t), 942, 2, 10);
    text(t >= 3600 ? formatTotal(t).replace(/:00$/, "") : `${t / 60}′`, sx(t), 980, `400 20px ${grotesk}`, COL.dim, t === 0 ? "left" : "center");
  }

  // Race clock
  label("Race clock", M, 1050);
  ctx.textAlign = "left";
  const legend = (x: number, color: string, s: string, dashed = false) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.setLineDash(dashed ? [8, 6] : []);
    ctx.beginPath();
    ctx.moveTo(x, 1042);
    ctx.lineTo(x + 30, 1042);
    ctx.stroke();
    ctx.setLineDash([]);
    text(s, x + 40, 1050, `400 22px ${sans}`, COL.dim);
  };
  legend(CARD_W - M - 520, COL.run, "Your plan");
  legend(CARD_W - M - 330, COL.dim, "Even pace to target", true);
  const cy0 = 1080;
  const ch = 236;
  const maxT = Math.max(plan.finalTime, plan.targetTime, 1);
  const X = (i: number) => M + (i / 16) * W;
  const Y = (t: number) => cy0 + ch - (t / maxT) * ch;
  for (let k = 0; k <= 4; k++) {
    ctx.fillStyle = COL.line;
    ctx.fillRect(M, cy0 + (ch / 4) * k, W, 1);
  }
  const ends = [0, ...plan.segments.map((s) => s.end)];
  const ratio = plan.finalTime > 0 ? plan.targetTime / plan.finalTime : 1;
  const path = (scale: number) => {
    ctx.beginPath();
    ends.forEach((t, i) => (i ? ctx.lineTo(X(i), Y(t * scale)) : ctx.moveTo(X(i), Y(t * scale))));
  };
  path(ratio);
  ctx.strokeStyle = COL.dim;
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);
  ctx.stroke();
  ctx.setLineDash([]);
  path(1);
  ctx.strokeStyle = COL.run;
  ctx.lineWidth = 4;
  ctx.stroke();
  ends.slice(1).forEach((t, i) => {
    ctx.fillStyle = plan.segments[i].kind === "run" ? COL.run : COL.station;
    ctx.beginPath();
    ctx.arc(X(i + 1), Y(t), 5, 0, Math.PI * 2);
    ctx.fill();
  });
  text("Start", M, cy0 + ch + 36, `400 20px ${grotesk}`, COL.dim);
  text("Finish", CARD_W - M, cy0 + ch + 36, `400 20px ${grotesk}`, COL.dim, "right");

  // Station splits with dotted leaders and a small bar
  rule(1400);
  label("Station splits", M, 1452);
  label("Target · drill goal", CARD_W - M, 1452, "right");
  const max = Math.max(...plan.stations.map((s) => s.time), 1);
  plan.stations.forEach((s, i) => {
    const y = 1510 + i * 38;
    text(s.name, M, y, `400 26px ${sans}`, COL.soft);
    ctx.font = `400 26px ${sans}`;
    const nameW = ctx.measureText(s.name).width;
    const barX = M + 330;
    ctx.fillStyle = COL.line;
    ctx.fillRect(barX, y - 12, 300, 6);
    ctx.fillStyle = COL.station;
    ctx.fillRect(barX, y - 12, (s.time / max) * 300, 6);
    ctx.fillStyle = COL.line;
    for (let x = M + nameW + 14; x < barX - 14; x += 10) ctx.fillRect(x, y - 8, 3, 2);
    for (let x = barX + 316; x < CARD_W - M - 200; x += 10) ctx.fillRect(x, y - 8, 3, 2);
    text(formatSplit(s.time), CARD_W - M - 96, y, `400 28px ${grotesk}`, COL.ink, "right");
    text(formatSplit(s.drillGoal), CARD_W - M, y, `400 24px ${grotesk}`, COL.dim, "right");
  });

  // Footer
  rule(1810);
  text(
    `Engine ${config.engineFactor.toFixed(2)}  ·  Strength ${config.strengthFactor.toFixed(2)}`,
    M,
    1856,
    `400 22px ${grotesk}`,
    COL.dim,
  );
  text(`${host}/pace-calculator`, CARD_W - M, 1856, `400 22px ${grotesk}`, COL.dim, "right");
  text("@highrocks", CARD_W / 2, 1886, `400 18px ${grotesk}`, "#4d545e", "center", 2);

  return canvas;
}
