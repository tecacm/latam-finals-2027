import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';
import { about } from './content/about';
import { event } from './content/event';
import { navItems } from './content/nav';
import { rules } from './content/rules';

describe('App', () => {
  it('renders the hero, About and Rules on one page', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: event.name })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: about.heading })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: rules.heading })).toBeInTheDocument();
  });

  it('has a section for every in-page nav item', () => {
    render(<App />);
    for (const item of navItems.filter((i) => i.to.startsWith('/#'))) {
      const id = item.to.slice(2);
      expect(document.getElementById(id), `missing #${id}`).not.toBeNull();
    }
  });

  it('renders every About block and every rules entry', () => {
    render(<App />);
    for (const block of about.blocks) {
      expect(screen.getByRole('heading', { level: 3, name: block.title })).toBeInTheDocument();
    }
    for (const entry of rules.entries) {
      expect(screen.getByRole('button', { name: entry.title })).toBeInTheDocument();
    }
  });

  it('shows the countdown fallback while the date is unknown, or a live countdown once set', () => {
    render(<App />);
    if (event.countdownTarget === null) {
      expect(screen.getByRole('status')).toHaveTextContent('Date to be announced');
    } else {
      expect(screen.queryByRole('timer') ?? screen.queryByRole('status')).not.toBeNull();
    }
  });

  it('gives every image alt text and links to the official rules', () => {
    render(<App />);
    for (const img of screen.getAllByRole('img')) {
      expect(img.getAttribute('alt')?.length ?? 0).toBeGreaterThan(0);
    }
    const main = screen.getByRole('main');
    expect(within(main).getByRole('link', { name: rules.officialRulesLabel })).toHaveAttribute(
      'href',
      event.links.regionalRules,
    );
  });
});
