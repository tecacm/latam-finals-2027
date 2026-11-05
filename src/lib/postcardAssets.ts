import { withBase } from './withBase';

/** Widths produced by `scripts/export-postcards.mjs` (keep in sync). */
export const POSTCARD_WIDTHS = [800, 1600] as const;

export function postcardSrc(id: string, width: number): string {
  return withBase(`/postcards/${id}-${width}.webp`);
}

export function postcardSrcSet(id: string): string {
  return POSTCARD_WIDTHS.map((width) => `${postcardSrc(id, width)} ${width}w`).join(', ');
}
