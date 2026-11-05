import { describe, expect, it } from 'vitest';
import { postcardSrc, postcardSrcSet } from './postcardAssets';
import { withBase } from './withBase';

describe('withBase', () => {
  it('prefixes the Vite base URL', () => {
    expect(withBase('/postcards/cetec-800.webp')).toBe(`${import.meta.env.BASE_URL}postcards/cetec-800.webp`);
  });

  it('supports deployment under a sub-path', () => {
    expect(withBase('/postcards/cetec-800.webp', '/icpc2027/')).toBe('/icpc2027/postcards/cetec-800.webp');
    expect(withBase('postcards/x.webp', '/icpc2027/')).toBe('/icpc2027/postcards/x.webp');
  });
});

describe('postcard asset paths', () => {
  it('builds the 800 and 1600 px sources', () => {
    expect(postcardSrc('cetec', 800)).toBe(withBase('/postcards/cetec-800.webp'));
    expect(postcardSrcSet('cetec')).toBe(
      `${withBase('/postcards/cetec-800.webp')} 800w, ${withBase('/postcards/cetec-1600.webp')} 1600w`,
    );
  });
});
