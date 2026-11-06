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
