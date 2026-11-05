import type { NavItem, SectionId } from './types';

export const sectionIds: readonly SectionId[] = ['home', 'about', 'rules'];

export const navItems: readonly NavItem[] = [
  { label: 'Home', sectionId: 'home' },
  { label: 'About', sectionId: 'about' },
  { label: 'Rules', sectionId: 'rules' },
];
