import type { Article } from "@/lib/cms-types";

/** Starting content for the Articles collection; only used to seed an empty database. */
export type SeedArticle = Omit<Article, "readTime" | "posted">;

export const seedArticles: SeedArticle[] = [
  {
    slug: "how-to-pace-a-hyrox-race",
    title: "How to pace a Hyrox race, split by split",
    excerpt:
      "Pick a goal time, run every 1 km at the same steady pace, and protect your legs for the back half. Here is how to turn one finish time into 16 splits you can actually hold.",
    category: "Guides",
    published: "2026-11-06",
    image: { src: "/images/polaroid-sled.png", alt: "Athlete driving a sled across a dark gym floor" },
    keywords: ["Hyrox pacing", "Hyrox pace strategy", "Hyrox splits", "Hyrox goal time"],
    intro: [
      "The short answer: decide on a realistic goal time, divide it across the 8 runs, the 8 stations and the roxzone, and run the first kilometre no faster than the last one should be. Even pacing beats a fast start in almost every Hyrox race.",
      "Most athletes lose their race between station 5 and station 8, not at the start. Pacing is how you arrive at the lunges and wall balls with enough left to keep moving.",
    ],
    sections: [
      {
        heading: "Start from one number: your goal time",
        paragraphs: [
          "Use a recent result, or a 5 km run time plus an honest look at your station strength, to choose a goal. First-timers often finish between 1:30 and 2:00. Competitive age-group athletes often land between 1:10 and 1:20.",
          "Once you have the number, split it into three buckets: running, stations and roxzone. For most people, running is roughly half of the total time, stations a little less, and the roxzone takes several minutes.",
        ],
      },
      {
        heading: "Run every kilometre at the same pace",
        paragraphs: [
          "The first run feels easy because your legs are fresh and the crowd is loud. That is the trap. If your target is 5:00 per km, run 5:00, not 4:30. Each later run comes straight after a station, so your legs will feel heavier and your pace will drift without any extra effort from you.",
          "A good sign of even pacing is that your eighth run is within 30 to 45 seconds of your first.",
        ],
      },
      {
        heading: "Give each station a time, not just an effort",
        paragraphs: [
          "Stations are where pacing plans fall apart, because effort is hard to judge under fatigue. Give every station a target time and a rest plan. For example: SkiErg at a steady stroke rate, sled push in four even lengths, wall balls in fixed sets with short planned breaks.",
        ],
        list: [
          "SkiErg and row: hold a pace you could repeat, not your best 1 km.",
          "Sled push and pull: keep moving; standing still costs more than going slowly.",
          "Lunges and wall balls: plan your breaks before you start the station.",
        ],
      },
      {
        heading: "Check your splits as you go",
        paragraphs: [
          "Know three checkpoints: your time after run 4, after the row, and after the farmers carry. If you are more than a minute ahead at run 4, ease off. If you are behind, do not try to win it all back on one run; take a few seconds from each remaining segment.",
          "The HighRocks pace calculator does this split work for you. Enter a goal time and it gives you a target for all 16 segments, so you can check every roxzone against a real number.",
        ],
      },
    ],
    quote: "The race is not won on run one. It is lost there.",
    takeaways: [
      "Choose a realistic goal time and split it into runs, stations and roxzone.",
      "Run every 1 km at the same pace; your first run should not be your fastest.",
      "Give every station a target time and plan your breaks in advance.",
      "Check your time after run 4, the row and the farmers carry.",
    ],
  },
  {
    slug: "hyrox-stations-explained",
    title: "The 8 Hyrox stations explained",
    excerpt:
      "A Hyrox race is 8 × 1 km runs, each followed by a station: SkiErg, sled push, sled pull, burpee broad jumps, rowing, farmers carry, sandbag lunges and wall balls. Here is what each one asks of you.",
    category: "Guides",
    published: "2026-11-03",
    image: { src: "/images/pages/article-band-1.png", alt: "Hyrox athlete driving a sled push in front of the race clock" },
    keywords: ["Hyrox stations", "Hyrox workouts", "Hyrox weights", "Hyrox format"],
    intro: [
      "Every Hyrox race follows the same format: run 1 km, complete a station, and repeat eight times. That adds up to 8 km of running and 8 functional workouts, always in the same order, at every Hyrox event in the world.",
      "Because the format never changes, you can train for each station specifically. Here they are in order, with what they demand and what usually goes wrong.",
    ],
    sections: [
      {
        heading: "Stations 1 to 4: the strength half",
        paragraphs: [
          "The first half of the race tests power and pulling strength while your running legs are still fresh.",
        ],
        list: [
          "1. SkiErg, 1,000 m: a full-body pull. Hinge at the hips and drive with your lats, not just your arms.",
          "2. Sled push, 50 m: four 12.5 m lengths. Stay low, arms locked or slightly bent, short powerful steps.",
          "3. Sled pull, 50 m: hand over hand on a rope from behind a line. Sit back and use your legs.",
          "4. Burpee broad jumps, 80 m: chest to the floor, then jump forward with both feet. Rhythm beats speed.",
        ],
      },
      {
        heading: "Stations 5 to 8: the endurance half",
        paragraphs: [
          "The second half is where fatigue builds, and where most time is lost.",
        ],
        list: [
          "5. Rowing, 1,000 m: a chance to settle your breathing if you pace it well.",
          "6. Farmers carry, 200 m: two kettlebells. Grip and posture; walk fast, do not drop them.",
          "7. Sandbag lunges, 100 m: a bag on your shoulders, back knee to the floor each rep.",
          "8. Wall balls, 100 reps: squat below parallel and hit the target. The finish line is right after.",
        ],
      },
      {
        heading: "Weights by division",
        paragraphs: [
          "Weights depend on your division. In Open, the sandbag is 10 kg for women and 20 kg for men, the farmers carry kettlebells are 2 × 16 kg and 2 × 24 kg, and wall balls are 4 kg and 6 kg. Pro divisions go heavier on every loaded station, and the sleds are loaded differently too.",
          "Hyrox updates its standards between seasons, so always confirm the numbers for your division in the official rulebook before race day.",
        ],
      },
      {
        heading: "How to train the stations",
        paragraphs: [
          "Train each station tired. A sled push after a hard 1 km run feels nothing like a fresh one. Pair every station drill with a run so your body learns the transition.",
          "HighRocks gives every station a goal time and a drill, so you can find your weakest one and train it on purpose instead of guessing.",
        ],
      },
    ],
    quote: "Same eight stations, same order, every race. That is your advantage: you can rehearse all of it.",
    takeaways: [
      "Hyrox is 8 × 1 km runs, each followed by one of 8 stations, always in the same order.",
      "Stations 1 to 4 test strength and power; 5 to 8 test endurance under fatigue.",
      "Weights change by division; check the official rulebook for the current season.",
      "Train every station straight after a run, not fresh.",
    ],
  },
  {
    slug: "how-to-do-skierg-efficiently",
    shortTitle: "How to do SkiErg efficiently",
    title: "How to do the SkiErg efficiently in Hyrox",
    excerpt:
      "Use your hips and lats, not your arms: hinge, pull the handles down past your hips, and hold a stroke rate you can sustain. Here is the technique and pacing for the 1,000 m SkiErg.",
    category: "Guides",
    published: "2026-10-30",
    image: { src: "/images/pages/category-guides.png", alt: "Athlete pulling a SkiErg in a dark training hall" },
    keywords: ["SkiErg technique", "Hyrox SkiErg", "SkiErg pacing", "SkiErg 1000m"],
    intro: [
      "The SkiErg is the first station in every Hyrox race: 1,000 m straight after your first 1 km run. Done well, it costs you very little. Done with your arms alone, it leaves your shoulders and grip tired for the sled push and sled pull that come next.",
      "Efficient SkiErg technique is a hip hinge with a strong lat pull, finished by your arms, at a pace you could hold for twice the distance.",
    ],
    sections: [
      {
        heading: "The stroke, step by step",
        paragraphs: [
          "Stand tall with the handles above your head. Start the pull by hinging at the hips and letting your body weight pull the handles down. Your lats take over, then your triceps finish the stroke as your hands pass your hips.",
          "Return by standing back up and letting your arms rise with your body. The recovery should be relaxed; it is where you breathe.",
        ],
        list: [
          "Hinge, do not squat: your knees bend a little, your hips move back.",
          "Keep your arms nearly straight at the top of the pull.",
          "Finish with your hands by your thighs, not at your chest.",
        ],
      },
      {
        heading: "Pick a damper and a pace",
        paragraphs: [
          "Most athletes use a middle damper setting, often between 5 and 7. Higher is not faster; it just makes each stroke heavier. Test settings in training and keep the one where you can hold your pace with a smooth rhythm.",
          "Aim for a 500 m split you could repeat. If your best 1,000 m in training is 3:50, a race target around 4:05 to 4:15 leaves energy for the sleds.",
        ],
      },
      {
        heading: "Common mistakes",
        paragraphs: [
          "The most common mistake is pulling with the arms and bending the elbows early. The second is going out too hard because it is the first station and you feel fresh.",
          "Watch your stroke rate. If it climbs while your split stays the same, you are working harder for nothing. Lengthen the stroke and let the rate come down.",
        ],
      },
      {
        heading: "A simple SkiErg session",
        paragraphs: [
          "Try 4 rounds of 1 km run plus 500 m SkiErg, holding the same SkiErg split each round. It teaches you to ski on tired legs and to keep a steady pace when your heart rate is already high.",
        ],
      },
    ],
    quote: "Hips start it, lats drive it, arms finish it.",
    takeaways: [
      "Start each stroke with a hip hinge and your lats, then finish with your arms.",
      "Use a middle damper setting, often 5 to 7, and keep a steady rhythm.",
      "Race slightly slower than your best 1,000 m to save your grip for the sleds.",
      "Practise skiing straight after running.",
    ],
  },
  {
    slug: "sled-push-technique",
    shortTitle: "Sled-push was tough until?",
    title: "Sled push was tough until I fixed these three things",
    excerpt:
      "Get low, lock your arms, and take short fast steps without stopping. These three changes make the Hyrox sled push faster and stop the sled from stalling.",
    category: "Blogs",
    published: "2026-10-27",
    image: { src: "/images/pages/category-blogs.png", alt: "Athlete driving a sled from above on a dark textured floor" },
    keywords: ["sled push technique", "Hyrox sled push", "sled push tips", "Hyrox station 2"],
    intro: [
      "The sled push is the station most people fear: 50 m in four 12.5 m lengths, with a heavy sled on a carpeted track. The fix is not more strength. It is body angle, arm position and footwork.",
      "These are the three changes that make the biggest difference, and how to train them.",
    ],
    sections: [
      {
        heading: "1. Get your body angle low",
        paragraphs: [
          "If you stand too upright, your force goes down into the floor instead of forward into the sled. Lean in until your body is closer to 45 degrees, with your hips low and your back flat.",
          "Your shoulders should be behind the poles or level with your hands, never far above them.",
        ],
      },
      {
        heading: "2. Lock your arms",
        paragraphs: [
          "Bent arms turn the push into a chest press and tire your upper body before the sled pull. Most athletes push faster with arms locked or only slightly bent, so the force comes from the legs and passes straight through the body.",
        ],
      },
      {
        heading: "3. Short steps, and never stop",
        paragraphs: [
          "Long strides make your speed uneven. Take short, quick steps and drive through the balls of your feet. Above all, keep the sled moving. Starting a heavy sled from still takes much more effort than keeping it rolling.",
          "If you have to rest, rest at the end of a length, not in the middle.",
        ],
      },
      {
        heading: "How to train it without a race sled",
        paragraphs: [
          "Gym sleds and turf behave differently to race carpet, so train heavier than race weight where you can. Push for time, not just distance, and add a 1 km run before every set.",
        ],
        list: [
          "4 × (1 km run + 4 lengths of sled push) with 2 minutes rest.",
          "Heavy sled marches: slow, low and continuous, for leg drive.",
          "Wall sits and walking lunges on non-sled days.",
        ],
      },
    ],
    quote: "The sled does not care how strong you are. It cares how low you are.",
    takeaways: [
      "Lean in to about 45 degrees so your force goes forward.",
      "Keep your arms locked or only slightly bent.",
      "Take short, quick steps and never let the sled stop mid-length.",
      "Train it heavier than race weight, straight after a run.",
    ],
  },
  {
    slug: "running-indoors-or-outdoors-for-hyrox",
    shortTitle: "Running - Indoors or outdoors?",
    title: "Running for Hyrox: indoors or outdoors?",
    excerpt:
      "Do most of your running outdoors for volume, and add indoor or treadmill sessions to rehearse race conditions: flat surfaces, tight turns and running straight after a station.",
    category: "Articles",
    published: "2026-10-23",
    image: { src: "/images/pages/category-articles.png", alt: "Runner on a mountain road under a stormy sky" },
    keywords: ["Hyrox running", "treadmill vs outdoor running", "Hyrox running training", "compromised running"],
    intro: [
      "Hyrox is run indoors, usually on a flat exhibition hall floor with tight turns and a lap around the stations. So should you train indoors too? The answer is both: build volume outdoors, then rehearse the race indoors.",
      "Half of a Hyrox race is running. How and where you train it shapes your finish time more than any single station.",
    ],
    sections: [
      {
        heading: "Why outdoor running builds the engine",
        paragraphs: [
          "Most of your weekly running should be easy, conversational-pace kilometres. Outdoors, these are easier to enjoy and easier to do for longer. Varied ground also builds strong ankles and feet.",
          "Long easy runs build the aerobic base that lets you recover between stations.",
        ],
      },
      {
        heading: "Why indoor running matches race day",
        paragraphs: [
          "A Hyrox run lap has corners, a hard floor, crowds, and no wind or hills. Running on a treadmill or an indoor track teaches you to hold an exact pace with no terrain to hide behind.",
          "If you use a treadmill, set a 1% incline so it feels closer to running over the ground, and practise stepping off straight onto a station.",
        ],
      },
      {
        heading: "Train compromised running",
        paragraphs: [
          "Compromised running means running on legs that are already tired from a station. It is the most specific running you can do for Hyrox, and you can do it indoors or out.",
        ],
        list: [
          "1 km run, then 20 wall balls, repeated 5 times.",
          "1 km run, then 100 m walking lunges, repeated 4 times.",
          "Hold the same run pace every round.",
        ],
      },
      {
        heading: "A simple weekly split",
        paragraphs: [
          "If you run three times a week, make one an easy outdoor long run, one an interval session, and one a compromised run that pairs kilometres with stations. That covers your aerobic base, your speed and your race-specific fitness.",
        ],
      },
    ],
    quote: "Build the engine outside. Learn the race inside.",
    takeaways: [
      "Do most of your easy volume outdoors.",
      "Use indoor or treadmill runs to practise exact race pace.",
      "Set the treadmill to 1% incline.",
      "Train compromised running every week: runs straight after stations.",
    ],
  },
  {
    slug: "walking-jogging-or-running-for-endurance",
    title: "Walking, jogging or running: which builds endurance faster?",
    excerpt:
      "For most people, easy jogging builds endurance fastest because you can do the most of it. Brisk walking works for beginners and recovery days, and faster running sharpens the engine once a base is in place.",
    category: "Articles",
    published: "2026-10-20",
    image: { src: "/images/polaroid-run.png", alt: "Runner on an indoor track seen from above" },
    keywords: ["endurance training", "zone 2 running", "walking vs running", "Hyrox endurance"],
    intro: [
      "Endurance improves with the total amount of steady aerobic work you can do and recover from. That is why the answer depends on where you start: the best option is the one you can repeat most often without breaking down.",
      "For most people training for Hyrox, that means plenty of easy jogging, some brisk or incline walking, and a smaller amount of harder running.",
    ],
    sections: [
      {
        heading: "Walking: the underrated base",
        paragraphs: [
          "Brisk walking, especially on an incline, raises your heart rate with very little impact. For beginners, or on recovery days, it adds aerobic time without adding soreness.",
          "It also matters on race day. Many athletes walk through parts of the roxzone or between lunges, so a strong walking pace is a real skill.",
        ],
      },
      {
        heading: "Jogging: where most endurance is built",
        paragraphs: [
          "Easy jogging, at a pace where you could still hold a conversation, is the backbone of endurance training. It strengthens your heart and helps your muscles use oxygen better, and it is gentle enough to do several times a week.",
          "If you track heart rate, this is often called zone 2.",
        ],
      },
      {
        heading: "Running hard: sharpen, do not build",
        paragraphs: [
          "Intervals and tempo runs raise your top-end speed and teach you to hold race pace. But they take longer to recover from, so they work best as one or two sessions a week on top of an easy base.",
        ],
        list: [
          "Intervals: 6 × 1 km at goal race pace, 90 seconds rest.",
          "Tempo: 20 minutes at a comfortably hard, steady pace.",
        ],
      },
      {
        heading: "The mix that works for Hyrox",
        paragraphs: [
          "A common balance is about 80% of your weekly running easy and 20% hard. Add walking where you need more volume without more impact. Change one thing at a time and give your body a few weeks to adapt.",
        ],
      },
    ],
    quote: "The best endurance session is the one you can do again tomorrow.",
    takeaways: [
      "Easy jogging builds the most endurance for most people.",
      "Brisk or incline walking adds aerobic work with little impact.",
      "Keep hard running to one or two sessions a week.",
      "Aim for roughly 80% easy and 20% hard running.",
    ],
  },
  {
    slug: "cycling-for-hyrox-conditioning",
    title: "Can cycling help your Hyrox fitness?",
    excerpt:
      "Yes. Cycling adds aerobic volume with almost no impact, which helps you recover and build your engine. It cannot replace running, but it is a strong second cardio session.",
    category: "Blogs",
    published: "2026-10-16",
    image: { src: "/images/pages/latest-cycling.png", alt: "Cyclist silhouetted on a road bike under a cloudy sky" },
    keywords: ["cycling for Hyrox", "cross training Hyrox", "low impact cardio", "Hyrox conditioning"],
    intro: [
      "Cycling does not appear in a Hyrox race, so why do so many Hyrox athletes ride? Because it builds aerobic fitness without the pounding of running, which lets you train more without getting hurt.",
      "Used well, it adds fitness on top of your running. Used badly, it replaces the running you actually need.",
    ],
    sections: [
      {
        heading: "What cycling gives you",
        paragraphs: [
          "Cycling trains your heart and lungs and builds strong quads, the same muscles you use on the sled push, the lunges and the wall balls. Because there is almost no impact, you can recover from it quickly.",
        ],
      },
      {
        heading: "What it cannot give you",
        paragraphs: [
          "Running fitness is specific. Your tendons, feet and running rhythm only adapt by running. Keep your key run sessions, and add cycling as extra volume, not as a swap.",
        ],
      },
      {
        heading: "How to use it",
        paragraphs: ["Three ways to fit cycling into a Hyrox week:"],
        list: [
          "Easy ride of 45 to 60 minutes on a recovery day.",
          "Bike intervals, such as 8 × 1 minute hard with 1 minute easy, when your legs need a break from impact.",
          "A short spin after strength sessions to flush the legs.",
        ],
      },
      {
        heading: "When cycling helps most",
        paragraphs: [
          "Cycling is especially useful when you are coming back from a running niggle, during a high-volume block, or if you are new to running and your legs are not yet used to the load.",
        ],
      },
    ],
    quote: "Ride for the engine. Run for the race.",
    takeaways: [
      "Cycling adds aerobic volume with almost no impact.",
      "It strengthens the quads you use on sleds, lunges and wall balls.",
      "It cannot replace running; keep your key run sessions.",
      "Use it on recovery days, in high-volume blocks or when coming back from a niggle.",
    ],
  },
  {
    slug: "rowing-1000m-in-hyrox",
    title: "Rowing 1,000 m in Hyrox: pace it to recover",
    excerpt:
      "Drive with your legs, keep the stroke rate moderate, and row at a pace that lets your breathing settle. The Hyrox row comes at station 5, right before the farmers carry, lunges and wall balls.",
    category: "Guides",
    published: "2026-10-13",
    image: { src: "/images/pages/latest-rowing.png", alt: "Athlete on a rowing machine in a dark gym" },
    keywords: ["Hyrox rowing", "rowing technique", "1000m row pace", "Hyrox station 5"],
    intro: [
      "The row is station 5 of 8: 1,000 m on a rowing machine after the burpee broad jumps and your fifth run. It is the one station where you sit down, which makes it the best place in the race to control your breathing.",
      "Row it a little conservatively and you buy back time on the three stations that follow.",
    ],
    sections: [
      {
        heading: "Technique: legs, body, arms",
        paragraphs: [
          "Each stroke follows the same order. Push with your legs, swing your body back slightly, then pull the handle to your lower ribs. On the way back, reverse it: arms, body, then legs.",
          "Most of the power should come from your legs. If your arms are burning, you are pulling too early.",
        ],
      },
      {
        heading: "Stroke rate and damper",
        paragraphs: [
          "A moderate stroke rate, often in the mid to high 20s per minute, gives you power without spiking your heart rate. Like the SkiErg, a middle damper setting around 5 to 7 works for most people.",
        ],
      },
      {
        heading: "Pace it to recover",
        paragraphs: [
          "Pick a 500 m split that is a few seconds slower than your training best and hold it. Breathe out on the drive, in on the recovery. You should step off the rower with your breathing under control, ready to run.",
        ],
      },
      {
        heading: "Common mistakes",
        paragraphs: ["The errors that cost the most time on the row:"],
        list: [
          "Rushing the slide back to the front, which raises the stroke rate without adding speed.",
          "Bending the arms before the legs have finished pushing.",
          "Starting too fast and fading in the last 300 m.",
        ],
      },
    ],
    quote: "The row is the only seat in the house. Use it to breathe.",
    takeaways: [
      "Drive with your legs first, then your body, then your arms.",
      "Keep the stroke rate moderate and the damper around 5 to 7.",
      "Row a few seconds per 500 m slower than your best to recover.",
      "Slow the slide back to the front of the rower.",
    ],
  },
  {
    slug: "wall-balls-strategy-for-hyrox",
    title: "Wall balls: how to break up 100 reps",
    excerpt:
      "Plan your sets before you start, rest for short fixed breaks, and keep every squat below parallel so no reps are cancelled. Here are set plans for 100 wall balls at the end of a Hyrox race.",
    category: "Guides",
    published: "2026-10-09",
    image: { src: "/images/polaroid-wallballs.png", alt: "Athlete throwing a wall ball in a dark gym" },
    keywords: ["Hyrox wall balls", "wall ball strategy", "100 wall balls", "Hyrox station 8"],
    intro: [
      "Wall balls are the last station of every Hyrox race: 100 reps, with the finish line just beyond. Your legs are tired, your heart rate is high and a no-rep costs you time. A set plan made before race day is the difference between finishing strong and standing at the target.",
      "The best plan is the one you can stick to when you are exhausted, so keep it simple.",
    ],
    sections: [
      {
        heading: "Choose a set plan",
        paragraphs: [
          "Pick sets that you could finish fresh with reps to spare. On race day they will feel much harder.",
        ],
        list: [
          "Strong: 25, 25, 20, 15, 15.",
          "Steady: 20 × 5 sets.",
          "Survival: 10 × 10 sets with 3 to 5 breaths between.",
        ],
      },
      {
        heading: "Rest on purpose",
        paragraphs: [
          "Rest for a fixed number of breaths, not until you feel ready, because you will never feel ready. Hold the ball at your chest or set it down close to your feet so you lose no time picking it up.",
        ],
      },
      {
        heading: "Make every rep count",
        paragraphs: [
          "A rep only counts if your hips go below your knees and the ball hits the target. Judges call no-reps, and each one adds time. Squat fully, then drive up and throw in one smooth movement.",
          "Look at the target, not the floor, and let the ball drop back into your hands at chest height.",
        ],
      },
      {
        heading: "Train them tired",
        paragraphs: [
          "Practise wall balls straight after lunges or a hard run, because that is how they arrive in the race. Try 100 m walking lunges into 50 wall balls, twice through.",
        ],
      },
    ],
    quote: "Decide your sets in training. On race day, just count.",
    takeaways: [
      "Plan your sets before the race and stick to them.",
      "Rest for a set number of breaths.",
      "Squat below parallel and hit the target so no reps are cancelled.",
      "Train wall balls straight after lunges.",
    ],
  },
  {
    slug: "your-first-hyrox-race",
    title: "Your first Hyrox race: a beginner's guide",
    excerpt:
      "Choose the Open or Doubles division, train three to four days a week for 8 to 12 weeks, practise every station after a run, and start the race slower than you think. Here is what to expect.",
    category: "Articles",
    published: "2026-10-06",
    image: { src: "/images/pages/carousel-1.png", alt: "Athlete in a gym with kettlebells and wall balls behind him" },
    keywords: ["first Hyrox", "Hyrox for beginners", "Hyrox training plan", "Hyrox divisions"],
    intro: [
      "Anyone who can run a slow 5 km and handle a gym session can finish a Hyrox race. Choose a division that suits you, give yourself 8 to 12 weeks, and practise the format, not just your fitness.",
      "This guide covers choosing a division, a simple training week, what happens on race day, and the mistakes first-timers make most.",
    ],
    sections: [
      {
        heading: "Choose your division",
        paragraphs: [
          "Singles race in Open or Pro, and Pro uses heavier weights. Doubles is a pair who run every kilometre together and split the station work however they like. Relay is a team of four who each run two kilometres and do two stations.",
          "Most first-timers choose Open singles or Doubles.",
        ],
      },
      {
        heading: "A simple training week",
        paragraphs: ["Three or four sessions a week is enough to get to the finish line:"],
        list: [
          "One easy run of 30 to 50 minutes.",
          "One interval run, such as 5 × 1 km at goal pace.",
          "One strength session: squats, lunges, deadlifts, carries.",
          "One Hyrox session: runs paired with stations.",
        ],
      },
      {
        heading: "What race day looks like",
        paragraphs: [
          "You start in a wave with other athletes in your division. You run laps of a marked course, enter the roxzone, complete each station in order, and judges check your reps. Your time runs from start to finish, including transitions.",
          "Arrive early, find the roxzone entrance and exit, and walk the course if you can.",
        ],
      },
      {
        heading: "Mistakes to avoid",
        paragraphs: ["The most common first-race mistakes:"],
        list: [
          "Running the first kilometre far too fast.",
          "Never having tried the sled on a carpet surface.",
          "Wearing new shoes or trying new food on race day.",
          "Forgetting to count laps; most courses use a lap counter, but know your number.",
        ],
      },
    ],
    quote: "Your first Hyrox is about finishing well, not finishing fast.",
    takeaways: [
      "Most beginners choose Open singles or Doubles.",
      "Train three to four days a week for 8 to 12 weeks.",
      "Practise every station straight after a run.",
      "Start slower than you think and know your lap count.",
    ],
  },
  {
    slug: "hyrox-roxzone-transitions",
    title: "The roxzone: how to save minutes in transitions",
    excerpt:
      "The roxzone is the transition area between the run course and each station, and its time counts toward your result. Know the layout, keep moving, and use it to reset your breathing, not to stop.",
    category: "Blogs",
    published: "2026-10-02",
    image: { src: "/images/pages/features-hero.png", alt: "Athlete running on a marked indoor track lane" },
    keywords: ["Hyrox roxzone", "Hyrox transitions", "roxzone time", "Hyrox race tips"],
    intro: [
      "The roxzone is the area you pass through between the running course and every station. You enter it 16 times in a race, and the clock never stops. For many athletes, it adds up to several minutes of their finish time.",
      "You do not need to sprint through it. You just need to never stand still in it.",
    ],
    sections: [
      {
        heading: "Learn the layout before you race",
        paragraphs: [
          "Every venue is different. Before your wave, find the run course entry, the roxzone entry and exit, and where each station sits. Knowing where you are going saves seconds every time.",
        ],
      },
      {
        heading: "Walk with purpose",
        paragraphs: [
          "If you need a recovery, take it as a fast walk through the roxzone rather than a stop at the station. Walking keeps blood moving and your breathing settles just as well.",
        ],
      },
      {
        heading: "Have a routine for every station",
        paragraphs: ["A short routine stops you from wasting time thinking:"],
        list: [
          "Set the damper on the SkiErg and rower before you start.",
          "Chalk or dry your hands before the sleds and the carry, if allowed.",
          "Pick up the sandbag and wall ball in the same way every time in training.",
        ],
      },
      {
        heading: "Count it in your plan",
        paragraphs: [
          "Your goal time should include the roxzone. If your race plan adds up perfectly but ignores transitions, you will finish slower than expected. HighRocks builds roxzone time into your splits.",
        ],
      },
    ],
    quote: "Nobody remembers a fast roxzone. Everybody feels a slow one.",
    takeaways: [
      "The roxzone is the transition area and its time counts in your result.",
      "Learn the venue layout before your wave starts.",
      "Recover with a fast walk, never a full stop.",
      "Include roxzone time in your goal-time plan.",
    ],
  },
  {
    slug: "sandbag-lunges-and-the-back-half",
    title: "Sandbag lunges and the back half of Hyrox",
    excerpt:
      "The second half of a Hyrox race decides your result. Slow down slightly early, keep a steady lunge rhythm with your back knee touching every rep, and save something for the wall balls.",
    category: "Guides",
    published: "2026-09-29",
    image: { src: "/images/pages/drill-sandbag.png", alt: "Athlete lunging with a sandbag across the shoulders" },
    keywords: ["Hyrox sandbag lunges", "Hyrox back half", "Hyrox station 7", "lunge technique"],
    intro: [
      "Stations 5 to 8, the row, farmers carry, sandbag lunges and wall balls, are where Hyrox races are decided. Fatigue builds, runs slow down and small mistakes cost minutes.",
      "The sandbag lunges at station 7 are usually the slowest part of the back half. Here is how to get through them, and the stations around them, well.",
    ],
    sections: [
      {
        heading: "Lunge technique that holds up",
        paragraphs: [
          "Rest the sandbag across your shoulders, not your neck. Take a medium step, let your back knee touch the floor every rep, and stand up fully before the next step. A judge will ask you to repeat reps where the knee does not touch.",
          "Keep your chest up and your steps the same length. Short, steady steps are faster than long ones you cannot repeat.",
        ],
      },
      {
        heading: "Find a rhythm and keep it",
        paragraphs: [
          "Pick a pace you can hold without stopping, for example a breath per lunge. If you must rest, stand tall with the bag on your shoulders rather than putting it down; picking it back up costs energy.",
        ],
      },
      {
        heading: "Protect the run after it",
        paragraphs: [
          "After 100 m of lunges your legs will feel heavy on the final run. Expect it. Shorten your stride for the first 200 m and let your legs come back before you pick up the pace.",
        ],
      },
      {
        heading: "Train the back half on purpose",
        paragraphs: ["Back-half sessions teach you to keep moving when it hurts:"],
        list: [
          "1 km run, 200 m farmers carry, 50 m lunges, 50 wall balls, twice through.",
          "Lunges after a hard row, then a 1 km run at goal pace.",
        ],
      },
    ],
    quote: "The back half is where your race plan meets your training.",
    takeaways: [
      "Stations 5 to 8 decide most Hyrox results.",
      "Bag on the shoulders, back knee touches every rep.",
      "Pick a rhythm you can hold without putting the bag down.",
      "Shorten your stride at the start of the final run.",
    ],
  },
];
