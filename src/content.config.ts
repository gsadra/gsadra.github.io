import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

import { projectCategories, projectStatuses } from './data/taxonomy';

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum([...projectCategories]),
    technologies: z.array(z.string()).default([]),
    github: z.url().optional(),
    demo: z.url().optional(),
    featured: z.boolean().default(false),
    status: z.enum([...projectStatuses]),
    date: z.coerce.date(),
  }),
});

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { projects, blog };
