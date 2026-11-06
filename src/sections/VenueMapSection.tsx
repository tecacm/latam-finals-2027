import Box from '@mui/material/Box';
import LocationCard from '../components/LocationCard';
import MapEmbed from '../components/MapEmbed';
import Section from '../components/Section';
import SectionHeading from '../components/SectionHeading';
import { venue } from '../content/venue';
import { googleMapsSearchUrl } from '../lib/maps';
import { tokens } from '../theme/tokens';

export default function VenueMapSection() {
  const { location } = venue;
  return (
    <Section id="location" labelledBy="location-title">
      <Box sx={{ maxWidth: 1100, mx: 'auto', px: 2 }}>
        <SectionHeading id="location-title" color={tokens.green} eyebrow={location.eyebrow}>
          {location.heading}
        </SectionHeading>
        <Box sx={{ position: 'relative' }}>
          <MapEmbed query={location.mapQuery} title={location.mapTitle} />
          <Box sx={{ mt: { xs: 2, md: 0 }, position: { md: 'absolute' }, top: { md: 24 }, right: { md: 24 } }}>
            <LocationCard
              eyebrow={location.cardEyebrow}
              name={location.name}
              addressLines={location.addressLines}
              coordinates={location.coordinates}
              rows={location.rows}
              cta={{ label: location.ctaLabel, href: googleMapsSearchUrl(location.mapQuery) }}
            />
          </Box>
        </Box>
      </Box>
    </Section>
  );
}
