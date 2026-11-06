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
