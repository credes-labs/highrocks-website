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
- `/` landing page · `/features` · `/faqs` · `/info-centre` · `/articles` · `/articles/[slug]`
- `/admin` Payload CMS · `/api/*` Payload REST API (plus `/api/waitlist`)

## CMS (Payload)
What editors manage at `/admin`:

| In the admin | Drives |
| --- | --- |
| **FAQs** (+ **FAQ categories**) | `/faqs`, the three home-page cards (“Show on home page”), FAQ structured data, `llms-full.txt` |
| **Articles** (+ **Media**) | `/articles`, `/articles/[slug]`, Info Centre lists, sitemap, share images, `llms.txt` |
| **Info Centre page** | The three category tiles and the “Latest” rows on `/info-centre` |

- Articles have drafts. Only published articles appear on the site.
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

The Payload CLI runs with `--use-swc` (already set in the npm scripts) because its default `tsx`
loader fails on Node 24.22.0. Payload officially asks for Node `^22.23.4 || >=24.22.1`.

## Structure
- `src/app/(site)/*`: website routes and root layout · `src/app/(payload)/*`: generated Payload admin and API routes (do not edit)
- `src/payload.config.ts`, `src/payload/*`: CMS config, collections, revalidation hooks, setup and seed data
- `src/lib/cms.ts`: cached, tagged reads from Payload, mapped to the types in `src/lib/cms-types.ts`
- `src/components/sections/*`, `src/components/articles/*`, `src/components/features/*`: page blocks
- `src/lib/content.ts`: remaining static copy · `src/lib/seo.ts`, `src/lib/site.ts`, `src/lib/llms.ts`: SEO / GEO
