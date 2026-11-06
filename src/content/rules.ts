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
        'Regionals taking part:',
      ],
      bullets: ['Brazil', 'Caribbean', 'Central America', 'Mexico', 'South America / North', 'South America / South'],
    },
    {
      id: 'advancing-to-championship',
      title: 'Advancing to the championship',
      paragraphs: [
        'General rule: A maximum of two teams from the same school can be promoted to the Championship, but the second team can qualify only within the N/2 performance slots (step 1 of the algorithm below).',
        'Let N (40 ≤ N ≤ 60) be the number of teams to be promoted to the Championship, always a multiple of 4. For 2026-2027, N=40.',
        '1. [Performance Slots] N/2 slots should be allocated to the best-performing teams in the Regional Contest, observing the General Rule.',
        '2. [Geographic Representation] The number of slots in this item is limited to the minimum between N/4 and the number of participating countries that do not yet have a qualified team, minus 1. Those slots are assigned, one at a time, to the best-performing team from a country that does not yet have a classified team, but only if that team solved at least one problem in the Regional Contest.',
        '3. [Hosting institutions] If none of the schools hosting the Championship have a promoted team, a slot should be awarded to the best-performing team among the unpromoted schools.',
        '4. [Participation Slots] The remaining slots should be assigned to schools that have not yet promoted teams using the algorithm on the next page. Each time a region receives a slot, it should be assigned to the best-performing team in that region, in accordance with the General Rule.',
        '[Female Slots] Two additional slots will be assigned to female-only teams that are not yet qualified: First, one for the best-performing female team from the host country, and then one for the best-performing female team from the Latin America Region. These slots should be assigned in that order. The general rule above does not apply to those slots.',
        '[Additional Host Slots] If one or more host institutions do not have a promoted team, the best-performing team from each institution may be invited to the Championship as additional slots (k slots).',
        'Therefore, in the end, there will be N+2+k teams in the Championship.'
      ],
    },
    {
      id: 'advancing-to-world-finals',
      title: 'Advancing to the World Finals',
      paragraphs: [
        "Let “N_WF” be the number of slots for the World Finals assigned to Latin America. Considering the results in the Championship:",
        'The champion of each of the six regions receives a slot.',
        'The remaining slots are assigned to the NW_F - 6 teams with the best overall performance.',
        'Only one team from a given institution may advance to the World Finals.'
      ],
    },
    {
      id: 'prizes',
      title: 'Prizes',
      paragraphs: [
        'The highest-ranked team will be recognized as the ICPC Latin America Champions at the Awards Ceremony and receive the trophy',
        'Teams finishing in the top four positions will be awarded Gold Medals. Those teams finishing fifth through eighth place will be awarded Silver Medals. Those teams finishing ninth through twelfth place will receive Bronze Medals.',
        'The highest-ranked team from each ICPC Latin America Region will be recognized with the appropriate title: Caribbean Regional Champions, Brazilian Champions, Mexican Champions, Central American Champions, South America South Champions, and South America North Champions.'
      ],
    },
    {
      id: 'unforeseen-cases',
      title: 'Unforeseen cases',
      paragraphs: [
        'Unforeseen cases in these rules will be resolved by the Latin America Steering Committee, composed of the Regional Contest Directors of the six regions and the Latin America Contest Director.',
      ],
    },
  ],
  officialRulesLabel: 'Read the official ICPC regional rules',
};
