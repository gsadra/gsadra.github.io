import type { APIRoute } from 'astro';
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { sortPosts } from '../../data/blog';
import { profile } from '../../data/profile';

export const GET: APIRoute = async (context) => {
  const posts = sortPosts(await getCollection('blog'));
  const site = context.site ?? new URL(context.url.origin);

  return rss({
    title: `${profile.name} — Blog`,
    description:
      'Working notes on machine learning, operations research, and the parts of a project that usually go unrecorded.',
    site,
    customData: '<language>en-us</language>',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/${post.id}/`,
      categories: post.data.tags,
    })),
  });
};
