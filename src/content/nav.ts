import type { NavItem, SectionId } from './types';

/** Home-page sections watched by the scroll spy. */
export const sectionIds: readonly SectionId[] = ['home', 'about', 'rules'];

export const navItems: readonly NavItem[] = [
  { label: 'Home', id: 'home', to: '/#home' },
  { label: 'About', id: 'about', to: '/#about' },
  { label: 'Rules', id: 'rules', to: '/#rules' },
];
