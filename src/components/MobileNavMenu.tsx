import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import type { NavItem } from '../content/types';
import { icpcColors, tokens } from '../theme/tokens';

type MobileNavMenuProps = { items: readonly NavItem[]; activeId?: string };

/** Hamburger menu for small screens (HackMTY's IconButton + Menu pattern). */
export default function MobileNavMenu({ items, activeId }: MobileNavMenuProps) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const open = anchor !== null;
  const close = () => setAnchor(null);

  return (
    <>
      <IconButton
        aria-label="Open navigation menu"
        aria-controls={open ? 'mobile-nav-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={(event) => setAnchor(event.currentTarget)}
        sx={{ color: tokens.ink }}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="mobile-nav-menu"
        anchorEl={anchor}
        open={open}
        onClose={close}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: { backgroundColor: tokens.paper, border: `2px solid ${tokens.ink}`, borderRadius: 2, minWidth: 200 },
          },
        }}
      >
        {items.map((item, index) => (
          <MenuItem
            key={item.sectionId}
            component="a"
            href={`#${item.sectionId}`}
            onClick={close}
            aria-current={item.sectionId === activeId ? 'true' : undefined}
            selected={item.sectionId === activeId}
            sx={{
              fontWeight: 700,
              color: tokens.ink,
              borderLeft: `4px solid ${icpcColors[index % icpcColors.length]}`,
            }}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
