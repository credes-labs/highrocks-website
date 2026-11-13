# HighRocks — Phase 1 Implementation Plan

> Master instruction document for Cursor Composer agent. Read this first. Reference .speckit/ docs for detail. Execute tasks in order. Do NOT skip tasks. Do NOT reorder phases. Each task has dependencies.

---

## 0\. Context for Composer

### What this project is

A Flutter \+ Supabase mobile app for HYROX athletes. 4 screens in Phase 1: Auth/Onboarding, Home Dashboard, Pace Calculator \+ Share Card, Drill Library. The pace calculator \+ shareable PNG card is the core product.

### How this repo is organized

```
highrocks/
├── lib/                          ← Flutter app code
├── assets/                       ← Local assets (icons, logo)
├── figma/                        ← Figma UI screenshots organized by user flow
│   ├── Splash Screen.png
│   ├── Home Screen.png
│   ├── onboarding 0/            ← Hook screens (3 variants)
│   ├── onboarding 1/            ← Goal screen
│   ├── first race onboarding flow screens/
│   │   ├── S3 - Find Race, S5 - About You
│   │   ├── Step 1B - Q1, Q2, Q3 (wizard)
│   │   ├── Step 3B - Wizard Summary
│   │   ├── Step 6 + Step 7 - Goal Setting and Breakdown
│   │   ├── S8+S9 - Equipment Setup
│   │   └── S10/S11 - Account screens
│   ├── race before onboarding flow screens/
│   │   ├── Step 2A - Race Data Import
│   │   ├── Step 6 + Step 7 - Goal Setting and Breakdown
│   │   ├── S8+S9 - Training + Equipment
│   │   └── S10/S11 - Account screens
│   ├── general fitness flow screens/
│   │   ├── S6+S7 - Fitness Baseline
│   │   ├── S8+S9 - Training + Equipment
│   │   └── S10/S11 - Account screens
│   ├── pace calculator screen/   ← Standalone pace calc
│   └── drill screens/            ← Library, Plan, Session
├── .speckit/                     ← Product specs (READ-ONLY reference)
│   ├── _index.md                 ← START HERE — implementation lookup
│   ├── global/                   ← G1–G7 docs
```

│   └── flows/                    ← F01–F04 docs └── docs/                         ← Source reference docs ├── F01\_onboarding\_flow.md ├── pace\_calculator\_spec.md └── pace\_calculator\_ux\_flows\_v2.md

```

### Figma File Lookup

Use PRIMARY path below. Full mapping with all variants in G3 Screen Inventory.

| Screen | Primary Figma Path |
|--------|-------------------|
| Splash | `figma/Splash Screen.png` |
| Hook (x3) | `figma/onboarding 0/S1 - Onboarding 0 - Splash Screen 1.png` (+ 2, 3) |
| Goal | `figma/onboarding 1/S2 - Onboarding 1 - Goal Screen - Active State.png` |
| Find Race | `figma/first race onboarding flow screens/S3 - Onboarding 2 - Find Race - Active State with Default Selection.png` |
| About You | `figma/first race onboarding flow screens/S5 - Onboarding 3 - About You - Inactive State.png` |
| Wizard Q1-Q3 | `figma/first race onboarding flow screens/Step 1B - Q1.png` (Q2, Q3) |
| Wizard Summary | `figma/first race onboarding flow screens/Step 3B - Wizard Summary.png` |
| Race Import | `figma/race before onboarding flow screens/Step 2A - Race Data Import.png` |
| Goal + Gap | `figma/first race onboarding flow screens/Step 6 + Step 7 - Goal Setting and Breakdown.png` |
| Fitness Baseline | `figma/general fitness flow screens/S6+S7 - Onboarding 4 - Fitness Baseline 1 - Active State with Running Experience.png` |
| Training Setup | `figma/race before onboarding flow screens/S8+S9 - Onboarding 5 - Training Setup - Active State with Experience.png` |
| Equipment Setup | `figma/first race onboarding flow screens/S8+S9 - Onboarding 6 - Equipments Setup - Active State with Experience.png` |
| Plan Preview | `figma/first race onboarding flow screens/S10 - Onboarding 6 - Account - Active State with Experience.png` |
| Account Creation | `figma/first race onboarding flow screens/S11 - Onboarding 7 - Account - Active State with Experience.png` |
| Home | `figma/Home Screen.png` |
| Pace Calculator | `figma/pace calculator screen/Pace Calculator.png` |
| Drill Library | `figma/drill screens/Drill Library Screen.png` |
| Drill Plan | `figma/drill screens/Drill Plan Screen.png` |
| Drill Session | `figma/drill screens/Drill Session Screen.png` |
| Processing | No Figma — build from spec |
| Profile Confirm | No Figma — build from spec |
| Branch Gate | No Figma — build from spec |
| Share Card 1080x1920 | No Figma — awaiting designer |

### Rules for Composer

1. **Read the referenced spec section BEFORE writing code.** Every task below has a `Read:` line. Open that file and read that section first.
2. **Match the Figma screenshot exactly.** When a Figma file is referenced, open the image from `figma/` and match layout, spacing, colors, typography pixel-for-pixel.
3. **Use design tokens from code, not raw values.** Never write `Color(0xFF101012)` inline. Always use `AppColors.background`. Same for typography, spacing, radius.
4. **One provider per concern.** Don't merge providers. Follow the provider map in G4.
5. **Error handling on every Supabase call.** Wrap in try/catch, report to Sentry, show appropriate UI feedback per G4 Error Handling Strategy.
6. **PostHog event on every user action.** Events are defined in each flow's .6 section.
7. **No TODO comments without a ticket.** If something is deferred to Phase 2, add a comment: `// Phase 2: [description]` — not `// TODO`.
8. **Test the pacing engine with unit tests.** This is the ONE thing that gets automated tests in Phase 1. See G7.

### Asset Conventions

- **Figma screenshots:** Named `S{##}_{screen_id}.png` matching G3 Screen Inventory numbering
- **Icons:** Uploaded to `assets/icons/` as SVG. Referenced via `SvgPicture.asset()`
- **Fonts:** Loaded via `google_fonts` package — no local font files. Archivo + Space Grotesk.
- **Station images:** Hosted on Cloudflare R2 at `${R2_CDN_BASE_URL}/stations/{slug}.webp`. NOT bundled in app.
- **App logo:** Uploaded to `assets/logo/` as SVG + PNG (for share card)

---

## PHASE A — Project Foundation

> Estimated: 1 day. No Figma dependency. No design needed.
> After this phase: project runs, shows blank screen, Supabase connected, tokens in code.

### Task A1: Flutter Project Init

```

flutter create highrocks \--org com.highrocks \--platforms ios,android cd highrocks

```

Create folder structure:

```

lib/ ├── app.dart ├── main.dart ├── core/ │   ├── theme/ │   │   ├── app\_colors.dart │   │   ├── app\_typography.dart │   │   ├── app\_spacing.dart │   │   └── app\_radius.dart │   ├── constants/ │   │   ├── station\_data.dart │   │   └── enums.dart │   └── utils/ │       ├── time\_formatter.dart │       └── validators.dart ├── features/ │   ├── auth/ │   │   ├── screens/ │   │   ├── providers/ │   │   └── widgets/ │   ├── onboarding/ │   │   ├── screens/ │   │   ├── providers/ │   │   ├── widgets/ │   │   └── pace\_subflow/ │   │       ├── screens/ │   │       ├── providers/ │   │       └── widgets/ │   ├── home/ │   │   ├── screens/ │   │   ├── providers/ │   │   └── widgets/ │   ├── pace\_calculator/ │   │   ├── screens/ │   │   ├── providers/ │   │   ├── engine/ │   │   ├── widgets/ │   │   └── models/ │   ├── share\_card/ │   │   ├── widgets/ │   │   └── controllers/ │   └── drill\_library/ │       ├── screens/ │       ├── widgets/ │       └── data/ └── routing/ └── router.dart

````

**Read:** G4 §Folder Structure
**Acceptance:** `flutter run` shows blank MaterialApp on simulator.
### Task A2: Dependencies

**Read:** G4 §Phase 1 Dependencies

Add all dependencies to `pubspec.yaml` exactly as listed in G4. Run `flutter pub get`. Verify no version conflicts.

**Acceptance:** `flutter pub get` succeeds with zero errors.

### Task A3: Environment Config

**Read:** G4 §Environment Config

Create `.env.dev` and `.env.prod` in project root with keys:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SENTRY_DSN`
- `POSTHOG_API_KEY`
- `POSTHOG_HOST`
- `R2_CDN_BASE_URL`

Add `.env.*` to `.gitignore`.

Update `main.dart`:

```dart
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:sentry_flutter/sentry_flutter.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  final env = const String.fromEnvironment('ENV', defaultValue: 'dev');
  await dotenv.load(fileName: '.env.$env');

  await Supabase.initialize(
    url: dotenv.env['SUPABASE_URL']!,
    anonKey: dotenv.env['SUPABASE_ANON_KEY']!,
  );

  await SentryFlutter.init(
    (options) {
      options.dsn = dotenv.env['SENTRY_DSN']!;
      options.environment = env;
      options.tracesSampleRate = 0.2;
    },
    appRunner: () => runApp(
      const ProviderScope(child: HighRocksApp()),
    ),
  );
}
````

**Read:** G4 §Observability Init for PostHog setup (add after Sentry init).

**Acceptance:** App launches with `--dart-define=ENV=dev`, connects to Supabase, Sentry captures test error.

### Task A4: Design Tokens

**Read:** G6 §2.8 (colors), §3.4 (typography), §4.3 (spacing), §5 (radius)

Create 4 files with EXACT values from G6:

**`lib/core/theme/app_colors.dart`** — Copy G6 §2.8 Flutter Implementation verbatim. All 17 color constants.

**`lib/core/theme/app_typography.dart`** — Copy G6 §3.4 Flutter Implementation. Import `google_fonts`. Define `displayXl`, `displayL`, `displayM`, `bodyM`, `bodyS`, `label`.

**`lib/core/theme/app_spacing.dart`** — Copy G6 §4.3. Define `xs` through `xxl` \+ `screenPadding` \+ `cardPadding`.

**`lib/core/theme/app_radius.dart`** — Copy G6 §5. Define `card`, `button`, `chip`, `input`, `sheet`.

**Acceptance:** All token files compile. No raw hex values anywhere — all via `AppColors.xxx`.

### Task A5: Constants & Utils

**Read:** G5 §Enum Registries, §Station Weights, §Time Format Rules

**`lib/core/constants/enums.dart`:** Define all enums from G5: `GoalType`, `Division`, `Gender`, `HyroxExperience`, `EquipmentProfile`, `ProfileSource`, `PaceProfileConfidence`, `RunFitnessBand`, `StationSlug`, `BiasLabel`, `OnboardingState`.

**`lib/core/constants/station_data.dart`:** Define `StationData` class and `kStations` list (8 items) with name, slug, baseWeight, distance from G5 §Station Weights. Leave `cues`, `mistakes`, `scalingOptions` as empty lists — content not yet written. Add comment: `// Content: product owner deliverable — fill before launch`.

**`lib/core/utils/time_formatter.dart`:** Implement `formatSplit()`, `formatTotal()`, `formatGap()` — copy directly from G5 §Time Format Rules code block.

**`lib/core/utils/validators.dart`:** Implement validation functions from G5 §Validation Rules:

- `validateBirthYear(int year)` → age ≥ 14  
- `validateFinishTime(int seconds)` → soft warn if outside 2700–9000  
- `validateTrainingDays(List<String> days, int required)` → count must match  
- `clampBias(double value)` → clamp to −1.0..+1.0  
- `isFactorInAutoRange(double ef, double sf)` → ef 0.92–1.08, sf 0.85–1.15

**Acceptance:** All constants compile. `formatTotal(4500)` returns `"1:15:00"`. `formatGap(330)` returns `"+5:30"`.

### Task A6: Supabase Schema

**Read:** G4 §Supabase Schema (full DDL for 3 tables \+ RLS)

In Supabase dashboard SQL editor, run:

1. `CREATE TABLE users (...)` — full DDL from G4  
2. `CREATE TABLE upcoming_races (...)` — full DDL from G4  
3. `CREATE TABLE pace_race_history (...)` — full DDL from G4  
4. All 6 RLS policies from G4  
5. Enable RLS on all 3 tables

Seed `upcoming_races` with 3–5 races for testing (Delhi, Dubai, Mumbai at minimum).

**Acceptance:** Supabase table explorer shows 3 tables with RLS enabled. Test INSERT/SELECT from SQL editor.

### Task A7: Dart Models

**Read:** G5 §Dart Model Classes (UserProfile, PaceConfig, SplitResult, StationData)

Create:

- `lib/features/pace_calculator/models/pace_config.dart` — PaceConfig class from G5  
- `lib/features/pace_calculator/models/split_result.dart` — SplitResult class from G5  
- `lib/features/auth/models/user_profile.dart` — UserProfile class from G5 with `fromJson()` and `toJson()`

**Read:** G5 §Supabase ↔ Dart Type Mapping for correct type casts in `fromJson()`.

**Acceptance:** All models compile. `UserProfile.fromJson(sampleMap)` creates valid object.

### Task A8: GoRouter \+ App Shell

**Read:** G4 §Navigation, F01.4 §GoRouter Redirect

**`lib/routing/router.dart`:**

- Define all routes from G4 §Navigation  
- Implement redirect guard logic from F01.4 (no session → /auth, session \+ \!onboarded → /onboarding, etc.)  
- Bottom nav ShellRoute with 5 icon slots (3 active \+ 2 locked)

**`lib/app.dart`:**

- MaterialApp.router with GoRouter  
- ThemeData using AppColors.background as scaffold background  
- SystemUiOverlayStyle.light for status bar

**Read:** G6 §10.1 for bottom nav bar specs (height, icon size, active/inactive colors, no labels).

**Acceptance:** App launches → shows bottom nav with 5 icons. Tapping locked icons shows snackbar "Coming in Phase 2". GoRouter redirects unauthenticated user to /auth.

### Task A9: Global Providers

**Read:** G4 §Provider Architecture Map (top section: supabaseProvider, authStateProvider)

**`lib/core/providers/supabase_provider.dart`:**

```dart
final supabaseProvider = Provider<SupabaseClient>((ref) {
  return Supabase.instance.client;
});
```

&nbsp;

**`lib/core/providers/auth_provider.dart`:**

```dart
final authStateProvider = StreamProvider<AuthState>((ref) {
  return ref.read(supabaseProvider).auth.onAuthStateChange;
});
```

&nbsp;

**Acceptance:** Providers compile. `ref.read(supabaseProvider)` returns Supabase client.

---

**CHECKPOINT A:** App runs. Supabase connected. Tokens in code. Router works. Models compile. Zero Figma dependency in this phase.

## PHASE B — Auth & Onboarding

> Estimated: 3–4 days. Heavy Figma dependency. After this phase: user can sign up, complete onboarding, land on Home.

### Task B1: Splash Screen (S01, S02)

**Read:** F01 §F01.1 (flow overview), F01\_onboarding\_flow.md §3 (Screen Index) **Figma:** `figma/Splash Screen.png`, `figma/onboarding 0/S1 - Onboarding 0 - Splash Screen 1.png` (+ variants 2, 3)\`

**Files:**

- `lib/features/auth/screens/splash_screen.dart` — app logo centered, auto-advances or user taps  
- `lib/features/auth/screens/hook_screen.dart` — "Get Started" \+ "I Already Have An Account"

**Logic:**

- "Get Started" → navigates to `/onboarding/goal`  
- "I Already Have An Account" → navigates to `/auth/login` (Onboarding\_7 in login mode)

**Acceptance:** Both screens render matching Figma. Taps navigate correctly.

### Task B2: Onboarding Notifier

**Read:** F01\_onboarding\_flow.md §2 (User States), §4 (Data Model — Inputs Collected Per Screen) **Read:** F01 §F01.4 (Providers)

**`lib/features/onboarding/providers/onboarding_notifier.dart`:**

StateNotifier that accumulates ALL onboarding answers across screens:

- `goalType`, `raceId`, `raceDate`, `division`, `weeksToRace`  
- `gender`, `birthYear`, `ageGroup`, `hyroxExperience`  
- `engineFactor`, `strengthFactor`, `teamSize`, `teamEfficiency`  
- `targetTimeSeconds`, `biasValue`, `profileSource`, `paceProfileConfidence`  
- `runFitnessBand` (general fitness path only)  
- `trainingDaysPerWeek`, `sessionDurationMinutes`, `trainingDays`  
- `equipmentProfile`, `stationsTrained`  
- `notificationOptIn`  
- `currentStep` (for resume logic)

Methods:

- `setGoalType(GoalType)` — triggers path fork  
- `setRace(String raceId, DateTime date, Division div)` — computes weeksToRace  
- `setAboutYou(Gender, int birthYear, HyroxExperience)` — computes ageGroup  
- `setPaceProfile(double ef, double sf, ...)` — from wizard or import  
- `setSchedule(...)` — training setup  
- `setEquipment(...)` — equipment setup  
- `toUserProfileJson()` — builds the full JSON map for Supabase upsert  
- `persistToStorage()` — saves JSON snapshot to flutter\_secure\_storage after each step  
- `restoreFromStorage()` — rehydrates from flutter\_secure\_storage on cold start

**Read:** F01\_onboarding\_flow.md §4 §Storage for persistence pattern details.

**Acceptance:** Notifier accumulates state across screens. `toUserProfileJson()` produces valid JSON matching `users` table schema. `persistToStorage()` \+ `restoreFromStorage()` round-trips correctly.

### Task B3: Goal Screen (S03)

**Read:** F01\_onboarding\_flow.md §3 Path A/B fork, §6 UX Patterns (Goal\_Screen) **Figma:** `figma/onboarding 1/S2 - Onboarding 1 - Goal Screen - Active State.png`

**`lib/features/onboarding/screens/goal_screen.dart`:**

- Two full-bleed tap cards: "Prep for a race" / "Build general fitness"  
- Tap navigates immediately — no confirm button  
- On tap: `onboardingNotifier.setGoalType(...)` → GoRouter navigates based on type  
  - `race_prep` → `/onboarding/find-race`  
  - `general` → `/onboarding/fitness-baseline`  
- Step indicator shows step 1

**Read:** G6 §7.3 (Selectable Card), §18.3 (reusable patterns — tap cards)

**Acceptance:** Cards render matching Figma. Tap "race prep" → Find Race. Tap "general fitness" → Fitness Baseline. No confirm button.

### Task B4: Find Race Screen (S04)

**Read:** F01\_onboarding\_flow.md §3 (Onboarding\_2), §4 (race\_id, race\_date, division fields), §6 (Find\_Race input pattern) **Figma:** `figma/first race onboarding flow screens/S3 - Onboarding 2 - Find Race - Active State with Default Selection.png` (+ Inactive State variant)\`

**`lib/features/onboarding/screens/find_race_screen.dart`:**

- Search bar at top → filters `upcoming_races` table  
- Race rows: name, city, date. Tap to expand → show date \+ division selector inline  
- "This Is My Race" CTA — gated until race expanded \+ date \+ division selected  
- "My race isn't listed" → manual entry modal (name, city, date picker, division)  
- Inline advisory if `weeks_to_race < 6`: "Tight window — plan will be compressed"  
- Computes `weeksToRace` on race selection

**`lib/features/onboarding/providers/race_search_provider.dart`:**

- FutureProvider that queries `upcoming_races` from Supabase  
- Filtered by search text

**Read:** G6 §8.2 (List Row selector variant), §9.1 (text input for search) **Read:** F01\_onboarding\_flow.md §8 Race Selection Edge Cases

**Acceptance:** Race list loads from Supabase. Search filters. Tap expands row. Division selector works. CTA gates correctly. Manual entry modal works.

### Task B5: About You Screen (S05)

**Read:** F01\_onboarding\_flow.md §3 (Onboarding\_3), §4 (gender, birth\_year, hyrox\_experience), §6 (About\_You input pattern) **Figma:** `figma/first race onboarding flow screens/S5 - Onboarding 3 - About You - Inactive State.png`

**`lib/features/onboarding/screens/about_you_screen.dart`:**

- Gender selector: chip group (male, female, non-binary, prefer not to say) — single select  
- Birth year: number input or drum picker. Validation: 4-digit, age ≥ 14\.  
- Experience toggle: two cards — "This is my first HYROX" / "I've raced before" — single select  
- CTA: "Calculate Your Pace →" — gated until all 3 fields answered  
- On CTA tap: navigate based on `hyroxExperience`:  
  - `first` → `/onboarding/pace/wizard` (Path 1B)  
  - `veteran` → `/onboarding/pace/import` (Path 2A)

**Read:** G6 §8.1 (Chip selector for gender), §8.2 (Tier card for experience toggle), §9.1 (text input for birth year)

**Acceptance:** All 3 inputs work. CTA gated until complete. Experience toggle routes correctly.

### Task B6: Pace Sub-flow — Wizard Path (S06, S07)

**Read:** pace\_calculator\_ux\_flows\_v2.md §Scenario 1 Path 1B (Wizard Q1–Q4 \+ Summary) **Read:** G5 §Factor Mappings (wizard path values) **Figma:** `figma/first race onboarding flow screens/Step 1B - Q1.png`, `Step 1B - Q2.png`, `Step 1B - Q3.png`, `figma/first race onboarding flow screens/Step 3B - Wizard Summary.png`

**`lib/features/onboarding/pace_subflow/screens/wizard_screen.dart`:**

- PageView with 4 questions (Q3 conditional → Q4 only if Doubles)  
- Each question: label \+ 3–4 selectable cards with plain-language labels  
- Factor values set silently — no numbers shown to user  
- Progress indicator within sub-flow (not top-level onboarding counter)  
- All questions must be answered before Next activates

**`lib/features/onboarding/pace_subflow/screens/wizard_summary_screen.dart`:**

- Shows computed engine\_factor \+ strength\_factor with plain-language labels  
- "These are starting estimates" disclaimer  
- Two CTAs: "Looks right, continue" → Step 6 \| "Adjust" → inline factor sliders → confirm → Step 6  
- Sets `profileSource = 'wizard'`, `paceProfileConfidence = 'estimated'`

**Read:** G6 §8.2 (Tier Card selector for Q1–Q4), §18.3 (reusable patterns)

**Acceptance:** Wizard collects 3–4 answers. Q4 conditional on Doubles. Summary shows correct factors per G5 mapping table. Adjust sliders work.

### Task B7: Pace Sub-flow — Import Path (S08, S09, S10)

**Read:** pace\_calculator\_ux\_flows\_v2.md §Scenario 1 Path 2A (Import → Processing → Confirmation) **Read:** pace\_calculator\_spec.md §5.6 (factor back-calculation math) **Figma:** `figma/race before onboarding flow screens/Step 2A - Race Data Import.png` (S09 Processing \+ S10 Confirmation: No Figma — build from spec)\`

**`lib/features/onboarding/pace_subflow/screens/import_screen.dart`:**

- Finish time input: HH:MM:SS (3 separate fields)  
- 8 optional station split fields (MM:SS per station)  
- Soft validation: warn if finish time outside 2700–9000s, warn if splits implausible  
- "Not sure? Find your result at hyrox.com →" link  
- CTA: "Continue" → fires back-calculation

**`lib/features/onboarding/pace_subflow/screens/processing_screen.dart`:**

- Brief loading animation (\< 1 second). "Calculating your profile..."  
- Runs back-calculation in background → navigates to confirmation

**`lib/features/onboarding/pace_subflow/screens/profile_confirmation_screen.dart`:**

- Shows: Your Race vs Model Expected for runs \+ stations \+ per-station breakdown  
- engine\_factor \+ strength\_factor with plain-language labels  
- "Looks right, continue" → Step 6 \| "Adjust manually" → sliders → Step 6  
- Sets confidence based on splits provided (all \= high, some \= medium, none \= low)

**Acceptance:** Import captures finish time \+ optional splits. Back-calc produces plausible factors. Confirmation shows correct comparison table.

### Task B8: Pace Sub-flow — Goal Setting \+ Gap Breakdown (S11, S12)

**Read:** pace\_calculator\_ux\_flows\_v2.md §Step 6 (Goal Setting), §Step 7 (Gap Breakdown) **Read:** F03 §F03.2 (Goal Setting screen layout, Gap Breakdown layout) **Read:** F03 §F03.4 (engine logic — needed to compute T\_final live) **Figma:** `figma/first race onboarding flow screens/Step 6 + Step 7 - Goal Setting and Breakdown.png` (combined comp)\`

**`lib/features/onboarding/pace_subflow/screens/goal_setting_screen.dart`:**

- Target time input: HH:MM:SS fields, pre-filled if available  
- Percentile context: "Not sure? Find recent results →" link to hyrox.com  
- Live-updating: T\_final, gap, percentile label all recompute on every input change  
- Bias slider: conservative ↔ aggressive, default 0.0  
- Soft advisories per F03.5 (gap \> 15min, already achievable, etc.)  
- CTA: "Set this goal"

**`lib/features/onboarding/pace_subflow/screens/gap_breakdown_screen.dart`:**

- Stations sorted by gap size descending  
- Each row: station name, Race 1 time (if import), target time, gap, proportional bar  
- Runs section: per-km improvement needed  
- Focus advisory: "Focus on \[top 2 stations\] first."  
- Wizard path: all values with \~ prefix  
- CTA: "Continue" → exits sub-flow → `/onboarding/training-setup`

**CRITICAL:** This task requires the PacingEngine to be built. See Task C1. If doing Phase B before C, stub the engine with hardcoded outputs and come back to wire it after C1.

**Acceptance:** Goal setting shows live T\_final. Gap breakdown sorts by gap. Sub-flow exits to Training Setup.

### Task B9: General Fitness Path — Fitness Baseline (S13)

**Read:** F01\_onboarding\_flow.md §3 Path B, §4 (run\_fitness\_band), §6 (Fitness\_Baseline\_1 input pattern) **Figma:** `figma/general fitness flow screens/S6+S7 - Onboarding 4 - Fitness Baseline 1 - Active State with Running Experience.png`

**`lib/features/onboarding/screens/fitness_baseline_screen.dart`:**

- 4 stacked cards: Runner, Strong, Intermediate, Beginner  
- Single-select — tap selects, no explicit Next held  
- Sets `runFitnessBand` → derives `engineFactor` per G5 §Factor Mappings (General fitness path)  
- Navigates to `/onboarding/training-setup`

**Read:** G6 §8.2 (Tier Card selector)

**Acceptance:** 4 cards render. Tap selects and navigates. Correct engine\_factor mapped.

### Task B10: Shared Tail — Training Setup \+ Equipment Setup (S14, S15)

**Read:** F01\_onboarding\_flow.md §3 (Onboarding\_5), §4 (training fields), §6 (Training\_Setup \+ Equipment\_Setup input patterns) **Figma:** `figma/race before onboarding flow screens/S8+S9 - Onboarding 5 - Training Setup - Active State with Experience.png`, `figma/first race onboarding flow screens/S8+S9 - Onboarding 6 - Equipments Setup - Active State with Experience.png`

**Training Setup (`lib/features/onboarding/screens/training_setup_screen.dart`):**

- Days/week: 4-segment control (3/4/5/6). "Recommended" badge on 4\.  
- Session duration: time picker (45/60/75/90 min). "Recommended" badge on 60\.  
- Day picker: 7 pill chips (Mon–Sun). Multi-select. Count must equal selected days/week — Next gated until exact match.  
- Computed feedback card: "That's X sessions before race day — Tight / Solid / Plenty"  
  - Tight: \< 20 sessions. Solid: 20–40. Plenty: \> 40\.

**Equipment Setup (`lib/features/onboarding/screens/equipment_setup_screen.dart`):**

- 3 preset cards: Hyrox Gym / Standard Gym / Home — single select  
- Station familiarity grid: 2×4 grid of 8 stations — multi-select (which stations have you trained?)  
- CTA: "Next"

**Read:** G6 §8 (selection system — chips for days, grid cards for stations, tier cards for preset)

**Acceptance:** Day picker enforces exact count. Feedback card computes correctly. Equipment preset \+ station grid save to notifier.

### Task B11: Plan Preview \+ Account Creation (S16, S17)

**Read:** F01 §F01.2 (Auth UX/UI Spec — full section), F01 §F01.3 (Auth Data Flow) **Read:** F01\_onboarding\_flow.md §3 (Onboarding\_6, Onboarding\_7) **Figma:** `figma/first race onboarding flow screens/S10 - Onboarding 6 - Account - Active State with Experience.png`, `figma/first race onboarding flow screens/S11 - Onboarding 7 - Account - Active State with Experience.png`

**Plan Preview (`lib/features/onboarding/screens/plan_preview_screen.dart`):**

- Summary of collected inputs: race, division, factors (or fitness band), schedule  
- Pace profile card preview (if race prep path — shows T\_final, gap)  
- Notification opt-in toggle  
- CTA: "Create Account"

**Account Creation (`lib/features/auth/screens/auth_screen.dart`):**

- Google OAuth button (full-width, white bg, Google G icon) — all platforms  
- Apple Sign-In button (full-width, white bg, Apple icon) — iOS only (detect via `Platform.isIOS`)  
- Divider: "— or —"  
- Email \+ Password \+ Confirm Password fields  
- CTA: "Create Account" (email path)  
- Toggle: "Already have an account? Log in" ↔ "Don't have an account? Sign up"  
- Login mode: Email \+ Password only (no confirm), CTA: "Log In"

**Auth flow on success:**

```dart
// 1. Supabase auth (Google/Apple/Email)
// 2. onboardingNotifier.toUserProfileJson() → upsert to users table
// 3. If import path: insert to pace_race_history table
// 4. Set onboarding_complete = true
// 5. Persist session via Supabase built-in
// 6. Navigate to /home
```

&nbsp;

**Read:** F01 §F01.5 for all auth error cases (OAuth failure, email exists, weak password, network error, plan gen failure)

**Acceptance:** Google OAuth works on both platforms. Apple Sign-In shows on iOS only. Email signup creates user \+ profile row. Login works for returning users. Error cases handled per spec.

### Task B12: Session Restore

**Read:** F01 §F01.3 (Session Management), F01.4 (GoRouter Redirect)

**`lib/features/auth/providers/session_restore_provider.dart`:**

- On app cold start: check flutter\_secure\_storage for Supabase session  
- If valid session → refresh token → check `onboarding_complete` from `users` table  
- Route: valid \+ complete → `/home`, valid \+ incomplete → `/onboarding/{lastStep}`, no session → `/auth`  
- If onboarding incomplete pre-auth: rehydrate OnboardingNotifier from flutter\_secure\_storage

**Acceptance:** Kill app mid-onboarding → reopen → resumes at correct step. Kill app post-auth → reopen → lands on Home. Uninstall → reinstall → starts fresh (pre-auth state lost).

### Task B13: Onboarding Analytics

**Read:** F01 §F01.6 (all events)

Wire PostHog events at each transition point:

- `onboarding_started` on Hook Screen "Get Started" tap  
- `goal_selected` on Goal Screen card tap  
- `race_selected` on Find Race CTA  
- `pace_subflow_entered` on About You CTA (with entry\_path)  
- `pace_subflow_completed` on Gap Breakdown "Continue"  
- `schedule_set` on Equipment Setup "Next"  
- `onboarding_completed` on auth success (full properties)  
- `onboarding_dropped` — fire on app background if onboarding not complete (with last\_screen)

**Acceptance:** Events fire at correct moments with correct properties. Verify in PostHog debug panel.

---

**CHECKPOINT B:** Full onboarding flow works end-to-end. Both paths (race prep \+ general fitness). Both pace sub-flow branches (wizard \+ import). Auth creates user. Profile saved to Supabase. Session restore works.

---

## PHASE C — Pacing Engine

> Estimated: 1 day. Zero Figma dependency. Pure Dart logic. After this phase: engine computes correct splits. Unit tests pass.

### Task C1: Pacing Engine Class

**Read:** F03 §F03.4 (full State Logic section), pace\_calculator\_spec.md §5 (Core Logic — complete math) **Read:** G5 §Station Weights (default values)

**`lib/features/pace_calculator/engine/pacing_engine.dart`:**

Pure static class. No state. No network. No side effects.

```dart
class PacingEngine {
  static SplitResult compute(PaceConfig config) {
    // Step 1: Base allocation (58/38/4 + bias adjustment)
    // Step 2: Station weight normalization
    // Step 3: Engine factor → run_time
    // Step 4: Strength factor → all station_times
    // Step 5: Format modifier (Doubles only)
    // Step 6: T_final = run + stations + transition
    // Step 7: Drill goals = station_time × 0.90
    // Return SplitResult
  }
}
```

&nbsp;

Follow the exact formulas from F03 §F03.4. Do NOT renormalize T\_final to match target.

### Task C2: Factor Back-Calculation

**Read:** pace\_calculator\_spec.md §5.6 (Factor back-calculation from actual performance)

**`lib/features/pace_calculator/engine/factor_calculator.dart`:**

```dart
class FactorCalculator {
  /// Back-calculate engine_factor from actual run time
  static double computeEngineFactor(int actualRunTime, int totalTimeTarget, double bias) {
    final modelRunTime = (0.58 + bias * 0.06) * totalTimeTarget;
    return actualRunTime / modelRunTime;
  }

  /// Back-calculate strength_factor from actual station times
  static double computeStrengthFactor(List<int> actualStationTimes, int totalTimeTarget, double bias, List<double> weights) {
    final modelWorkTime = (0.38 - bias * 0.06) * totalTimeTarget;
    final totalWeight = weights.reduce((a, b) => a + b);
    final modelAvg = modelWorkTime / 8;
    final actualAvg = actualStationTimes.reduce((a, b) => a + b) / actualStationTimes.length;
    return actualAvg / modelAvg;
  }
}
```

&nbsp;

**Acceptance:** Given Race 1 finish time 1:22:00 with sample splits → back-calculated factors are within plausible range (ef: 0.92–1.08, sf: 0.85–1.15).

### Task C3: Pacing Engine Unit Tests

**Read:** G7 §Pacing Engine test cases (full matrix)

**`test/pacing_engine_test.dart`:**

Write unit tests for EVERY row in G7 test matrix:

- Default allocation (T=4500, ef=1.0, sf=1.0, bias=0) → verify exact outputs  
- Aggressive bias → verify run\_share \= 0.64  
- Conservative bias → verify run\_share \= 0.52  
- Engine factor slow → run\_time increases, T\_final \> target  
- Strength factor slow → station\_times increase, T\_final \> target  
- Doubles format → station\_times ≈ 56% of solo at team\_eff=0.90  
- Zero target time → all outputs 0, no crash  
- Extreme bias ±1.0 → valid outputs  
- Factor at boundary → no clamping errors  
- T\_final ≠ target when modifiers ≠ 1.0

**Additional tests:**

- Verify station weights sum normalization: changing one weight redistributes all  
- Verify drill goals \= station\_time × 0.90 for all 8 stations  
- Verify run\_pct \+ work\_pct \+ transition\_pct ≈ 1.0

**Acceptance:** `flutter test` — ALL tests pass. This is the one automated test gate in Phase 1\.

---

## **CHECKPOINT C:** Pacing engine is a pure, tested Dart class. Can be used anywhere. Now wire it to UI.

## PHASE D — Home Dashboard \+ Pace Calculator UI

> Estimated: 2–3 days. Heavy Figma dependency. After this phase: Home renders all 3 states. Pace calculator works from homepage.

### Task D1: Home Dashboard Providers

**Read:** F02 §F02.3 (Data Interactions), §F02.4 (State Logic) **Read:** G4 §Provider Architecture Map (Home section)

**`lib/features/home/providers/user_profile_provider.dart`:**

- FutureProvider — fetches user row from Supabase, returns UserProfile model  
- Invalidated on: return from pace calculator, pull-to-refresh, app foreground resume

**`lib/features/home/providers/dashboard_providers.dart`:**

- `countdownProvider` — computed from userProfileProvider.raceDate  
- `paceProfileStateProvider` — returns `unactivated` / `activated` / `estimated` per F02.4 derivation logic  
- `factorLabelsProvider` — plain-language labels from engine\_factor \+ strength\_factor per F02.2 table

**Acceptance:** Providers compile. Profile fetch works. State derivation returns correct enum.

### Task D2: Home Dashboard Screen (S18)

**Read:** F02 (full doc — all 6 sections) **Figma:** `figma/Home Screen.png`

**`lib/features/home/screens/home_screen.dart`:**

Widgets to build:

**`lib/features/home/widgets/pace_profile_card.dart`:**

- 3 states based on `paceProfileStateProvider`:  
  - Unactivated: "Not set up yet" \+ "Set up now →" CTA  
  - Activated: T\_final, gap (colored per F03.2 Display Formats), factor labels, days to race  
  - Estimated: same as activated \+ \~ prefix \+ "estimated" badge \+ calibration prompt  
- Tap: navigates to /pace (Scenario 2\) or /pace/setup (Scenario 3\)  
- Uses HeroCard style from G6 §7.2

**`lib/features/home/widgets/race_countdown_card.dart`:**

- Reads raceDate from profile  
- Displays per F02.2 countdown rules (\>7 days, ≤7 days, race day, past)  
- No race date: "No race selected" prompt

**`lib/features/home/widgets/quick_action_grid.dart`:**

- 2×2 grid of tiles  
- Pace Calculator \+ Drill Library: active, navigate on tap  
- Simulator \+ Leaderboard: 40% opacity, lock icon, snackbar on tap  
- Uses DefaultCard style from G6 §7.1

**`lib/features/home/widgets/training_streak_badge.dart`:**

- Reads trainingStreak from profile  
- Displays per F02.2 streak rules

**Read:** G6 §14.1 (shimmer loading while profile fetches), §14.2 (empty states), §14.3 (error states)

**Acceptance:** Home renders correctly in all 3 states. Pull-to-refresh works. Shimmer during load. Error banner on network failure.

### Task D3: Pace Calculator — Homepage Providers

**Read:** F03 §F03.4 (Providers section), G4 §Provider Architecture Map (Pace Calculator section)

**`lib/features/pace_calculator/providers/pace_input_notifier.dart`:**

- StateNotifier holding: goalTime, bias, engineFactor, strengthFactor, teamSize, teamEfficiency  
- Seeded from UserProfile on screen mount  
- Every setter triggers `paceSplitsProvider` recomputation

**`lib/features/pace_calculator/providers/pace_splits_provider.dart`:**

- Computed Provider — reads paceInputNotifier, runs `PacingEngine.compute()`, returns SplitResult  
- Recomputes on EVERY input change (goal time, bias, any factor)  
- This is what makes the live-updating Goal Setting screen work

**Acceptance:** Changing any input → splits recompute instantly. No network call.

### Task D4: Pace Calculator — Homepage Screens (S19, S20, S11, S12)

**Read:** pace\_calculator\_ux\_flows\_v2.md §Scenario 2 (full), §Scenario 3 (full) **Read:** F03 §F03.1 (3-scenario architecture — which screens shown per scenario) **Figma:** Branch Gate: ❌ No Figma — build from spec. Race Selection: reuses `figma/first race onboarding flow screens/S3 - Onboarding 2 - Find Race - Active State with Default Selection.png`. Goal \+ Gap: reuse from Phase B.

**Scenario routing logic (**`lib/features/pace_calculator/screens/pace_router_screen.dart`**):**

```dart
// On pace calculator open from home:
final profile = ref.read(userProfileProvider);
if (profile.paceProfileConfidence == null && profile.targetTimeSeconds == null) {
  // Scenario 3: no profile → show branch gate
  navigate('/pace/setup');
} else if (profile.raceId == null) {
  // Scenario 2: profile exists, no race → show race selection
```

&nbsp;

navigate('/pace/race-select'); } else { // Scenario 2: profile \+ race → show goal setting pre-filled navigate('/pace/goal'); }

````

**Screens to build (if not already built in Phase B):**
- Branch Gate (S19): "I have race data" / "Set up without" — two cards. Reuse from pace_calculator_ux_flows_v2.md Scenario 3 Step 1B.
- Race Selection (S20): same as Find Race but standalone, not inside onboarding. Hard gate.
- Goal Setting: reuse from Task B8. In S2: pre-filled, shows "Update goal" CTA. In S3: shows ~ prefix for wizard path.
- Gap Breakdown: reuse from Task B8. In S2: only shown if goal changed. In S3: shows ~ prefix.

**Key difference from onboarding:** after Gap Breakdown, navigate to `/home` (not to Training Setup). Profile saved to Supabase immediately.

**Read:** pace_calculator_ux_flows_v2.md §Screen Reuse Map for exact reuse rules.

**Acceptance:** S2 opens pre-filled. S3 shows branch gate. Both paths end on Home with updated profile.
### Task D5: Pace Calculator Analytics

**Read:** F03 §F03.6 (all events)

Wire PostHog events:
- `pace_calc_opened` with scenario + profile_exists
- `pace_branch_selected` with path
- `pace_import_completed` with splits_provided count + confidence
- `pace_wizard_completed` with factors
- `pace_goal_set` with target_time, T_final, gap, bias_value, confidence
- `pace_goal_updated` with old/new target, gap delta
- `pace_gap_breakdown_viewed` with top 2 stations, total gap

**Acceptance:** Events fire at correct moments. Verify in PostHog debug.

---

**CHECKPOINT D:** Home Dashboard renders all 3 states. Pace calculator works in all 3 scenarios from homepage. Engine computes live. Profile saves to Supabase.

---

## PHASE E — Share Card

> Estimated: 1 day. Figma dependency for card layout.
> After this phase: user can generate + share a PNG card.

### Task E1: Share Card Widget

**Read:** F04 (full doc — all 6 sections)
**Read:** G6 §15 (Share Card Design Tokens)
**Figma:** `No Figma — awaiting designer`

**`lib/features/share_card/widgets/share_card_widget.dart`:**

A StatelessWidget that renders the full 1080×1920 card layout. NOT a screen — a widget inside the pace calculator.

Build EXACTLY per F04 §F04.2 Card Anatomy:
- App logo (top-left) — from `assets/logo/`
- Division badge (top-right) — pill shape, accent bg, background text
- Target time — Archivo Semibold 72px, accent color
- Run/station summary — Archivo Semibold 28px + percentages
- 8 station split rows — name left, dotted leader, time right
- Pace strategy label — CONSERVATIVE / BALANCED / AGGRESSIVE per bias thresholds in F04.2
- Watermark — "@highrocks", text-disabled, 10px, bottom-center
- 2px outer border in `#2A2A2F`

Use ONLY design tokens (AppColors, AppTypography). No raw values.

**Acceptance:** Card renders correctly. Matches Figma pixel-for-pixel. All data from SplitResult + UserProfile.
### Task E2: Share Card Export Pipeline

**Read:** F04 §F04.3 (Export Pipeline — code block), §F04.4 (State Logic, Pre-render Strategy, Font Loading)

**`lib/features/share_card/controllers/share_card_controller.dart`:**
- StateNotifier with states: `idle → preRendering → ready → exporting → done | error`
- Wraps ShareCardWidget in RepaintBoundary with GlobalKey
- Pre-renders PNG bytes on EVERY split change (not on share tap) — cache in state
- On share tap: save to gallery via `image_gallery_saver` + open share sheet via `share_plus`

**Integration point:** Add Share button to Goal Setting screen (and Gap Breakdown "Share card" action). Button reads `shareCardController` state — disabled while preRendering, enabled when ready.

**Font loading:** On pace calculator screen mount:
```dart
await GoogleFonts.pendingFonts(); // ensures Archivo + Space Grotesk loaded
````

**Platform permissions:**

- iOS: add `NSPhotoLibraryAddUsageDescription` to `ios/Runner/Info.plist`  
- Android: `image_gallery_saver` handles permission request internally

**Read:** F04 §F04.5 for edge cases (permission denied, font not loaded, share cancelled)

**Acceptance:** Tap Share → card saves to gallery \+ share sheet opens in \< 500ms. Test on iOS \+ Android. Card looks correct on WhatsApp preview (no bleed — border works).

### Task E3: Share Card Analytics

**Read:** F04 §F04.6 (all events)

Wire PostHog events:

- `share_card_generated` with target\_time, division, bias\_label, confidence  
- `share_card_shared` with gallery\_saved boolean  
- `share_card_cancelled`  
- `share_card_error` with error\_type

**Acceptance:** Events fire correctly.

---

**CHECKPOINT E:** User can generate splits → tap Share → PNG in share sheet. The viral loop is functional.

---

## PHASE F — Drill Library

> Estimated: 1 day. Figma dependency for grid \+ detail sheet. After this phase: all 8 stations browsable.

### Task F1: Station Data

**Read:** G5 §Station Weights, StationData model

**`lib/features/drill_library/data/station_data.dart`:** Define `kStations` — `List<StationData>` constant with all 8 stations.

- name, slug, baseWeight, distance from G5  
- imageUrl: `'${dotenv.env['R2_CDN_BASE_URL']}/stations/{slug}.webp'`  
- cues, mistakes, scalingOptions: populate from product owner's content. If not yet written, use placeholder: `['Content pending — see spec-kit notes']`

**Acceptance:** `kStations.length == 8`. All slugs match G5 enum.

### Task F2: Drill Library Grid Screen (S22)

**Figma:** `figma/drill screens/Drill Library Screen.png`

**`lib/features/drill_library/screens/drill_grid_screen.dart`:**

- 2×4 grid of station cards  
- Each card: station icon/glyph \+ name \+ difficulty badge (relative weight from baseWeight)  
- Tap any card → opens StationDetailSheet (bottom sheet)  
- Uses GridCardSelector pattern from G6 §8.2

**`lib/features/drill_library/widgets/station_card.dart`:**

- DefaultCard style (G6 §7.1)  
- CachedNetworkImage for station image with shimmer placeholder  
- Station name in bodyM typography  
- DifficultyBadge showing relative weight

**`lib/features/drill_library/widgets/difficulty_badge.dart`:**

- Visual indicator of station difficulty relative to others  
- Highest weight (1.30 — Wall Balls, Burpee BJ) → "Hard"  
- Lowest weight (0.90 — Farmers Carry) → "Easy"  
- Middle → "Medium"

**Acceptance:** Grid shows all 8 stations. Images load from R2 with shimmer. Badge shows correct relative difficulty.

### Task F3: Station Detail Bottom Sheet (S23)

**Figma:** `figma/drill screens/Drill Library Screen.png` (+ `Drill Plan Screen.png`, `Drill Session Screen.png`

**`lib/features/drill_library/widgets/station_detail_sheet.dart`:**

- Bottom sheet with 16px top border radius (G6 §5)  
- Sections: station image (hero), movement description, key cues, common mistakes, scaling options  
- Content from `kStations[index]` — static, no network  
- Swipe-down or tap backdrop to dismiss

**`lib/features/drill_library/providers/drill_providers.dart`:**

- `selectedStationProvider` — StateProvider\<String?\> tracks which sheet is open

**Read:** G6 §13.1 (bottom sheet open/close animation: 300ms decelerate / 250ms accelerate)

**Acceptance:** Tap station card → sheet opens with correct content. Dismiss works. No network calls.

---

**CHECKPOINT F:** Drill library complete. All 8 stations browsable. Images load from CDN.

---

## PHASE G — Polish \+ Testing

> Estimated: 1–2 days. No new features. After this phase: app is shippable.

### Task G1: Animation Pass

**Read:** G6 §13 (Motion & Animation — full timing table)

Add animations:

- Onboarding step transitions: 300ms easeInOut  
- Card selection toggle: 150ms easeInOut  
- Split row list stagger: 50ms per item, max 8 items (pace calculator)  
- Share card slide-in: 400ms spring (damping 0.7)  
- Bottom sheet: 300ms decelerate open, 250ms accelerate close  
- Button press: 100ms easeOut opacity feedback  
- Value changes (countdown, T\_final): 200ms easeOut

Use `flutter_animate` for declarative composition.

**Acceptance:** All animations feel subtle and fast. No jank. No bounce on functional elements.

### Task G2: Loading, Empty, and Error States Audit

**Read:** G6 §14 (Loading, Empty, Error states — full rules), G4 §Error Handling Strategy

Audit EVERY screen against these checklists:

**Loading:**

- [ ] Profile fetch on Home → shimmer placeholders on pace profile card \+ countdown card  
- [ ] Race list fetch on Find Race → shimmer rows  
- [ ] Station images on Drill Library → shimmer placeholders via CachedNetworkImage  
- [ ] Auth buttons during OAuth → spinner inside button, maintain dimensions

**Empty states:**

- [ ] Home: no race date → "No race selected" prompt in countdown card  
- [ ] Home: streak \= 0 → "0 day streak — start training\!" (never hide)  
- [ ] Home: unactivated profile → full setup prompt card  
- [ ] Pace calculator: no splits yet → Share button disabled (40% opacity)

**Error states:**

- [ ] Home: network error → ErrorBanner with retry button  
- [ ] Auth: OAuth failure → inline banner \+ retry  
- [ ] Auth: email exists → inline field error  
- [ ] Auth: weak password → inline field error  
- [ ] Share card: export failure → snackbar with retry  
- [ ] Drill library: image load failure → placeholder icon

**Acceptance:** Every screen handles loading, empty, and error. No blank screens. No unhandled exceptions.

### Task G3: Accessibility Baseline

**Read:** G6 §17 (Accessibility), G7 §Accessibility test cases

- [ ] All interactive elements ≥ 48×48px touch target  
- [ ] Semantics() wrapper on all icon-only buttons (bottom nav, back button, gear icon)  
- [ ] Onboarding selectors announce selection state to screen reader  
- [ ] Slider announces current value  
- [ ] System font scaling at 1.3× — verify no layout overflow on Home, Pace Calculator, Drill Library  
- [ ] Status bar: SystemUiOverlayStyle.light on all screens

**Acceptance:** VoiceOver (iOS) and TalkBack (Android) can navigate full critical path.

### Task G4: End-to-End Flow Test

**Read:** G7 §Critical Path, §QA Checklist

Run the full critical path manually on iOS \+ Android:

```
1. Fresh install → Splash → "Get Started"
2. Goal: "Prep for a race"
3. Find Race → select Delhi → Open division
4. About You → Male, 1990, "I've raced before"
5. Pace Import → enter 1:22:00 + a few station splits
6. Profile Confirmation → "Looks right"
7. Goal Setting → set 1:15:00 → verify T_final + gap
8. Gap Breakdown → verify station ranking → "Continue"
9. Training Setup → 4 days, 60 min, pick Mon/Wed/Fri/Sat
10. Equipment Setup → Hyrox Gym, select all stations
11. Plan Preview → toggle notifications → "Create Account"
12. Auth → Google OAuth (or email)
13. Home Dashboard → verify pace profile card (activated, T_final, gap)
14. Tap Pace Calculator → Goal Setting pre-filled → adjust goal → update
15. Share Card → tap Share → verify PNG in share sheet
16. Share to WhatsApp → verify card renders correctly in chat
17. Drill Library → browse all 8 → open detail sheet for each
18. Kill app → reopen → verify session restore → Home
19. Repeat steps 2–12 with "general fitness" path
20. Repeat steps 2–12 with wizard path (first-timer)
```

**Acceptance:** All 20 steps pass on at least 1 iOS \+ 1 Android device.

### Task G5: Performance Verification

**Read:** G4 §Performance Targets

- [ ] Cold start to Home: \< 2 seconds (measure with Stopwatch)  
- [ ] Pace engine compute: \< 50ms (measure in unit test)  
- [ ] Share card export: \< 500ms tap-to-share-sheet (measure with Stopwatch)  
- [ ] Station images from R2: \< 300ms first load, instant on cache hit  
- [ ] No jank on pace calculator (bias slider drag, goal time change) — 60fps

**Acceptance:** All performance targets met on recommended test devices.

### Task G6: Bug Fix Pass

Fix any issues found in G4. Classify by severity per G7 §Bug Severity:

- S0 (Blocker): fix immediately  
- S1 (Critical): fix before launch  
- S2 (Major): fix in launch week  
- S3 (Minor): fix post-launch  
- S4 (Enhancement): backlog

---

**CHECKPOINT G:** App is shippable. All screens work. All paths tested. Performance verified. Bugs classified and S0/S1 fixed.

---

## Task Dependency Graph

```
PHASE A (Foundation)
  A1 Project Init
  A2 Dependencies ← A1
  A3 Env Config ← A2
  A4 Design Tokens ← A1
  A5 Constants & Utils ← A1
  A6 Supabase Schema (parallel — done in dashboard)
  A7 Dart Models ← A5
  A8 GoRouter + App Shell ← A2, A4
  A9 Global Providers ← A2

PHASE B (Auth & Onboarding) ← all of Phase A
  B1 Splash Screens ← A8
  B2 Onboarding Notifier ← A7, A9
  B3 Goal Screen ← B1, B2
  B4 Find Race ← B3
  B5 About You ← B4
  B6 Wizard Path ← B5
  B7 Import Path ← B5
  B8 Goal Setting + Gap ← B6 or B7 (+ C1 for live engine)
  B9 Fitness Baseline ← B3 (parallel with B4–B8)
  B10 Training + Equipment ← B8 or B9
  B11 Plan Preview + Auth ← B10
  B12 Session Restore ← B11
  B13 Analytics ← B11

PHASE C (Engine) — can start parallel with Phase B
  C1 Pacing Engine ← A5, A7
  C2 Factor Back-Calc ← C1
  C3 Unit Tests ← C1, C2

PHASE D (Home + Pace UI) ← Phase B, Phase C
  D1 Home Providers ← A9, A7
  D2 Home Screen ← D1
  D3 Pace Providers ← C1
  D4 Pace Screens (homepage) ← D3, reuses B6–B8 screens
  D5 Pace Analytics ← D4

PHASE E (Share Card) ← Phase C, D
  E1 Share Card Widget ← C1 (needs SplitResult)
  E2 Export Pipeline ← E1
  E3 Analytics ← E2

PHASE F (Drill Library) — can start anytime after Phase A
  F1 Station Data ← A5
  F2 Grid Screen ← F1, A4
  F3 Detail Sheet ← F1

PHASE G (Polish) ← all above
  G1 Animations ← all screens built
  G2 States Audit ← all screens built
  G3 Accessibility ← all screens built
  G4 E2E Test ← everything
  G5 Performance ← everything
  G6 Bug Fixes ← G4
```

---

## Parallel Work Opportunities

| Can happen in parallel | Dependency |
| :---- | :---- |
| Phase C (engine) \+ Phase B (onboarding) | Engine is pure Dart, no UI dependency. Stub engine in B8 until C1 is done. |
| Phase F (drill library) \+ Phase B/C/D | Drill library is fully independent — static data, no cross-feature deps. |
| Task A6 (Supabase schema) \+ all other A tasks | Schema is set up in Supabase dashboard, not in code. |
| G1 animations \+ G3 accessibility | Non-overlapping work on the same screens. |

---

## Final Deliverable Checklist

Before declaring Phase 1 complete:

- [ ] All 23 screens from G3 Screen Inventory are built and functional  
- [ ] Pacing engine unit tests pass (`flutter test`)  
- [ ] Full critical path E2E on iOS (1 device minimum)  
- [ ] Full critical path E2E on Android (1 device minimum)  
- [ ] Share card shared to WhatsApp — renders correctly  
- [ ] Share card shared to Instagram Stories — renders correctly  
- [ ] All PostHog events firing (verify in debug panel)  
- [ ] Sentry capturing errors (trigger a test error, verify in dashboard)  
- [ ] No S0 or S1 bugs open  
- [ ] Station content populated (cues, mistakes, scaling for all 8\)  
- [ ] Station images uploaded to R2 and loading in app  
- [ ] `upcoming_races` seeded with launch market races  
- [ ] iOS: NSPhotoLibraryAddUsageDescription set  
- [ ] Android: media permissions handled  
- [ ] .env.prod configured with production Supabase/Sentry/PostHog keys