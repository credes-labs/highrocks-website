# HighRocks website

Next.js 16 (App Router, Turbopack, Cache Components) · React 19 · TypeScript · Tailwind CSS v4 · Payload CMS 3.

```bash
cp .env.example .env   # then set PAYLOAD_SECRET (openssl rand -hex 32)
npm install
npm run dev            # site: http://localhost:3000 · CMS: http://localhost:3000/admin
npm run build && npm start
```

`npm run dev` and `npm run build` first run `npm run setup`, which applies database migrations and,
on an empty database, seeds the starting FAQs, articles and photos. The first visit to `/admin`
asks you to create the first admin user.

## Pages
- `/` landing page · `/features` · `/pace-calculator` · `/faqs` · `/info-centre` · `/articles` · `/articles/[slug]`
- `/admin` Payload CMS · `/api/*` Payload REST API (plus `/api/waitlist`)

## CMS (Payload)
What editors manage at `/admin`:

| In the admin | Drives |
| --- | --- |
| **FAQs** (+ **FAQ categories**) | `/faqs`, the three home-page cards (“Show on home page”), FAQ structured data, `llms-full.txt` |
| **Articles** (+ **Media**) | `/articles`, `/articles/[slug]`, Info Centre lists, sitemap, share images, `llms.txt` |
| **Info Centre page** | The three category tiles and the “Latest” rows on `/info-centre` |
| **Waitlist** | Every sign-up from both forms; search, status, notes, and **Export CSV** |
| **Legal pages** | `/privacy` and `/terms` (drafts: fill in the bracketed details and get a legal review) |

- Articles have drafts. Only published articles appear on the site. **Preview** in the admin opens the
  site in draft mode (editors only), with a bar to exit.
- Pages are prerendered and cached. Saving in the admin invalidates the cache tags in
  `src/payload/revalidate.ts`, so the next visit shows the change without a rebuild.
- Body text fields are plain text: separate paragraphs with an empty line.

### Changing the content model
1. Edit `src/payload/collections.ts`.
2. `npm run migrate:create <name>`: writes a migration to `src/migrations`; commit it.
3. `npm run generate:types` (and `npm run generate:importmap` if you add admin components).

Schema changes always go through migrations (`push: false`), so local and production databases match.

### Production
- `PAYLOAD_SECRET`: required, long random string.
- `DATABASE_URL`: defaults to a local SQLite file (`highrocks.db`). On serverless hosts use a hosted
  libSQL database such as Turso (`libsql://…` plus `DATABASE_AUTH_TOKEN`), because the file system
  is not persistent there.
- Uploaded photos are stored in `/media` on disk. On serverless hosts add a Payload storage adapter
  (for example `@payloadcms/storage-vercel-blob` or `@payloadcms/storage-s3`).
- `NEXT_PUBLIC_SITE_URL`: the canonical domain, used for canonicals, sitemap and structured data.
- `PAYLOAD_SEED=false` skips seeding an empty database.
- `RESEND_API_KEY` + `EMAIL_FROM_ADDRESS`: real emails. Without them, emails are printed to the server log.
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY`: bot check on the waitlist forms.

The Payload CLI uses its default `tsx` loader. Avoid `--use-swc` on Windows: Smart App Control blocks
SWC's unsigned native binary (`LoadLibraryExW failed`). Payload officially asks for Node `^22.23.4 || >=24.22.1`.

## Pace calculator
`src/lib/pacing/engine.ts` is the deterministic pacing engine from the pacing spec:
1. Fixed base split: runs 58%, stations 38%, transitions 4% of the target.
2. Station times from normalised weights: Wall balls / Burpee broad jump 1.30, Sled push / pull 1.20, Lunges 1.15,
   SkiErg 1.10, Row 1.00, Farmers carry 0.90.
3. `engine_factor` (0.92–1.08) scales runs only; `strength_factor` (0.85–1.15) scales stations only.
4. Doubles: stations × 1 / (2 × `team_efficiency`), with efficiency between 0.80 and 1.00.
5. T_final = runs + stations + transitions. It is not renormalised, so the gap to the target is shown.

Outputs also include each component's share of T_final, the delta vs base for each run and station, and drill goals
at 90% of each station time. The engine can also back-calculate the factors from a past race. `npm test` runs the tests in `tests/`.

`/pace-calculator` is the full tool:
- **Quick setup:** the onboarding wizard. Plain-English answers set the engine factor, strength factor, team size
  and (Doubles only) team efficiency, then a summary shows the derived values, a target slider and a three-number preview.
- **Fine-tune:** sliders and number fields for every input.
- **Import a race:** fill in a past result by hand, drop a file (CSV, text or JSON), or paste the splits table
  copied from results.hyrox.com. `src/lib/pacing/import.ts` parses it and also reads HighRocks CSV and data-file
  exports, so a plan can move between devices.
- **Share your plan:** a branded 1080 × 1920 PNG card drawn on a canvas (`src/components/pace/shareCard.ts`),
  splits CSV, a data file (.json) and a shareable link.
- Also: charts (timeline, race clock, shares, delta vs base, station budget, gap breakdown), a split ledger,
  shareable URLs and CSV export.

`/features` shows a live preview that opens the full tool with the same plan.

## Waitlist
`POST /api/waitlist` validates the form, drops bots (hidden honeypot field, per-IP rate limit, optional
Cloudflare Turnstile), stores the sign-up in the **Waitlist** collection and sends a confirmation email.
Duplicate emails get the same success response but are not stored twice.

## Images
Site images are WebP. Add new PNG/JPEG files to `public/images` and run `npm run images:webp`: it converts
them, rewrites references in `src/` and deletes the originals. CMS uploads are converted to WebP on upload.

## Performance & quality

Lighthouse 12 on the production build (`next start`), simulated mobile (slow 4G, 4× CPU) unless noted.
Measured 11 Nov 2026.

| Page | Performance | Accessibility | Best practices | SEO |
| --- | --- | --- | --- | --- |
| Home (mobile) | 79 → **81–83** | 96 → **100** | 100 | 100 |
| Home (desktop) | **99** | 96 → **100** (footer tap targets fixed) | 100 | 100 |
| Info Centre | 91 → **90** | 96 → **100** | 100 | 92 → **100** |
| Article | **97** | **100** | **100** | **100** |
| FAQs | **95** | **100** | **100** | **100** |
| Features | **87–89** | **100** | 96 | **100** |

Home page, mobile:

| Metric | Before | After |
| --- | --- | --- |
| Main-thread work | 6.2 s | **~2.0 s** |
| Total blocking time | 340 ms | **220–280 ms** |
| Largest Contentful Paint (simulated) | 4.0 s | 4.0 s (measured directly: **~0.5 s**) |
| Cumulative layout shift | 0 | **0** |
| Page weight | — | **~460 KB** (hero photo 13 KB) |

Images:

| | Before | After |
| --- | --- | --- |
| `public/images` (32 files) | 49.7 MB PNG | **2.8 MB WebP** (94% smaller) |
| CMS photos (`/media`, 12 files) | PNG | **1.2 MB WebP** |

What changed:
- **Images:** all images are WebP, and Next serves AVIF or WebP resized to each screen, kept in its image cache for 30 days.
- **Hero loading:** hero photos load first (`fetchPriority="high"`), and nothing below the fold is loaded eagerly.
- **Animations:** looping animations (SVG SMIL and CSS) pause while off screen (`usePauseOffscreen`).
- **Fonts:** the Courier font is no longer preloaded on every page.
- **Headers:** static files in `/images` and `/icons` are cached, and security headers are set (nosniff, frame options, referrer, permissions, HSTS).
- **Accessibility:** "Read More" links carry the article title for screen readers, an invalid ARIA attribute was removed, and footer links are at least 24 px tall.

Known gaps:
- **Home LCP on mobile:** the simulated estimate stays around 4 s because of the JavaScript behind the scroll animations. The real paint breakdown is about 0.5 s.
- **Features best practices (96):** the pace calculator's 8–11 px labels are kept small on purpose, to match the design.
- **Redirect warning:** the local "redirect" warning comes from the browser trying HTTPS on localhost first. Check it again on the live HTTPS domain.

## Structure
- `src/app/(site)/*`: website routes and root layout · `src/app/(payload)/*`: generated Payload admin and API routes (do not edit)
- `src/payload.config.ts`, `src/payload/*`: CMS config, collections, revalidation hooks, setup and seed data
- `src/lib/cms.ts`: cached, tagged reads from Payload, mapped to the types in `src/lib/cms-types.ts`
- `src/components/sections/*`, `src/components/articles/*`, `src/components/features/*`: page blocks
- `src/lib/content.ts`: remaining static copy · `src/lib/seo.ts`, `src/lib/site.ts`, `src/lib/llms.ts`: SEO / GEO
