import Box from '@mui/material/Box';
import { tokens } from '../theme/tokens';

type WordmarkProps = { prefix: string; accent: string; suffix: string; accentColor?: string };

/** Text logo, e.g. "ICPC LAC 2027" with the middle word colored. */
export default function Wordmark({ prefix, accent, suffix, accentColor = tokens.red }: WordmarkProps) {
  return (
    <Box component="span" sx={{ fontWeight: 800, letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
      {prefix}{' '}
      <Box component="span" sx={{ color: accentColor }}>
        {accent}
      </Box>{' '}
      {suffix}
    </Box>
  );
}
