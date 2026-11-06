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
