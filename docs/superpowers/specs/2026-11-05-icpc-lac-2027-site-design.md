# ICPC Latin America Championship 2027 — Website Design

**Date:** 2026-11-05
**Status:** Approved in conversation; awaiting written-spec review

## 1. Intent

Build the website for the 2027 ICPC Latin America Championship (LAC), hosted in
Monterrey, Nuevo León, México. The 2026 Chile site (`../latam2026-mirror/`) is a
reference for *what information* to cover; it is not copied. The 2027 site
reuses the stack, libraries and component approach of the HackMTY site
(`/Users/erngrzab/Documents/tecaah/hackmty-website-react-master`).

**What the user specified**

- React project built with HackMTY's components, approaches and libraries.
- Only Home, About and Rules — no gallery, sponsors page, schedule or other pages.
- English only.
- A single long scrollable page (unlike the 2026 multi-page site).
- Vector-art style built around the user's own postcard/stamp illustrations of
  Monterrey (CETEC, Rectoría, Fundidora). More postcards are coming.
- Paper look (cream background) with ICPC colors — blue, red, yellow, green —
  mixed in boldly, including contest balloons.
- Hosted on a static host that is not GitHub Pages (host not chosen yet).
- Modular components wherever possible.

**Assumptions (confirm or correct)**

- 2027 facts (dates, host institution, venue, slot counts, prizes) are unknown;
  every such value is a visible `TBD` sourced from one config file.
- The four ICPC colors below are approximations; official brand values will be
  swapped in later via the theme tokens.
- No official ICPC logo file is available yet; the header uses a text wordmark.

**Success criteria**

- `npm run dev`, `npm run lint`, `npm test` and `npm run build` all succeed.
- The page works at mobile (≥ 360 px) and desktop widths.
- Adding a new postcard requires only: drop the SVG in `art/`, run the export
  script, add one entry to `content/postcards.ts`, reference it from a block.
- Replacing a `TBD` requires editing only `content/*.ts`.

## 2. Visual direction

Chosen in the visual companion: **Layout A "Postcard journey"**, **Paper** mood,
**"Bolder + balloons"** color strength.

### Palette (theme tokens)

| Token     | Value     | Use                                                        |
|-----------|-----------|------------------------------------------------------------|
| `paper`   | `#FFFBEB` | Page background (matches the postcard border cream)        |
| `ink`     | `#0B2A55` | Body text, nav text, footer background                     |
| `blue`    | `#1F5AA6` | ICPC blue (approx.) — About accents, primary buttons        |
| `red`     | `#CF3B2A` | ICPC red (approx.) — Rules accents, wordmark "LAC"          |
| `yellow`  | `#F0B323` | ICPC yellow (approx.) — accents; dark text on top of it     |
| `green`   | `#2E7D3A` | ICPC green (approx.) — accents; darkened so cream text on it passes WCAG AA (4.9:1) |
| `yellowText` | `#A87A00` | Yellow used as large text (countdown digit) — 3.7:1 on paper |
| `teal`    | `#387072` | Eyebrows, countdown labels (taken from the postcards)       |
| `bodyText`| `#24323F` | Long-form paragraph text                                   |

`yellow` text on `paper` fails contrast; yellow is only used as a fill (with
`ink` text on it) or for large decorative elements. `yellowText` is used when
yellow must be text (countdown digit). A unit test pins every text/fill pair:
≥ 4.5:1 for normal text, ≥ 3:1 for large text.

Derived lists: `icpcColors` = blue, red, yellow, green (fills, stripes,
balloons); `textAccents` = blue, red, green (colored headings);
`countdownColors` = blue, red, yellowText, green.

### Typography

- Montserrat (400–800) for everything — same as HackMTY, via Google Fonts link.
- JetBrains Mono (400–700) for eyebrows, postmark text and small labels.

### Motifs

- **Postcards/stamps:** the user's art, tilted −6°…+6°, drop shadow, slight lift
  on hover.
- **Postmark:** round "MONTERREY N.L. · 2027" cancellation mark with wavy lines,
  overlapping the hero stamp's corner.
- **Airmail stripe:** diagonal 4-color stripe (blue/red/yellow/green on paper)
  between hero and content, and above the footer.
- **4-color segment line:** thin bar under the sticky header.
- **Balloons:** four contest balloons (one per color) floating in the hero,
  gently bobbing.
- **Section tints:** each section has a very light tint of its accent color
  (≈ 7–8 % opacity).
- **Rules accordions:** solid-color headers cycling blue → red → yellow → green.

## 3. Architecture

Single-page Vite + React 19 + TypeScript app. No router.

### Libraries

Kept from HackMTY: `react`, `react-dom`, `@mui/material`, `@mui/icons-material`,
`@emotion/react`, `@emotion/styled`, `react-intersection-observer`,
`vite-plugin-svgr`, `@vitejs/plugin-react`, ESLint 9 + `typescript-eslint`,
`eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`.

Dropped: `react-router-dom`, `react-router-hash-link` (single page),
`tailwindcss` (installed but unused in HackMTY), `leaflet`/`react-leaflet`,
`react-slideshow-image`, `color`, MLH/Mailchimp/Instagram pieces, i18n.

Added: `vitest`, `@testing-library/react`, `@testing-library/user-event`,
`@testing-library/jest-dom`, `jsdom` (tests); `sharp` (postcard export script,
dev only).

### Directory layout

```
site/
  art/                         # user's original postcard SVGs (source of truth, untouched)
  scripts/export-postcards.mjs # art/*.svg → public/postcards/<id>-{800,1600}.webp
  public/
    favicon.svg
    postcards/                 # generated WebP files (committed so `npm run build` never needs the export step)
  src/
    main.tsx
    App.tsx                    # ThemeProvider + CssBaseline + layout composition
    theme/
      tokens.ts                # palette + font tokens (single place to swap ICPC colors)
      theme.ts                 # MUI createTheme from tokens
    content/
      types.ts                 # shared content types
      event.ts                 # event facts; TBD values live here
      postcards.ts             # postcard registry
      about.ts                 # About blocks
      rules.ts                 # Rules intro + accordion entries
      nav.ts                   # nav items (label → section id)
      hero.ts                  # hero eyebrow + hero postcard id
      footer.ts                # footer copyright + links
    hooks/
      useActiveSection.ts      # which section id is in view (for nav highlight)
      usePrefersReducedMotion.ts
    lib/
      countdown.ts             # pure time-left math
      contrast.ts              # WCAG contrast + readable text color for a fill
      withBase.ts              # prefix public asset paths with Vite BASE_URL
    theme/layout.ts            # HEADER_HEIGHT shared by header, sections, scroll spy
    components/                # reusable, content-agnostic building blocks
      AnimateOnView.tsx        # HackMTY's useInView pattern; CSS transitions; respects reduced motion
      Countdown.tsx            # from HackMTY; null target → "Date to be announced"
      Postcard.tsx
      Postmark.tsx
      Balloon.tsx
      BalloonCluster.tsx
      AirmailStripe.tsx
      ColorSegmentBar.tsx
      Section.tsx
      SectionHeading.tsx
      ProseBlock.tsx           # optional title + paragraphs + optional bullets
      Wordmark.tsx             # "ICPC LAC 2027" text logo with colored accent
      PostcardRow.tsx
      ColorAccordion.tsx       # adapted from HackMTY ControlledAccordions
      SiteHeader.tsx
      MobileNavMenu.tsx
      Footer.tsx
    sections/                  # page sections composed from components + content
      HeroSection.tsx
      AboutSection.tsx
      RulesSection.tsx
    pages/
      HomePage.tsx             # Hero → AirmailStripe → About → Rules
    test/
      setup.ts                 # jest-dom matchers, IntersectionObserver/matchMedia stubs
```

Rule of thumb: `components/` never import content *data* from `content/`
(`import type` from `content/types.ts` is allowed); `sections/` and `App.tsx`
are the only places content and components meet. This keeps every component reusable
and testable with plain props.

### Component contracts

| Component | Props (key ones) | Responsibility |
|---|---|---|
| `Postcard` | `postcard: PostcardData`, `tilt?: number`, `postmark?: boolean`, `size?: 'hero' \| 'row'`, `priority?: boolean` | Responsive `<img srcSet>` of a stamp with tilt, shadow, hover lift; optional `Postmark` overlay. `priority` disables lazy loading (hero). |
| `Postmark` | `color?: string`, `label?: string`, `year?: string` | Decorative SVG, `aria-hidden`. |
| `Balloon` | `color: string`, `size?: number`, `delay?: number` | Decorative SVG balloon with bobbing animation (off under reduced motion). |
| `BalloonCluster` | `colors: string[]` | Positions balloons around its parent (absolute). |
| `AirmailStripe` | `height?: number` | 4-color diagonal stripe, `role="presentation"`. |
| `ColorSegmentBar` | `height?: number` | 4-color flat segment bar. |
| `Section` | `id: string`, `tint?: string`, `labelledBy: string`, `children` | `<section>` with `scroll-margin-top` for the sticky header and optional tint. |
| `SectionHeading` | `id: string`, `color: string`, `eyebrow?: string`, `children` | Uppercase heading in the section's accent color. |
| `PostcardRow` | `side: 'left' \| 'right'`, `postcard?: PostcardData`, `children` | Text + postcard side by side; postcard slides in from its side via `AnimateOnView`. No postcard → full-width text. Stacks on mobile (postcard first). |
| `ColorAccordion` | `items: { id, title, body: ReactNode }[]`, `colors: string[]` | One-open-at-a-time MUI accordion; header colors cycle through `colors`; picks readable text color per fill. |
| `Countdown` | `target: string \| null`, `colors?: string[]` | Days/hours/min/sec; digit colors cycle; `null` or past → fallback text. |
| `SiteHeader` | `items: NavItem[]`, `activeId?: string` | Sticky header: wordmark, anchor links, `ColorSegmentBar`; renders `MobileNavMenu` below `md`. |
| `MobileNavMenu` | `items: NavItem[]`, `activeId?: string` | MUI `IconButton` + `Menu` (HackMTY pattern). |
| `Footer` | `copyright: string`, `links?: { label, href }[]` | Ink-colored footer preceded by an `AirmailStripe`. |
| `AnimateOnView` | `variant: 'fade' \| 'rise' \| 'slide-from-left' \| 'slide-from-right'`, `timeout?`, `threshold?` | HackMTY's `useInView({ triggerOnce })` pattern, but a short CSS opacity/translate transition instead of MUI `Slide` (which translates by the full window width and causes horizontal overflow). Renders children with no wrapper styles under reduced motion; `fallbackInView: true` so content is visible without IntersectionObserver. |
| `ProseBlock` | `title?`, `titleColor?`, `paragraphs: string[]`, `bullets?: string[]` | Typography for a content block (h3 title, paragraphs, list). |
| `Wordmark` | `prefix`, `accent`, `suffix`, `accentColor?` | Text logo used in the header. |

### Content types

```ts
type PostcardData = {
  id: string;            // matches public/postcards/<id>-{800,1600}.webp
  alt: string;           // descriptive alt text
  place: string;         // e.g. "Parque Fundidora"
  orientation: 'landscape' | 'portrait';
  width: number;         // intrinsic SVG viewBox width (for width/height attrs → no layout shift)
  height: number;        // intrinsic SVG viewBox height
};

type ContentBlock = {
  id: string;
  title: string;
  paragraphs: string[];
  postcardId?: string;   // optional; absent → text-only row
};

type RuleEntry = { id: string; title: string; paragraphs: string[]; bullets?: string[] };

type EventInfo = {
  name: string;            // "2027 ICPC Latin America Championship"
  shortName: string;       // "ICPC LAC 2027"
  city: string;            // "Monterrey, Nuevo León, México"
  dates: string;           // "TBD"
  host: string;            // "TBD"
  countdownTarget: string | null; // ISO 8601 with offset, e.g. "2027-11-12T09:00:00-06:00"; null until known
  links: { icpc: string; regionalRules: string };
};

type NavItem = { label: string; sectionId: 'home' | 'about' | 'rules' };
```

### Data flow

Static: `content/*.ts` → `sections/*` → `components/*`. The only runtime state
is the countdown tick, accordion expansion, mobile-menu anchor and the active
section (IntersectionObserver). No network requests besides fonts and images.

### Navigation behavior

- Nav links are `<a href="#about">` etc. `html { scroll-behavior: smooth }`
  unless reduced motion is preferred.
- `Section` sets `scroll-margin-top` equal to the header height so headings are
  not hidden under the sticky header.
- `useActiveSection(['home','about','rules'])` returns the id most in view; the
  header underlines that link (and sets `aria-current="true"`).

## 4. Page content

All copy is written new for 2027 (no text reused from the 2026 site). Values not
yet known render the literal string `TBD`.

- **Hero (`#home`)** — eyebrow "Monterrey · Nuevo León · México"; H1
  "2027 ICPC Latin America Championship"; dates line; `Countdown`; CETEC
  postcard (`size="hero"`, postmark, `priority`); `BalloonCluster`.
- **AirmailStripe**
- **About (`#about`, blue tint)** — three `PostcardRow`s, alternating sides:
  1. What is the ICPC — Rectoría postcard.
  2. The Latin America Championship — Fundidora postcard.
  3. Monterrey 2027 — host/venue TBD; text-only until the next postcard arrives.
- **Rules (`#rules`, red tint)** — one `PostcardRow` (text-only until a postcard
  is assigned via `rules.postcardId`) holding the intro paragraph + `ColorAccordion` entries:
  regional structure; advancing to the championship; advancing to the World
  Finals; prizes; unforeseen cases. All counts/slots `TBD`. Link to official
  ICPC regional rules (`event.links.regionalRules`).
- **Footer** — `AirmailStripe`, copyright "© 2027 ICPC Latin America
  Championship", link to icpc.global.

## 5. Postcard asset pipeline

- Originals copied (not moved) from `~/Downloads` into `site/art/`:
  `cetec.svg`, `rectoria.svg`, `fundidora.svg`.
- `npm run postcards` runs `scripts/export-postcards.mjs`: for each
  `art/*.svg`, `sharp` renders WebP at 800 px and 1600 px width
  (quality ≈ 82) into `public/postcards/`. Output is committed.
- `Postcard` uses `srcSet="<id>-800.webp 800w, <id>-1600.webp 1600w"` with
  `sizes` per `size` prop, explicit `width`/`height` from orientation to avoid
  layout shift, `loading="lazy"` except the hero.

## 6. Accessibility and motion

- Semantic landmarks: `<header>`, `<nav aria-label="Main">`, `<main>`,
  `<section aria-labelledby>`, `<footer>`.
- Postcards carry descriptive `alt`; postmark, balloons, stripes are
  `aria-hidden`.
- `prefers-reduced-motion: reduce` disables: slide-in animations, balloon
  bobbing, hover lift transitions, smooth scrolling.
- Color is never the only carrier of meaning; accordion headers keep text
  labels; text on fills meets WCAG AA (ink on yellow, paper on blue/red/green).
- Mobile: rows stack with postcard first, tilt reduced to ≤ 3°, hero stamp
  width ~85 vw, balloons scaled down.

## 7. Error handling

Static site with no data fetching, so failure modes are limited:

- `countdownTarget` null or unparsable → "Date to be announced"; target in
  the past → "The championship has started". Never throws, never shows
  negative numbers.
- `postcardId` referencing an unknown postcard → row renders text-only and a
  dev-only `console.warn`; a unit test asserts every referenced id exists.
- Missing WebP file → browser alt text shows; the export script fails loudly
  if an SVG cannot be rendered.

## 8. Testing

Vitest + Testing Library + jsdom (`npm test`):

- `lib/countdown.ts`: exact breakdown for known instants; past/invalid/null.
- `Countdown`: "Date to be announced" for null/invalid; "The championship
  has started" for a past date; four units for a future date (fake timers).
- `PostcardRow`: postcard on requested side; text-only when no postcard.
- `ColorAccordion`: one panel open at a time; header colors cycle.
- `SiteHeader`: links target `#home/#about/#rules`; active item has
  `aria-current`.
- Content integrity: every `postcardId` in `about.ts` exists in `postcards.ts`;
  every nav `sectionId` has a rendered section.
- `HomePage` smoke test: renders hero H1, About and Rules headings.

Plus `npm run lint`, `npm run build` (includes `tsc -b`), and a manual check in
a browser at ~375 px and ~1440 px widths.

## 9. Out of scope

Gallery/photos, videos, schedule, teams, registration, sponsors section,
mascot, location/travel pages, i18n, analytics, CMS, deployment configuration
(host undecided). Each can be added later as a new section without changing the
component layer.

## 10. Open items (TBD)

- Event dates, countdown target time and timezone.
- Host institution and venue.
- Regional slot counts, World Finals slots, prizes.
- Official ICPC color values and logo asset.
- Additional postcards (Monterrey 2027 block is ready for one).
- Final static host.
