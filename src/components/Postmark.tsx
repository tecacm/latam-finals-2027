import { useId, type CSSProperties } from 'react';
import { fonts, tokens } from '../theme/tokens';

type PostmarkProps = {
  color?: string;
  label?: string;
  year?: string;
  style?: CSSProperties;
};

/** Round cancellation mark with wavy lines, drawn over a stamp corner. */
export default function Postmark({ color = tokens.ink, label = 'MONTERREY N.L.', year = '2027', style }: PostmarkProps) {
  const arcId = useId();
  return (
    <svg
      viewBox="0 0 200 120"
      aria-hidden="true"
      focusable="false"
      data-testid="postmark"
      style={{ color, ...style }}
    >
      <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="4" />
      <circle cx="60" cy="60" r="38" fill="none" stroke="currentColor" strokeWidth="2" />
      <path id={arcId} d="M 20 60 A 40 40 0 0 1 100 60" fill="none" />
      <text fontFamily={fonts.mono} fontSize="11" fontWeight="700" fill="currentColor">
        <textPath href={`#${arcId}`} startOffset="50%" textAnchor="middle">
          {label}
        </textPath>
      </text>
      <text x="60" y="72" fontFamily={fonts.mono} fontSize="16" fontWeight="800" fill="currentColor" textAnchor="middle">
        {year}
      </text>
      <path
        d="M110 34 q12 -8 24 0 t24 0 t24 0 M110 52 q12 -8 24 0 t24 0 t24 0 M110 70 q12 -8 24 0 t24 0 t24 0 M110 88 q12 -8 24 0 t24 0 t24 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
