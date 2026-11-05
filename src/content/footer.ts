import { event } from './event';
import type { FooterContent } from './types';

export const footer: FooterContent = {
  copyright: `© ${event.name} · Monterrey, N.L.`, // → "© 2027 ICPC Latin America Championship · Monterrey, N.L."
  links: [
    { label: 'icpc.global', href: event.links.icpc },
    { label: 'Official ICPC regional rules', href: event.links.regionalRules },
  ],
};
