import { articles, faqGroups, featureStory } from "@/lib/content";
import { HYROX_DEFINITION, SITE_DESCRIPTION, SITE_NAME, absoluteUrl } from "@/lib/site";

const link = (title: string, path: string, note?: string) => `- [${title}](${absoluteUrl(path)})${note ? `: ${note}` : ""}`;

const header = () => [
  `# ${SITE_NAME}`,
  "",
  `> ${SITE_DESCRIPTION}`,
  "",
  `${HYROX_DEFINITION} ${SITE_NAME} helps athletes plan and train for a Hyrox race. The app is in early access; people join a waitlist on the home page.`,
  "",
  "## Key facts",
  "",
  "- A Hyrox race is 8 × 1 km runs, each followed by one station, in this fixed order: SkiErg 1,000 m, sled push 50 m, sled pull 50 m, burpee broad jumps 80 m, rowing 1,000 m, farmers carry 200 m, sandbag lunges 100 m, wall balls 100 reps.",
  "- Divisions: Open and Pro singles, Doubles and Relay (teams of four). Weights vary by division; the official Hyrox rulebook is the source of truth.",
  "- The roxzone is the transition area between the run course and the stations; its time counts toward the result.",
  ...featureStory.map((s) => `- ${SITE_NAME} ${s.feature}: ${s.body}`),
  "",
];

/** Short index for AI answer engines (https://llmstxt.org). */
export function llmsTxt() {
  return [
    ...header(),
    "## Pages",
    "",
    link("Home", "/", "what HighRocks is, the feature story, wearable sync and the early-access waitlist"),
    link("Features and Hyrox pace calculator", "/features", "pace calculator for all 16 Hyrox segments, drill library and race simulation"),
    link("Hyrox FAQs", "/faqs", "race format, stations, divisions, finish times, pacing and the app"),
    link("Info Centre", "/info-centre", "latest Hyrox stories and guides"),
    link("Articles", "/articles", "all Hyrox training articles and guides"),
    "",
    "## Articles",
    "",
    ...articles.map((a) => link(a.title, `/articles/${a.slug}`, a.excerpt)),
    "",
    "## Optional",
    "",
    link("Full text of every article and FAQ", "/llms-full.txt"),
    "",
  ].join("\n");
}

/** Every article and FAQ in plain Markdown, so the whole site can be read in one request. */
export function llmsFullTxt() {
  const faqs = faqGroups.flatMap((g) => [`### ${g.label}`, "", ...g.items.flatMap((i) => [`**${i.q}**`, "", i.a, ""])]);
  const body = articles.flatMap((a) => [
    `## ${a.title}`,
    "",
    `URL: ${absoluteUrl(`/articles/${a.slug}`)}  `,
    `Published: ${a.published} · ${a.category} · ${a.readTime} read`,
    "",
    `> ${a.excerpt}`,
    "",
    ...a.intro.flatMap((p) => [p, ""]),
    ...a.sections.flatMap((s) => [`### ${s.heading}`, "", ...s.paragraphs.flatMap((p) => [p, ""]), ...(s.list ? [...s.list.map((li) => `- ${li}`), ""] : [])]),
    "### Key takeaways",
    "",
    ...a.takeaways.map((t) => `- ${t}`),
    "",
  ]);
  return [...header(), "## Hyrox FAQs", "", ...faqs, "# Articles", "", ...body].join("\n");
}
