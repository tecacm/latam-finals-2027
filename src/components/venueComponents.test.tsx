import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { tokens } from '../theme/tokens';
import InfoCard from './InfoCard';
import LocationCard from './LocationCard';
import MapEmbed from './MapEmbed';

describe('MapEmbed', () => {
  it('renders a titled, lazy, keyless Google Maps iframe', () => {
    render(<MapEmbed query="Arena Borregos | Gimnasio Deportivo ITESM" title="Map of Arena Borregos" />);
    const frame = screen.getByTitle('Map of Arena Borregos');
    expect(frame.tagName).toBe('IFRAME');
    expect(frame.getAttribute('src')).toContain('q=Arena%20Borregos%20%7C%20Gimnasio%20Deportivo%20ITESM');
    expect(frame.getAttribute('src')).toContain('output=embed');
    expect(frame).toHaveAttribute('loading', 'lazy');
    expect(frame).toHaveAttribute('referrerpolicy', 'no-referrer-when-downgrade');
  });
});

describe('LocationCard', () => {
  it('shows the venue, address, details and a safe external map link', () => {
    render(
      <LocationCard
        eyebrow="Venue"
        name="Arena Borregos"
        addressLines={['Av. Eugenio Garza Sada 2501 Sur', 'Tecnológico, 64849 Monterrey, N.L., México']}
        coordinates="25.6515° N / 100.2899° W"
        rows={[
          { label: 'When', value: 'July 17 2027' },
          { label: 'Where', value: 'Arena Borregos, Campus Monterrey' },
        ]}
        cta={{ label: 'View on Google Maps', href: 'https://www.google.com/maps/search/?api=1&query=x' }}
      />,
    );
    const card = screen.getByRole('complementary', { name: 'Arena Borregos' });
    expect(within(card).getByRole('heading', { level: 3, name: 'Arena Borregos' })).toBeInTheDocument();
    expect(card).toHaveTextContent('Av. Eugenio Garza Sada 2501 Sur');
    expect(card).toHaveTextContent('Tecnológico, 64849 Monterrey, N.L., México');
    expect(card).toHaveTextContent('25.6515° N / 100.2899° W');
    expect(within(card).getByText('When').nextElementSibling).toHaveTextContent('July 17 2027');
    expect(within(card).getByText('Where').nextElementSibling).toHaveTextContent('Arena Borregos, Campus Monterrey');
    const link = within(card).getByRole('link', { name: 'View on Google Maps' });
    expect(link).toHaveAttribute('href', 'https://www.google.com/maps/search/?api=1&query=x');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('omits the coordinates line when not given', () => {
    render(
      <LocationCard
        eyebrow="Venue"
        name="Arena Borregos"
        addressLines={['Line 1']}
        rows={[]}
        cta={{ label: 'View on Google Maps', href: 'https://example.com' }}
      />,
    );
    expect(screen.queryByText(/° N/)).not.toBeInTheDocument();
  });
});

describe('InfoCard', () => {
  it('renders an article with an h3 title, accent border and body', () => {
    render(
      <InfoCard title="By air" accent={tokens.blue}>
        <p>Monterrey International Airport (MTY)</p>
      </InfoCard>,
    );
    const card = screen.getByRole('article');
    expect(within(card).getByRole('heading', { level: 3, name: 'By air' })).toBeInTheDocument();
    expect(card).toHaveTextContent('Monterrey International Airport (MTY)');
    expect(card).toHaveAttribute('data-accent', tokens.blue);
  });
});
