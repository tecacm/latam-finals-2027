import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import ColorAccordion from '../components/ColorAccordion';
import PostcardRow from '../components/PostcardRow';
import ProseBlock from '../components/ProseBlock';
import Section from '../components/Section';
import SectionHeading from '../components/SectionHeading';
import { event } from '../content/event';
import { getPostcard } from '../content/postcards';
import { rules } from '../content/rules';
import { icpcColors, tokens } from '../theme/tokens';

export default function RulesSection() {
  const items = rules.entries.map((entry) => ({
    id: entry.id,
    title: entry.title,
    body: <ProseBlock paragraphs={entry.paragraphs} bullets={entry.bullets} />,
  }));

  return (
    <Section id="rules" labelledBy="rules-title" tint={tokens.red}>
      <Box sx={{ maxWidth: 1100, mx: 'auto', px: 2 }}>
        <SectionHeading id="rules-title" color={tokens.red} eyebrow={rules.eyebrow}>
          {rules.heading}
        </SectionHeading>
      </Box>
      <PostcardRow side="left" postcard={getPostcard(rules.postcardId)}>
        <ProseBlock paragraphs={rules.intro} />
        <ColorAccordion items={items} colors={icpcColors} />
        <Link
          href={event.links.regionalRules}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ fontWeight: 700, color: tokens.blue }}
        >
          {rules.officialRulesLabel}
        </Link>
      </PostcardRow>
    </Section>
  );
}
