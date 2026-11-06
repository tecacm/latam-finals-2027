import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { tokens } from '../theme/tokens';

type InfoCardProps = { title: string; accent: string; children: ReactNode };

/** Small card with a colored top edge, used for "Getting there" tips. */
export default function InfoCard({ title, accent, children }: InfoCardProps) {
  return (
    <Box
      component="article"
      data-accent={accent}
      sx={{
        height: '100%',
        p: 3,
        backgroundColor: tokens.white,
        borderTop: `6px solid ${accent}`,
        borderRadius: 2,
        boxShadow: `0 6px 16px ${alpha(tokens.ink, 0.1)}`,
      }}
    >
      <Typography variant="h3" sx={{ fontWeight: 800, fontSize: '1.25rem', color: tokens.ink, mb: 1.5 }}>
        {title}
      </Typography>
      <Box sx={{ color: tokens.bodyText }}>{children}</Box>
    </Box>
  );
}
