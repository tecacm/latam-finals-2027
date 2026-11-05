import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import type { ReactNode } from 'react';
import { HEADER_HEIGHT } from '../theme/layout';

type SectionProps = {
  id: string;
  /** id of the heading that names this section. */
  labelledBy: string;
  /** Accent color; painted as a ~7% tint behind the section. */
  tint?: string;
  children: ReactNode;
};

export default function Section({ id, labelledBy, tint, children }: SectionProps) {
  return (
    <Box
      component="section"
      id={id}
      aria-labelledby={labelledBy}
      data-tint={tint}
      style={{ scrollMarginTop: `${HEADER_HEIGHT}px` }}
      sx={{
        py: { xs: 5, md: 9 },
        // Clip sideways overflow from tilted stamps and slide-ins without breaking sticky.
        overflowX: 'clip',
        backgroundColor: tint ? alpha(tint, 0.07) : 'transparent',
      }}
    >
      {children}
    </Box>
  );
}
