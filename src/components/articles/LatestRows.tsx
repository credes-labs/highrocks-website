import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { d } from "@/lib/design";

const rows = [
  { photo: "/images/polaroid-run.png", w: 1536, h: 1024, photoSide: "right", pos: "50% 28%" },
  { photo: "/images/pages/latest-cycling.png", w: 1536, h: 1024, photoSide: "left", pos: "50% 72%" },
  { photo: "/images/pages/latest-rowing.png", w: 1448, h: 1086, photoSide: "right", pos: "50% 60%" },
] as const;

const TITLE = "Walking, Jogging or Running? Which one improves your endurance faster.";

function TextPanel({ flip }: { flip: boolean }) {
  return (
    <div className="relative flex h-full w-full flex-col justify-center overflow-hidden px-5 py-12 lg:px-[calc(71*var(--d))] lg:py-0">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.69]"
        style={{
          backgroundImage: `radial-gradient(${d(405)} ${d(405)} at ${flip ? "-9.7%" : "109.7%"} 50%, #1e3654 0%, #172434 50%, #141a23 75%, #101113 100%)`,
        }}
        aria-hidden
      />
      <div className="relative flex max-w-[494px] flex-col gap-[clamp(32px,4.75vw,82px)]">
        <h3 className="text-[clamp(30px,2.31vw,40px)] font-normal capitalize leading-[1.35] tracking-[-0.06em] text-ink">
          {TITLE}
        </h3>
        <Button href="/articles/why-gen-z-is-obsessed-with-hyrox-1" className="h-[54px] w-[203px]">
          Read More
        </Button>
      </div>
    </div>
  );
}

/** "Latest" — three full-bleed rows alternating photo / text (design canvas 1728 wide). */
export function LatestRows() {
  return (
    <section aria-labelledby="latest-heading">
      <h2
        id="latest-heading"
        className="px-5 text-[clamp(40px,3.7vw,64px)] font-normal capitalize leading-[1.06] tracking-[-0.0375em] text-ink lg:px-0 lg:pl-[calc(71*var(--d))]"
      >
        Latest
      </h2>
      <div className="mt-8 lg:mt-[calc(36*var(--d))]">
        {rows.map((row, i) => {
          const photoLeft = row.photoSide === "left";
          return (
            <div
              key={i}
              className={`grid lg:min-h-[calc(410*var(--d))] ${
                photoLeft ? "lg:grid-cols-[1114fr_614fr]" : "lg:grid-cols-[614fr_1114fr]"
              }`}
            >
              <Link
                href="/articles/why-gen-z-is-obsessed-with-hyrox-1"
                className={`relative block min-h-[240px] overflow-hidden ${photoLeft ? "lg:order-1" : "lg:order-2"}`}
                aria-label={TITLE}
              >
                <Image
                  src={row.photo}
                  alt=""
                  width={row.w}
                  height={row.h}
                  sizes="(min-width: 1024px) 65vw, 100vw"
                  className="absolute inset-0 size-full object-cover"
                  style={{ objectPosition: row.pos }}
                />
              </Link>
              <div className={`flex ${photoLeft ? "lg:order-2" : "lg:order-1"}`}>
                <TextPanel flip={photoLeft} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
