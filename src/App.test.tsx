import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the championship title', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { level: 1, name: '2027 ICPC Latin America Championship' }),
    ).toBeInTheDocument();
  });
});
