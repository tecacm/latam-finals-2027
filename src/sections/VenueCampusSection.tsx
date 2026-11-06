import Box from '@mui/material/Box';
import PostcardRow from '../components/PostcardRow';
import ProseBlock from '../components/ProseBlock';
import Section from '../components/Section';
import SectionHeading from '../components/SectionHeading';
import { getPostcard } from '../content/postcards';
import { venue } from '../content/venue';
import { tokens } from '../theme/tokens';

export default function VenueCampusSection() {
  const { campus } = venue;
  return (
    <Section id="campus" labelledBy="campus-title" tint={tokens.blue}>
      <Box sx={{ maxWidth: 1100, mx: 'auto', px: 2 }}>
        <SectionHeading id="campus-title" color={tokens.blue} eyebrow={campus.eyebrow}>
          {campus.heading}
        </SectionHeading>
      </Box>
      <PostcardRow side="right" postcard={getPostcard(campus.postcardId)}>
        <ProseBlock paragraphs={campus.paragraphs} />
      </PostcardRow>
    </Section>
  );
}
