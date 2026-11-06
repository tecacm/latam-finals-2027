// @vitest-environment node
/// <reference types="node" />
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it, vi } from 'vitest';
import { googleMapsEmbedUrl, googleMapsSearchUrl } from '../lib/maps';
import { POSTCARD_WIDTHS } from '../lib/postcardAssets';
import { about } from './about';
import { event } from './event';
import { hero } from './hero';
import { navItems, sectionIds } from './nav';
import { getPostcard, postcards } from './postcards';
import { rules } from './rules';
import { venue } from './venue';

const postcardDir = fileURLToPath(new URL('../../public/postcards/', import.meta.url));

describe('content integrity', () => {
  it('references only postcards that exist', () => {
    const referenced = [hero.postcardId, rules.postcardId, ...about.blocks.map((b) => b.postcardId)].filter(
      (id): id is string => id !== undefined,
    );
    for (const id of referenced) {
      expect(Object.hasOwn(postcards, id), `unknown postcard "${id}"`).toBe(true);
    }
  });

  it('has exported WebP files for every postcard', () => {
    for (const postcard of Object.values(postcards)) {
      for (const width of POSTCARD_WIDTHS) {
        const file = `${postcardDir}${postcard.id}-${width}.webp`;
        expect(existsSync(file), `missing ${file} — run npm run postcards`).toBe(true);
      }
    }
  });

  it('gives every postcard a descriptive alt text and a matching id key', () => {
    for (const [key, postcard] of Object.entries(postcards)) {
      expect(postcard.id).toBe(key);
      expect(postcard.alt.length).toBeGreaterThan(20);
      expect(postcard.width).toBeGreaterThan(0);
      expect(postcard.height).toBeGreaterThan(0);
    }
  });

  it('points every in-page nav item at a known home section', () => {
    for (const item of navItems.filter((i) => i.to.startsWith('/#'))) {
      expect(sectionIds).toContain(item.to.slice(2));
      expect(item.id).toBe(item.to.slice(2));
    }
  });

  it('requires an explicit timezone offset on the countdown target', () => {
    const target = event.countdownTarget;
    const valid =
      target === null || (/(Z|[+-]\d{2}:\d{2})$/.test(target) && !Number.isNaN(Date.parse(target)));
    expect(valid, `countdownTarget "${target}" must be ISO 8601 ending in Z or ±HH:MM`).toBe(true);
  });

  it('uses absolute https links', () => {
    expect(event.links.icpc).toMatch(/^https:\/\//);
    expect(event.links.regionalRules).toMatch(/^https:\/\//);
  });

  it('points every page nav item at a known route', () => {
    for (const item of navItems.filter((i) => !i.to.startsWith('/#'))) {
      expect(['/venue']).toContain(item.to);
    }
  });

  it('gives the venue a real postcard and https map links', () => {
    expect(Object.hasOwn(postcards, venue.campus.postcardId)).toBe(true);
    expect(googleMapsEmbedUrl(venue.location.mapQuery)).toMatch(/^https:\/\//);
    expect(googleMapsSearchUrl(venue.location.mapQuery)).toMatch(/^https:\/\//);
    expect(venue.travel.cards).toHaveLength(3);
  });
});

describe('getPostcard', () => {
  it('returns undefined for a missing id', () => {
    expect(getPostcard(undefined)).toBeUndefined();
  });

  it('returns undefined and warns for unknown ids, including Object.prototype keys', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(getPostcard('macroplaza')).toBeUndefined();
    expect(getPostcard('toString')).toBeUndefined();
    expect(warn).toHaveBeenCalledTimes(2);
    warn.mockRestore();
  });

  it('returns known postcards', () => {
    expect(getPostcard('cetec')?.place).toMatch(/CETEC/);
  });
});
