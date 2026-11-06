import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Fragment } from 'react';
import { fonts, tokens } from '../theme/tokens';

export type LocationRow = { label: string; value: string };

type LocationCardProps = {
  eyebrow: string;
  name: string;
  addressLines: readonly string[];
  coordinates?: string;
  rows: readonly LocationRow[];
  cta: { label: string; href: string };
};

const labelSx = {
  fontFamily: fonts.mono,
  fontSize: '0.75rem',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: tokens.teal,
} as const;

/** Venue card (HackMTY location-card layout): name, address, details and a map link. */
export default function LocationCard({ eyebrow, name, addressLines, coordinates, rows, cta }: LocationCardProps) {
  return (
    <Box
      component="aside"
      aria-label={name}
      sx={{
        width: '100%',
        maxWidth: 380,
        p: { xs: 2.5, md: 3 },
        backgroundColor: tokens.white,
        border: `2px solid ${tokens.ink}`,
        borderRadius: 3,
        boxShadow: `0 12px 28px ${alpha(tokens.ink, 0.18)}`,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 2, mb: 1 }}>
        <Typography component="p" sx={labelSx}>
          {eyebrow}
        </Typography>
        {coordinates && (
          <Typography component="p" sx={{ fontFamily: fonts.mono, fontSize: '0.7rem', color: tokens.bodyText }}>
            {coordinates}
          </Typography>
        )}
      </Box>
      <Typography component="h3" sx={{ fontWeight: 800, fontSize: '1.6rem', lineHeight: 1.1, color: tokens.ink }}>
        {name}
      </Typography>
      <Box component="address" sx={{ mt: 1, fontStyle: 'normal', lineHeight: 1.6, color: tokens.bodyText }}>
        {addressLines.map((line) => (
          <Box component="span" key={line} sx={{ display: 'block' }}>
            {line}
          </Box>
        ))}
      </Box>
      {rows.length > 0 && (
        <Box
          component="dl"
          sx={{ m: 0, mt: 2, display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: 2, rowGap: 0.75, alignItems: 'baseline' }}
        >
          {rows.map((row) => (
            <Fragment key={row.label}>
              <Box component="dt" sx={labelSx}>
                {row.label}
              </Box>
              <Box component="dd" sx={{ m: 0, fontWeight: 600, color: tokens.ink }}>
                {row.value}
              </Box>
            </Fragment>
          ))}
        </Box>
      )}
      <Box
        component="a"
        href={cta.href}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          mt: 2.5,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
          px: 2,
          py: 1,
          borderRadius: 999,
          backgroundColor: tokens.blue,
          color: tokens.paper,
          fontWeight: 700,
          textDecoration: 'none',
          '&:hover': { backgroundColor: tokens.ink },
          '&:focus-visible': { outline: `3px solid ${tokens.yellow}`, outlineOffset: 3 },
        }}
      >
        {cta.label}
        <Box component="span" aria-hidden="true">
          ↗
        </Box>
      </Box>
    </Box>
  );
}
