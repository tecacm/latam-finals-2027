import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { tokens } from '../theme/tokens';
import AirmailStripe from './AirmailStripe';

type FooterProps = {
  copyright: string;
  links?: { label: string; href: string }[];
};

export default function Footer({ copyright, links = [] }: FooterProps) {
  return (
    <Box component="footer">
      <AirmailStripe />
      <Box sx={{ backgroundColor: tokens.ink, color: tokens.paper, py: 4, px: 2, textAlign: 'center' }}>
        <Typography sx={{ fontWeight: 600 }}>{copyright}</Typography>
        {links.length > 0 && (
          <Box
            component="ul"
            sx={{ listStyle: 'none', p: 0, m: 0, mt: 1.5, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 3 }}
          >
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: tokens.paper, fontWeight: 600, textDecorationColor: tokens.yellow }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
