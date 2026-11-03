import type { CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;

/** Newest first — the single ordering used by every blog listing. */
export function sortPosts(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** "Machine Learning" → "machine-learning" */
export function slugifyTag(tag: string): string {
  return tag
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function tagHref(tag: string): string {
  return `/blog/tags/${slugifyTag(tag)}/`;
}

export interface TagSummary {
  /** Original spelling, used as the visible label. */
  tag: string;
  slug: string;
  count: number;
}

/** Every tag with a post count, alphabetical. Tags that slugify identically are merged. */
export function collectTags(posts: BlogPost[]): TagSummary[] {
  const tags = new Map<string, TagSummary>();

  for (const post of posts) {
    const seen = new Set<string>();

    for (const raw of post.data.tags) {
      const tag = raw.trim();
      const slug = slugifyTag(tag);
      if (!slug || seen.has(slug)) continue;
      seen.add(slug);

      const existing = tags.get(slug);
      if (existing) existing.count += 1;
      else tags.set(slug, { tag, slug, count: 1 });
    }
  }

  return [...tags.values()].sort((a, b) => a.tag.localeCompare(b.tag));
}

/** Posts carrying a given tag slug. */
export function postsWithTag(posts: BlogPost[], slug: string): BlogPost[] {
  return posts.filter((post) =>
    post.data.tags.some((tag) => slugifyTag(tag.trim()) === slug),
  );
}
