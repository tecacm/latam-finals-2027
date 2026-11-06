import type { EventInfo } from './types';

/** Single source for event facts. Replace each 'TBD' when confirmed. */
export const event: EventInfo = {
  name: '2027 ICPC Latin America Championship',
  shortName: 'ICPC LAC 2027',
  wordmark: { prefix: 'ICPC', accent: 'LAC', suffix: '2027' },
  city: 'Monterrey, Nuevo León, México',
  dates: 'July 17 2027',
  host: 'Tecnológico de Monterrey',
  venue: 'Arena Borregos, Campus Monterrey',
  // Example once known: '2027-11-12T09:00:00-06:00' (always include the offset).
  countdownTarget: '2027-07-17T09:00:00-06:00',
  links: {
    icpc: 'https://icpc.global',
    regionalRules: 'https://icpc.global/regionals/rules',
  },
};
