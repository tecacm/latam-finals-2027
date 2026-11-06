import { describe, expect, it } from 'vitest';
import { googleMapsEmbedUrl, googleMapsSearchUrl } from './maps';

const QUERY = 'Arena Borregos | Gimnasio Deportivo ITESM';

describe('maps', () => {
  it('builds a keyless Google Maps embed URL', () => {
    expect(googleMapsEmbedUrl(QUERY)).toBe(
      'https://maps.google.com/maps?q=Arena%20Borregos%20%7C%20Gimnasio%20Deportivo%20ITESM&t=m&z=16&output=embed&iwloc=near',
    );
    expect(googleMapsEmbedUrl(QUERY, 14)).toContain('&z=14&');
  });

  it('builds a Google Maps search link', () => {
    expect(googleMapsSearchUrl(QUERY)).toBe(
      'https://www.google.com/maps/search/?api=1&query=Arena%20Borregos%20%7C%20Gimnasio%20Deportivo%20ITESM',
    );
  });
});
