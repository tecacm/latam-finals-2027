import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { icpcColors, tokens } from '../theme/tokens';
import AirmailStripe from './AirmailStripe';
import Balloon from './Balloon';
import BalloonCluster from './BalloonCluster';
import ColorSegmentBar from './ColorSegmentBar';
import Postmark from './Postmark';
import Wordmark from './Wordmark';

describe('decorations', () => {
  it('hides the postmark from assistive tech and renders its label and year', () => {
    render(<Postmark label="MONTERREY N.L." year="2027" />);
    const mark = screen.getByTestId('postmark');
    expect(mark).toHaveAttribute('aria-hidden', 'true');
    expect(mark).toHaveTextContent('MONTERREY N.L.');
    expect(mark).toHaveTextContent('2027');
  });

  it('colors a balloon and hides it from assistive tech', () => {
    render(<Balloon color={tokens.red} size={40} />);
    const balloon = screen.getByTestId('balloon');
    expect(balloon).toHaveAttribute('aria-hidden', 'true');
    expect(balloon).toHaveStyle({ color: tokens.red });
    expect(balloon).toHaveAttribute('width', '40');
    expect(balloon).toHaveAttribute('height', '70');
  });

  it('renders one balloon per color in a cluster', () => {
    render(<BalloonCluster colors={icpcColors} />);
    expect(screen.getAllByTestId('balloon')).toHaveLength(icpcColors.length);
  });

  it('renders decorative stripes hidden from assistive tech', () => {
    render(
      <>
        <AirmailStripe />
        <ColorSegmentBar />
      </>,
    );
    expect(screen.getByTestId('airmail-stripe')).toHaveAttribute('aria-hidden', 'true');
    const bar = screen.getByTestId('color-segment-bar');
    expect(bar).toHaveAttribute('aria-hidden', 'true');
    expect(bar.children).toHaveLength(icpcColors.length);
  });

  it('renders the wordmark as readable text', () => {
    render(<Wordmark prefix="ICPC" accent="LAC" suffix="2027" />);
    expect(screen.getByText('LAC')).toBeInTheDocument();
    expect(screen.getByText('LAC').parentElement).toHaveTextContent('ICPC LAC 2027');
  });
});
