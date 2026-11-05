import { event } from './event';
import type { AboutContent } from './types';

export const about: AboutContent = {
  eyebrow: 'The championship',
  heading: 'About',
  blocks: [
    {
      id: 'what-is-icpc',
      title: 'What is the ICPC?',
      postcardId: 'rectoria',
      paragraphs: [
        'The International Collegiate Programming Contest is the longest-running and largest programming competition for university students. Teams of three share a single computer and have five hours to solve as many algorithmic problems as they can.',
        'Every problem rewards clear thinking, solid teamwork and calm under pressure. Universities around the world host regional contests, and the best teams from each region earn a place at the ICPC World Finals.',
      ],
    },
    {
      id: 'latin-america-championship',
      title: 'The Latin America Championship',
      postcardId: 'fundidora',
      paragraphs: [
        'The Latin America Championship brings together the strongest teams from the regional contests held across Brazil, Mexico, Central America, the Caribbean and South America.',
        'One contest, one problem set, one scoreboard: the final standings decide which teams represent Latin America at the World Finals.',
      ],
    },
    {
      id: 'monterrey-2027',
      title: 'Monterrey 2027',
      paragraphs: [
        `In 2027 the championship comes to ${event.city}, an industrial and university city framed by the Sierra Madre Oriental and the unmistakable silhouette of the Cerro de la Silla.`,
        `Host institution: ${event.host}. Venue: ${event.venue}. Dates: ${event.dates}.`,
      ],
    },
  ],
};
