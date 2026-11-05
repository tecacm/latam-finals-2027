import Box from '@mui/material/Box';
import type { ReactNode } from 'react';
import type { NavItem } from '../content/types';
import { HEADER_HEIGHT } from '../theme/layout';
import { icpcColors, tokens } from '../theme/tokens';
import ColorSegmentBar from './ColorSegmentBar';
import MobileNavMenu from './MobileNavMenu';

type SiteHeaderProps = {
  brand: ReactNode;
  items: readonly NavItem[];
  activeId?: string;
};

const SEGMENT_HEIGHT = 4;

export default function SiteHeader({ brand, items, activeId }: SiteHeaderProps) {
  return (
    <Box
      component="header"
      sx={{ position: 'sticky', top: 0, zIndex: 1100, backgroundColor: tokens.paper }}
    >
      <Box
        sx={{
          height: HEADER_HEIGHT - SEGMENT_HEIGHT,
          maxWidth: 1200,
          mx: 'auto',
          px: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box component="a" href="#home" sx={{ color: tokens.ink, textDecoration: 'none', fontSize: '1.1rem' }}>
          {brand}
        </Box>

        <Box component="nav" aria-label="Main" sx={{ display: { xs: 'none', md: 'block' } }}>
          <Box component="ul" sx={{ display: 'flex', gap: 4, listStyle: 'none', m: 0, p: 0 }}>
            {items.map((item, index) => {
              const isActive = item.sectionId === activeId;
              const color = icpcColors[index % icpcColors.length];
              return (
                <li key={item.sectionId}>
                  <Box
                    component="a"
                    href={`#${item.sectionId}`}
                    aria-current={isActive ? 'true' : undefined}
                    sx={{
                      display: 'inline-block',
                      py: 0.5,
                      color: tokens.ink,
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      borderBottom: `3px solid ${isActive ? color : 'transparent'}`,
                      transition: 'border-color 200ms ease',
                      '&:hover': { borderBottomColor: color },
                      '&:focus-visible': { outline: `3px solid ${tokens.blue}`, outlineOffset: 4 },
                    }}
                  >
                    {item.label}
                  </Box>
                </li>
              );
            })}
          </Box>
        </Box>

        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          <MobileNavMenu items={items} activeId={activeId} />
        </Box>
      </Box>
      <ColorSegmentBar height={SEGMENT_HEIGHT} />
    </Box>
  );
}
