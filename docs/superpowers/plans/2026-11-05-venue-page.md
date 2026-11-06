# Venue Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a separate `/venue` page about Arena Borregos at Tecnológico de Monterrey, Campus Monterrey (map + location card, campus copy with the CETEC postcard, getting-there cards), with cross-page navigation on the existing site.

**Architecture:** Introduce React Router 7 (`BrowserRouter` in `App`, everything else in a router-aware `AppShell`). Nav items become router links (`/#home`, `/#about`, `/#rules`, `/venue`); a `ScrollToHash` component scrolls to hash targets or to the top after navigation; the scroll-spy hook re-attaches when the page changes. A post-build script copies `dist/index.html` to `dist/venue/index.html` so the route works on any static host. New content-agnostic components (`MapEmbed`, `LocationCard`, `InfoCard`) are composed by new venue sections from `src/content/venue.ts`.

**Tech Stack:** Existing Vite 6 / React 19 / TypeScript 5.8 / MUI 7 / Vitest 3 stack, plus `react-router-dom@^7.6.0`.

**Spec:** `docs/superpowers/specs/2026-11-05-venue-page-design.md` (extends `docs/superpowers/specs/2026-11-05-icpc-lac-2027-site-design.md`)

## Global Constraints

- Project root `/Users/erngrzab/Documents/tecaah/icpc2027/site`, branch `main` (user-approved). Run every command from there. Commit at the end of every task with the message given.
- Routes: `/` → HomePage, `/venue` → VenuePage, `*` → `<Navigate to="/" replace />`. Trailing slash (`/venue/`) must behave like `/venue`.
- Nav items exactly: Home `/#home`, About `/#about`, Rules `/#rules`, Venue `/venue` (shape `{ label, id, to }`). Brand links to `/#home`.
- Palette only from `src/theme/tokens.ts`; never hard-code colors. `src/components/*` never import content data (`import type` from `src/content/types.ts` is fine). All site text lives in `src/content/*`; unknown facts are the literal `TBD`.
- Venue facts (verbatim): name "Arena Borregos"; address lines "Av. Eugenio Garza Sada 2501 Sur" / "Tecnológico, 64849 Monterrey, N.L., México"; coordinates "25.6515° N / 100.2899° W"; map query "Arena Borregos | Gimnasio Deportivo ITESM"; `event.venue = 'Arena Borregos, Campus Monterrey'`.
- External links open in a new tab with `rel="noopener noreferrer"`. Dev/preview servers bind to `127.0.0.1` only and are stopped after use.
- English only. Copy is written fresh (no text from the 2026 site).
- Vitest globals are off (import from `'vitest'`); tests needing routing use `MemoryRouter`. Test output must be pristine.

## Review Focus

1. **Direct load or refresh of `/venue` on a static host** must show the venue page, not a 404 or the home page → pinned by the `dist/venue/index.html` build check (Task 4) and the no-fallback static-server `curl` check (Task 5).
2. **Landing on `/venue`, then navigating to `/`** must keep the home scroll-spy working → pinned by the `resetKey` test (Task 1).
3. **Clicking "About" from `/venue`** must land at `#about`, not at the top of the home page → pinned by the ScrollToHash "hash wins over top" test (Task 1).
4. **Host redirects `/venue` → `/venue/`** must still render the venue page with "Venue" current → pinned by the trailing-slash AppShell test (Task 4).
5. **Deploy under a sub-path** (`base: '/icpc2027/'`) must keep routes working → pinned by the `routerBasename` tests (Task 2).

---

### Task 1: Router dependency and navigation hooks

**Files:**
- Modify: `package.json` (add `react-router-dom`), `src/hooks/useActiveSection.ts`, `src/test/setup.ts`
- Create: `src/hooks/usePageTitle.ts`, `src/components/ScrollToHash.tsx`
- Test: `src/hooks/useActiveSection.test.tsx` (add one test), `src/hooks/usePageTitle.test.tsx`, `src/components/ScrollToHash.test.tsx`

**Interfaces:**
- Consumes: `usePrefersReducedMotion()` (`src/hooks/usePrefersReducedMotion.ts`), `mockMatchMedia()` (`src/test/matchMedia.ts`), `installIntersectionObserverMock()` (`src/test/intersectionObserver.ts`).
- Produces:
  - `useActiveSection(ids: readonly string[], resetKey?: string): string | undefined` — re-observes when `resetKey` changes.
  - `usePageTitle(title: string): void`.
  - `<ScrollToHash />` (default export, renders `null`; must be inside a router).
  - `src/test/setup.ts` installs no-op `window.scrollTo` and `Element.prototype.scrollIntoView` (jsdom lacks/complains about them).

- [ ] **Step 1: Install React Router (HackMTY's major)**

Run: `npm install react-router-dom@^7.6.0`
Expected: `added N packages`; `npm ls react-router-dom` shows 7.x.

- [ ] **Step 2: Add jsdom scroll stubs to the test setup**

Replace `src/test/setup.ts` with:
```ts
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Vitest globals are off, so Testing Library cannot register cleanup itself.
afterEach(() => {
  cleanup();
});

// jsdom does not implement scrolling: scrollIntoView is missing and scrollTo
// logs "Not implemented". Install silent no-ops; tests spy on them as needed.
window.scrollTo = (() => {}) as typeof window.scrollTo;
Element.prototype.scrollIntoView = function scrollIntoView() {};
```

- [ ] **Step 3: Write the failing tests**

Append inside the `describe('useActiveSection', ...)` block of `src/hooks/useActiveSection.test.tsx`:
```tsx
  it('re-observes sections when resetKey changes (e.g. /venue → /)', () => {
    const io = installIntersectionObserverMock();
    function Switcher({ page }: { page: string }) {
      const active = useActiveSection(IDS, page);
      return (
        <div>
          {page === '/' && (
            <>
              <section id="home" />
              <section id="about" />
              <section id="rules" />
            </>
          )}
          <output data-testid="active">{active ?? 'none'}</output>
        </div>
      );
    }

    const { rerender } = render(<Switcher page="/venue" />);
    rerender(<Switcher page="/" />);
    act(() => io.setVisibleHeights({ home: 50, about: 500 }));
    expect(screen.getByTestId('active')).toHaveTextContent('about');
  });
```

`src/hooks/usePageTitle.test.tsx`:
```tsx
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { usePageTitle } from './usePageTitle';

function Probe({ title }: { title: string }) {
  usePageTitle(title);
  return null;
}

describe('usePageTitle', () => {
  it('sets the document title and restores the previous one on unmount', () => {
    document.title = 'Home title';
    const { unmount } = render(<Probe title="Venue · ICPC" />);
    expect(document.title).toBe('Venue · ICPC');
    unmount();
    expect(document.title).toBe('Home title');
  });
});
```

`src/components/ScrollToHash.test.tsx`:
```tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockMatchMedia } from '../test/matchMedia';
import ScrollToHash from './ScrollToHash';

function Pages() {
  return (
    <>
      <ScrollToHash />
      <Link to="/#rules">to rules</Link>
      <Link to="/venue">to venue</Link>
      <Routes>
        <Route path="/" element={<section id="rules">Rules</section>} />
        <Route path="/venue" element={<p>Venue page</p>} />
      </Routes>
    </>
  );
}

describe('ScrollToHash', () => {
  let scrolled: { id: string; options: unknown }[];
  let restoreMatchMedia: (() => void) | undefined;

  beforeEach(() => {
    scrolled = [];
    vi.spyOn(Element.prototype, 'scrollIntoView').mockImplementation(function (this: Element, options?: unknown) {
      scrolled.push({ id: this.id, options });
    });
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    restoreMatchMedia?.();
    restoreMatchMedia = undefined;
  });

  it('scrolls smoothly to the hash target after navigating from another page (hash wins over top)', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/venue']}>
        <Pages />
      </MemoryRouter>,
    );
    await user.click(screen.getByRole('link', { name: 'to rules' }));
    await waitFor(() => expect(scrolled).toEqual([{ id: 'rules', options: { behavior: 'smooth', block: 'start' } }]));
    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it('scrolls to the hash target on first load', async () => {
    render(
      <MemoryRouter initialEntries={['/#rules']}>
        <Pages />
      </MemoryRouter>,
    );
    await waitFor(() => expect(scrolled.map((s) => s.id)).toEqual(['rules']));
  });

  it('scrolls to the top when the page changes without a hash', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/']}>
        <Pages />
      </MemoryRouter>,
    );
    await user.click(screen.getByRole('link', { name: 'to venue' }));
    expect(await screen.findByText('Venue page')).toBeInTheDocument();
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('jumps without animation under reduced motion', async () => {
    restoreMatchMedia = mockMatchMedia((query) => query.includes('prefers-reduced-motion: reduce'));
    render(
      <MemoryRouter initialEntries={['/#rules']}>
        <Pages />
      </MemoryRouter>,
    );
    await waitFor(() => expect(scrolled).toEqual([{ id: 'rules', options: { behavior: 'auto', block: 'start' } }]));
  });

  it('ignores a hash with no matching element', async () => {
    render(
      <MemoryRouter initialEntries={['/#missing']}>
        <Pages />
      </MemoryRouter>,
    );
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(scrolled).toEqual([]);
  });
});
```

- [ ] **Step 4: Run them to verify they fail**

Run: `npx vitest run src/hooks src/components/ScrollToHash.test.tsx`
Expected: FAIL — `usePageTitle` / `ScrollToHash` cannot be resolved; the resetKey test fails with `expected 'home' to contain 'about'` (the hook ignores the second argument today).

- [ ] **Step 5: Implement**

`src/hooks/useActiveSection.ts` — change only the doc comment, signature and effect dependencies (body otherwise unchanged):
```ts
/**
 * Scroll spy: returns the id of the section with the most visible height
 * below the sticky header. Any array of ids works; the effect re-subscribes
 * when the joined ids change or when `resetKey` changes (pass the current
 * pathname so sections that mount after navigation are observed).
 */
export function useActiveSection(ids: readonly string[], resetKey?: string): string | undefined {
```
and the effect's dependency array becomes:
```ts
  }, [key, resetKey]);
```

`src/hooks/usePageTitle.ts`:
```ts
import { useEffect } from 'react';

/** Sets document.title while the calling component is mounted. */
export function usePageTitle(title: string): void {
  useEffect(() => {
    const previous = document.title;
    document.title = title;
    return () => {
      document.title = previous;
    };
  }, [title]);
}
```

`src/components/ScrollToHash.tsx`:
```tsx
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

/**
 * After each navigation: scroll the `#hash` target into view, or jump to the
 * top when the page changed without a hash (router-aware take on HackMTY's
 * ScrollToElement). Renders nothing.
 */
export default function ScrollToHash() {
  const { pathname, hash, key } = useLocation();
  const reducedMotion = usePrefersReducedMotion();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    const pathnameChanged = previousPathname.current !== pathname;
    previousPathname.current = pathname;

    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      // Defer one tick so the destination page has rendered and laid out.
      const timer = setTimeout(() => {
        const target = document.getElementById(id);
        if (target && typeof target.scrollIntoView === 'function') {
          target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
        }
      }, 0);
      return () => clearTimeout(timer);
    }

    if (pathnameChanged) window.scrollTo(0, 0);
  }, [pathname, hash, key, reducedMotion]);

  return null;
}
```

- [ ] **Step 6: Run tests**

Run: `npx vitest run src/hooks src/components/ScrollToHash.test.tsx`
Expected: PASS (useActiveSection 4, usePageTitle 1, ScrollToHash 5).

- [ ] **Step 7: Full check and commit**

Run: `npm test && npm run lint && npx tsc -b`
Expected: all pass, pristine output.
```bash
git add package.json package-lock.json src/test/setup.ts src/hooks src/components/ScrollToHash.tsx src/components/ScrollToHash.test.tsx
git commit -m "feat: add React Router, ScrollToHash, usePageTitle and resettable scroll spy"
```

---

### Task 2: Router-aware navigation and AppShell

**Files:**
- Modify: `src/content/types.ts` (`NavItem`), `src/content/nav.ts`, `src/components/SiteHeader.tsx`, `src/components/MobileNavMenu.tsx`, `src/lib/withBase.ts`, `src/App.tsx` (replace), `src/content/content.test.ts` (one test), `src/App.test.tsx` (one test)
- Create: `src/AppShell.tsx`
- Test: `src/components/SiteHeader.test.tsx` (replace), `src/AppShell.test.tsx`, `src/lib/withBase.test.ts` (add tests)

**Interfaces:**
- Consumes: Task 1 (`ScrollToHash`, `useActiveSection(ids, resetKey)`); existing `HomePage`, `Footer`, `Wordmark`, `theme`, `event`, `footer`.
- Produces:
  - `type NavItem = { label: string; id: string; to: string }` (`SectionId` unchanged).
  - `navItems` = Home `/#home`, About `/#about`, Rules `/#rules` (Venue added in Task 4); `sectionIds` unchanged.
  - `routerBasename(base?: string): string` in `src/lib/withBase.ts`.
  - `AppShell` (default export, needs a router) and `App` = `BrowserRouter` + `AppShell`.
  - `SiteHeader` / `MobileNavMenu` render React Router links; props unchanged in name (`brand`, `items`, `activeId`).

- [ ] **Step 1: Write the failing tests**

Replace `src/components/SiteHeader.test.tsx` with:
```tsx
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import type { NavItem } from '../content/types';
import SiteHeader from './SiteHeader';

const items: NavItem[] = [
  { label: 'Home', id: 'home', to: '/#home' },
  { label: 'About', id: 'about', to: '/#about' },
  { label: 'Rules', id: 'rules', to: '/#rules' },
  { label: 'Venue', id: 'venue', to: '/venue' },
];

// jsdom does not evaluate @media rules, so the desktop nav (display: none below
// md) counts as hidden here; query it with { hidden: true }.
const HIDDEN = { hidden: true } as const;

function renderHeader(activeId: string) {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <SiteHeader brand="ICPC LAC 2027" items={items} activeId={activeId} />
    </MemoryRouter>,
  );
}

describe('SiteHeader', () => {
  it('links the brand to the home hero and every item to its route', () => {
    renderHeader('home');
    expect(screen.getByRole('link', { name: 'ICPC LAC 2027' })).toHaveAttribute('href', '/#home');
    const nav = screen.getAllByRole('navigation', { name: 'Main', ...HIDDEN })[0];
    expect(within(nav).getByRole('link', { name: 'Home', ...HIDDEN })).toHaveAttribute('href', '/#home');
    expect(within(nav).getByRole('link', { name: 'About', ...HIDDEN })).toHaveAttribute('href', '/#about');
    expect(within(nav).getByRole('link', { name: 'Rules', ...HIDDEN })).toHaveAttribute('href', '/#rules');
    expect(within(nav).getByRole('link', { name: 'Venue', ...HIDDEN })).toHaveAttribute('href', '/venue');
  });

  it('marks only the active item as current', () => {
    renderHeader('venue');
    const nav = screen.getAllByRole('navigation', { name: 'Main', ...HIDDEN })[0];
    expect(within(nav).getByRole('link', { name: 'Venue', ...HIDDEN })).toHaveAttribute('aria-current', 'true');
    expect(within(nav).getByRole('link', { name: 'Home', ...HIDDEN })).not.toHaveAttribute('aria-current');
  });

  it('opens the mobile menu and closes it after picking an item', async () => {
    const user = userEvent.setup();
    renderHeader('home');
    await user.click(screen.getByRole('button', { name: 'Open navigation menu' }));
    const menu = await screen.findByRole('menu');
    const rules = within(menu).getByRole('menuitem', { name: 'Rules' });
    expect(rules).toHaveAttribute('href', '/#rules');
    await user.click(rules);
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  });

  it('marks the active item in the mobile menu as current', async () => {
    const user = userEvent.setup();
    renderHeader('about');
    await user.click(screen.getByRole('button', { name: 'Open navigation menu' }));
    const menu = await screen.findByRole('menu');
    expect(within(menu).getByRole('menuitem', { name: 'About' })).toHaveAttribute('aria-current', 'true');
    expect(within(menu).getByRole('menuitem', { name: 'Home' })).not.toHaveAttribute('aria-current');
  });
});
```

`src/AppShell.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import AppShell from './AppShell';
import { event } from './content/event';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppShell />
    </MemoryRouter>,
  );
}

describe('AppShell', () => {
  it('renders the home page at /', () => {
    renderAt('/');
    expect(screen.getByRole('heading', { level: 1, name: event.name })).toBeInTheDocument();
  });

  it('redirects unknown paths to the home page', () => {
    renderAt('/does-not-exist');
    expect(screen.getByRole('heading', { level: 1, name: event.name })).toBeInTheDocument();
  });

  it('links the brand to the home hero', () => {
    renderAt('/');
    expect(screen.getByRole('link', { name: 'ICPC LAC 2027' })).toHaveAttribute('href', '/#home');
  });
});
```

Append to `src/lib/withBase.test.ts` (and add `routerBasename` to its import from `'./withBase'`):
```ts
describe('routerBasename', () => {
  it('maps the Vite base URL to a React Router basename', () => {
    expect(routerBasename('/')).toBe('/');
    expect(routerBasename('/icpc2027/')).toBe('/icpc2027');
  });
});
```

In `src/content/content.test.ts`, replace the test `'points every nav item at a known section'` with:
```ts
  it('points every in-page nav item at a known home section', () => {
    for (const item of navItems.filter((i) => i.to.startsWith('/#'))) {
      expect(sectionIds).toContain(item.to.slice(2));
      expect(item.id).toBe(item.to.slice(2));
    }
  });
```

In `src/App.test.tsx`, replace the test `'has a section for every nav item'` with:
```tsx
  it('has a section for every in-page nav item', () => {
    render(<App />);
    for (const item of navItems.filter((i) => i.to.startsWith('/#'))) {
      const id = item.to.slice(2);
      expect(document.getElementById(id), `missing #${id}`).not.toBeNull();
    }
  });
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run src/components/SiteHeader.test.tsx src/AppShell.test.tsx src/lib/withBase.test.ts`
Expected: FAIL — `./AppShell` unresolved, `routerBasename` not exported, header links still `#home` (no router links).

- [ ] **Step 3: Implement**

`src/content/types.ts` — replace the `NavItem` line with:
```ts
/** A header link: `to` is a route (`/venue`) or a home-page anchor (`/#about`). */
export type NavItem = { label: string; id: string; to: string };
```

`src/content/nav.ts`:
```ts
import type { NavItem, SectionId } from './types';

/** Home-page sections watched by the scroll spy. */
export const sectionIds: readonly SectionId[] = ['home', 'about', 'rules'];

export const navItems: readonly NavItem[] = [
  { label: 'Home', id: 'home', to: '/#home' },
  { label: 'About', id: 'about', to: '/#about' },
  { label: 'Rules', id: 'rules', to: '/#rules' },
];
```

`src/lib/withBase.ts` — append:
```ts
/** React Router basename for Vite's BASE_URL ('/' stays '/', '/icpc2027/' → '/icpc2027'). */
export function routerBasename(base: string = import.meta.env.BASE_URL): string {
  return base.replace(/\/+$/, '') || '/';
}
```

`src/components/SiteHeader.tsx` (replace the whole file; only the link elements, keys and active check change):
```tsx
import Box from '@mui/material/Box';
import type { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import type { NavItem } from '../content/types';
import { HEADER_HEIGHT } from '../theme/layout';
import { icpcColors, tokens } from '../theme/tokens';
import ColorSegmentBar from './ColorSegmentBar';
import MobileNavMenu from './MobileNavMenu';

type SiteHeaderProps = {
  brand: ReactNode;
  items: readonly NavItem[];
  activeId?: string;
};

const SEGMENT_HEIGHT = 4;

export default function SiteHeader({ brand, items, activeId }: SiteHeaderProps) {
  return (
    <Box
      component="header"
      sx={{ position: 'sticky', top: 0, zIndex: 1100, backgroundColor: tokens.paper }}
    >
      <Box
        sx={{
          height: HEADER_HEIGHT - SEGMENT_HEIGHT,
          maxWidth: 1200,
          mx: 'auto',
          px: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box component={RouterLink} to="/#home" sx={{ color: tokens.ink, textDecoration: 'none', fontSize: '1.1rem' }}>
          {brand}
        </Box>

        <Box component="nav" aria-label="Main" sx={{ display: { xs: 'none', md: 'block' } }}>
          <Box component="ul" sx={{ display: 'flex', gap: 4, listStyle: 'none', m: 0, p: 0 }}>
            {items.map((item, index) => {
              const isActive = item.id === activeId;
              const color = icpcColors[index % icpcColors.length];
              return (
                <li key={item.id}>
                  <Box
                    component={RouterLink}
                    to={item.to}
                    aria-current={isActive ? 'true' : undefined}
                    sx={{
                      display: 'inline-block',
                      py: 0.5,
                      color: tokens.ink,
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      borderBottom: `3px solid ${isActive ? color : 'transparent'}`,
                      transition: 'border-color 200ms ease',
                      '&:hover': { borderBottomColor: color },
                      '&:focus-visible': { outline: `3px solid ${tokens.blue}`, outlineOffset: 4 },
                    }}
                  >
                    {item.label}
                  </Box>
                </li>
              );
            })}
          </Box>
        </Box>

        <Box component="nav" aria-label="Main" sx={{ display: { xs: 'block', md: 'none' } }}>
          <MobileNavMenu items={items} activeId={activeId} />
        </Box>
      </Box>
      <ColorSegmentBar height={SEGMENT_HEIGHT} />
    </Box>
  );
}
```

`src/components/MobileNavMenu.tsx` — add `import { Link as RouterLink } from 'react-router-dom';` and change the `MenuItem` to:
```tsx
          <MenuItem
            key={item.id}
            component={RouterLink}
            to={item.to}
            onClick={close}
            aria-current={item.id === activeId ? 'true' : undefined}
            selected={item.id === activeId}
            sx={{
              fontWeight: 700,
              color: tokens.ink,
              borderLeft: `4px solid ${icpcColors[index % icpcColors.length]}`,
            }}
          >
```

`src/AppShell.tsx`:
```tsx
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Footer from './components/Footer';
import ScrollToHash from './components/ScrollToHash';
import SiteHeader from './components/SiteHeader';
import Wordmark from './components/Wordmark';
import { event } from './content/event';
import { footer } from './content/footer';
import { navItems, sectionIds } from './content/nav';
import { useActiveSection } from './hooks/useActiveSection';
import HomePage from './pages/HomePage';
import { theme } from './theme/theme';

/** Layout + routes. Needs router context: App provides BrowserRouter, tests MemoryRouter. */
export default function AppShell() {
  const { pathname } = useLocation();
  const page = pathname.replace(/\/+$/, '') || '/';
  const activeId = useActiveSection(sectionIds, page);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ScrollToHash />
      <SiteHeader
        brand={<Wordmark prefix={event.wordmark.prefix} accent={event.wordmark.accent} suffix={event.wordmark.suffix} />}
        items={navItems}
        activeId={activeId}
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer copyright={footer.copyright} links={footer.links} />
    </ThemeProvider>
  );
}
```

`src/App.tsx` (replace the whole file):
```tsx
import { BrowserRouter } from 'react-router-dom';
import AppShell from './AppShell';
import { routerBasename } from './lib/withBase';

export default function App() {
  return (
    <BrowserRouter basename={routerBasename()}>
      <AppShell />
    </BrowserRouter>
  );
}
```

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/components/SiteHeader.test.tsx src/AppShell.test.tsx src/lib/withBase.test.ts src/content src/App.test.tsx`
Expected: PASS.

- [ ] **Step 5: Full check and commit**

Run: `npm test && npm run lint && npm run build`
Expected: all pass, pristine output.
```bash
git add src
git commit -m "feat: router-aware navigation with AppShell and hash links"
```

---

### Task 3: Map, location card and info card components

**Files:**
- Create: `src/lib/maps.ts`, `src/components/MapEmbed.tsx`, `src/components/LocationCard.tsx`, `src/components/InfoCard.tsx`
- Test: `src/lib/maps.test.ts`, `src/components/venueComponents.test.tsx`

**Interfaces:**
- Consumes: `tokens`, `fonts` (`src/theme/tokens.ts`); `alpha`, `styled` from `@mui/material/styles`.
- Produces:
  - `googleMapsEmbedUrl(query: string, zoom?: number): string` and `googleMapsSearchUrl(query: string): string` (`src/lib/maps.ts`).
  - `<MapEmbed query: string; title: string; zoom?: number />`.
  - `type LocationRow = { label: string; value: string }`; `<LocationCard eyebrow: string; name: string; addressLines: readonly string[]; coordinates?: string; rows: readonly LocationRow[]; cta: { label: string; href: string } />` — `<aside aria-label={name}>`, `h3` name.
  - `<InfoCard title: string; accent: string>{children}</InfoCard>` — `<article>`, `h3` title.

- [ ] **Step 1: Write the failing tests**

`src/lib/maps.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { googleMapsEmbedUrl, googleMapsSearchUrl } from './maps';

const QUERY = 'Arena Borregos | Gimnasio Deportivo ITESM';

describe('maps', () => {
  it('builds a keyless Google Maps embed URL', () => {
    expect(googleMapsEmbedUrl(QUERY)).toBe(
      'https://maps.google.com/maps?q=Arena%20Borregos%20%7C%20Gimnasio%20Deportivo%20ITESM&t=m&z=16&output=embed&iwloc=near',
    );
    expect(googleMapsEmbedUrl(QUERY, 14)).toContain('&z=14&');
  });

  it('builds a Google Maps search link', () => {
    expect(googleMapsSearchUrl(QUERY)).toBe(
      'https://www.google.com/maps/search/?api=1&query=Arena%20Borregos%20%7C%20Gimnasio%20Deportivo%20ITESM',
    );
  });
});
```

`src/components/venueComponents.test.tsx`:
```tsx
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { tokens } from '../theme/tokens';
import InfoCard from './InfoCard';
import LocationCard from './LocationCard';
import MapEmbed from './MapEmbed';

describe('MapEmbed', () => {
  it('renders a titled, lazy, keyless Google Maps iframe', () => {
    render(<MapEmbed query="Arena Borregos | Gimnasio Deportivo ITESM" title="Map of Arena Borregos" />);
    const frame = screen.getByTitle('Map of Arena Borregos');
    expect(frame.tagName).toBe('IFRAME');
    expect(frame.getAttribute('src')).toContain('q=Arena%20Borregos%20%7C%20Gimnasio%20Deportivo%20ITESM');
    expect(frame.getAttribute('src')).toContain('output=embed');
    expect(frame).toHaveAttribute('loading', 'lazy');
    expect(frame).toHaveAttribute('referrerpolicy', 'no-referrer-when-downgrade');
  });
});

describe('LocationCard', () => {
  it('shows the venue, address, details and a safe external map link', () => {
    render(
      <LocationCard
        eyebrow="Venue"
        name="Arena Borregos"
        addressLines={['Av. Eugenio Garza Sada 2501 Sur', 'Tecnológico, 64849 Monterrey, N.L., México']}
        coordinates="25.6515° N / 100.2899° W"
        rows={[
          { label: 'When', value: 'July 17 2027' },
          { label: 'Where', value: 'Arena Borregos, Campus Monterrey' },
        ]}
        cta={{ label: 'View on Google Maps', href: 'https://www.google.com/maps/search/?api=1&query=x' }}
      />,
    );
    const card = screen.getByRole('complementary', { name: 'Arena Borregos' });
    expect(within(card).getByRole('heading', { level: 3, name: 'Arena Borregos' })).toBeInTheDocument();
    expect(card).toHaveTextContent('Av. Eugenio Garza Sada 2501 Sur');
    expect(card).toHaveTextContent('Tecnológico, 64849 Monterrey, N.L., México');
    expect(card).toHaveTextContent('25.6515° N / 100.2899° W');
    expect(within(card).getByText('When').nextElementSibling).toHaveTextContent('July 17 2027');
    expect(within(card).getByText('Where').nextElementSibling).toHaveTextContent('Arena Borregos, Campus Monterrey');
    const link = within(card).getByRole('link', { name: 'View on Google Maps' });
    expect(link).toHaveAttribute('href', 'https://www.google.com/maps/search/?api=1&query=x');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('omits the coordinates line when not given', () => {
    render(
      <LocationCard
        eyebrow="Venue"
        name="Arena Borregos"
        addressLines={['Line 1']}
        rows={[]}
        cta={{ label: 'View on Google Maps', href: 'https://example.com' }}
      />,
    );
    expect(screen.queryByText(/° N/)).not.toBeInTheDocument();
  });
});

describe('InfoCard', () => {
  it('renders an article with an h3 title, accent border and body', () => {
    render(
      <InfoCard title="By air" accent={tokens.blue}>
        <p>Monterrey International Airport (MTY)</p>
      </InfoCard>,
    );
    const card = screen.getByRole('article');
    expect(within(card).getByRole('heading', { level: 3, name: 'By air' })).toBeInTheDocument();
    expect(card).toHaveTextContent('Monterrey International Airport (MTY)');
    expect(card).toHaveAttribute('data-accent', tokens.blue);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run src/lib/maps.test.ts src/components/venueComponents.test.tsx`
Expected: FAIL — `./maps`, `./InfoCard`, `./LocationCard`, `./MapEmbed` unresolved.

- [ ] **Step 3: Implement**

`src/lib/maps.ts`:
```ts
/** Keyless Google Maps embed URL (the same approach as HackMTY's location map). */
export function googleMapsEmbedUrl(query: string, zoom = 16): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=m&z=${zoom}&output=embed&iwloc=near`;
}

/** Google Maps search link that opens the place in the Maps app or site. */
export function googleMapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
```

`src/components/MapEmbed.tsx`:
```tsx
import { styled } from '@mui/material/styles';
import { googleMapsEmbedUrl } from '../lib/maps';
import { tokens } from '../theme/tokens';

const Frame = styled('iframe')({
  display: 'block',
  width: '100%',
  height: 360,
  border: `2px solid ${tokens.ink}`,
  borderRadius: 16,
  backgroundColor: tokens.white,
  '@media (min-width: 900px)': { height: 480 },
});

type MapEmbedProps = { query: string; title: string; zoom?: number };

/** Embedded Google map for a place query; no API key needed. */
export default function MapEmbed({ query, title, zoom = 16 }: MapEmbedProps) {
  return (
    <Frame
      src={googleMapsEmbedUrl(query, zoom)}
      title={title}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}
```

`src/components/LocationCard.tsx`:
```tsx
import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Fragment } from 'react';
import { fonts, tokens } from '../theme/tokens';

export type LocationRow = { label: string; value: string };

type LocationCardProps = {
  eyebrow: string;
  name: string;
  addressLines: readonly string[];
  coordinates?: string;
  rows: readonly LocationRow[];
  cta: { label: string; href: string };
};

const labelSx = {
  fontFamily: fonts.mono,
  fontSize: '0.75rem',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: tokens.teal,
} as const;

/** Venue card (HackMTY location-card layout): name, address, details and a map link. */
export default function LocationCard({ eyebrow, name, addressLines, coordinates, rows, cta }: LocationCardProps) {
  return (
    <Box
      component="aside"
      aria-label={name}
      sx={{
        width: '100%',
        maxWidth: 380,
        p: { xs: 2.5, md: 3 },
        backgroundColor: tokens.white,
        border: `2px solid ${tokens.ink}`,
        borderRadius: 3,
        boxShadow: `0 12px 28px ${alpha(tokens.ink, 0.18)}`,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 2, mb: 1 }}>
        <Typography component="p" sx={labelSx}>
          {eyebrow}
        </Typography>
        {coordinates && (
          <Typography component="p" sx={{ fontFamily: fonts.mono, fontSize: '0.7rem', color: tokens.bodyText }}>
            {coordinates}
          </Typography>
        )}
      </Box>
      <Typography component="h3" sx={{ fontWeight: 800, fontSize: '1.6rem', lineHeight: 1.1, color: tokens.ink }}>
        {name}
      </Typography>
      <Box component="address" sx={{ mt: 1, fontStyle: 'normal', lineHeight: 1.6, color: tokens.bodyText }}>
        {addressLines.map((line) => (
          <Box component="span" key={line} sx={{ display: 'block' }}>
            {line}
          </Box>
        ))}
      </Box>
      {rows.length > 0 && (
        <Box
          component="dl"
          sx={{ m: 0, mt: 2, display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: 2, rowGap: 0.75, alignItems: 'baseline' }}
        >
          {rows.map((row) => (
            <Fragment key={row.label}>
              <Box component="dt" sx={labelSx}>
                {row.label}
              </Box>
              <Box component="dd" sx={{ m: 0, fontWeight: 600, color: tokens.ink }}>
                {row.value}
              </Box>
            </Fragment>
          ))}
        </Box>
      )}
      <Box
        component="a"
        href={cta.href}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          mt: 2.5,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
          px: 2,
          py: 1,
          borderRadius: 999,
          backgroundColor: tokens.blue,
          color: tokens.paper,
          fontWeight: 700,
          textDecoration: 'none',
          '&:hover': { backgroundColor: tokens.ink },
          '&:focus-visible': { outline: `3px solid ${tokens.yellow}`, outlineOffset: 3 },
        }}
      >
        {cta.label}
        <Box component="span" aria-hidden="true">
          ↗
        </Box>
      </Box>
    </Box>
  );
}
```

`src/components/InfoCard.tsx`:
```tsx
import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { tokens } from '../theme/tokens';

type InfoCardProps = { title: string; accent: string; children: ReactNode };

/** Small card with a colored top edge, used for "Getting there" tips. */
export default function InfoCard({ title, accent, children }: InfoCardProps) {
  return (
    <Box
      component="article"
      data-accent={accent}
      sx={{
        height: '100%',
        p: 3,
        backgroundColor: tokens.white,
        borderTop: `6px solid ${accent}`,
        borderRadius: 2,
        boxShadow: `0 6px 16px ${alpha(tokens.ink, 0.1)}`,
      }}
    >
      <Typography variant="h3" sx={{ fontWeight: 800, fontSize: '1.25rem', color: tokens.ink, mb: 1.5 }}>
        {title}
      </Typography>
      <Box sx={{ color: tokens.bodyText }}>{children}</Box>
    </Box>
  );
}
```

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/lib/maps.test.ts src/components/venueComponents.test.tsx`
Expected: PASS (maps 2, venue components 4).

- [ ] **Step 5: Full check and commit**

Run: `npm test && npm run lint && npx tsc -b`
```bash
git add src/lib/maps.ts src/lib/maps.test.ts src/components/MapEmbed.tsx src/components/LocationCard.tsx src/components/InfoCard.tsx src/components/venueComponents.test.tsx
git commit -m "feat: add MapEmbed, LocationCard and InfoCard components"
```

---

### Task 4: Venue content, sections, page, route and static copy

**Files:**
- Modify: `src/content/types.ts` (add `VenueContent`), `src/content/event.ts` (`venue` line only), `src/content/nav.ts` (add Venue), `src/AppShell.tsx`, `src/content/content.test.ts`, `src/AppShell.test.tsx`, `package.json` (build script)
- Create: `src/content/venue.ts`, `src/sections/VenueHeroSection.tsx`, `src/sections/VenueCampusSection.tsx`, `src/sections/VenueMapSection.tsx`, `src/sections/VenueTravelSection.tsx`, `src/pages/VenuePage.tsx`, `scripts/copy-route-html.mjs`

**Interfaces:**
- Consumes: Task 1 (`usePageTitle`), Task 2 (`AppShell`, `NavItem`), Task 3 (`MapEmbed`, `LocationCard`, `InfoCard`, `googleMapsSearchUrl`), existing `Section`, `SectionHeading`, `ProseBlock`, `PostcardRow`, `AirmailStripe`, `getPostcard`, `event`, `tokens`, `fonts`, `textAccents`.
- Produces: `venue: VenueContent`; `VenuePage` at `/venue`; `navItems` gains `{ label: 'Venue', id: 'venue', to: '/venue' }`; `npm run build` emits `dist/venue/index.html`.

- [ ] **Step 1: Write the failing tests**

Append to `src/AppShell.test.tsx` (add `import userEvent from '@testing-library/user-event';`, `import { within } from '@testing-library/react';` merged into the existing import, and `import { venue } from './content/venue';`):
```tsx
describe('AppShell venue route', () => {
  it('renders the venue page with map, location card and current nav item', () => {
    renderAt('/venue');
    expect(screen.getByRole('heading', { level: 1, name: venue.hero.title })).toBeInTheDocument();
    expect(screen.getByTitle(venue.location.mapTitle).tagName).toBe('IFRAME');
    expect(screen.getByRole('complementary', { name: venue.location.name })).toBeInTheDocument();
    const nav = screen.getAllByRole('navigation', { name: 'Main', hidden: true })[0];
    expect(within(nav).getByRole('link', { name: 'Venue', hidden: true })).toHaveAttribute('aria-current', 'true');
    expect(document.title).toBe(venue.pageTitle);
  });

  it('treats /venue/ like /venue', () => {
    renderAt('/venue/');
    expect(screen.getByRole('heading', { level: 1, name: venue.hero.title })).toBeInTheDocument();
    const nav = screen.getAllByRole('navigation', { name: 'Main', hidden: true })[0];
    expect(within(nav).getByRole('link', { name: 'Venue', hidden: true })).toHaveAttribute('aria-current', 'true');
  });

  it('renders the campus postcard and three getting-there cards', () => {
    renderAt('/venue');
    expect(screen.getByRole('heading', { level: 2, name: venue.campus.heading })).toBeInTheDocument();
    expect(screen.getAllByRole('img').length).toBeGreaterThan(0);
    expect(screen.getAllByRole('article')).toHaveLength(venue.travel.cards.length);
  });

  it('goes back to the home page from the venue page via the brand link', async () => {
    const user = userEvent.setup();
    renderAt('/venue');
    await user.click(screen.getByRole('link', { name: 'ICPC LAC 2027' }));
    expect(await screen.findByRole('heading', { level: 1, name: event.name })).toBeInTheDocument();
  });
});
```

In `src/content/content.test.ts`, add `import { venue } from './venue';` and `import { googleMapsEmbedUrl, googleMapsSearchUrl } from '../lib/maps';`, then add inside `describe('content integrity', ...)`:
```ts
  it('points every page nav item at a known route', () => {
    for (const item of navItems.filter((i) => !i.to.startsWith('/#'))) {
      expect(['/venue']).toContain(item.to);
    }
  });

  it('gives the venue a real postcard and https map links', () => {
    expect(Object.hasOwn(postcards, venue.campus.postcardId)).toBe(true);
    expect(googleMapsEmbedUrl(venue.location.mapQuery)).toMatch(/^https:\/\//);
    expect(googleMapsSearchUrl(venue.location.mapQuery)).toMatch(/^https:\/\//);
    expect(venue.travel.cards).toHaveLength(3);
  });
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run src/AppShell.test.tsx src/content`
Expected: FAIL — `./content/venue` / `./venue` unresolved.

- [ ] **Step 3: Content**

Append to `src/content/types.ts`:
```ts
export type VenueContent = {
  pageTitle: string;
  hero: { eyebrow: string; title: string; subtitle: string; datesLine: string };
  campus: { eyebrow: string; heading: string; paragraphs: string[]; postcardId: string };
  location: {
    eyebrow: string;
    heading: string;
    cardEyebrow: string;
    name: string;
    addressLines: string[];
    coordinates: string;
    rows: { label: string; value: string }[];
    mapQuery: string;
    mapTitle: string;
    ctaLabel: string;
  };
  travel: { eyebrow: string; heading: string; cards: { id: string; title: string; paragraphs: string[] }[] };
};
```

In `src/content/event.ts`, change only the `venue` line to:
```ts
  venue: 'Arena Borregos, Campus Monterrey',
```

In `src/content/nav.ts`, add as the last `navItems` entry:
```ts
  { label: 'Venue', id: 'venue', to: '/venue' },
```

`src/content/venue.ts`:
```ts
import { event } from './event';
import type { VenueContent } from './types';

export const venue: VenueContent = {
  pageTitle: `Venue · ${event.name}`,
  hero: {
    eyebrow: 'Venue',
    title: 'Arena Borregos',
    subtitle: `${event.host} · Campus Monterrey`,
    datesLine: `Dates: ${event.dates}`,
  },
  campus: {
    eyebrow: 'The host',
    heading: 'Campus Monterrey',
    postcardId: 'cetec',
    paragraphs: [
      'Tecnológico de Monterrey was founded in Monterrey in 1943, and Campus Monterrey is its original campus. It sits in the south of the city, beneath the Cerro de la Silla.',
      'The championship takes place in Arena Borregos, the campus sports arena.',
    ],
  },
  location: {
    eyebrow: 'Find us',
    heading: 'Location',
    cardEyebrow: 'Venue',
    name: 'Arena Borregos',
    addressLines: ['Av. Eugenio Garza Sada 2501 Sur', 'Tecnológico, 64849 Monterrey, N.L., México'],
    coordinates: '25.6515° N / 100.2899° W',
    rows: [
      { label: 'When', value: event.dates },
      { label: 'Where', value: event.venue },
    ],
    mapQuery: 'Arena Borregos | Gimnasio Deportivo ITESM',
    mapTitle: 'Map of Arena Borregos at Tecnológico de Monterrey, Campus Monterrey',
    ctaLabel: 'View on Google Maps',
  },
  travel: {
    eyebrow: 'Plan your trip',
    heading: 'Getting there',
    cards: [
      {
        id: 'by-air',
        title: 'By air',
        paragraphs: ['Monterrey International Airport (MTY) is the closest airport.', 'Travel time to campus: TBD.'],
      },
      {
        id: 'around-the-city',
        title: 'Around the city',
        paragraphs: [
          'Taxis and ride-hailing apps are the simplest way to reach campus.',
          'Recommended hotels and official transport: TBD.',
        ],
      },
      {
        id: 'on-campus',
        title: 'On campus',
        paragraphs: ['Arena Borregos is inside Campus Monterrey.', 'Entrance and arrival instructions: TBD.'],
      },
    ],
  },
};
```

- [ ] **Step 4: Sections and page**

`src/sections/VenueHeroSection.tsx`:
```tsx
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Section from '../components/Section';
import { venue } from '../content/venue';
import { fonts, tokens } from '../theme/tokens';

export default function VenueHeroSection() {
  const { hero } = venue;
  return (
    <Section id="venue-top" labelledBy="venue-title">
      <Box sx={{ textAlign: 'center', px: 2, maxWidth: 900, mx: 'auto' }}>
        <Typography
          component="p"
          sx={{ fontFamily: fonts.mono, letterSpacing: '0.18em', fontSize: { xs: '0.75rem', md: '0.9rem' }, textTransform: 'uppercase', color: tokens.teal }}
        >
          {hero.eyebrow}
        </Typography>
        <Typography
          id="venue-title"
          variant="h1"
          sx={{ mt: 1.5, fontWeight: 800, lineHeight: 1.05, fontSize: { xs: '2.5rem', md: '4.25rem' }, color: tokens.ink }}
        >
          {hero.title}
        </Typography>
        <Typography sx={{ mt: 2, fontWeight: 700, fontSize: { xs: '1.05rem', md: '1.25rem' }, color: tokens.blue }}>
          {hero.subtitle}
        </Typography>
        <Typography sx={{ mt: 1, fontWeight: 600, color: tokens.bodyText }}>{hero.datesLine}</Typography>
      </Box>
    </Section>
  );
}
```

`src/sections/VenueCampusSection.tsx`:
```tsx
import Box from '@mui/material/Box';
import PostcardRow from '../components/PostcardRow';
import ProseBlock from '../components/ProseBlock';
import Section from '../components/Section';
import SectionHeading from '../components/SectionHeading';
import { getPostcard } from '../content/postcards';
import { venue } from '../content/venue';
import { tokens } from '../theme/tokens';

export default function VenueCampusSection() {
  const { campus } = venue;
  return (
    <Section id="campus" labelledBy="campus-title" tint={tokens.blue}>
      <Box sx={{ maxWidth: 1100, mx: 'auto', px: 2 }}>
        <SectionHeading id="campus-title" color={tokens.blue} eyebrow={campus.eyebrow}>
          {campus.heading}
        </SectionHeading>
      </Box>
      <PostcardRow side="right" postcard={getPostcard(campus.postcardId)}>
        <ProseBlock paragraphs={campus.paragraphs} />
      </PostcardRow>
    </Section>
  );
}
```

`src/sections/VenueMapSection.tsx`:
```tsx
import Box from '@mui/material/Box';
import LocationCard from '../components/LocationCard';
import MapEmbed from '../components/MapEmbed';
import Section from '../components/Section';
import SectionHeading from '../components/SectionHeading';
import { venue } from '../content/venue';
import { googleMapsSearchUrl } from '../lib/maps';
import { tokens } from '../theme/tokens';

export default function VenueMapSection() {
  const { location } = venue;
  return (
    <Section id="location" labelledBy="location-title">
      <Box sx={{ maxWidth: 1100, mx: 'auto', px: 2 }}>
        <SectionHeading id="location-title" color={tokens.green} eyebrow={location.eyebrow}>
          {location.heading}
        </SectionHeading>
        <Box sx={{ position: 'relative' }}>
          <MapEmbed query={location.mapQuery} title={location.mapTitle} />
          <Box sx={{ mt: { xs: 2, md: 0 }, position: { md: 'absolute' }, top: { md: 24 }, right: { md: 24 } }}>
            <LocationCard
              eyebrow={location.cardEyebrow}
              name={location.name}
              addressLines={location.addressLines}
              coordinates={location.coordinates}
              rows={location.rows}
              cta={{ label: location.ctaLabel, href: googleMapsSearchUrl(location.mapQuery) }}
            />
          </Box>
        </Box>
      </Box>
    </Section>
  );
}
```

`src/sections/VenueTravelSection.tsx`:
```tsx
import Box from '@mui/material/Box';
import InfoCard from '../components/InfoCard';
import ProseBlock from '../components/ProseBlock';
import Section from '../components/Section';
import SectionHeading from '../components/SectionHeading';
import { venue } from '../content/venue';
import { textAccents, tokens } from '../theme/tokens';

export default function VenueTravelSection() {
  const { travel } = venue;
  return (
    <Section id="getting-there" labelledBy="getting-there-title" tint={tokens.red}>
      <Box sx={{ maxWidth: 1100, mx: 'auto', px: 2 }}>
        <SectionHeading id="getting-there-title" color={tokens.red} eyebrow={travel.eyebrow}>
          {travel.heading}
        </SectionHeading>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          {travel.cards.map((card, index) => (
            <InfoCard key={card.id} title={card.title} accent={textAccents[index % textAccents.length]}>
              <ProseBlock paragraphs={card.paragraphs} />
            </InfoCard>
          ))}
        </Box>
      </Box>
    </Section>
  );
}
```

`src/pages/VenuePage.tsx`:
```tsx
import Box from '@mui/material/Box';
import AirmailStripe from '../components/AirmailStripe';
import { venue } from '../content/venue';
import { usePageTitle } from '../hooks/usePageTitle';
import VenueCampusSection from '../sections/VenueCampusSection';
import VenueHeroSection from '../sections/VenueHeroSection';
import VenueMapSection from '../sections/VenueMapSection';
import VenueTravelSection from '../sections/VenueTravelSection';

export default function VenuePage() {
  usePageTitle(venue.pageTitle);
  return (
    <Box component="main" id="main">
      <VenueHeroSection />
      <AirmailStripe />
      <VenueCampusSection />
      <VenueMapSection />
      <VenueTravelSection />
    </Box>
  );
}
```

- [ ] **Step 5: Route and active item in AppShell**

In `src/AppShell.tsx`: add `import VenuePage from './pages/VenuePage';`; replace
```tsx
  const activeId = useActiveSection(sectionIds, page);
```
with
```tsx
  const sectionId = useActiveSection(sectionIds, page);
  const activeId = page === '/venue' ? 'venue' : sectionId;
```
and add the route before the catch-all:
```tsx
        <Route path="/venue" element={<VenuePage />} />
```

- [ ] **Step 6: Run tests**

Run: `npx vitest run src/AppShell.test.tsx src/content src/App.test.tsx`
Expected: PASS.

- [ ] **Step 7: Static route copy**

`scripts/copy-route-html.mjs`:
```js
// Copies dist/index.html into each client-side route folder so static hosts serve
// /venue (and refreshes of it) without rewrite rules. Keep ROUTES in sync with
// the <Route> paths in src/AppShell.tsx.
import { access, copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const source = path.join(dist, 'index.html');
const ROUTES = ['venue'];

try {
  await access(source);
} catch {
  throw new Error(`${source} not found — run vite build first`);
}

for (const route of ROUTES) {
  const dir = path.join(dist, route);
  await mkdir(dir, { recursive: true });
  const target = path.join(dir, 'index.html');
  await copyFile(source, target);
  console.log(`copied ${path.relative(root, source)} → ${path.relative(root, target)}`);
}
```

Run: `npm pkg set scripts.build="tsc -b && vite build && node scripts/copy-route-html.mjs"`
Then: `npm run build && test -f dist/venue/index.html && cmp dist/index.html dist/venue/index.html && echo "venue route copied"`
Expected: build succeeds, prints `copied dist/index.html → dist/venue/index.html`, then `venue route copied`.

- [ ] **Step 8: Full check and commit**

Run: `npm test && npm run lint && npm run build`
```bash
git add package.json scripts/copy-route-html.mjs src
git commit -m "feat: add venue page for Arena Borregos at Campus Monterrey"
```

---

### Task 5: README and browser verification

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: the finished app.
- Produces: updated docs; verified build; screenshots in `/tmp` (not committed).

- [ ] **Step 1: Update the README**

In `README.md`:
1. After the first paragraph, add:
```markdown
## Pages

| URL | Page |
|---|---|
| `/` | Home: hero, About (`/#about`), Rules (`/#rules`) |
| `/venue` | Venue: Arena Borregos at Tecnológico de Monterrey, Campus Monterrey |

Routing uses React Router (`src/AppShell.tsx`). `npm run build` also copies
`dist/index.html` to `dist/venue/index.html` (`scripts/copy-route-html.mjs`) so
`/venue` loads directly on any static host. When adding a page, add its
`<Route>` in `AppShell.tsx` **and** its folder name to `ROUTES` in that script.
```
2. In the "Editing content" table, add the row:
```markdown
| `venue.ts` | Venue page: hero, campus text, address/map, getting-there cards. |
```

- [ ] **Step 2: Verification suite**

Run: `npm test && npm run lint && npm run build && ls dist/venue/index.html && grep -rn "TBD" src/content | wc -l`
Expected: all pass; the file exists; a non-zero TBD count.

- [ ] **Step 3: Prove direct loads work on a plain static host (no SPA fallback)**

`vite preview` falls back to `index.html` for every path, so it cannot prove the static copy works. Use Python's plain file server, which has no fallback, bound to loopback:

Run (background): `python3 -I -m http.server 4174 --bind 127.0.0.1 --directory dist`
Then:
```bash
lsof -nP -iTCP:4174 -sTCP:LISTEN
curl -sL -o /dev/null -w "%{http_code} %{url_effective}\n" http://127.0.0.1:4174/
curl -sL -o /dev/null -w "%{http_code} %{url_effective}\n" http://127.0.0.1:4174/venue
curl -sL http://127.0.0.1:4174/venue | grep -c '<div id="root">'
```
Expected: listener on `127.0.0.1:4174` only; `200` for `/` and for `/venue` (Python redirects to `/venue/` then serves `dist/venue/index.html`); the grep prints `1`. Stop this server and confirm `lsof -nP -iTCP:4174 -sTCP:LISTEN` prints nothing.

Then start the preview for screenshots — run (background): `npm run preview -- --port 4173 --strictPort` and confirm `lsof -nP -iTCP:4173 -sTCP:LISTEN` shows `127.0.0.1:4173` (never `*:4173`).

- [ ] **Step 4: Screenshots of /venue**

```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --virtual-time-budget=12000 --window-size=1440,2600 --screenshot=/tmp/venue-1440.png http://127.0.0.1:4173/venue
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --virtual-time-budget=12000 --window-size=768,3200 --screenshot=/tmp/venue-768.png http://127.0.0.1:4173/venue
cat > /tmp/venue-375-wrap.html <<'EOF'
<!doctype html><html><body style="margin:0"><iframe src="http://127.0.0.1:4173/venue" width="375" height="4200" style="border:0"></iframe></body></html>
EOF
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --virtual-time-budget=12000 --window-size=600,4200 --screenshot=/tmp/venue-375.png file:///tmp/venue-375-wrap.html
```
Read each PNG and record PASS/FAIL:
- "Venue" is underlined in the desktop nav (1440); hamburger shown at 375.
- H1 "Arena Borregos", subtitle and dates line visible.
- CETEC postcard visible in the Campus section with its caption.
- Map area present (the third-party map may render blank in headless Chrome — acceptable) with the location card floating at its top-right at 1440 and stacked below it at 375/768 (768 is below `md`, so stacked).
- Three "Getting there" cards: three across at 1440, stacked at 375.
- No horizontal overflow at 375.
Also load the home page once (`--screenshot=/tmp/home-1440-after-router.png http://127.0.0.1:4173/`) and confirm the hero and nav look as before (four items now).

- [ ] **Step 5: Stop the server**

Stop the background preview process and confirm `lsof -nP -iTCP:4173 -sTCP:LISTEN` prints nothing.

- [ ] **Step 6: Commit**

```bash
git add README.md
git commit -m "docs: document pages, routing and venue content"
```
