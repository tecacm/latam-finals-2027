import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState, type ReactNode } from 'react';
import { readableTextOn } from '../lib/contrast';
import { tokens } from '../theme/tokens';

export type ColorAccordionItem = { id: string; title: string; body: ReactNode };

type ColorAccordionProps = {
  items: ColorAccordionItem[];
  /** Header fills, cycled in order. */
  colors: readonly string[];
};

/** One-open-at-a-time accordion with solid color headers (from HackMTY's ControlledAccordions). */
export default function ColorAccordion({ items, colors }: ColorAccordionProps) {
  const [expanded, setExpanded] = useState<string | false>(false);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, my: 3 }}>
      {items.map((item, index) => {
        const fill = colors[index % colors.length];
        const text = readableTextOn(fill);
        return (
          <Accordion
            key={item.id}
            disableGutters
            expanded={expanded === item.id}
            onChange={(_event, isOpen) => setExpanded(isOpen ? item.id : false)}
            sx={{
              border: `2px solid ${fill}`,
              boxShadow: 'none',
              overflow: 'hidden',
              '&, &:first-of-type, &:last-of-type': { borderRadius: '12px' },
              '&::before': { display: 'none' },
            }}
          >
            <AccordionSummary
              id={`${item.id}-header`}
              aria-controls={`${item.id}-content`}
              data-fill={fill}
              expandIcon={<ExpandMoreIcon sx={{ color: text }} />}
              sx={{ backgroundColor: fill, color: text }}
            >
              <Typography component="span" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {item.title}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: tokens.white, pt: 2 }}>
              {item.body}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
}
