import Image from "next/image";
import { d } from "@/lib/design";
import { polaroids } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";
import { ScrollDial } from "./ScrollDial";

const PHOTOS = {
  run: "/images/polaroid-run.png",
  wallballs: "/images/polaroid-wallballs.png",
  sled: "/images/polaroid-sled.png",
} as const;

type Polaroid = (typeof polaroids)[number];

/**
 * Square photo card with a shared inset and a separate caption row.
 * With `fluid` every size is expressed in design pixels so the card scales with the viewport.
 */
function PolaroidCard({
  photo,
  left,
  right,
  fluid = false,
}: Pick<Polaroid, "photo" | "left" | "right"> & { fluid?: boolean }) {
  const u = (n: number) => (fluid ? d(n) : `${n}px`);
  return (
    <div
      className="flex flex-col border border-white/5 bg-card"
      style={{ width: u(317), height: u(317), padding: u(16), gap: u(14) }}
    >
      <div
        className="relative min-h-0 flex-1 overflow-hidden"
      >
        <Image
          src={PHOTOS[photo]}
          alt=""
          width={1536}
          height={1024}
          sizes="320px"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex items-baseline justify-between whitespace-nowrap text-ink/80" style={{ gap: u(12), fontSize: u(28), lineHeight: 1.15, letterSpacing: "-0.045em" }}>
        <p className="capitalize">{left}</p>
        {right && <p className="font-grotesk text-accent/70" style={{ fontSize: u(22) }}>{right}</p>}
      </div>
    </div>
  );
}

const DIAL = { cx: 857.9, cy: 3716, r: 335 };
const ORIGIN_Y = 3027; // top of this section on the Figma canvas

/** "Train in Full Circle." — dial of 60 ticks surrounded by tilted photo cards. */
export function TrainCircle() {
  return (
    <section id="info-centre" className="relative scroll-mt-24 px-5 py-20 lg:p-0">
      {/* Mobile / tablet: a compact ring with the headline, then a swipeable row of photo cards */}
      <div className="lg:hidden">
        <Reveal>
          <div
            className="relative mx-auto grid place-items-center"
            style={{ "--d": "min(0.5px, calc((100vw - 40px) / 670))", width: d(670), height: d(670) } as React.CSSProperties}
          >
            <ScrollDial cx={335} cy={335} radius={335} />
            <div className="relative z-10 px-6 text-center" style={{ width: d(520) }}>
              <Heading compact />
            </div>
          </div>
        </Reveal>

        <p className="mt-8 flex items-center justify-center gap-2 font-grotesk text-[10px] uppercase tracking-[0.25em] text-[#889fc3]">
          Swipe <span aria-hidden>→</span>
        </p>
        <ul
          className="-mx-5 mt-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-[calc(50vw-114px)] pb-6 pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Training categories"
        >
          {polaroids.map((p) => (
            <li
              key={p.id}
              className="shrink-0 snap-center"
              style={{ "--d": "0.72px" } as React.CSSProperties}
            >
              <PolaroidCard photo={p.photo} left={p.left} right={p.right} fluid />
            </li>
          ))}
        </ul>
      </div>

      {/* Desktop: positioned on the 1728px design canvas */}
      <div
        className="relative mx-auto hidden lg:block"
        style={{ width: d(1728), height: d(4497 - ORIGIN_Y) }}
      >
        <ScrollDial cx={DIAL.cx} cy={DIAL.cy - ORIGIN_Y} radius={DIAL.r} />

        {/* Centre copy */}
        <div
          className="absolute text-center"
          style={{ left: d(651), top: d(3665 - ORIGIN_Y), width: d(413) }}
        >
          <Reveal y={24} duration={1}>
            <Heading />
          </Reveal>
        </div>

        {/* Photo cards */}
        {polaroids.map((p, i) => (
          <div
            key={p.id}
            className="absolute"
            style={{ left: d(p.cx), top: d(p.cy - ORIGIN_Y), width: 0, height: 0 }}
          >
            <div
              className="absolute origin-center"
              style={{ transform: `translate(-50%, -50%) rotate(${p.rotate}deg)` }}
            >
              <Reveal
                x={p.cx < 864 ? "70%" : "-70%"}
                y={p.cy < 3716 ? "45%" : "-45%"}
                scale={0.82}
                duration={1.1}
                delay={(i % 3) * 0.08}
              >
                <PolaroidCard photo={p.photo} left={p.left} right={p.right} fluid />
              </Reveal>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Heading({ compact = false }: { small?: boolean; compact?: boolean }) {
  return (
    <div className="text-center">
      <h2
        className={`font-normal capitalize leading-[1.1] tracking-[-0.046em] text-accent ${
          compact ? "text-[32px]" : "text-[clamp(32px,3.01vw,52px)] leading-[1.154]"
        }`}
      >
        <span className="text-ink">Train in </span>
        {compact && <br />}
        Full Circle.
      </h2>
      <p
        className={`mx-auto mt-3 capitalize tracking-[0.035em] text-muted max-w-[413px] ${
          compact ? "text-[15px] leading-[21px]" : "text-[clamp(16px,1.16vw,20px)] leading-[22.75px]"
        }`}
      >
        From Training to<br />Nutrition &amp; recovery
      </p>
    </div>
  );
}
