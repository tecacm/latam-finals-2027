import Box from '@mui/material/Box';
import { alpha, styled } from '@mui/material/styles';
import type { PostcardData } from '../content/types';
import { postcardSrc, postcardSrcSet } from '../lib/postcardAssets';
import { fonts, tokens } from '../theme/tokens';
import Postmark from './Postmark';

export type PostcardSize = 'hero' | 'row';

const SIZES: Record<PostcardSize, string> = {
  hero: '(min-width: 900px) 560px, 85vw',
  row: '(min-width: 900px) 440px, 80vw',
};

const MAX_WIDTH: Record<PostcardSize, number> = { hero: 560, row: 440 };

const StampImage = styled('img')({
  display: 'block',
  width: '100%',
  height: 'auto',
  filter: `drop-shadow(0 10px 14px ${alpha(tokens.ink, 0.25)})`,
});

type PostcardProps = {
  postcard: PostcardData;
  /** Rotation in degrees on desktop; clamped to ±3° on mobile. */
  tilt?: number;
  postmark?: boolean;
  postmarkColor?: string;
  size?: PostcardSize;
  /** Above-the-fold image: load eagerly with high priority. */
  priority?: boolean;
  showPlace?: boolean;
};

export default function Postcard({
  postcard,
  tilt = 0,
  postmark = false,
  postmarkColor = tokens.ink,
  size = 'row',
  priority = false,
  showPlace = true,
}: PostcardProps) {
  const mobileTilt = Math.max(-3, Math.min(3, tilt));
  return (
    <Box
      component="figure"
      data-testid="postcard"
      sx={{
        position: 'relative',
        m: 0,
        mx: 'auto',
        width: '100%',
        maxWidth: MAX_WIDTH[size],
        '--tilt': `${mobileTilt}deg`,
        '@media (min-width: 900px)': { '--tilt': `${tilt}deg` },
        transform: 'rotate(var(--tilt))',
        transition: 'transform 300ms ease',
        '@media (hover: hover) and (prefers-reduced-motion: no-preference)': {
          '&:hover': { transform: 'rotate(var(--tilt)) translateY(-8px)' },
        },
        '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
      }}
    >
      <StampImage
        src={postcardSrc(postcard.id, 800)}
        srcSet={postcardSrcSet(postcard.id)}
        sizes={SIZES[size]}
        width={postcard.width}
        height={postcard.height}
        alt={postcard.alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
      />
      {postmark && (
        <Postmark
          color={postmarkColor}
          style={{
            position: 'absolute',
            right: '-10%',
            top: '-6%',
            width: '42%',
            transform: 'rotate(14deg)',
            opacity: 0.85,
            pointerEvents: 'none',
          }}
        />
      )}
      {showPlace && (
        <Box
          component="figcaption"
          sx={{
            mt: 1.5,
            textAlign: 'center',
            fontFamily: fonts.mono,
            fontSize: '0.75rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: tokens.teal,
          }}
        >
          {postcard.place}
        </Box>
      )}
    </Box>
  );
}
