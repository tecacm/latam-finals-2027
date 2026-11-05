/**
 * Design tokens. ICPC blue/red/yellow/green are approximations of the brand
 * colors; swap the official values here and re-run `npm test` (contrast tests).
 */
export const tokens = {
  paper: '#FFFBEB',
  ink: '#0B2A55',
  blue: '#1F5AA6',
  red: '#CF3B2A',
  yellow: '#F0B323',
  yellowText: '#A87A00',
  green: '#2E7D3A',
  teal: '#387072',
  bodyText: '#24323F',
  white: '#FFFFFF',
} as const;

/** Fills, stripes and balloons. Yellow is never used as small text. */
export const icpcColors = [tokens.blue, tokens.red, tokens.yellow, tokens.green] as const;

/** Accent colors that are safe for normal-size text on paper. */
export const textAccents = [tokens.blue, tokens.red, tokens.green] as const;

/** Large countdown digits, one color per unit. */
export const countdownColors = [tokens.blue, tokens.red, tokens.yellowText, tokens.green] as const;

export const fonts = {
  body: 'Montserrat, "Helvetica Neue", Helvetica, Arial, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, Menlo, monospace',
} as const;
