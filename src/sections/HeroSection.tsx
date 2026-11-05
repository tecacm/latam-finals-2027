import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import BalloonCluster from '../components/BalloonCluster';
import Countdown from '../components/Countdown';
import Postcard from '../components/Postcard';
import Section from '../components/Section';
import { event } from '../content/event';
import { hero } from '../content/hero';
import { getPostcard } from '../content/postcards';
import { fonts, icpcColors, tokens } from '../theme/tokens';

export default function HeroSection() {
  const postcard = getPostcard(hero.postcardId);
  return (
    <Section id="home" labelledBy="home-title">
      <Box sx={{ position: 'relative', textAlign: 'center', px: 2, pt: { xs: 7, md: 10, lg: 0 }, maxWidth: 1100, mx: 'auto' }}>
        <BalloonCluster colors={icpcColors} />
        <Typography
          component="p"
          sx={{ fontFamily: fonts.mono, letterSpacing: '0.18em', fontSize: { xs: '0.75rem', md: '0.9rem' }, textTransform: 'uppercase', color: tokens.teal }}
        >
          {hero.eyebrow}
        </Typography>
        <Typography
          id="home-title"
          variant="h1"
          sx={{
            mt: 1.5,
            mx: 'auto',
            maxWidth: 900,
            fontWeight: 800,
            lineHeight: 1.05,
            fontSize: { xs: '2.25rem', sm: '3rem', md: '4.25rem' },
            color: tokens.ink,
            position: 'relative',
          }}
        >
          {event.name}
        </Typography>
        <Typography sx={{ mt: 2, fontWeight: 600, color: tokens.bodyText }}>{hero.datesLabel}: {event.dates}</Typography>
        <Box sx={{ mt: { xs: 3, md: 4 }, position: 'relative' }}>
          <Countdown target={event.countdownTarget} />
        </Box>
        {postcard && (
          <Box sx={{ mt: { xs: 5, md: 7 }, mx: 'auto', width: { xs: '85%', md: 560 }, maxWidth: '100%' }}>
            <Postcard postcard={postcard} tilt={-4} postmark priority size="hero" showPlace={false} />
          </Box>
        )}
      </Box>
    </Section>
  );
}
