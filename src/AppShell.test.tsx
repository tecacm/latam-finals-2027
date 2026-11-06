import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import AppShell from './AppShell';
import { event } from './content/event';
import { venue } from './content/venue';

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

describe('AppShell venue route', () => {
  it('renders the venue page with map, location card and current nav item', () => {
    renderAt('/venue');
    expect(screen.getByRole('heading', { level: 1, name: venue.hero.title })).toBeInTheDocument();
    expect(screen.getByTitle(venue.location.mapTitle).tagName).toBe('IFRAME');
    expect(screen.getByRole('complementary', { name: venue.location.name })).toBeInTheDocument();
    const nav = screen.getAllByRole('navigation', { name: 'Main', hidden: true })[0];
    expect(within(nav).getByRole('link', { name: 'Venue', hidden: true })).toHaveAttribute('aria-current', 'page');
    expect(document.title).toBe(venue.pageTitle);
  });

  it('treats /venue/ like /venue', () => {
    renderAt('/venue/');
    expect(screen.getByRole('heading', { level: 1, name: venue.hero.title })).toBeInTheDocument();
    const nav = screen.getAllByRole('navigation', { name: 'Main', hidden: true })[0];
    expect(within(nav).getByRole('link', { name: 'Venue', hidden: true })).toHaveAttribute('aria-current', 'page');
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

describe('AppShell focus after navigation', () => {
  it('focuses the chosen section after picking a mobile menu item (MUI does not restore focus to the hamburger)', async () => {
    const user = userEvent.setup();
    renderAt('/');
    await user.click(screen.getByRole('button', { name: 'Open navigation menu' }));
    await user.click(within(await screen.findByRole('menu')).getByRole('menuitem', { name: 'Rules' }));
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    await waitFor(() => expect(document.activeElement?.id).toBe('rules'));
  });

  it('returns focus to the hamburger when the menu is dismissed with Escape', async () => {
    const user = userEvent.setup();
    renderAt('/');
    const button = screen.getByRole('button', { name: 'Open navigation menu' });
    await user.click(button);
    await screen.findByRole('menu');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    await waitFor(() => expect(document.activeElement).toBe(button));
  });
});
