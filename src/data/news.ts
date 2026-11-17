export interface NewsItem {
  /** ISO month, e.g. "2026-11". Month precision avoids inventing exact days. */
  date: string;
  text: string;
  href?: string;
}

/**
 * Genuine updates only. Add newest entries at the top.
 */
export const news: NewsItem[] = [
  {
    date: '2026-11',
    text: 'Working on Feasibility Study of Tire size 195R14 Production in Iran',
    href: '/projects/',
  },
  {
    date: '2026-10',
    text: 'Research on machine learning approaches to cluster workload scheduling is in progress.',
    href: '/research/',
  },
];
