import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import type { NavItem } from '../content/types';
import SiteHeader from './SiteHeader';

const items: NavItem[] = [
  { label: 'Home', sectionId: 'home' },
  { label: 'About', sectionId: 'about' },
  { label: 'Rules', sectionId: 'rules' },
];

// jsdom does not evaluate @media rules, so the desktop nav (display: none below
// md) counts as hidden here; query it with { hidden: true }.
const HIDDEN = { hidden: true } as const;

describe('SiteHeader', () => {
  it('links the brand and every nav item to its section', () => {
    render(<SiteHeader brand="ICPC LAC 2027" items={items} activeId="home" />);
    expect(screen.getByRole('link', { name: 'ICPC LAC 2027' })).toHaveAttribute('href', '#home');
    const nav = screen.getAllByRole('navigation', { name: 'Main', ...HIDDEN })[0];
    expect(within(nav).getByRole('link', { name: 'Home', ...HIDDEN })).toHaveAttribute('href', '#home');
    expect(within(nav).getByRole('link', { name: 'About', ...HIDDEN })).toHaveAttribute('href', '#about');
    expect(within(nav).getByRole('link', { name: 'Rules', ...HIDDEN })).toHaveAttribute('href', '#rules');
  });

  it('marks only the active section link as current', () => {
    render(<SiteHeader brand="ICPC LAC 2027" items={items} activeId="about" />);
    const nav = screen.getAllByRole('navigation', { name: 'Main', ...HIDDEN })[0];
    expect(within(nav).getByRole('link', { name: 'About', ...HIDDEN })).toHaveAttribute('aria-current', 'true');
    expect(within(nav).getByRole('link', { name: 'Home', ...HIDDEN })).not.toHaveAttribute('aria-current');
  });

  it('opens the mobile menu and closes it after picking a section', async () => {
    const user = userEvent.setup();
    render(<SiteHeader brand="ICPC LAC 2027" items={items} activeId="home" />);

    await user.click(screen.getByRole('button', { name: 'Open navigation menu' }));
    const menu = await screen.findByRole('menu');
    const rules = within(menu).getByRole('menuitem', { name: 'Rules' });
    expect(rules).toHaveAttribute('href', '#rules');

    await user.click(rules);
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  });

  it('marks the active section in the mobile menu as current', async () => {
    const user = userEvent.setup();
    render(<SiteHeader brand="ICPC LAC 2027" items={items} activeId="about" />);

    await user.click(screen.getByRole('button', { name: 'Open navigation menu' }));
    const menu = await screen.findByRole('menu');
    expect(within(menu).getByRole('menuitem', { name: 'About' })).toHaveAttribute('aria-current', 'true');
    expect(within(menu).getByRole('menuitem', { name: 'Home' })).not.toHaveAttribute('aria-current');
  });
});
