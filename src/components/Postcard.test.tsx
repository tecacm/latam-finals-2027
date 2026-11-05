import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { PostcardData } from '../content/types';
import Postcard from './Postcard';

const card: PostcardData = {
  id: 'cetec',
  place: 'CETEC · Tecnológico de Monterrey',
  alt: 'Vector postcard of the CETEC buildings with the Cerro de la Silla behind them',
  orientation: 'landscape',
  width: 1056,
  height: 864,
};

describe('Postcard', () => {
  it('renders a responsive image with alt text and intrinsic size', () => {
    render(<Postcard postcard={card} />);
    const img = screen.getByRole('img', { name: card.alt });
    const base = import.meta.env.BASE_URL;
    expect(img).toHaveAttribute('src', `${base}postcards/cetec-800.webp`);
    expect(img.getAttribute('srcset')).toBe(
      `${base}postcards/cetec-800.webp 800w, ${base}postcards/cetec-1600.webp 1600w`,
    );
    expect(img).toHaveAttribute('width', '1056');
    expect(img).toHaveAttribute('height', '864');
  });

  it('lazy-loads by default and loads eagerly when priority is set', () => {
    const { rerender } = render(<Postcard postcard={card} />);
    expect(screen.getByRole('img')).toHaveAttribute('loading', 'lazy');
    rerender(<Postcard postcard={card} priority />);
    expect(screen.getByRole('img')).toHaveAttribute('loading', 'eager');
  });

  it('shows the place caption unless disabled', () => {
    const { rerender } = render(<Postcard postcard={card} />);
    expect(screen.getByText(card.place)).toBeInTheDocument();
    rerender(<Postcard postcard={card} showPlace={false} />);
    expect(screen.queryByText(card.place)).not.toBeInTheDocument();
  });

  it('adds a postmark only when asked', () => {
    const { rerender } = render(<Postcard postcard={card} />);
    expect(screen.queryByTestId('postmark')).not.toBeInTheDocument();
    rerender(<Postcard postcard={card} postmark />);
    expect(screen.getByTestId('postmark')).toBeInTheDocument();
  });
});
