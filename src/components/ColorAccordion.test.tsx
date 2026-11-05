import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { icpcColors, tokens } from '../theme/tokens';
import ColorAccordion, { type ColorAccordionItem } from './ColorAccordion';

const items: ColorAccordionItem[] = [
  { id: 'a', title: 'Regional structure', body: <p>Body A</p> },
  { id: 'b', title: 'Advancing', body: <p>Body B</p> },
  { id: 'c', title: 'World Finals', body: <p>Body C</p> },
  { id: 'd', title: 'Prizes', body: <p>Body D</p> },
  { id: 'e', title: 'Unforeseen cases', body: <p>Body E</p> },
];

describe('ColorAccordion', () => {
  it('cycles header fills through the given colors', () => {
    render(<ColorAccordion items={items} colors={icpcColors} />);
    const fills = items.map((item) =>
      screen.getByRole('button', { name: item.title }).getAttribute('data-fill'),
    );
    expect(fills).toEqual([tokens.blue, tokens.red, tokens.yellow, tokens.green, tokens.blue]);
  });

  it('keeps only one panel open at a time', async () => {
    const user = userEvent.setup();
    render(<ColorAccordion items={items} colors={icpcColors} />);
    const first = screen.getByRole('button', { name: 'Regional structure' });
    const second = screen.getByRole('button', { name: 'Advancing' });

    await user.click(first);
    expect(first).toHaveAttribute('aria-expanded', 'true');

    await user.click(second);
    expect(second).toHaveAttribute('aria-expanded', 'true');
    expect(first).toHaveAttribute('aria-expanded', 'false');
  });

  it('points every header at exactly one panel element', () => {
    render(<ColorAccordion items={items} colors={icpcColors} />);
    for (const item of items) {
      const header = screen.getByRole('button', { name: item.title });
      const controls = header.getAttribute('aria-controls');
      expect(controls).toBe(`${item.id}-content`);
      expect(document.querySelectorAll(`[id="${controls}"]`)).toHaveLength(1);
    }
  });

  it('opens with the keyboard', async () => {
    const user = userEvent.setup();
    render(<ColorAccordion items={items} colors={icpcColors} />);
    await user.tab();
    const first = screen.getByRole('button', { name: 'Regional structure' });
    expect(first).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(first).toHaveAttribute('aria-expanded', 'true');
  });
});
