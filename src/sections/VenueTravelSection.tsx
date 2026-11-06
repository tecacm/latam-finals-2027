import Box from '@mui/material/Box';
import InfoCard from '../components/InfoCard';
import ProseBlock from '../components/ProseBlock';
import Section from '../components/Section';
import SectionHeading from '../components/SectionHeading';
import { venue } from '../content/venue';
import { textAccents, tokens } from '../theme/tokens';

export default function VenueTravelSection() {
  const { travel } = venue;
  return (
    <Section id="getting-there" labelledBy="getting-there-title" tint={tokens.red}>
      <Box sx={{ maxWidth: 1100, mx: 'auto', px: 2 }}>
        <SectionHeading id="getting-there-title" color={tokens.red} eyebrow={travel.eyebrow}>
          {travel.heading}
        </SectionHeading>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          {travel.cards.map((card, index) => (
            <InfoCard key={card.id} title={card.title} accent={textAccents[index % textAccents.length]}>
              <ProseBlock paragraphs={card.paragraphs} />
            </InfoCard>
          ))}
        </Box>
      </Box>
    </Section>
  );
}
