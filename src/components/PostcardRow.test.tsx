import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { PostcardData } from '../content/types';
import PostcardRow from './PostcardRow';

const card: PostcardData = {
  id: 'fundidora',
  place: 'Parque Fundidora',
  alt: 'Vector postcard of a steel ladle pouring water at Parque Fundidora',
  orientation: 'portrait',
  width: 3308,
  height: 4040,
};

describe('PostcardRow', () => {
  it('puts the postcard on the requested side', () => {
    const { rerender } = render(
      <PostcardRow side="left" postcard={card}>
        <p>Row text</p>
      </PostcardRow>,
    );
    expect(screen.getByTestId('postcard-row')).toHaveAttribute('data-layout', 'postcard-left');
    rerender(
      <PostcardRow side="right" postcard={card}>
        <p>Row text</p>
      </PostcardRow>,
    );
    expect(screen.getByTestId('postcard-row')).toHaveAttribute('data-layout', 'postcard-right');
  });

  it('places the postcard before the text in DOM order (stacks first on mobile)', () => {
    render(
      <PostcardRow side="right" postcard={card}>
        <p>Row text</p>
      </PostcardRow>,
    );
    const img = screen.getByRole('img', { name: card.alt });
    const text = screen.getByText('Row text');
    expect(img.compareDocumentPosition(text) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('renders text only when there is no postcard', () => {
    render(
      <PostcardRow side="left">
        <p>Row text</p>
      </PostcardRow>,
    );
    expect(screen.getByTestId('postcard-row')).toHaveAttribute('data-layout', 'text-only');
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('Row text')).toBeInTheDocument();
  });
});
