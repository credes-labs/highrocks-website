export const navLinks = [
  { label: "Features", href: "/features" },
  { label: "FAQs", href: "/faqs" },
  { label: "Pace Calculator", href: "/features#pace-calculator" },
  { label: "Info Centre", href: "/info-centre" },
] as const;

export const footerLinks = [
  { label: "Features", href: "/features" },
  { label: "Pace Calculator", href: "/features#pace-calculator" },
  { label: "Blogs", href: "/articles" },
  { label: "Text", href: "#" },
  { label: "Text", href: "#" },
] as const;

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  readTime: string;
  posted: string;
};

/** Placeholder articles (the Figma file repeats one story). Replace with CMS data. */
export const articles: Article[] = Array.from({ length: 12 }, (_, i) => ({
  slug: `why-gen-z-is-obsessed-with-hyrox-${i + 1}`,
  title: "'I spent £2,000 on one event': Why Gen Z is obsessed with Hyrox",
  excerpt:
    "Hyrox is a fitness craze that shows no signs of dying out - with 1.3m people expected to compete in an event ...",
  readTime: "10 min",
  posted: "2 hours ago",
}));

export const storyBody = [
  "Hyrox is a fitness craze that shows no signs of dying out - with 1.3m people expected to compete in an event somewhere in the world this year.",
  "The competition, which is split between running and fitness exercises, has proven particularly popular with young millennials and Generation Z - people in their twenties to early forties.",
  "Its rapidly growing popularity has been attributed to social media.",
  "Fashionable looks are often a non-negotiable for competitors, with many choosing to compete in high-end fitness brands, matching their outfits with their team members",
  "Allana Falconer, who works in sustainability and started competing in 2023, says she has \"fallen in love\" with it.",
  "She has competed in 20 different races across six countries and 12 different cities.",
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

/** Landing-page highlights (the full list lives in faqGroups). */
export const faqs = [
  {
    q: "What is a Hyrox race?",
    a: "Hyrox is an indoor fitness race of eight 1 km runs, each followed by a functional station: SkiErg, sled push, sled pull, burpee broad jumps, rowing, farmers carry, sandbag lunges and wall balls. That is 8 km of running and 8 stations, done in the same order at every event.",
  },
  {
    q: "How should I pace a Hyrox race?",
    a: "Set a goal finish time, then hold an even pace on the 8 runs instead of racing the first kilometre. Most time is lost in the second half, so leave something for the lunges and wall balls. The HighRocks pace calculator turns your goal time into a split for every run and station.",
  },
  {
    q: "What is HighRocks?",
    a: "HighRocks is a Hyrox training app with a pace calculator, a drill library for every station and full race simulations. It is in early access: join the waitlist and we will email you when your spot opens.",
  },
] as const;

export type FaqItem = { q: string; a: string };
export type FaqGroup = { id: string; label: string; blurb: string; items: readonly FaqItem[] };

export const faqGroups: readonly FaqGroup[] = [
  {
    id: "hyrox",
    label: "Hyrox basics",
    blurb: "The race, the stations and how it is scored.",
    items: [
      { q: "What is Hyrox?", a: "Hyrox is an indoor fitness race that pairs running with functional workouts. You run 1 km, then complete a station, eight times over, for a total of 8 km of running and 8 stations." },
      { q: "What are the eight stations?", a: "In order: 1 km SkiErg, 50 m sled push, 50 m sled pull, 80 m burpee broad jumps, 1 km row, 200 m farmers carry, 100 m sandbag lunges and 100 wall balls. Weights depend on your division." },
      { q: "What are the divisions?", a: "There are Open and Pro divisions for singles, plus doubles (same-sex or mixed) and relay teams of four. Station weights and wall-ball targets change by division, so check the official rulebook for your category." },
      { q: "What is a good Hyrox time?", a: "It varies by division and age group. Many first-timers finish between 1:30 and 2:00, a competitive age-grouper lands around 1:10 to 1:20, and elites finish under an hour. HighRocks helps you set a realistic target from your own data." },
      { q: "Do I need to be a runner to do Hyrox?", a: "No, but running is half the race and it is where most time is lost. Comfortable pacing on 1 km repeats, with legs that are already tired, matters more than raw top speed." },
    ],
  },
  {
    id: "pacing",
    label: "Training & pacing",
    blurb: "How the plans, splits and drills work.",
    items: [
      { q: "How does the pace calculator work?", a: "Tell us your goal time and your strongest and weakest stations. We distribute the total across all 16 segments so that your runs and stations are balanced, and show the split you should hit at every checkpoint." },
      { q: "What is the Split Ledger?", a: "It is the running record of your 16 segments — four runs, four stations and so on — with each time, the target, and how far ahead or behind you are. After a session you can compare ledgers side by side." },
      { q: "What is the Drill Library?", a: "A library of station-specific drills, each with a goal, a coaching tag and a code (STN_01, STN_02…). Pick the station you are weakest at and train it with intent instead of guessing." },
      { q: "Can I simulate a full race?", a: "Yes. Race Simulation walks you through all 16 segments with live targets, so you can rehearse transitions, fuelling and pacing before race day." },
      { q: "Will it work if I only train a few days a week?", a: "Yes. Plans are built around the days you actually have, and the pacing targets adapt as your recent sessions come in." },
    ],
  },
  {
    id: "app",
    label: "The app",
    blurb: "What you get, and what is coming.",
    items: [
      { q: "Is HighRocks a mobile app?", a: "HighRocks is being built mobile-first, with a companion experience for your wrist. Waitlist members get first access to the beta." },
      { q: "Does it work offline?", a: "Core features such as your plan, drills and the pace calculator are designed to work without a connection. Syncing happens whenever you are back online." },
      { q: "What will it cost?", a: "Pricing is not final. Waitlist members will hear about it first, and early supporters will get a founding-member offer." },
      { q: "Which platforms are supported?", a: "iOS and Android are planned for launch, along with the watch integrations listed below." },
    ],
  },
  {
    id: "devices",
    label: "Devices & data",
    blurb: "Wearables, syncing and privacy.",
    items: [
      { q: "Which wearables will it support?", a: "Apple Watch, Whoop, Garmin and Fitbit are first in line. Each one feeds heart rate, pace and energy data into your splits." },
      { q: "What data do you read from my watch?", a: "Only what is needed for training: heart rate, distance, pace, cadence, calories and recovery or strain metrics where the platform provides them." },
      { q: "Can I use HighRocks without a wearable?", a: "Absolutely. You can log splits manually and use every planning feature — a wearable just makes the data automatic." },
      { q: "Who owns my data?", a: "You do. We never sell personal data, and you can export or delete your account at any time." },
    ],
  },
  {
    id: "access",
    label: "Early access",
    blurb: "The waitlist, invites and support.",
    items: [
      { q: "How do I join the waitlist?", a: "Fill in the early access form with your name, email, and optionally your phone number and date of birth. You will get a confirmation straight away." },
      { q: "Why do you ask for a date of birth?", a: "Age group is part of how Hyrox divisions and benchmarks work, so it lets us give you realistic targets. It is optional and never shown publicly." },
      { q: "How will I know when I am in?", a: "We will email you with an invite and set-up steps as soon as your spot opens. Invites go out in waves." },
      { q: "Still have a question?", a: "Browse the Info Centre for guides and stories, or write to us from the early access form and we will get back to you." },
    ],
  },
];


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
