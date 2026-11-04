#!/usr/bin/env node
/**
 * Static SEO audit for the built site.
 *
 * Runs against `dist/` with no dependencies. Checks titles, descriptions,
 * canonicals, robots directives, Open Graph/Twitter tags, JSON-LD, internal
 * links, image alt text, sitemap coverage and robots.txt.
 *
 * Usage: npm run seo:audit
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';

const ORIGIN = 'https://gsadra.github.io';
const DIST = resolve(process.argv[2] ?? 'dist');

const errors = [];
const warnings = [];

const fail = (page, message) => errors.push(`${page} — ${message}`);
const warn = (page, message) => warnings.push(`${page} — ${message}`);

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });

const ENTITIES = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&apos;': "'",
};

const decode = (value = '') =>
  value.replace(/&(?:amp|lt|gt|quot|#39|apos);/g, (match) => ENTITIES[match]);

const attributes = (source) => {
  const result = {};
  for (const match of source.matchAll(
    /([A-Za-z_:][-A-Za-z0-9_:.]*)\s*=\s*"([^"]*)"/g,
  )) {
    result[match[1].toLowerCase()] = decode(match[2]);
  }
  return result;
};

const elements = (html, name) => {
  const pattern = new RegExp(`<${name}\\b([^>]*)>`, 'gi');
  return [...html.matchAll(pattern)].map((match) => attributes(match[1]));
};

const pagePath = (file) => {
  const rel = relative(DIST, file).split(sep).join('/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'index.html'.length)}`;
  return `/${rel}`;
};

const resolves = (pathname) => {
  const clean = decodeURIComponent(pathname.split('#')[0].split('?')[0]);
  const direct = join(DIST, clean);
  if (existsSync(direct) && statSync(direct).isFile()) return true;
  return existsSync(join(DIST, clean, 'index.html'));
};

if (!existsSync(DIST)) {
  console.error(`No build found at ${DIST}. Run "npm run build" first.`);
  process.exit(1);
}

const htmlFiles = walk(DIST).filter((file) => file.endsWith('.html'));
const pages = htmlFiles.map((file) => {
  const html = readFileSync(file, 'utf8');
  return { file, path: pagePath(file), html };
});

const titles = new Map();
const descriptions = new Map();
const canonicals = new Map();
const indexablePaths = new Set();
const sitemapPaths = new Set();

const REQUIRED_SCHEMA = {
  Person: ['name', 'url'],
  WebSite: ['url', 'name', 'inLanguage'],
  WebPage: ['url', 'name', 'isPartOf', 'inLanguage'],
  BlogPosting: ['headline', 'datePublished', 'author', 'publisher', 'image'],
  BreadcrumbList: ['itemListElement'],
  DigitalDocument: ['url', 'encodingFormat'],
};

const checkAbsoluteUrl = (page, label, value, { sameOrigin = true } = {}) => {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') fail(page, `${label} is not https: ${value}`);
    if (sameOrigin && url.origin !== ORIGIN)
      fail(page, `${label} points off-site: ${value}`);
  } catch {
    fail(page, `${label} is not an absolute URL: ${value}`);
  }
};

for (const { path, html } of pages) {
  const is404 = path === '/404.html';
  const expected = new URL(path, ORIGIN).href;

  const htmlTag = /<html\b([^>]*)>/i.exec(html);
  const lang = htmlTag ? attributes(htmlTag[1]).lang : undefined;
  if (!lang) fail(path, 'missing <html lang>');
  if (lang && lang !== 'en') warn(path, `unexpected document language "${lang}"`);

  const title = /<title>([\s\S]*?)<\/title>/i.exec(html)?.[1]?.trim();
  if (!title) fail(path, 'missing <title>');
  else {
    if (title.length < 10 || title.length > 70)
      warn(path, `title length ${title.length} (aim for 10–65)`);
    if (titles.has(title)) fail(path, `duplicate title with ${titles.get(title)}`);
    else titles.set(title, path);
  }

  const metas = elements(html, 'meta');
  const byName = new Map();
  const byProperty = new Map();
  for (const meta of metas) {
    if (meta.name) byName.set(meta.name.toLowerCase(), meta.content ?? '');
    if (meta.property) byProperty.set(meta.property.toLowerCase(), meta.content ?? '');
  }

  const description = byName.get('description');
  if (!description) fail(path, 'missing meta description');
  else {
    if (!is404 && (description.length < 50 || description.length > 165))
      warn(path, `description length ${description.length} (aim for 50–160)`);
    if (descriptions.has(description))
      fail(path, `duplicate description with ${descriptions.get(description)}`);
    else descriptions.set(description, path);
  }

  if (!byName.get('author')) warn(path, 'missing meta author');

  const robots = byName.get('robots') ?? '';
  if (is404) {
    if (!robots.includes('noindex')) fail(path, '404 page should be noindex');
  } else if (robots.includes('noindex')) {
    fail(path, 'unexpected noindex on a public page');
  } else {
    indexablePaths.add(path);
  }
  if (!is404 && !robots.includes('index')) warn(path, 'robots meta does not allow indexing');

  const canonicalTags = elements(html, 'link').filter(
    (link) => link.rel === 'canonical',
  );
  if (is404) {
    if (canonicalTags.length > 0) warn(path, '404 page emits a canonical URL');
  } else if (canonicalTags.length !== 1) {
    fail(path, `expected exactly one canonical URL, found ${canonicalTags.length}`);
  } else {
    const canonical = canonicalTags[0].href;
    if (canonical !== expected)
      fail(path, `canonical mismatch: ${canonical} (expected ${expected})`);
    if (canonicals.has(canonical))
      fail(path, `duplicate canonical with ${canonicals.get(canonical)}`);
    else canonicals.set(canonical, path);
  }

  // Open Graph
  const og = (key) => byProperty.get(`og:${key}`);
  const requiredOg = is404
    ? ['type', 'site_name', 'title', 'description', 'image']
    : ['type', 'site_name', 'title', 'description', 'url', 'image'];
  for (const key of requiredOg) {
    if (!og(key)) fail(path, `missing og:${key}`);
  }
  if (og('title') && title && og('title') !== title)
    warn(path, 'og:title differs from <title>');
  if (!is404 && og('url') && og('url') !== expected)
    fail(path, `og:url mismatch: ${og('url')} (expected ${expected})`);
  if (og('image')) {
    if (!byProperty.get('og:image:width') || !byProperty.get('og:image:height'))
      warn(path, 'og:image is missing width/height');
    const imagePath = new URL(og('image'), ORIGIN).pathname;
    if (!resolves(imagePath)) fail(path, `og:image not found in build: ${imagePath}`);
  }
  if (og('type') === 'article') {
    if (!byProperty.get('article:published_time'))
      warn(path, 'article page has no article:published_time');
    if (!byProperty.get('article:author'))
      warn(path, 'article page has no article:author');
  }

  // Twitter / X
  if (!byName.get('twitter:card')) fail(path, 'missing twitter:card');
  for (const key of ['twitter:title', 'twitter:description', 'twitter:image']) {
    if (!byName.get(key)) fail(path, `missing ${key}`);
  }

  // RSS discovery
  const rss = elements(html, 'link').find(
    (link) => link.rel === 'alternate' && link.type === 'application/rss+xml',
  );
  if (!rss) warn(path, 'no RSS alternate link');
  else if (!resolves(new URL(rss.href, ORIGIN).pathname))
    fail(path, `RSS alternate link not found: ${rss.href}`);

  // Internal links
  for (const link of elements(html, 'a')) {
    const href = link.href;
    if (!href || href.startsWith('#') || /^(mailto|tel):/.test(href)) continue;
    let url;
    try {
      url = new URL(href, ORIGIN);
    } catch {
      fail(path, `malformed link: ${href}`);
      continue;
    }
    if (url.origin !== ORIGIN) continue;
    if (!resolves(url.pathname))
      fail(path, `broken internal link: ${href}`);
  }

  // Images
  for (const img of elements(html, 'img')) {
    if (img.alt === undefined || img.alt.trim() === '')
      fail(path, `image without alt text: ${img.src ?? '(no src)'}`);
    if (img.src && !resolves(new URL(img.src, ORIGIN).pathname))
      fail(path, `missing image file: ${img.src}`);
  }

  // JSON-LD
  const scripts = [
    ...html.matchAll(
      /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ].map((match) => match[1]);

  if (is404) {
    if (scripts.length > 0) warn(path, '404 page emits JSON-LD despite noindex');
    continue;
  }

  if (scripts.length === 0) {
    fail(path, 'missing JSON-LD');
    continue;
  }

  for (const raw of scripts) {
    let document;
    try {
      document = JSON.parse(raw);
    } catch (error) {
      fail(path, `invalid JSON-LD: ${error.message}`);
      continue;
    }
    if (document['@context'] !== 'https://schema.org')
      fail(path, 'JSON-LD @context is not https://schema.org');

    const nodes = document['@graph'] ?? [document];
    const types = new Set(nodes.map((node) => node['@type']));

    for (const type of ['Person', 'WebSite', 'WebPage']) {
      if (!types.has(type)) fail(path, `JSON-LD graph is missing ${type}`);
    }

    for (const node of nodes) {
      const type = node['@type'];
      const required = REQUIRED_SCHEMA[type] ?? [];
      for (const field of required) {
        if (node[field] === undefined || node[field] === '')
          fail(path, `${type} is missing ${field}`);
      }
      if (node['@id']) checkAbsoluteUrl(path, `${type} @id`, node['@id']);
      if (node.url) checkAbsoluteUrl(path, `${type} url`, node.url);
      if (node.image && typeof node.image === 'string')
        checkAbsoluteUrl(path, `${type} image`, node.image);
      if (node.codeRepository)
        checkAbsoluteUrl(path, `${type} codeRepository`, node.codeRepository, {
          sameOrigin: false,
        });
      if (node.item) checkAbsoluteUrl(path, `${type} item`, node.item);
      if (type === 'BreadcrumbList' && (!Array.isArray(node.itemListElement) || node.itemListElement.length < 2))
        fail(path, 'BreadcrumbList needs at least two items');
    }

    const isBlogPost =
      path.startsWith('/blog/') &&
      path !== '/blog/' &&
      !path.startsWith('/blog/tags/');
    if (isBlogPost) {
      if (!types.has('BlogPosting')) fail(path, 'blog post is missing BlogPosting');
      if (!types.has('BreadcrumbList')) warn(path, 'blog post is missing BreadcrumbList');
    }
    if (path.startsWith('/projects/') && path !== '/projects/') {
      if (!types.has('BreadcrumbList')) warn(path, 'project page is missing BreadcrumbList');
      if (!types.has('CreativeWork') && !types.has('SoftwareSourceCode'))
        fail(path, 'project page is missing a CreativeWork/SoftwareSourceCode node');
    }
  }
}

// Sitemap
const sitemapFiles = walk(DIST).filter((file) =>
  /sitemap-\d+\.xml$/.test(file),
);
if (sitemapFiles.length === 0) {
  errors.push('sitemap — no sitemap-*.xml found in the build');
} else {
  for (const file of sitemapFiles) {
    const xml = readFileSync(file, 'utf8');
    const name = relative(DIST, file);
    for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      const loc = decode(match[1]).trim();
      try {
        const url = new URL(loc);
        if (url.origin !== ORIGIN) fail(name, `sitemap URL off-site: ${loc}`);
        if (!resolves(url.pathname)) fail(name, `sitemap URL has no built page: ${loc}`);
        if (sitemapPaths.has(url.pathname)) fail(name, `duplicate sitemap URL: ${loc}`);
        sitemapPaths.add(url.pathname);
      } catch {
        fail(name, `malformed sitemap URL: ${loc}`);
      }
    }
  }

  const expected = [...indexablePaths].filter((path) => path !== '/404.html');
  for (const path of expected) {
    if (!sitemapPaths.has(path)) fail(path, 'indexable page is missing from the sitemap');
  }
  for (const path of sitemapPaths) {
    if (!indexablePaths.has(path)) fail('sitemap', `listed page is not indexable: ${path}`);
  }
}

const indexFile = join(DIST, 'sitemap-index.xml');
if (!existsSync(indexFile)) {
  errors.push('sitemap — sitemap-index.xml was not generated');
} else {
  const xml = readFileSync(indexFile, 'utf8');
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  if (locs.length === 0) errors.push('sitemap — sitemap-index.xml has no entries');
  for (const loc of locs) {
    if (!loc.startsWith(`${ORIGIN}/`))
      errors.push(`sitemap — index entry is not absolute on the production origin: ${loc}`);
  }
}

// robots.txt
const robotsFile = join(DIST, 'robots.txt');
if (!existsSync(robotsFile)) {
  errors.push('robots.txt — missing from the build');
} else {
  const text = readFileSync(robotsFile, 'utf8');
  if (!/^Sitemap:\s*https:\/\/gsadra\.github\.io\/sitemap-index\.xml\s*$/m.test(text))
    errors.push('robots.txt — missing or wrong Sitemap directive');
  if (/^Disallow:\s*\/\s*$/m.test(text))
    errors.push('robots.txt — Disallow: / blocks the whole site');
}

// Report
console.log(`SEO audit — ${ORIGIN}`);
console.log(
  `Pages: ${pages.length} built (${indexablePaths.size} indexable, 1 noindex) · sitemap URLs: ${sitemapPaths.size}`,
);
console.log(`Checked: titles, descriptions, canonicals, robots, OG/Twitter, JSON-LD, links, images, sitemap, robots.txt\n`);

if (warnings.length > 0) {
  console.log(`Warnings (${warnings.length})`);
  for (const warning of warnings) console.log(`  • ${warning}`);
  console.log('');
}

if (errors.length > 0) {
  console.log(`Errors (${errors.length})`);
  for (const error of errors) console.log(`  ✕ ${error}`);
  console.log('\nSEO audit failed.');
  process.exit(1);
}

console.log(`No errors. ${warnings.length} warning(s).`);
