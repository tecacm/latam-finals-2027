import { describe, expect, it } from 'vitest';
import { countdownColors, icpcColors, textAccents, tokens } from '../theme/tokens';
import { contrastRatio, readableTextOn, relativeLuminance } from './contrast';

describe('contrast', () => {
  it('computes WCAG luminance at the extremes', () => {
    expect(relativeLuminance('#000000')).toBe(0);
    expect(relativeLuminance('#FFFFFF')).toBeCloseTo(1, 5);
  });

  it('computes the black/white contrast ratio', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
  });

  it('rejects colors that are not #RRGGBB', () => {
    expect(() => relativeLuminance('red')).toThrow(/#RRGGBB/);
  });

  it('picks ink on yellow and paper on blue, red and green', () => {
    expect(readableTextOn(tokens.yellow)).toBe(tokens.ink);
    expect(readableTextOn(tokens.blue)).toBe(tokens.paper);
    expect(readableTextOn(tokens.red)).toBe(tokens.paper);
    expect(readableTextOn(tokens.green)).toBe(tokens.paper);
  });

  it('keeps every accordion fill readable (WCAG AA, 4.5:1)', () => {
    for (const fill of icpcColors) {
      expect(contrastRatio(fill, readableTextOn(fill))).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('keeps colored headings and labels readable on paper (4.5:1)', () => {
    for (const color of [...textAccents, tokens.teal, tokens.bodyText, tokens.ink]) {
      expect(contrastRatio(color, tokens.paper)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('keeps large countdown digits readable on paper (3:1)', () => {
    for (const color of countdownColors) {
      expect(contrastRatio(color, tokens.paper)).toBeGreaterThanOrEqual(3);
    }
  });
});
