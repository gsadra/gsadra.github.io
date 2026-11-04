/**
 * Structured-data builders.
 *
 * Everything here is generated at build time from the site's existing data
 * sources (profile, research interests, content collections). No new claims are
 * introduced: only information already rendered on the site appears in JSON-LD.
 *
 * Every node uses a stable `@id` so the Person, WebSite and WebPage entities
 * described on different pages resolve to the same things.
 */

import { profile, sameAsProfiles, siteMeta } from '../data/profile';
import { researchAreas } from '../data/research';

export type JsonLdNode = Record<string, unknown>;

export const OG_IMAGE_PATH = '/images/og-card.png';
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

/** Absolute URL for a site-relative path. */
export function absoluteUrl(path: string, site: URL | string): string {
  return new URL(path, site).href;
}

/** The site root with a trailing slash, used to build stable `@id` values. */
export function siteRoot(site: URL | string): string {
  return new URL('/', site).href;
}

/** The canonical, absolute URL for a built page pathname. */
export function pageUrl(pathname: string, site: URL | string): string {
  return new URL(pathname, site).href;
}

/** `@x_handle` for an X/Twitter profile URL, if the URL is a profile. */
export function twitterHandle(profileUrl: string): string | undefined {
  const match = /^https?:\/\/(?:www\.)?(?:x|twitter)\.com\/([A-Za-z0-9_]+)\/?$/.exec(
    profileUrl,
  );
  return match ? `@${match[1]}` : undefined;
}

/** One JSON-LD document with every node in a single `@graph`. */
export function structuredData(nodes: JsonLdNode[]): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes,
  };
}

/** The site owner. Present on every indexable page. */
export function personNode(root: string): JsonLdNode {
  return {
    '@type': 'Person',
    '@id': `${root}#person`,
    name: profile.name,
    url: root,
    image: absoluteUrl(profile.photo, root),
    jobTitle: profile.title,
    // The owner's own introduction, already shown on the homepage.
    description: profile.bio[0],
    knowsAbout: researchAreas.map((area) => area.name),
    sameAs: sameAsProfiles,
  };
}

/** The portfolio as a whole. */
export function webSiteNode(root: string): JsonLdNode {
  return {
    '@type': 'WebSite',
    '@id': `${root}#website`,
    url: root,
    name: profile.name,
    description: siteMeta.description,
    inLanguage: siteMeta.lang,
    publisher: { '@id': `${root}#person` },
  };
}

export interface WebPageInput {
  root: string;
  url: string;
  name: string;
  description: string;
  /** Set when the page itself is about the site owner (home, about). */
  aboutPerson?: boolean;
}

/** The individual page, linked back to the WebSite and Person. */
export function webPageNode({
  root,
  url,
  name,
  description,
  aboutPerson = false,
}: WebPageInput): JsonLdNode {
  return {
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name,
    description,
    isPartOf: { '@id': `${root}#website` },
    inLanguage: siteMeta.lang,
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: absoluteUrl(OG_IMAGE_PATH, root),
      width: OG_IMAGE_WIDTH,
      height: OG_IMAGE_HEIGHT,
    },
    ...(aboutPerson
      ? {
          about: { '@id': `${root}#person` },
          mainEntity: { '@id': `${root}#person` },
        }
      : {}),
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/** Mirrors the visible breadcrumb trail, starting at its first shown item. */
export function breadcrumbListNode(
  url: string,
  items: BreadcrumbItem[],
): JsonLdNode {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export interface BlogPostingInput {
  root: string;
  url: string;
  headline: string;
  description: string;
  /** ISO date (YYYY-MM-DD). */
  datePublished: string;
  tags: string[];
}

/** A blog post, matching the article metadata emitted in the document head. */
export function blogPostingNode({
  root,
  url,
  headline,
  description,
  datePublished,
  tags,
}: BlogPostingInput): JsonLdNode {
  return {
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline,
    description,
    url,
    datePublished,
    inLanguage: siteMeta.lang,
    mainEntityOfPage: { '@id': `${url}#webpage` },
    isPartOf: { '@id': `${root}#website` },
    author: { '@id': `${root}#person` },
    publisher: { '@id': `${root}#person` },
    image: absoluteUrl(OG_IMAGE_PATH, root),
    ...(tags.length > 0 ? { keywords: tags.join(', ') } : {}),
  };
}

/** The blog section, described once on the blog index. */
export function blogNode({
  root,
  url,
  name,
  description,
}: {
  root: string;
  url: string;
  name: string;
  description: string;
}): JsonLdNode {
  return {
    '@type': 'Blog',
    '@id': `${url}#blog`,
    url,
    name,
    description,
    inLanguage: siteMeta.lang,
    publisher: { '@id': `${root}#person` },
  };
}

/**
 * Languages named in a project's technology list. Only exact matches with
 * known language names are promoted, so concepts such as "Scheduling" or
 * "Packaging" are not mislabelled as programming languages.
 */
const PROGRAMMING_LANGUAGES = new Set([
  'Python',
  'C',
  'C++',
  'C#',
  'Go',
  'Java',
  'JavaScript',
  'Julia',
  'MATLAB',
  'R',
  'Rust',
  'SQL',
  'TypeScript',
]);

export interface ProjectInput {
  root: string;
  url: string;
  name: string;
  description: string;
  /** Year precision, as displayed on the site. */
  year: string;
  status: string;
  technologies: string[];
  repository?: string;
}

/** A project write-up, as software when a repository is linked. */
export function projectNode({
  root,
  url,
  name,
  description,
  year,
  status,
  technologies,
  repository,
}: ProjectInput): JsonLdNode {
  const languages = technologies.filter((tech) =>
    PROGRAMMING_LANGUAGES.has(tech),
  );

  return {
    '@type': repository ? 'SoftwareSourceCode' : 'CreativeWork',
    '@id': `${url}#work`,
    name,
    description,
    url,
    dateCreated: year,
    creativeWorkStatus: status,
    ...(technologies.length > 0 ? { keywords: technologies.join(', ') } : {}),
    creator: { '@id': `${root}#person` },
    ...(repository ? { codeRepository: repository } : {}),
    ...(languages.length > 0
      ? {
          programmingLanguage: languages.map((language) => ({
            '@type': 'ComputerLanguage',
            name: language,
          })),
        }
      : {}),
  };
}

/** The CV PDF, described alongside the page that offers it. */
export function curriculumVitaeNode({
  root,
  url,
  path,
}: {
  root: string;
  url: string;
  path: string;
}): JsonLdNode {
  return {
    '@type': 'DigitalDocument',
    '@id': `${url}#document`,
    name: `${profile.name} — Curriculum Vitae`,
    url: absoluteUrl(path, root),
    encodingFormat: 'application/pdf',
    author: { '@id': `${root}#person` },
  };
}
