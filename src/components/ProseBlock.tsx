import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { tokens } from '../theme/tokens';

type ProseBlockProps = {
  title?: string;
  titleColor?: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
};

export default function ProseBlock({ title, titleColor = tokens.ink, paragraphs, bullets }: ProseBlockProps) {
  return (
    <Box>
      {title && (
        <Typography
          variant="h3"
          sx={{ color: titleColor, fontWeight: 800, fontSize: { xs: '1.4rem', md: '1.75rem' }, mb: 2 }}
        >
          {title}
        </Typography>
      )}
      {paragraphs.map((paragraph, index) => (
        <Typography key={index} sx={{ color: tokens.bodyText, fontSize: { xs: '1rem', md: '1.1rem' }, lineHeight: 1.7, mb: 2 }}>
          {paragraph}
        </Typography>
      ))}
      {bullets && bullets.length > 0 && (
        <Box component="ul" sx={{ m: 0, mb: 2, pl: 3, color: tokens.bodyText, lineHeight: 1.7, '& li': { mb: 0.5 } }}>
          {bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </Box>
      )}
    </Box>
  );
}
