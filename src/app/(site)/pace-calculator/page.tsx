import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { PaceTool } from "@/components/pace/PaceTool";
import { JsonLd } from "@/components/seo/JsonLd";
import { APP_ID, ORG_ID, WEBSITE_ID, breadcrumbLd, pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { RUN_SHARE, TRANSITION_SHARE, WORK_SHARE } from "@/lib/pacing/engine";
import "./pace-page.css";

const TITLE = "Hyrox Pace Calculator: Splits for Every Run & Station";
const DESCRIPTION =
  "Free Hyrox pace calculator. Enter a goal finish and get a target for all 8 runs, 8 stations and the roxzone, with a race timeline, station budget, strategy analysis and calibration from your last race.";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/pace-calculator",
  keywords: ["Hyrox pace calculator", "Hyrox splits", "Hyrox goal time", "Hyrox race plan", "Hyrox doubles pacing", "roxzone time"],
});

const pct = (v: number) => `${Math.round(v * 100)}%`;

const faqs = [
  {
    q: "How does the Hyrox pace calculator split my goal time?",
    a: `It starts from a balanced race: ${pct(RUN_SHARE)} of your target for the 8 runs, ${pct(WORK_SHARE)} for the 8 stations and ${pct(TRANSITION_SHARE)} for transitions, the split seen in Hyrox results across ability levels. Station time is shared out by difficulty weight, so wall balls and burpee broad jumps (1.30) get more than the row (1.00) or the farmers carry (0.90).`,
  },
  {
    q: "Why is my projected finish different from my target?",
    a: "Your profile says how fast you run and how strong you are on stations compared with the model. The calculator does not force the plan to hit your target: if your profile says your running is slower than the goal needs, the projected finish shows it, and the gap tells you how much time to find and where.",
  },
  {
    q: "What do the setup questions change?",
    a: "Your running answer sets an engine factor that scales only the runs (Elite 0.93 to Tough 1.05). Your station answer sets a strength factor that scales only the stations (Specialist 0.87 to Grind 1.10). Runs never affect stations. Same answers, same plan, every time.",
  },
  {
    q: "What is delta vs base?",
    a: "How much your profile and race format expanded or shrank each run and station compared with its unmodified share of your target. It shows where your gap to the goal comes from.",
  },
  {
    q: "How do Doubles splits work?",
    a: "In Doubles both athletes run every kilometre, but the station work is shared. The calculator divides each station by two times your team efficiency (0.80 to 1.00), because handovers are never perfect. At 0.90 each station takes about 56% of the solo time, not 50%.",
  },
  {
    q: "What is a drill goal?",
    a: "90% of your race target for that station. Hitting it fresh in training leaves room for the fatigue of race day.",
  },
];

const jsonLd = [
  {
    "@type": "WebPage",
    "@id": absoluteUrl("/pace-calculator#webpage"),
    url: absoluteUrl("/pace-calculator"),
    name: TITLE,
    description: DESCRIPTION,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": APP_ID },
    mainEntity: { "@id": absoluteUrl("/pace-calculator#app") },
    breadcrumb: breadcrumbLd([{ name: "Pace calculator", path: "/pace-calculator" }]),
  },
  {
    "@type": "WebApplication",
    "@id": absoluteUrl("/pace-calculator#app"),
    name: "HighRocks Hyrox Pace Calculator",
    url: absoluteUrl("/pace-calculator"),
    applicationCategory: "SportsApplication",
    operatingSystem: "Any (web browser)",
    browserRequirements: "Requires JavaScript",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
    featureList: [
      "Target split for all 8 runs, 8 stations and the roxzone",
      "Race timeline and race clock charts",
      "Three-question setup that turns plain answers into a pacing profile",
      "Delta vs base for every run and station",
      "Calibration from a past race result",
      "Solo and Doubles",
      "Drill goals per station",
      "CSV export and shareable plan links",
    ],
    description: DESCRIPTION,
    publisher: { "@id": ORG_ID },
  },
  {
    "@type": "FAQPage",
    "@id": absoluteUrl("/pace-calculator#faq"),
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  },
];

export default function PaceCalculatorPage() {
  return (
    <>
      <Navbar />
      <main className="pace-page">
        <header className="pace-page-head">
          <nav aria-label="Breadcrumb" className="pace-crumbs">
            <Link href="/features">Features</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Pace calculator</span>
          </nav>
          <h1>
            Hyrox pace <span>calculator</span>
          </h1>
          <p>
            Set a goal finish and get a split for every run, every station and the roxzone. Tell it how you race, or calibrate it
            from your last result, and it shows where your time will go and where to find more.
          </p>
        </header>

        <PaceTool />

        <section className="pace-method" aria-labelledby="method-h">
          <h2 id="method-h">How the calculator works</h2>
          <dl>
            {faqs.map((f) => (
              <div key={f.q}>
                <dt>{f.q}</dt>
                <dd>{f.a}</dd>
              </div>
            ))}
          </dl>
          <p className="pace-method-more">
            The same engine powers the HighRocks app. For race-day tactics, read{" "}
            <Link href="/articles/how-to-pace-a-hyrox-race">how to pace a Hyrox race</Link>.
          </p>
        </section>
      </main>
      <Footer />
      <JsonLd data={jsonLd} />
    </>
  );
}
