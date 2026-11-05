import type { PostcardData } from './types';

/** Registry of postcard art. Add an entry after running `npm run postcards`. */
export const postcards: Record<string, PostcardData> = {
  cetec: {
    id: 'cetec',
    place: 'CETEC · Tecnológico de Monterrey',
    alt: 'Vector postcard of the angular CETEC buildings at Tecnológico de Monterrey, with the Cerro de la Silla and white clouds behind them on a sunny day',
    orientation: 'landscape',
    width: 1056,
    height: 864,
  },
  rectoria: {
    id: 'rectoria',
    place: 'Rectoría · Tecnológico de Monterrey',
    alt: 'Vector postcard of the Rectoría building at night, a long colorful mural raised on columns above a softly lit lobby',
    orientation: 'portrait',
    width: 918,
    height: 1121,
  },
  fundidora: {
    id: 'fundidora',
    place: 'Parque Fundidora',
    alt: 'Vector postcard of a giant steel ladle pouring a stream of water into a pool at Parque Fundidora, with mountains under a blue sky',
    orientation: 'portrait',
    width: 3308,
    height: 4040,
  },
};

export function getPostcard(id: string | undefined): PostcardData | undefined {
  if (id === undefined) return undefined;
  if (Object.hasOwn(postcards, id)) return postcards[id];
  if (import.meta.env.DEV) console.warn(`Unknown postcard id "${id}" — rendering text only.`);
  return undefined;
}
