import Box from '@mui/material/Box';
import AirmailStripe from '../components/AirmailStripe';
import { venue } from '../content/venue';
import { usePageTitle } from '../hooks/usePageTitle';
import VenueCampusSection from '../sections/VenueCampusSection';
import VenueHeroSection from '../sections/VenueHeroSection';
import VenueMapSection from '../sections/VenueMapSection';
import VenueTravelSection from '../sections/VenueTravelSection';

export default function VenuePage() {
  usePageTitle(venue.pageTitle);
  return (
    <Box component="main" id="main">
      <VenueHeroSection />
      <AirmailStripe />
      <VenueCampusSection />
      <VenueMapSection />
      <VenueTravelSection />
    </Box>
  );
}
