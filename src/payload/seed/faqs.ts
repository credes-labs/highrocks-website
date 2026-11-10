/** Starting content for the FAQ collections; only used to seed an empty database. */

/** The three questions shown on the home page. */
export const homeFaqs = [
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


export const faqGroups: readonly { id: string; label: string; blurb: string; items: readonly { q: string; a: string }[] }[] = [
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
