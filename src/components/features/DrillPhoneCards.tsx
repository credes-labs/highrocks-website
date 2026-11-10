import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { d } from "@/lib/design";
import { Svg } from "@/components/ui/Svg";

/** All sizes are design pixels scaled with --d, so a card is 410.84 × 740.78 on the 1728 canvas. */
const u = d;

function At({
  x,
  y,
  w,
  h,
  className = "",
  style,
  children,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  return (
    <div
      className={`absolute ${className}`}
      style={{ left: u(x), top: u(y), width: w ? u(w) : undefined, height: h ? u(h) : undefined, ...style }}
    >
      {children}
    </div>
  );
}

function Shell({ bg, children, label }: { bg: string; children: ReactNode; label: string }) {
  return (
    <div
      role="group"
      aria-label={label}
      className="relative overflow-hidden border border-white/20"
      style={{ width: u(410.84), height: u(740.78) }}
    >
      <Image
        src={`/images/pages/${bg}.webp`}
        alt=""
        width={1024}
        height={768}
        sizes="(min-width: 1024px) 24vw, 80vw"
        className="absolute inset-0 size-full object-cover object-bottom"
      />
      <div
        className="absolute border border-white"
        style={{ left: u(62.72), top: u(66.35), width: u(284.5), height: u(609), borderRadius: u(19.09) }}
      />
      {children}
    </div>
  );
}

function Headline({
  station,
  title,
  icon,
  iconW,
  iconH,
  flipIcon = false,
}: {
  station: string;
  title: string;
  icon: string;
  iconW: number;
  iconH: number;
  flipIcon?: boolean;
}) {
  return (
    <At x={82.71} y={87.26} w={242.69}>
      <p
        className="font-grotesk uppercase text-accent"
        style={{ fontSize: u(8.515), lineHeight: u(12.773), letterSpacing: "0.15em" }}
      >
        {station}
      </p>
      <div className="bg-line" style={{ height: u(1.419) }}>
        <div className="h-full bg-accent-deep" style={{ width: u(161.79) }} />
      </div>
      <div className="flex items-start justify-between" style={{ marginTop: u(5.677) }}>
        <p
          className="capitalize text-ink/80"
          style={{ fontSize: u(27.268), lineHeight: u(34.061), letterSpacing: "-0.0625em" }}
        >
          {title}
        </p>
        <Svg
          name={`pages/${icon}`}
          width={iconW}
          height={iconH}
          className={flipIcon ? "-scale-x-100" : undefined}
          style={{ width: u(iconW), height: u(iconH) }}
        />
      </div>
    </At>
  );
}

function Caption({ lines }: { lines: [string, string] }) {
  return (
    <p
      className="absolute capitalize text-[#f1f1f1]"
      style={{
        left: u(74.53),
        top: u(570.27 - 33.631),
        width: u(260.87),
        fontSize: u(29.086),
        lineHeight: u(33.631),
        letterSpacing: "-0.075em",
      }}
    >
      {lines[0]}
      <br />
      {lines[1]}
    </p>
  );
}

function StartDrill() {
  return (
    <button
      type="button"
      className="absolute flex items-center justify-center bg-white font-grotesk font-bold capitalize text-navy transition-[filter] hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      style={{
        left: u(74.45),
        top: u(613.86),
        width: u(261.03),
        height: u(43.99),
        gap: u(8.8),
        fontSize: u(10.265),
        letterSpacing: "0.1em",
      }}
    >
      Start Drill
      <Svg name="pages/start-arrow" width={12} height={15} style={{ width: u(8.8), height: u(11) }} />
    </button>
  );
}

function Chip({
  x,
  y,
  tone,
  icon,
  iconW,
  iconH,
  label,
  value,
}: {
  x: number;
  y: number;
  tone: "violet" | "blue";
  icon: string;
  iconW: number;
  iconH: number;
  label: string;
  value: string;
}) {
  const color = tone === "violet" ? "#d0bdf9" : "#d7e2ff";
  return (
    <At
      x={x}
      y={y}
      w={148.16}
      h={68.27}
      className="bg-white/10"
      style={{
        borderLeft: `${u(3.636)} solid ${color}`,
        padding: `${u(14.543)} ${u(14.543)} ${u(14.543)} ${u(18.179)}`,
      }}
    >
      <p
        className="flex items-center font-grotesk uppercase"
        style={{ gap: u(7.272), color, fontSize: u(9.089), lineHeight: u(13.634) }}
      >
        <Svg name={`pages/${icon}`} width={iconW} height={iconH} style={{ width: u(iconW), height: u(iconH) }} />
        {label}
      </p>
      <p className="font-grotesk text-[#d7e2ff]" style={{ marginTop: u(3.181), fontSize: u(14.543), lineHeight: u(21.815) }}>
        {value}
      </p>
    </At>
  );
}

export function SandbagCard() {
  return (
    <Shell bg="drill-sandbag" label="Drill preview: Sandbag Lunges">
      <Headline station="STATION 4" title="Sandbag Lunges" icon="sandbag-lunges" iconW={36.206} iconH={31.034} />
      <Chip x={78.17} y={430.84} tone="violet" icon="tip-breathing" iconW={10.604} iconH={9.014} label="Breathing" value="2 PULLS/BR" />
      <Chip x={177.24} y={346.31} tone="blue" icon="tip-pacing" iconW={10.605} iconH={8.483} label="Pacing" value="75% SUSTAIN" />
      <Caption lines={["Keep Breathing.", "Keep Pacing."]} />
      <StartDrill />
    </Shell>
  );
}

function Thumb({
  x,
  y,
  w,
  h,
  img,
  label,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  img: string;
  label: string;
}) {
  const pad = w * 0.086;
  return (
    <At x={x} y={y} w={w} h={h} className="bg-white/10" style={{ padding: u(pad) }}>
      <div className="relative aspect-square w-full overflow-hidden border border-white/[0.14] mix-blend-lighten">
        <Image
          src={`/images/pages/${img}.webp`}
          alt=""
          width={1024}
          height={1024}
          sizes="10vw"
          className="size-full object-cover"
        />
      </div>
      <p className="whitespace-pre-wrap font-grotesk text-white" style={{ marginTop: u(6), fontSize: u(7.5), lineHeight: u(11.262) }}>
        {label}
      </p>
    </At>
  );
}

export function SkiErgCard() {
  return (
    <Shell bg="drill-skierg" label="Drill preview: SkiErg">
      <Headline station="STATION 1" title="SkiErg" icon="skierg" iconW={41.051} iconH={36.742} flipIcon />
      <Thumb x={82.71} y={161.79} w={122.38} h={140.21} img="drill-thumb-grip" label="01  GRIP POSITION" />
      <Thumb x={196.33} y={315.4} w={128.74} h={147.78} img="drill-thumb-eye" label="04  EYE LEVEL" />
      <Caption lines={["Correct Form.", "Max Impact."]} />
      <StartDrill />
    </Shell>
  );
}

function Warning({ x, y, title, lines }: { x: number; y: number; title: string; lines: [string, string] }) {
  return (
    <At
      x={x}
      y={y}
      w={237.23}
      h={54.26}
      className="flex"
      style={{ backgroundColor: "rgba(147,0,10,0.1)", gap: u(8.324), padding: u(8.324) }}
    >
      <Svg name="pages/warning" width={22} height={19} style={{ width: u(15.26), height: u(13.18), flexShrink: 0 }} />
      <div className="flex flex-col font-grotesk" style={{ gap: u(2.168) }}>
        <p className="whitespace-nowrap uppercase" style={{ color: "#ffb4ab", fontSize: u(8.324), lineHeight: u(12.486) }}>
          {title}
        </p>
        <p className="whitespace-nowrap" style={{ color: "#c5c6cf", fontSize: u(9.018), lineHeight: u(11.272) }}>
          {lines[0]}
          <br />
          {lines[1]}
        </p>
      </div>
    </At>
  );
}

export function WallBallCard() {
  return (
    <Shell bg="drill-wallball" label="Drill preview: Wall Ball">
      <Headline station="STATION 8" title="Wall Ball" icon="wall-ball" iconW={27.216} iconH={38.249} />
      <Warning
        x={98.17}
        y={315.4}
        title="Arm pulling"
        lines={["Avoid using only arms. Use your body", "weight and core to initiate the drive."]}
      />
      <Warning
        x={77.26}
        y={384.48}
        title="Heel lift"
        lines={["Keep heels connected to the platform until", "the very end of the drive phase."]}
      />
      <Caption lines={["Keep aware.", "Avoid Injury."]} />
      <StartDrill />
    </Shell>
  );
}
