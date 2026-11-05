import Box from '@mui/material/Box';
import AirmailStripe from '../components/AirmailStripe';
import AboutSection from '../sections/AboutSection';
import HeroSection from '../sections/HeroSection';
import RulesSection from '../sections/RulesSection';

export default function HomePage() {
  return (
    <Box component="main" id="main">
      <HeroSection />
      <AirmailStripe />
      <AboutSection />
      <RulesSection />
    </Box>
  );
}
