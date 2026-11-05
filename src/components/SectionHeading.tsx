import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { fonts, tokens } from '../theme/tokens';

type SectionHeadingProps = { id: string; color: string; eyebrow?: string; children: ReactNode };

export default function SectionHeading({ id, color, eyebrow, children }: SectionHeadingProps) {
  return (
    <Box sx={{ mb: { xs: 2, md: 3 } }}>
      {eyebrow && (
        <Typography
          component="p"
          sx={{
            fontFamily: fonts.mono,
            fontSize: '0.8rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: tokens.teal,
            mb: 1,
          }}
        >
          {eyebrow}
        </Typography>
      )}
      <Typography
        id={id}
        variant="h2"
        sx={{
          color,
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          fontSize: { xs: '1.9rem', md: '2.75rem' },
          lineHeight: 1.1,
        }}
      >
        {children}
      </Typography>
    </Box>
  );
}
