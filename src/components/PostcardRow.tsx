import Box from '@mui/material/Box';
import type { ReactNode } from 'react';
import type { PostcardData } from '../content/types';
import AnimateOnView from './AnimateOnView';
import Postcard from './Postcard';

type PostcardRowProps = {
  side: 'left' | 'right';
  postcard?: PostcardData;
  /** Defaults to -5° on the left, +5° on the right. */
  tilt?: number;
  children: ReactNode;
};

/** Text beside a postcard that slides in from its side; text-only without a postcard. */
export default function PostcardRow({ side, postcard, tilt, children }: PostcardRowProps) {
  if (!postcard) {
    return (
      <Box data-testid="postcard-row" data-layout="text-only" sx={{ maxWidth: 820, mx: 'auto', px: 2, py: { xs: 3, md: 5 } }}>
        {children}
      </Box>
    );
  }

  const resolvedTilt = tilt ?? (side === 'left' ? -5 : 5);
  return (
    <Box
      data-testid="postcard-row"
      data-layout={`postcard-${side}`}
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: side === 'left' ? 'row' : 'row-reverse' },
        alignItems: 'center',
        gap: { xs: 3, md: 8 },
        maxWidth: 1100,
        mx: 'auto',
        px: 2,
        py: { xs: 3, md: 5 },
      }}
    >
      <Box sx={{ flex: '0 0 auto', width: { xs: '80%', sm: '60%', md: '40%' } }}>
        <AnimateOnView variant={side === 'left' ? 'slide-from-left' : 'slide-from-right'}>
          <Postcard postcard={postcard} tilt={resolvedTilt} />
        </AnimateOnView>
      </Box>
      <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>{children}</Box>
    </Box>
  );
}
