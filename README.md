# HighRocks website

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## Pages
- `/` landing page · `/features` · `/info-centre` · `/articles` · `/articles/[slug]`
- Article text is placeholder data in `src/lib/content.ts` (the Figma file repeats one story). Replace with a CMS.

## Structure
- `src/app/page.tsx` — page composition
- `src/components/sections/*` — Navbar, Hero, Pacing, Waitlist(+Form), TrainCircle, Features(+SplitLedger, DrillLibrary), Ecosystem, Faq, Footer
- `src/components/articles/*`, `src/components/features/*` — blocks for the inner pages
- `src/components/ui/*` — Button, Eyebrow, Svg
- `src/lib/content.ts` — copy and data; `src/lib/design.ts` — `d(n)` design-pixel helper
- `public/images`, `public/icons` — assets exported from Figma
- `src/app/api/waitlist/route.ts` — validates sign-ups; **does not store them yet** (add your DB/email provider)

## Scaling
`--d` (globals.css) is one Figma pixel: it shrinks with the viewport below 1728px and caps at 1px above. Desktop artwork uses it; below `lg` several sections switch to simple stacked layouts.
