export const navLinks = [
  { label: "Features", href: "/features" },
  { label: "FAQs", href: "/faqs" },
  { label: "Pace Calculator", href: "/features#pace-calculator" },
  { label: "Info Centre", href: "/info-centre" },
] as const;

export const footerLinks = [
  {
    label: "Features",
    href: "/features",
    children: [
      { label: "Pace Calculator", href: "/features#pace-calculator" },
      { label: "Drill Library", href: "/features#drills" },
      { label: "Race Simulation", href: "/#features" },
    ],
  },
  {
    label: "Hyrox Guides",
    href: "/articles",
    children: [
      { label: "Pacing a race", href: "/articles/how-to-pace-a-hyrox-race" },
      { label: "The 8 stations", href: "/articles/hyrox-stations-explained" },
      { label: "Your first race", href: "/articles/your-first-hyrox-race" },
    ],
  },
  {
    label: "Station Tips",
    href: "/articles",
    children: [
      { label: "SkiErg", href: "/articles/how-to-do-skierg-efficiently" },
      { label: "Sled push", href: "/articles/sled-push-technique" },
      { label: "Wall balls", href: "/articles/wall-balls-strategy-for-hyrox" },
    ],
  },
  {
    label: "FAQs",
    href: "/faqs",
    children: [
      { label: "Hyrox basics", href: "/faqs#hyrox" },
      { label: "Training", href: "/faqs#pacing" },
      { label: "Devices", href: "/faqs#devices" },
    ],
  },
  {
    label: "Info Centre",
    href: "/info-centre",
    children: [
      { label: "Latest", href: "/info-centre" },
      { label: "All articles", href: "/articles" },
      { label: "Early access", href: "/#waitlist" },
    ],
  },
] as const;

export const featureTabs = [
  {
    id: "pace",
    short: "Pace",
    title: "Pace Calculator",
    blurb: "Structured workouts that build real fitness.",
  },
  {
    id: "drills",
    short: "Drills",
    title: "Drill Library",
    blurb: "Structured workouts that build real fitness.",
  },
  {
    id: "race",
    short: "Race Sim",
    title: "Race Simulation",
    blurb: "Structured workouts that build real fitness.",
  },
  {
    id: "drills-2",
    short: "More Drills",
    title: "Drill Library",
    blurb: "Structured workouts that build real fitness.",
  },
] as const;

/** The landing-page feature story: one athlete, four stages, one climb. */
export const featureStory = [
  {
    id: "pace",
    stage: "Plan",
    feature: "Pace Calculator",
    title: "Start with one number: your Hyrox goal time.",
    body: "The Hyrox pace calculator splits your goal across all 16 segments, eight 1 km runs and eight stations, so a 1:10:00 finish stops being a wish and becomes a split you can check at every roxzone.",
    facts: ["Goal 01:10:00", "Run 1 · 03:45 per km", "SkiErg 1,000 m · 03:50"],
    level: 0.2,
  },
  {
    id: "drills",
    stage: "Build",
    feature: "Drill Library",
    title: "Train the station that holds you back.",
    body: "Every Hyrox station, from the SkiErg to the sled push and wall balls, has its own drills with a goal time and a reason. Most athletes lose their minutes in one or two stations. Find yours and close the gap.",
    facts: ["Wall Balls · 3:15", "SkiErg · 4:00", "Sled Push · 2:45"],
    level: 0.5,
  },
  {
    id: "race",
    stage: "Rehearse",
    feature: "Race Simulation",
    title: "Run a full Hyrox simulation before race day.",
    body: "Go through all 16 segments in training, transitions included, and get a projected finish time. See exactly where your pace cracks while there is still time to fix it.",
    facts: ["16 segments", "Projected 01:08:00", "48 s faster than plan"],
    level: 0.8,
  },
  {
    id: "drills-2",
    stage: "Finish",
    feature: "Back-Half Drills",
    title: "Arrive at the last wall ball with something left.",
    body: "The second half of a Hyrox race is where finish times are decided: grip on the farmers carry, glutes on the sandbag lunges, then 100 wall balls on tired legs. It is the part most people never train.",
    facts: ["Sandbag Lunges · 4:30", "Farmers Carry · 1:45", "Wall Balls · 5:00"],
    level: 1,
  },
] as const;

/** Polaroid cards around the "Train in Full Circle" dial. cx/cy are Figma canvas coordinates of each card's centre. */
export const polaroids = [
  { id: "nutrition", photo: "run", left: "Nutrition", right: null, rotate: 7.09, cx: 255.03, cy: 3779.52 },
  { id: "running-top", photo: "run", left: "Running", right: "8 kms", rotate: -7.33, cx: 558.78, cy: 3369.08 },
  { id: "wall-balls", photo: "wallballs", left: "Wall Balls", right: "100 r", rotate: 7.09, cx: 626.03, cy: 4141.52 },
  { id: "running-bottom", photo: "run", left: "Running", right: "8 kms", rotate: -5.11, cx: 1096.72, cy: 4148.8 },
  { id: "endurance", photo: "run", left: "Endurance", right: null, rotate: -7.54, cx: 1474.43, cy: 3786.56 },
  { id: "sled-push", photo: "sled", left: "Sled Push", right: "12.5m", rotate: 9.49, cx: 1220.4, cy: 3463.9 },
] as const;

/** Wearables. x/y/w/h position the product shot inside its circle (design px). */
export const devices = [
  { id: "apple", name: "Apple Watch", image: "device-apple-watch", size: 323, active: false, box: { x: 44, y: 10, w: 221, h: 331 } },
  { id: "whoop", name: "Whoop", image: "device-whoop", size: 436, active: true, box: { x: 36, y: -36, w: 348, h: 522 } },
  { id: "garmin", name: "Garmin", image: "device-garmin", size: 323, active: false, box: { x: 0, y: -49.5, w: 291, h: 436 } },
  { id: "fitbit", name: "Fitbit", image: "device-fitbit", size: 323, active: false, box: { x: 19, y: -33.5, w: 264, h: 396 } },
] as const;

/** Wearables shown in the interactive ecosystem rows. */
export const wearables = [
  { id: "apple", name: "Apple Watch", blurb: "Heart rate, distance and active energy stream straight into your split ledger.", synced: ["Heart rate", "Distance", "Active energy"] },
  { id: "whoop", name: "Whoop", blurb: "Strain and recovery set the intensity of every drill we plan for you.", synced: ["Strain", "HRV", "Recovery"] },
  { id: "garmin", name: "Garmin", blurb: "GPS pace, cadence and heart-rate zones land in your race simulation.", synced: ["Pace", "Cadence", "Heart rate"] },
  { id: "fitbit", name: "Fitbit", blurb: "Daily load, calories and resting heart rate keep your pacing honest.", synced: ["Pace", "Heart rate", "Calories"] },
] as const;

export const ecosystemPills = [
  "Auto recovery tracking",
  "Live heart rate analysis",
  "Unified performance data",
  "Smart training insights",
] as const;

export const splitLedger = {
  title: "Split Ledger",
  segments: "/ 16 Segments",
  total: "01:10:00",
  rows: [
    { n: "01", label: "Run 1km", time: "03:45", bar: "blue", highlight: false },
    { n: "02", label: "SkiErg 1km", time: "03:50", bar: "peach", highlight: true },
    { n: "03", label: "Run 1km", time: "03:47", bar: "blue", highlight: false },
    { n: "16", label: "Wall Balls 100", time: "06:50", bar: "peach", highlight: false },
  ],
  footer: "view all 16 splits in ledger",
} as const;

export const stations = [
  { id: "wall-balls", name: "Wall Balls", tag: "High Vol", goal: "3:15 Goal", code: "STN_01", icon: "station-wallballs", w: 30, h: 42, active: true },
  { id: "skierg", name: "SkiErg", tag: "Core Drive", goal: "4:00 Goal", code: "STN_02", icon: "station-skierg", w: 45.164, h: 40.422, active: false },
  { id: "sled-push", name: "Sled Push", tag: "Leg Drive", goal: "2:45 Goal", code: "STN_03", icon: "station-sled", w: 43, h: 40, active: true },
] as const;

export type Station = {
  id: string;
  name: string;
  tag: string;
  goal: string;
  code: string;
  icon: string;
  w: number;
  h: number;
  active: boolean;
  flip?: boolean;
};

/** Second Drill Library column: the remaining stations, in the same card style. */
export const stationsMore: Station[] = [
  { id: "sandbag-lunges", name: "Sandbag Lunges", tag: "Glute Drive", goal: "4:30 Goal", code: "STN_04", icon: "pages/sandbag-lunges", w: 36.206, h: 31.034, active: true },
  { id: "farmers-carry", name: "Farmers Carry", tag: "Grip Hold", goal: "1:45 Goal", code: "STN_06", icon: "logo", w: 36, h: 36, active: false },
  { id: "wall-balls-2", name: "Wall Balls", tag: "Finisher", goal: "5:00 Goal", code: "STN_08", icon: "pages/wall-ball", w: 27.216, h: 38.249, active: true },
];

export const raceSim = {
  title: "Race Sim",
  segments: "/ 8 Runs + 8 Stations",
  finish: "01:08:00",
  /** Relative effort of each of the 16 segments: runs alternate with stations. */
  bars: [52, 64, 58, 70, 60, 74, 64, 78, 66, 82, 70, 86, 74, 90, 80, 100],
  stats: [
    { label: "Avg pace", value: "4:12/km", accent: false },
    { label: "Delta", value: "-0:48", accent: false },
    { label: "Top", value: "12%", accent: true },
  ],
  footer: "run a full race simulation",
} as const;
