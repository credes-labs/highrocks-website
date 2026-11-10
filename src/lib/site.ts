/** Canonical site origin. Set NEXT_PUBLIC_SITE_URL in production (e.g. https://highrocks.app). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const SITE_NAME = "HighRocks";

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
  "SkiErg",
  "sled push",
  "wall balls",
];
