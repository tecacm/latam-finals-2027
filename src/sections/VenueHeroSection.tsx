import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Section from '../components/Section';
import { venue } from '../content/venue';
import { fonts, tokens } from '../theme/tokens';

export default function VenueHeroSection() {
  const { hero } = venue;
  return (
    <Section id="venue-top" labelledBy="venue-title">
      <Box sx={{ textAlign: 'center', px: 2, maxWidth: 900, mx: 'auto' }}>
        <Typography
          component="p"
          sx={{ fontFamily: fonts.mono, letterSpacing: '0.18em', fontSize: { xs: '0.75rem', md: '0.9rem' }, textTransform: 'uppercase', color: tokens.teal }}
        >
          {hero.eyebrow}
        </Typography>
        <Typography
          id="venue-title"
          variant="h1"
          sx={{ mt: 1.5, fontWeight: 800, lineHeight: 1.05, fontSize: { xs: '2.5rem', md: '4.25rem' }, color: tokens.ink }}
        >
          {hero.title}
        </Typography>
        <Typography sx={{ mt: 2, fontWeight: 700, fontSize: { xs: '1.05rem', md: '1.25rem' }, color: tokens.blue }}>
          {hero.subtitle}
        </Typography>
        <Typography sx={{ mt: 1, fontWeight: 600, color: tokens.bodyText }}>{hero.datesLine}</Typography>
      </Box>
    </Section>
  );
}
