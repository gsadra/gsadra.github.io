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
    date: '2026-10',
    text: 'Research on machine learning approaches to cluster workload scheduling is in progress.',
    href: '/research/',
  },
  {
    date: '2026-9',
    text: 'Source code for Predict-Ur-Score and MDFH-SCP is available on GitHub.',
    href: '/projects/',
  },
];
