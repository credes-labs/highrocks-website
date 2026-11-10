/** Canonical site origin. Set NEXT_PUBLIC_SITE_URL in production (e.g. https://highrocks.app). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const SITE_NAME = "HighRocks";

export const SITE_TAGLINE = "Hyrox Training App & Pace Calculator";

export const SITE_DESCRIPTION =
  "HighRocks is a Hyrox training app: a Hyrox pace calculator for all 8 runs and 8 stations, station drills and full race simulations. Join the waitlist for early access.";

export const SITE_KEYWORDS = [
  "Hyrox",
  "Hyrox training",
  "Hyrox training app",
  "Hyrox pace calculator",
  "Hyrox race simulation",
  "Hyrox stations",
  "Hyrox training plan",
  "Hyrox finish time",
  "Hyrox pacing",
  "SkiErg",
  "sled push",
  "wall balls",
];

/** One sentence that defines Hyrox; reused in structured data and llms.txt. */
export const HYROX_DEFINITION =
  "Hyrox is an indoor fitness race of eight 1 km runs, each followed by a functional workout station: SkiErg, sled push, sled pull, burpee broad jumps, rowing, farmers carry, sandbag lunges and wall balls.";

export const absoluteUrl = (path = "/") => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
