# Venue Page — Design Addendum

**Date:** 2026-11-05
**Status:** Approved in conversation; awaiting written-spec review
**Extends:** `2026-11-05-icpc-lac-2027-site-design.md` (the base spec). Everything
there still applies unless this addendum overrides it.

## 1. Intent

**What the user specified**

- A **separate `/venue` page** about the host, Tecnológico de Monterrey (ITESM),
  Campus Monterrey.
- It includes a map and location card, a short piece about the campus,
  "getting there" information, and where on campus the event happens.
- The contest building is **Arena Borregos**.
- The page reuses the **CETEC** postcard.
- Execution is subagent-driven, as before.

**Assumptions (confirm or correct)**

- Address, coordinates and map query are taken from the HackMTY site's Arena
  Borregos listing: *Av. Eugenio Garza Sada 2501 Sur, Tecnológico, 64849
  Monterrey, N.L., México*, *25.6515° N / 100.2899° W*, and the map query
  "Arena Borregos | Gimnasio Deportivo ITESM".
- Travel times, recommended hotels, official transport and the campus entrance
  are unknown and render as `TBD`.
- English only, as in the base spec.

**Success criteria**

- `/` and `/venue` both load when opened directly and when refreshed, from
  `npm run preview` (static build). Unknown paths go to `/`.
- The menu works across pages:
  - From `/venue`, "About" opens `/` scrolled to `#about`.
  - On `/venue`, "Venue" is the current item.
  - On `/`, the existing section highlighting still works, including after
    coming from `/venue`.
- `npm test`, `npm run lint` and `npm run build` pass. `dist/venue/index.html`
  exists after the build.
- Screenshots of `/venue` at 375 px and 1440 px show no horizontal overflow, the
  map and card legible, and the card stacked under the map on phones.

## 2. Overrides to the base spec

| Base spec | Now |
|---|---|
| §3 "Single-page … No router"; `react-router-dom` dropped | `react-router-dom@^7` (HackMTY's major) with `BrowserRouter`; routes `/` → HomePage, `/venue` → VenuePage, `*` → `<Navigate to="/" replace />` |
| §9 out of scope: "location/travel pages" | `/venue` is in scope |
| Nav: Home · About · Rules (hash anchors) | Home · About · Rules · Venue, rendered as router links (`to` values below) |
| `event.venue = 'Campus Monterrey'` | `event.venue = 'Arena Borregos, Campus Monterrey'` |
| `npm run build` = `tsc -b && vite build` | `tsc -b && vite build && node scripts/copy-route-html.mjs` |

## 3. Architecture

### Routing and static hosting

- `src/App.tsx` becomes `<BrowserRouter><AppShell /></BrowserRouter>`.
- New `src/AppShell.tsx` holds everything that needs router context: the
  ThemeProvider, CssBaseline, `ScrollToHash`, `SiteHeader`, `<Routes>` and
  `Footer`. Tests render it inside `MemoryRouter`.
- `scripts/copy-route-html.mjs` copies `dist/index.html` to
  `dist/venue/index.html` (`ROUTES = ['venue']`), so opening or refreshing
  `/venue` works on any static host with no rewrite rules. It exits non-zero if
  `dist/index.html` is missing.

### Navigation

- `NavItem` becomes `{ label: string; id: string; to: string }`:

  | label | id | to |
  |---|---|---|
  | Home | `home` | `/` |
  | About | `about` | `/#about` |
  | Rules | `rules` | `/#rules` |
  | Venue | `venue` | `/venue` |

- `SiteHeader` and `MobileNavMenu` render each item as a React Router `Link`
  (`component={RouterLink} to={item.to}`). The brand links to `/`. Both stay
  free of content imports.
- New `ScrollToHash` component, a router-aware version of HackMTY's
  `ScrollToElement`, reacts to every location change:
  - If the location has a hash, it scrolls the element with that id into view
    after render (`block: 'start'`). It scrolls smoothly unless the visitor
    prefers reduced motion, in which case it jumps (`'auto'`).
  - With no hash, when the pathname changes it scrolls the window to the top.
  - It renders nothing. A missing target is ignored.
- Active item, computed in `AppShell`:
  - On `/venue`: `'venue'`.
  - Otherwise: the result of `useActiveSection(sectionIds, pathname)`.
- **Hook change:** `useActiveSection(ids, resetKey?: string)` adds `resetKey`
  to its effect dependencies. This fixes a bug: when someone lands on `/venue`
  and then navigates to `/`, the observer must re-attach to the newly mounted
  home sections. `sectionIds` stays `['home','about','rules']`.

### Page title

New hook `usePageTitle(title: string)` sets `document.title` on mount and
restores the previous title on unmount.

- Venue page: "Venue · 2027 ICPC Latin America Championship".
- Home page: keeps the existing `index.html` title.

### New components (content-agnostic; colors from tokens only)

| Component | Props | Responsibility |
|---|---|---|
| `MapEmbed` | `query: string`, `title: string`, `zoom?: number` (default 16) | `<iframe>` with `src="https://maps.google.com/maps?q=<encodeURIComponent(query)>&t=m&z=<zoom>&output=embed&iwloc=near"`, `loading="lazy"`, `referrerPolicy="no-referrer-when-downgrade"`, accessible `title`, responsive height (≈ 360 px on mobile, ≈ 480 px on desktop), rounded corners and ink border. No API key. |
| `LocationCard` | `eyebrow`, `name`, `addressLines: string[]`, `coordinates?`, `rows: { label: string; value: string }[]`, `cta: { label: string; href: string }` | `<aside aria-label={name}>` card in HackMTY's location-card layout. Floats over the map's right side on desktop and stacks under it below `md`. The CTA opens in a new tab with `rel="noopener noreferrer"`. |
| `InfoCard` | `title: string`, `accent: string`, `children` | `<article>` with a 6 px top border in `accent`, an `h3` title in ink, and paper or white background. Used three-up on desktop and stacked on mobile. |
| `ScrollToHash` | none | See Navigation. |

### New sections and page

- `src/sections/VenueHeroSection.tsx`: eyebrow, H1, subtitle and dates line.
  The H1 is the venue name. There are no balloons here.
- `src/sections/VenueCampusSection.tsx`: a `PostcardRow` with the CETEC
  postcard (no postmark) beside a `ProseBlock`.
- `src/sections/VenueMapSection.tsx`: `MapEmbed` plus `LocationCard`.
- `src/sections/VenueTravelSection.tsx`: a grid of three `InfoCard`s with
  accents blue, red and green.
- `src/pages/VenuePage.tsx`: `<main>` holding Hero → AirmailStripe → Campus →
  Map → Travel, and calling `usePageTitle`.

Every section uses `Section` with an id and `labelledBy`: `venue-top`,
`campus`, `location`, `getting-there`. Sections alternate tints: none, blue,
none, red.

### Content (`src/content/venue.ts`; types in `types.ts`)

All copy is written fresh. Unknowns are `TBD`.

- **hero:**
  - eyebrow: "Venue"
  - title: "Arena Borregos"
  - subtitle: `` `${event.host} · Campus Monterrey` ``
  - dates line: `` `Dates: ${event.dates}` ``
- **campus:**
  - title: "Campus Monterrey"
  - `postcardId: 'cetec'`
  - two paragraphs:
    1. Tec de Monterrey was founded in Monterrey in 1943, and Campus Monterrey
       is its original campus. It is in the south of the city, beneath the
       Cerro de la Silla.
    2. The championship takes place in Arena Borregos, the campus sports
       arena.
- **location:**
  - eyebrow "Venue", name "Arena Borregos"
  - addressLines:
    - "Av. Eugenio Garza Sada 2501 Sur"
    - "Tecnológico, 64849 Monterrey, N.L., México"
  - coordinates "25.6515° N / 100.2899° W"
  - rows:
    - When: `event.dates`
    - Where: "Arena Borregos, Campus Monterrey"
  - map query "Arena Borregos | Gimnasio Deportivo ITESM"
  - CTA "View on Google Maps" →
    `https://www.google.com/maps/search/?api=1&query=Arena+Borregos+%7C+Gimnasio+Deportivo+ITESM`
- **travel:** three cards:
  - **By air:** Monterrey International Airport (MTY) is the closest airport.
    Travel time to campus: TBD.
  - **Around the city:** Taxis and ride-hailing apps are the simplest way to
    reach campus. Recommended hotels and official transport: TBD.
  - **On campus:** Arena Borregos is inside Campus Monterrey. Entrance and
    arrival instructions: TBD.

## 4. Accessibility, motion and security

- One `<main>` per page.
- The map iframe has a descriptive `title`, and the location card is a
  labelled `aside`.
- The CTA and every external link open in a new tab with
  `rel="noopener noreferrer"`.
- `ScrollToHash` respects reduced motion.
- The Google Maps embed is a third-party iframe. That is acceptable for a
  public event page, and HackMTY does the same. No API key or secret is
  involved.
- The dev and preview servers stay on `127.0.0.1`.

## 5. Testing

Vitest and Testing Library. Router-dependent tests use `MemoryRouter`.

- **AppShell:**
  - `/` renders the home H1.
  - `/venue` renders the "Arena Borregos" H1 with the map iframe and the
    location card.
  - An unknown path redirects to `/`.
- **Navigation:**
  - On `/venue`, the Venue link has `aria-current="true"`.
  - The About link's href is `/#about`.
  - The brand link's href is `/`.
- **ScrollToHash:**
  - Navigating to `/#rules` calls `scrollIntoView` on `#rules`. jsdom has no
    `scrollIntoView`, so stub it on `Element.prototype`.
  - A pathname change without a hash calls `window.scrollTo(0, 0)`.
  - Reduced motion uses `behavior: 'auto'`.
- **useActiveSection:** changing `resetKey` re-observes newly mounted
  sections.
- **MapEmbed:** the iframe `src` contains the encoded query and
  `output=embed`, has `loading="lazy"`, and has the given `title`.
- **LocationCard:** shows the name, address lines and rows. The CTA has the
  right href, `target="_blank"` and `rel`.
- **InfoCard:** shows an h3 title and its body.
- **Content:** `venue.campus.postcardId` exists in `postcards`. The map URL and
  CTA are `https://`.
- **Page title:** after rendering VenuePage, `document.title` is the venue
  title, and it is restored on unmount.
- **Existing tests:** SiteHeader and App tests are updated for router links
  (wrap in `MemoryRouter` where needed).
- **Build check:** `npm run build` produces `dist/venue/index.html`.
- **Browser check:** with `npm run preview` on loopback, take screenshots of
  `/venue` at 375 px and 1440 px. Also check that a direct load of `/venue`
  shows the venue page.

## 6. Out of scope

- A hotel list and transport schedules (TBD notes only).
- Spanish.
- Per-route Open Graph tags (only `document.title` changes).
- A custom 404 page (unknown paths redirect to `/`).
- Campus maps or building floor plans.
