import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { installIntersectionObserverMock } from '../test/intersectionObserver';
import { useActiveSection } from './useActiveSection';

const IDS = ['home', 'about', 'rules'] as const;

function Probe() {
  const active = useActiveSection(IDS);
  return (
    <div>
      <section id="home" />
      <section id="about" />
      <section id="rules" />
      <output data-testid="active">{active ?? 'none'}</output>
    </div>
  );
}

describe('useActiveSection', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('starts on the first section and does nothing without IntersectionObserver', () => {
    render(<Probe />);
    expect(screen.getByTestId('active')).toHaveTextContent('home');
  });

  it('follows the section with the most visible height', () => {
    const io = installIntersectionObserverMock();
    render(<Probe />);

    act(() => io.setVisibleHeights({ home: 120, about: 540, rules: 0 }));
    expect(screen.getByTestId('active')).toHaveTextContent('about');

    act(() => io.setVisibleHeights({ about: 90, rules: 610 }));
    expect(screen.getByTestId('active')).toHaveTextContent('rules');
  });

  it('keeps the last active section when nothing is visible', () => {
    const io = installIntersectionObserverMock();
    render(<Probe />);
    act(() => io.setVisibleHeights({ about: 400 }));
    act(() => io.setVisibleHeights({ home: 0, about: 0, rules: 0 }));
    expect(screen.getByTestId('active')).toHaveTextContent('about');
  });
});
