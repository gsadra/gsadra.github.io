import { getCollection } from 'astro:content';

import { news } from '../data/news';

/**
 * The newest date first-party content carries: blog posts, projects and news
 * entries. Month-precision news dates are read as the first of that month.
 */
export async function latestContentDate(): Promise<Date> {
  const [posts, projects] = await Promise.all([
    getCollection('blog'),
    getCollection('projects'),
  ]);

  const dates = [
    ...posts.map((post) => post.data.date),
    ...projects.map((project) => project.data.date),
    ...news.map((item) => new Date(`${item.date}-01T00:00:00Z`)),
  ].filter((date) => !Number.isNaN(date.valueOf()));

  if (dates.length === 0) return new Date();

  return dates.reduce((latest, date) => (date > latest ? date : latest));
}
