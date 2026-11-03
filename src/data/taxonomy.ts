/** Controlled vocabularies shared by content schemas and pages. */

export const projectCategories = [
  'Machine Learning and AI',
  'Data Science and Analytics',
  'Operations Research and Optimization',
  'Python Development',
] as const;

export type ProjectCategory = (typeof projectCategories)[number];

export const projectStatuses = ['Completed', 'In Progress', 'Archived'] as const;

export type ProjectStatus = (typeof projectStatuses)[number];
