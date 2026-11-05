import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { mockMatchMedia } from '../test/matchMedia';
import AnimateOnView from './AnimateOnView';

describe('AnimateOnView', () => {
  let restore: (() => void) | undefined;
  afterEach(() => {
    restore?.();
    restore = undefined;
  });

  it('shows content when IntersectionObserver is unavailable', () => {
    render(
      <AnimateOnView variant="slide-from-left">
        <p>Hello Monterrey</p>
      </AnimateOnView>,
    );
    const wrapper = screen.getByTestId('animate-on-view');
    expect(screen.getByText('Hello Monterrey')).toBeInTheDocument();
    expect(wrapper.style.opacity).toBe('1');
    expect(wrapper.style.transform).toBe('none');
  });

  it('renders content with no animation styles under reduced motion', () => {
    restore = mockMatchMedia((query) => query.includes('prefers-reduced-motion: reduce'));
    render(
      <AnimateOnView variant="slide-from-right">
        <p>Hello Monterrey</p>
      </AnimateOnView>,
    );
    const wrapper = screen.getByTestId('animate-on-view');
    expect(wrapper.style.opacity).toBe('');
    expect(wrapper.style.transform).toBe('');
    expect(wrapper.style.transition).toBe('');
  });
});
