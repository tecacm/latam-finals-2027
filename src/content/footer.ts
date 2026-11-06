import { event } from './event';
import type { FooterContent } from './types';

export const footer: FooterContent = {
  copyright: `© ${event.name} · Monterrey, N.L.`, // → "© 2027 Tecnologico de Monterrey"
  links: [
    { label: 'icpc.global', href: event.links.icpc },
    { label: 'Tecnologico de Monterrey', href: event.links.tec },
    { label: 'Official ICPC regional rules', href: event.links.regionalRules },
  ],
};
