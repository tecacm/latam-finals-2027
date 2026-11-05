import type { RulesContent } from './types';

export const rules: RulesContent = {
  eyebrow: 'Latin America Regionals',
  heading: 'Rules',
  intro: [
    'The ICPC Regional Rules apply throughout Latin America. This page summarizes how teams qualify for the 2027 championship and for the World Finals; where this summary and the official ICPC rules differ, the official rules prevail.',
  ],
  entries: [
    {
      id: 'regional-structure',
      title: 'Regional structure',
      paragraphs: [
        'The Latin America regional contest runs on the same day and at the same time at sites in every regional, with the same problem set everywhere and centralized judging. Contest environment and judging system for 2027: TBD.',
        'Regionals taking part (to be confirmed for 2027):',
      ],
      bullets: ['Brazil', 'Caribbean', 'Central America', 'Mexico', 'South America / North', 'South America / South'],
    },
    {
      id: 'advancing-to-championship',
      title: 'Advancing to the championship',
      paragraphs: [
        'Each regional receives a number of championship slots and fills them from its own regional standings.',
        'Slots per regional: TBD. Maximum teams per university: TBD.',
      ],
    },
    {
      id: 'advancing-to-world-finals',
      title: 'Advancing to the World Finals',
      paragraphs: [
        "Latin America's World Finals slots are awarded from the final standings of the championship.",
        'Number of World Finals slots: TBD.',
      ],
    },
    {
      id: 'prizes',
      title: 'Prizes',
      paragraphs: ['Medals, awards and prizes for the 2027 championship: TBD.'],
    },
    {
      id: 'unforeseen-cases',
      title: 'Unforeseen cases',
      paragraphs: [
        'Situations not covered by these rules are decided by the championship organizers together with the ICPC Latin America regional leadership.',
      ],
    },
  ],
  officialRulesLabel: 'Read the official ICPC regional rules',
};
