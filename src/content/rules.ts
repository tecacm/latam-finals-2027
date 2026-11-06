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
        'I. Standard Qualification Criteria:',
        '',
        'Let N be the base number of qualification slots for the Championship; N is always a multiple of 4. A total of N + 2 teams will qualify under the standard criteria. For 2027, N=40.',
        'General rule: A maximum of two teams from the same school can be promoted to the Championship, but the second team can qualify only within the N/2 performance slots (step 1 of the accompanying algorithm).',
        '1. [Performance Slots] N/2 slots should be allocated to the best-performing teams in the Regional Contest, observing the General Rule.',
        '2. [Slots for Participating Countries] The number of slots in this criterion is limited to the minimum between N/4 and the number of participating countries that do not yet have a qualified team, minus 1. Those slots are assigned, one at a time, to the best-performing team from a country that does not yet have a promoted team, but only if that team solved at least one problem in the Regional Contest.',
        '3. [Host institutions Slots] If none of the schools hosting the Championship have a promoted team, a slot should be awarded to the best-performing team among the unpromoted schools.',
        '4. [Geographic Representation Slots] The remaining slots, up to a total of N qualified teams, should be assigned to schools that have not yet qualified a team, using the accompanying algorithm. Each time a region receives a slot, it should be assigned to the best-performing team in that region, in accordance with the General Rule.',
        '[All-Female Slots] Two additional slots will be assigned to all-female teams that are not yet qualified: First, one for the best-performing all-female team from the host country, and then one for the best-performing all-female team from the Latin America Region. These slots should be assigned in that order. The general rule above does not apply to those slots.',
        '',
        'II. 2027 Championship-Specific Qualification Criteria',
        '',
        'For the 2027 ICPC Latin America Championship, the hosts will provide 38 additional qualification slots that should be allocated according to the following criteria and in the order provided.',
        '[Pending Teams’ Slots] Teams that qualified for the 2026 Championship but were unable to attend due to extraordinary circumstances:',
        '• ACxioma, Universidad Central “Martha Abreu” de Las Villas, Cuba.',
        '• Lugia Brasileiro, Universidad Simón Bolívar, Venezuela.',
        'The general rule above does not apply to these slots.',
        '[2 slots]',
        '',
        '[Host All-Female Slot] One slot will be assigned to the best-performing all-female team from the host university that has not already qualified. The general rule above does not apply to this slot.',
        '[1 slot]',
        '',
        '[Regions’ Female Slots] Six slots will be assigned to all-female teams: One slot for the best-performing team from each region that has not already qualified. The general rule above does not apply to these slots.',
        '[6 slots]',
        '',
        '[Two-Female-Contestants Slots] Three slots will be assigned to the best-performing, not-yet-qualified teams from the Latin America Region with at least two female contestants. The general rule above does not apply to these slots.',
        '[3 slots]',
        '',
        '[One-Female-Contestant Slots] Three slots will be assigned to the best-performing,not-yet-qualified teams from the Latin America Region with at least one female contestant. The general rule above does not apply to these slots.',
        '[3 slots]',
        '',
        '[Country Participation Slots] Additional slots will be allocated to the five countries with the most participating teams during the competition cycle. These slots will be assigned to the best-performing teams from institutions that have not yet qualified for the Championship. The country with the most participating teams will receive five additional slots; the second-ranked country, four; the third-ranked country, three; the fourth-ranked country, two; and the fifth-ranked country, one. If two or more countries have the same number of participating teams, the number of participating institutions will be used as the tiebreaker.',
        '[15 slots]',
        '',
        '[Additional Host institution Slots] Two slots will be assigned to the best-performing teams from the host institution that have not yet qualified.',
        '[2 slots]',
        '',
        '[Reserve Slots] Six slots are reserved to address contingencies that could not be anticipated when the qualification rules were defined, such as the participation of new countries or new host institutions. If any of these slots remain unused, the local RCD may allocate them according to additional criteria to be announced in due course.',
        '[6 slots]',
        '',
        'Ultimately, 80 teams will qualify for the 2027 ICPC Latin America Championship.',
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
