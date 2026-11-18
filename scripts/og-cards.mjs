#!/usr/bin/env node
/**
 * Per-page social preview cards.
 *
 * Each card is rendered from the built HTML in `dist/`, so it can never drift
 * from the title and description its page publishes, and it is written to the
 * exact path that page's `og:image` points at (see `socialCardPath()` in
 * src/utils/seo.ts). Runs automatically after `astro build` via the
 * `postbuild` script.
 *
 * `sharp` is used for rasterising because Astro already installs it for its
 * image service, so this adds no dependency. The SVG renderer draws with the
 * host's fonts and ignores embedded web fonts, so the stacks below name the
 * faces build machines most reliably have; card structure is identical
 * everywhere, glyph widths within a line are not.
 *
 * Usage: node scripts/og-cards.mjs [distDir]
 */

import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
} from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';

import sharp from 'sharp';

const DIST = process.argv[2] ?? 'dist';

const WIDTH = 1200;
const HEIGHT = 630;
const PAD = 72;
const CONTENT_WIDTH = WIDTH - PAD * 2;
const RULE_Y = 516;
const FOOTER_Y = 566;
const TITLE_TOP = 250;
const DESC_SIZE = 26;
const DESC_LINE_HEIGHT = 34;

const COLORS = {
  bg: '#ffffff',
  text: '#171717',
  muted: '#64748b',
  accent: '#2563eb',
  border: '#e5e7eb',
};

const SERIF =
  "Georgia, 'DejaVu Serif', 'Liberation Serif', 'Times New Roman', serif";
const SANS = "Arial, Helvetica, 'DejaVu Sans', 'Liberation Sans', sans-serif";

const SITE_NAME = 'Sadra Gholami';
const SITE_HOST = 'gsadra.github.io';

/** Average glyph advance, in em, used to wrap lines without text metrics. */
const CHAR_FACTOR = 0.58;

const ENTITIES = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&apos;': "'",
};

const decode = (value) =>
  value.replace(/&(?:amp|lt|gt|quot|#39|apos);/g, (match) => ENTITIES[match]);

const esc = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });

/** `dist/about/index.html` → `/about/`, `dist/404.html` → `/404`. */
const pagePath = (file) => {
  const rel = relative(DIST, file).split(sep).join('/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'index.html'.length)}`;
  return `/${rel.replace(/\.html?$/, '')}`;
};

const metaContent = (html, property) => {
  const pattern = new RegExp(`property=["']${property}["']`, 'i');
  for (const match of html.matchAll(/<meta\b([^>]*)>/gi)) {
    if (!pattern.test(match[1])) continue;
    const content = /content=["']([^"']*)["']/i.exec(match[1]);
    if (content) return decode(content[1]);
  }
  return '';
};

const LABELS = {
  about: 'ABOUT',
  research: 'RESEARCH',
  blog: 'BLOG',
  projects: 'PROJECTS',
  cv: 'CURRICULUM VITAE',
  contact: 'CONTACT',
};

/** Section eyebrow, derived from the page path only. */
const sectionLabel = (pathname) => {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 0) return 'PORTFOLIO';
  if (parts[0] === 'blog') {
    if (parts[1] === 'tags') return 'BLOG · TAGS';
    if (parts.length > 1) return 'BLOG POST';
  }
  if (parts[0] === 'projects' && parts.length > 1) return 'PROJECT';
  return LABELS[parts[0]] ?? parts[0].toUpperCase();
};

const displayTitle = (title) => {
  const stripped = title.replace(/\s*\|\s*Sadra Gholami\s*$/i, '').trim();
  return stripped || SITE_NAME;
};

/** Greedy word wrap to a character budget. */
const wrapText = (text, maxChars) => {
  const lines = [];
  let line = '';

  for (const word of text.split(/\s+/).filter(Boolean)) {
    const candidate = line ? `${line} ${word}` : word;
    if (!line || candidate.length <= maxChars) {
      line = candidate;
      continue;
    }
    lines.push(line);
    line = word;
  }

  if (line) lines.push(line);
  return lines;
};

const clampLines = (lines, maxLines, maxChars) => {
  if (lines.length <= maxLines) return lines;
  const kept = lines.slice(0, maxLines);
  const last = kept[maxLines - 1];
  kept[maxLines - 1] = `${last.slice(0, Math.max(1, maxChars - 1)).trimEnd()}…`;
  return kept;
};

/** Larger type for short titles; smaller type when a title needs a third line. */
const TITLE_TIERS = [
  { size: 64, maxLines: 2 },
  { size: 56, maxLines: 3 },
  { size: 48, maxLines: 3 },
];

const fitTitle = (title) => {
  for (const tier of TITLE_TIERS) {
    const maxChars = Math.floor(CONTENT_WIDTH / (tier.size * CHAR_FACTOR));
    const lines = wrapText(title, maxChars);
    if (lines.length <= tier.maxLines) return { lines, size: tier.size };
  }

  const tier = TITLE_TIERS[TITLE_TIERS.length - 1];
  const maxChars = Math.floor(CONTENT_WIDTH / (tier.size * CHAR_FACTOR));
  return {
    lines: clampLines(wrapText(title, maxChars), tier.maxLines, maxChars),
    size: tier.size,
  };
};

const cardSvg = ({ label, title, description }) => {
  const { lines, size } = fitTitle(title);
  const lineHeight = Math.round(size * 1.18);
  const lastBaseline = TITLE_TOP + (lines.length - 1) * lineHeight;

  const descMaxChars = Math.floor(CONTENT_WIDTH / (DESC_SIZE * 0.52));
  const descLines = description
    ? clampLines(wrapText(description, descMaxChars), 2, descMaxChars)
    : [];
  // Sit just below the title, but never closer than 36px to the footer rule, so
  // a three-line title cannot push the description into it.
  const descFloor = RULE_Y - 36 - (descLines.length - 1) * DESC_LINE_HEIGHT;
  const descTop = Math.min(lastBaseline + 82, descFloor);

  const titleSpans = lines
    .map(
      (line, index) =>
        `<tspan x="${PAD}" y="${TITLE_TOP + index * lineHeight}">${esc(line)}</tspan>`,
    )
    .join('');
  const descSpans = descLines
    .map(
      (line, index) =>
        `<tspan x="${PAD}" y="${descTop + index * DESC_LINE_HEIGHT}">${esc(line)}</tspan>`,
    )
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${COLORS.bg}"/>
  <rect width="${WIDTH}" height="6" fill="${COLORS.accent}"/>
  <text x="${PAD}" y="150" font-family="${SANS}" font-size="20" font-weight="600" letter-spacing="3.2" fill="${COLORS.accent}">${esc(label)}</text>
  <text font-family="${SERIF}" font-size="${size}" font-weight="600" fill="${COLORS.text}">${titleSpans}</text>
  <text font-family="${SANS}" font-size="${DESC_SIZE}" fill="${COLORS.muted}">${descSpans}</text>
  <rect x="${PAD}" y="${RULE_Y}" width="${CONTENT_WIDTH}" height="1" fill="${COLORS.border}"/>
  <text x="${PAD}" y="${FOOTER_Y}" font-family="${SANS}" font-size="22" fill="${COLORS.text}">${SITE_HOST}</text>
  <text x="${WIDTH - PAD}" y="${FOOTER_Y}" text-anchor="end" font-family="${SANS}" font-size="22" fill="${COLORS.muted}">${SITE_NAME}</text>
</svg>`;
};

if (!existsSync(DIST)) {
  console.error(`No build found at ${DIST}. Run "npm run build" first.`);
  process.exit(1);
}

// Only route output is a page. Static-host verification files copied from
// public/ (e.g. the Google Search Console token page) are plain HTML too.
const PAGE_FILE = /(?:^|\/)(?:index|404)\.html$/;

const htmlFiles = walk(DIST)
  .filter((file) => PAGE_FILE.test(file.split(sep).join('/')))
  .sort();

if (htmlFiles.length === 0) {
  console.error(`No HTML pages found in ${DIST}.`);
  process.exit(1);
}

let written = 0;
const withoutImage = [];

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const pathname = pagePath(file);

  let cardPath = null;
  const ogImage = metaContent(html, 'og:image');
  if (ogImage) {
    try {
      cardPath = new URL(ogImage).pathname;
    } catch {
      cardPath = null;
    }
  }

  if (!cardPath) {
    withoutImage.push(pathname);
    continue;
  }

  const svg = cardSvg({
    label: sectionLabel(pathname),
    title: displayTitle(metaContent(html, 'og:title')),
    description: metaContent(html, 'og:description'),
  });

  const outFile = join(DIST, decodeURIComponent(cardPath));
  mkdirSync(dirname(outFile), { recursive: true });
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(outFile);
  written += 1;
}

console.log(
  `og-cards: wrote ${written} card(s) for ${htmlFiles.length} page(s) into ${join(DIST, 'og')}`,
);

if (withoutImage.length > 0) {
  console.error(`og-cards: pages without an og:image: ${withoutImage.join(', ')}`);
  process.exitCode = 1;
}
