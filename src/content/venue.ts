import { event } from './event';
import type { VenueContent } from './types';

export const venue: VenueContent = {
  pageTitle: `Venue · ${event.name}`,
  hero: {
    eyebrow: 'Venue',
    title: 'Arena Borregos',
    subtitle: `${event.host} · Campus Monterrey`,
    datesLine: `Dates: ${event.dates}`,
  },
  campus: {
    eyebrow: 'The host',
    heading: 'Campus Monterrey',
    postcardId: 'cetec',
    paragraphs: [
      'Tecnológico de Monterrey was founded in Monterrey in 1943, and Campus Monterrey is its original campus. It sits in the south of the city, beneath the Cerro de la Silla.',
      'The championship takes place in Arena Borregos, the campus sports arena.',
    ],
  },
  location: {
    eyebrow: 'Find us',
    heading: 'Location',
    cardEyebrow: 'Venue',
    name: 'Arena Borregos',
    addressLines: ['Av. Eugenio Garza Sada 2501 Sur', 'Tecnológico, 64849 Monterrey, N.L., México'],
    coordinates: '25.6515° N / 100.2899° W',
    rows: [
      { label: 'When', value: event.dates },
      { label: 'Where', value: event.venue },
    ],
    mapQuery: 'Arena Borregos | Gimnasio Deportivo ITESM',
    mapTitle: 'Map of Arena Borregos at Tecnológico de Monterrey, Campus Monterrey',
    ctaLabel: 'View on Google Maps',
  },
  travel: {
    eyebrow: 'Plan your trip',
    heading: 'Getting there',
    cards: [
      {
        id: 'by-air',
        title: 'By air',
        paragraphs: ['Monterrey International Airport (MTY) is the closest airport.', 'Travel time to campus: TBD.'],
      },
      {
        id: 'around-the-city',
        title: 'Around the city',
        paragraphs: [
          'Taxis and ride-hailing apps are the simplest way to reach campus.',
          'Recommended hotels and official transport: TBD.',
        ],
      },
      {
        id: 'on-campus',
        title: 'On campus',
        paragraphs: ['Arena Borregos is inside Campus Monterrey.', 'Entrance and arrival instructions: TBD.'],
      },
    ],
  },
};
