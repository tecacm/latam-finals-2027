import { keyframes } from '@emotion/react';
import { styled } from '@mui/material/styles';
import { tokens } from '../theme/tokens';

const bob = keyframes`
  0%, 100% { transform: translateY(0) rotate(-3deg); }
  50% { transform: translateY(-14px) rotate(3deg); }
`;

const BalloonSvg = styled('svg')({
  display: 'block',
  overflow: 'visible',
  transformOrigin: '50% 100%',
  animation: `${bob} 5s ease-in-out infinite`,
  '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
});

type BalloonProps = {
  color: string;
  /** Width in px; height is 1.75 × width. */
  size?: number;
  /** Animation delay in seconds, so a cluster does not bob in sync. */
  delay?: number;
};

/** Contest balloon — ICPC teams get one for every solved problem. */
export default function Balloon({ color, size = 40, delay = 0 }: BalloonProps) {
  return (
    <BalloonSvg
      viewBox="0 0 40 70"
      width={size}
      height={size * 1.75}
      aria-hidden="true"
      focusable="false"
      data-testid="balloon"
      style={{ color, animationDelay: `${delay}s` }}
    >
      <ellipse cx="20" cy="20" rx="16" ry="19" fill="currentColor" />
      <ellipse cx="14" cy="13" rx="4" ry="6" fill={tokens.white} opacity="0.35" />
      <path d="M17 38 l3 4 l3 -4z" fill="currentColor" />
      <path d="M20 42 q-5 8 0 14 t0 14" fill="none" stroke={tokens.ink} strokeWidth="1.2" opacity="0.6" />
    </BalloonSvg>
  );
}
