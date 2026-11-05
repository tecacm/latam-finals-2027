import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { tokens } from '../theme/tokens';
import ProseBlock from './ProseBlock';
import Section from './Section';
import SectionHeading from './SectionHeading';

describe('Section', () => {
  it('is a labelled region that clears the sticky header when jumped to', () => {
    render(
      <Section id="about" labelledBy="about-title" tint={tokens.blue}>
        <SectionHeading id="about-title" color={tokens.blue} eyebrow="The championship">
          About
        </SectionHeading>
      </Section>,
    );
    const region = screen.getByRole('region', { name: 'About' });
    expect(region).toHaveAttribute('id', 'about');
    expect(region).toHaveAttribute('data-tint', tokens.blue);
    expect(region.style.scrollMarginTop).toBe('72px');
    expect(screen.getByRole('heading', { level: 2, name: 'About' })).toHaveAttribute('id', 'about-title');
    expect(screen.getByText('The championship')).toBeInTheDocument();
  });
});

describe('ProseBlock', () => {
  it('renders title, paragraphs and bullets', () => {
    render(<ProseBlock title="Prizes" paragraphs={['First.', 'Second.']} bullets={['Gold', 'Silver']} />);
    expect(screen.getByRole('heading', { level: 3, name: 'Prizes' })).toBeInTheDocument();
    expect(screen.getByText('First.')).toBeInTheDocument();
    expect(screen.getByText('Second.')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual(['Gold', 'Silver']);
  });

  it('omits the heading and list when not given', () => {
    render(<ProseBlock paragraphs={['Only text.']} />);
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });
});
