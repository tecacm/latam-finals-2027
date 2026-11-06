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
    expect(within(nav).getByRole('link', { name: 'Venue', ...HIDDEN })).toHaveAttribute('aria-current', 'page');
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
    expect(within(menu).getByRole('menuitem', { name: 'About' })).toHaveAttribute('aria-current', 'location');
    expect(within(menu).getByRole('menuitem', { name: 'Home' })).not.toHaveAttribute('aria-current');
  });
});
