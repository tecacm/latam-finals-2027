# ICPC Latin America Championship 2027 — website

Single-page site for the 2027 ICPC Latin America Championship in Monterrey,
Nuevo León. Built with Vite, React 19, TypeScript and MUI 7 (same stack as the
HackMTY site). Design spec: `docs/superpowers/specs/2026-11-05-icpc-lac-2027-site-design.md`.

## Commands

```bash
npm install
npm run dev        # http://127.0.0.1:5173 (bound to localhost only)
npm test           # Vitest unit tests (includes color-contrast checks)
npm run lint
npm run build      # type-check + production build into dist/
npm run preview    # serve dist/ on http://127.0.0.1:4173
npm run postcards  # re-export art/*.svg → public/postcards/*.webp
```

## Editing content

All text lives in `src/content/`:

| File | What it holds |
|---|---|
| `event.ts` | Name, city, dates, host, venue, countdown target, links. Every `TBD` here is an open item. |
| `hero.ts` | Hero eyebrow and hero postcard. |
| `about.ts` | About blocks (title, paragraphs, optional postcard). |
| `rules.ts` | Rules intro and accordion entries. |
| `footer.ts` | Footer copyright and links. |

Find remaining placeholders with `grep -rn "TBD" src/content`.

Countdown: set `event.countdownTarget` to ISO 8601 **with the Monterrey
offset**, e.g. `'2027-11-12T09:00:00-06:00'`. A test rejects targets without an
offset.

## Adding a postcard

1. Save the SVG as `art/<id>.svg` (e.g. `art/macroplaza.svg`).
2. Run `npm run postcards`.
3. Add an entry to `src/content/postcards.ts` (id, place, alt, orientation, and
   the SVG `viewBox` width/height).
4. Reference it from a block: `postcardId: '<id>'` in `about.ts` or `rules.ts`.
5. `npm test` checks the id exists and both WebP sizes were exported.

## Colors

`src/theme/tokens.ts` holds the palette. The ICPC blue/red/yellow/green are
approximations — replace them with official values there, then run `npm test`
to confirm text contrast still passes.

## Deploying

`npm run build` produces a static `dist/` folder that works on any static host
with no rewrite rules (it is a single page). If the site is served from a
sub-path such as `/icpc2027/`, set `base: '/icpc2027/'` in `vite.config.ts`.
