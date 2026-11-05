export type SectionId = 'home' | 'about' | 'rules';

export type PostcardData = {
  /** Matches public/postcards/<id>-<width>.webp */
  id: string;
  alt: string;
  place: string;
  orientation: 'landscape' | 'portrait';
  /** Intrinsic SVG viewBox size, used for width/height attributes. */
  width: number;
  height: number;
};

export type ContentBlock = {
  id: string;
  title: string;
  paragraphs: string[];
  /** Absent → the block renders as full-width text. */
  postcardId?: string;
};

export type RuleEntry = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type NavItem = { label: string; sectionId: SectionId };

export type EventInfo = {
  name: string;
  shortName: string;
  wordmark: { prefix: string; accent: string; suffix: string };
  city: string;
  dates: string;
  host: string;
  venue: string;
  /** ISO 8601 with explicit offset (Z or ±HH:MM), or null while unknown. */
  countdownTarget: string | null;
  links: { icpc: string; regionalRules: string };
};

export type HeroContent = { eyebrow: string; datesLabel: string; postcardId: string };

export type AboutContent = { eyebrow: string; heading: string; blocks: ContentBlock[] };

export type RulesContent = {
  eyebrow: string;
  heading: string;
  intro: string[];
  postcardId?: string;
  entries: RuleEntry[];
  officialRulesLabel: string;
};

export type FooterContent = { copyright: string; links: { label: string; href: string }[] };
