import Box from '@mui/material/Box';
import PostcardRow from '../components/PostcardRow';
import ProseBlock from '../components/ProseBlock';
import Section from '../components/Section';
import SectionHeading from '../components/SectionHeading';
import { about } from '../content/about';
import { getPostcard } from '../content/postcards';
import { textAccents, tokens } from '../theme/tokens';

export default function AboutSection() {
  return (
    <Section id="about" labelledBy="about-title" tint={tokens.blue}>
      <Box sx={{ maxWidth: 1100, mx: 'auto', px: 2 }}>
        <SectionHeading id="about-title" color={tokens.blue} eyebrow={about.eyebrow}>
          {about.heading}
        </SectionHeading>
      </Box>
      {about.blocks.map((block, index) => (
        <PostcardRow key={block.id} side={index % 2 === 0 ? 'right' : 'left'} postcard={getPostcard(block.postcardId)}>
          <ProseBlock
            title={block.title}
            titleColor={textAccents[index % textAccents.length]}
            paragraphs={block.paragraphs}
          />
        </PostcardRow>
      ))}
    </Section>
  );
}
