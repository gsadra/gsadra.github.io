# Sadra Gholami — Academic Portfolio

Personal academic website for **Sadra Gholami**, built as a static site with
Astro and deployed to GitHub Pages at <https://gsadra.github.io/>.

This README is the owner's manual. It covers how to run the site, where every
piece of content lives, how to add or remove content, how to change the design,
how to check your changes, and how to deploy.

> **Edit source, not generated output.** Never edit `dist/`, `.astro/`, or
> `node_modules/`. They are generated or installed and will be overwritten.

## Contents

- [1. What this site is](#1-what-this-site-is)
- [2. Quick start](#2-quick-start)
- [3. Project map](#3-project-map)
- [4. Where to change what](#4-where-to-change-what)
- [5. Content guide](#5-content-guide)
- [6. Design and code customization](#6-design-and-code-customization)
- [7. Verification and troubleshooting](#7-verification-and-troubleshooting)
- [8. Deployment](#8-deployment)
- [9. Common tasks](#9-common-tasks)
- [10. Conventions and limitations](#10-conventions-and-limitations)

## 1. What this site is

The site is a **static website**. Every page is generated ahead of time into
HTML, CSS, and assets. There is no database, no login, no server, and no
client-side framework. Editing a file and rebuilding is the whole content
workflow.

The visual language is deliberately restrained: white background, serif
headings, one blue accent, generous spacing, and content-first layouts. Most
of the design is controlled by a small set of CSS variables, so the site can be
restyled without rewriting components.

### Routes

| Route | What it shows | Source |
| --- | --- | --- |
| `/` | Profile sidebar, welcome text, research interests, schedule, CV, selected projects, news | `src/pages/index.astro` |
| `/about/` | Biography, education, experience, skills, certifications, contact | `src/pages/about.astro` |
| `/research/` | Research overview, interests, current project | `src/pages/research.astro` |
| `/blog/` | All posts, newest first | `src/pages/blog/index.astro` |
| `/blog/<post-slug>/` | A single post | `src/pages/blog/[...slug].astro` |
| `/blog/tags/` | All tags with post counts | `src/pages/blog/tags/index.astro` |
| `/blog/tags/<tag-slug>/` | Posts with one tag | `src/pages/blog/tags/[tag].astro` |
| `/blog/rss.xml` | RSS feed | `src/pages/blog/rss.xml.ts` |
| `/projects/` | All projects grouped by category | `src/pages/projects/index.astro` |
| `/projects/<project-slug>/` | A single project write-up | `src/pages/projects/[...slug].astro` |
| `/cv/` | CV landing page and PDF download | `src/pages/cv.astro` |
| `/contact/` | Email and public profiles | `src/pages/contact.astro` |
| `/404.html` | Custom not-found page | `src/pages/404.astro` |

The build also generates `/sitemap-index.xml`, `/sitemap-0.xml`, and the static
assets under `/public`.

### Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Astro 7, static output |
| Language | TypeScript, strict configuration |
| Styling | Hand-written CSS with design tokens |
| Content | Markdown + Astro Content Collections |
| Feed | `@astrojs/rss` |
| Sitemap | `@astrojs/sitemap` |
| Hosting | GitHub Pages |
| CI/CD | GitHub Actions (`withastro/action`) |
| Package manager | npm |

## 2. Quick start

Use **Node.js 22.23.4 or newer** and npm. The exact engine range is declared in
`package.json`.

```bash
node --version      # must be >= 22.23.4
npm install         # first time, or after changing dependencies
npm run dev         # local development server
```

Open the URL printed in the terminal. It is usually
<http://localhost:4321/>, but Astro may choose the next free port if 4321 is
already in use.

### The editing loop

1. Start `npm run dev`.
2. Edit the relevant file.
3. The browser reloads automatically.
4. Before committing, run:

```bash
npm run check       # Astro + TypeScript diagnostics
npm run build       # production build in dist/
npm run preview     # serve the built site locally
```

`npm run check` catches type errors and content-schema problems early. The
build performs the final validation and generates the static output.

### Command reference

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run check` | TypeScript and Astro diagnostics |
| `npm run build` | Build the static site into `dist/` |
| `npm run preview` | Serve the last production build |
| `npm run astro -- --help` | Access the Astro CLI |

If a port is busy:

```bash
npm run dev -- --port 4322
npm run preview -- --port 4323
```

Run commands from the project root. Several checks use paths relative to the
working directory.

## 3. Project map

```text
.
├── .github/workflows/deploy.yml   GitHub Pages build and deploy
├── astro.config.mjs               Astro configuration, site URL, sitemap
├── package.json                   Scripts and dependencies
├── package-lock.json              Locked dependency versions
├── public/                        Files copied unchanged to the site root
│   ├── files/sadra-gholami-cv.pdf
│   ├── fonts/                     Self-hosted Inter and Source Serif 4
│   ├── images/
│   │   ├── profile.jpg            Homepage portrait
│   │   ├── profile.svg            Old monogram placeholder (unused)
│   │   └── og-card.png            1200 × 630 social preview image
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── components/                Reusable interface pieces
│   │   ├── BlogPostList.astro
│   │   ├── Footer.astro
│   │   ├── Header.astro
│   │   ├── Icon.astro
│   │   ├── NewsList.astro
│   │   ├── Profile.astro
│   │   ├── ProjectCard.astro
│   │   ├── ResearchInterests.astro
│   │   ├── SectionTitle.astro
│   │   └── SocialLinks.astro
│   ├── content/
│   │   ├── projects/*.md          One Markdown file per project
│   │   └── blog/*.md              One Markdown file per post
│   ├── data/
│   │   ├── about.ts               Education, experience, skills, certificates
│   │   ├── blog.ts                Sorting, tag helpers
│   │   ├── navigation.ts          Navbar labels and order
│   │   ├── news.ts                Homepage news entries
│   │   ├── profile.ts             Identity, links, photo, calendar, bio
│   │   ├── research.ts            Research interests and current project
│   │   └── taxonomy.ts            Project categories and statuses
│   ├── layouts/
│   │   ├── BaseLayout.astro       HTML shell, SEO, header, footer
│   │   ├── PageLayout.astro       Standard inner-page header
│   │   └── ProjectLayout.astro    Project detail layout
│   ├── pages/                     File-based routes
│   ├── styles/
│   │   ├── variables.css          Design tokens
│   │   ├── typography.css         Fonts and element defaults
│   │   └── global.css             Reset, layout primitives, prose
│   ├── utils/dates.ts             Date and reading-time helpers
│   └── content.config.ts          Content collection schemas
├── screenshots/                   Local browser QA captures (not shipped)
├── dist/                          Generated build (ignored by Git)
└── README.md
```

`dist/` and `.astro/` are generated. `screenshots/` is ignored by Git and is not
part of the site.

## 4. Where to change what

| I want to change… | Edit |
| --- | --- |
| Name, title, location, email, bio, photo, calendar, social links | `src/data/profile.ts` |
| Homepage welcome heading, section order, cards | `src/pages/index.astro` |
| Homepage sidebar layout and responsive behaviour | `src/components/Profile.astro` |
| Navigation labels and order | `src/data/navigation.ts` |
| Header wordmark, desktop nav, mobile menu | `src/components/Header.astro` |
| Footer text and icon links | `src/components/Footer.astro`, `src/data/profile.ts` |
| CV PDF | `public/files/sadra-gholami-cv.pdf` |
| CV page text and download button | `src/pages/cv.astro` |
| Homepage news | `src/data/news.ts` |
| Projects | `src/content/projects/*.md` |
| Project categories and statuses | `src/data/taxonomy.ts` |
| Blog posts | `src/content/blog/*.md` |
| Blog listing, tags, RSS | `src/pages/blog/`, `src/data/blog.ts` |
| About biography and sections | `src/pages/about.astro`, `src/data/about.ts` |
| Research interests and current project | `src/data/research.ts`, `src/pages/research.astro` |
| Contact page | `src/pages/contact.astro`, `src/data/profile.ts` |
| 404 page | `src/pages/404.astro` |
| Colours, type scale, spacing, radii | `src/styles/variables.css` |
| Fonts | `src/styles/typography.css`, `public/fonts/` |
| Page metadata, Open Graph, social image | `src/layouts/BaseLayout.astro`, `public/images/og-card.png` |
| Site URL, sitemap, trailing-slash behaviour | `astro.config.mjs` |
| Sitemap URL in robots.txt | `public/robots.txt` |
| Deployment | `.github/workflows/deploy.yml` |

## 5. Content guide

### 5.1 Profile, identity, and links

`src/data/profile.ts` is the single source of truth for the person. Most fields
flow into several pages automatically.

| Field | Where it appears |
| --- | --- |
| `name` | Header wordmark, homepage sidebar `<h1>`, footer copyright, JSON-LD, author metadata |
| `title` | Homepage sidebar, JSON-LD `jobTitle`, social-image alt text |
| `email` | Sidebar, contact page, footer mail link. Empty hides the email everywhere |
| `location` | Homepage sidebar. Empty hides the location line |
| `calendarUrl` | “My Schedule” card |
| `photo` | Homepage portrait |
| `photoAlt` | Alternative text for the portrait |
| `social` | Sidebar and contact-page profile links, and JSON-LD `sameAs` |
| `bio` | Homepage introduction paragraphs |

`profileLinks` is derived from the fields above. Email is included only when
set; GitHub is always included; the other social networks appear only when
their URL is non-empty. The sidebar renders all of `profileLinks`; the footer
uses only the subset from `footerLinks` (email and GitHub).

To add a social profile, fill in the matching URL:

```ts
social: {
  github: 'https://github.com/gsadra',
  linkedin: 'https://www.linkedin.com/in/sadragholami',
  x: 'https://x.com/gsadraofficial',
  medium: 'https://medium.com/@gsadra',
  telegram: 'https://t.me/sadragholami',
  googleScholar: '',
},
```

An empty string removes that link. Do not put placeholder `#` URLs — the
template treats a filled value as a real link.

**Changing the name.** `profile.name` updates the visible identity, footer, and
metadata, but several page titles are written as `Page | Sadra Gholami` in
their page files. If you change your name, search for `Sadra Gholami` under
`src/pages/` and update those titles as well. Also review the social preview
image, which contains the old identity.

**Homepage bio.** The two entries in `profile.bio` become the two paragraphs
under the welcome heading. `src/pages/index.astro` currently reads `bio[0]` and
`bio[1]`; if you reduce the array to one paragraph, update that page too.

**Site metadata.** The bottom of `profile.ts` contains `siteMeta`:

- `title` — homepage `<title>` and default site title.
- `description` — homepage meta description and JSON-LD description.
- `lang` — the `<html lang>` value.
- `lastUpdated` — shown in the footer and on the CV page. Update it when the CV
  changes materially.

`sameAsProfiles` is derived automatically for structured data; do not edit it.

### 5.2 Portrait

The portrait is a normal file in `public/images/`, currently
`public/images/profile.jpg`.

1. Put the new image in `public/images/` (for example
   `public/images/profile.jpg`).
2. Set `photo` to the root-relative path, for example
   `'/images/profile.jpg'`.
3. Update `photoAlt` to a short description of the image.

The sidebar renders it in a **13:16** frame with `object-fit: cover` and
`object-position: center 22%`, so the photo is cropped rather than stretched.
The declared `width`/`height` attributes and CSS aspect ratio reserve space
before the image loads, avoiding layout shift.

The portrait is shown at 220px wide on desktop, 128px in the tablet profile
card, and 104–128px on phones. On phones the name, title, and location sit
beside the photo; the social links and contact link sit below.

Files in `public/` are copied as-is. Astro does **not** resize or convert them.
For a faster page, resize the source before adding it — roughly 520–640px wide
is enough for the largest display size, even on high-density screens. The
current JPEG is larger than it needs to be.

`profile.svg` is the old monogram placeholder and is no longer referenced. It
can be deleted.

### 5.3 Homepage

The homepage is assembled in `src/pages/index.astro`. Its current order is:

1. Welcome heading and bio (`home__intro`)
2. Research interests
3. My Schedule
4. CV
5. Selected projects
6. Latest news

The welcome heading is the literal text
`Welcome to Sadra's Home Page!` in that file. The two bio paragraphs come from
`profile.bio`.

The page uses a two-column grid: the sticky profile sidebar and the content
column. The sidebar is handled by `src/components/Profile.astro`; the grid is
defined in `src/pages/index.astro`.

**Reorder sections.** Move the corresponding `<section>` blocks inside
`.home__content`. The visual order is the HTML order. Keep the section
`aria-labelledby` IDs unique if you add or duplicate sections.

**Remove a section.** Delete its `<section>` block. Also remove or update links
to it elsewhere (for example the “Research” action in the section title).

**Add a section.** Copy an existing `<section class="section">`, give it a
unique heading ID, and use `SectionTitle` for the heading. For a card-style
action, copy one of the `.home-card` links; both the schedule and CV cards share
that styling.

**Research interests.** The homepage and the Research page both use
`researchAreas` from `src/data/research.ts`. Add, remove, or reorder entries
there. The homepage grid uses two columns on desktop and one on narrow screens.

**Selected projects.** The homepage filters projects with
`featured: true`, sorts them newest first, and shows the first three (`.slice(0, 3)`).
To show more, change that number. If no project is featured, the section is
empty.

**Latest news.** Entries come from `src/data/news.ts` in array order; put the
newest entry first. See [5.6 News](#56-news).

**Schedule and CV cards.** Both are `<a class="home-card">` elements. The
schedule card opens `calendarUrl` in a new tab; the CV card links to `/cv/`.
They share icons and action labels. If you add another card, use an icon name
that exists in `src/components/Icon.astro` and add `target="_blank"` plus
`rel="noopener noreferrer"` only for external destinations.

### 5.4 Google Calendar

The “My Schedule” card links to the URL in `profile.calendarUrl`:

- Empty value: the card falls back to Google Calendar's standard calendar view,
  and the development preview shows a reminder under the card.
- Public **share link**: opens the normal Google Calendar interface in a new
  tab.
- Public **embed URL** (from Google Calendar's “Integrate calendar” panel):
  opens Google's embedded-calendar view in a new tab.

The site currently links out; it does not render an iframe. To find a public
calendar link, open Google Calendar → **Settings** → your calendar →
**Access permissions** → **Make available to public**, then copy the public
link. Paste it into `calendarUrl` in `src/data/profile.ts`.

The card is in `src/pages/index.astro`; the link target is the only content
there that depends on the calendar configuration.

### 5.5 CV

The CV has two parts:

1. `src/pages/cv.astro` — the `/cv/` page, heading, and download button.
2. `public/files/sadra-gholami-cv.pdf` — the actual PDF.

To update the CV:

1. Replace `public/files/sadra-gholami-cv.pdf` with the new PDF, keeping the
   same filename.
2. Update `siteMeta.lastUpdated` in `src/data/profile.ts`.
3. Run `npm run check` and `npm run build`.

The page checks at build time whether the PDF exists. If the file is missing,
the page shows a short “not available” message instead of a broken download
button. Because the check uses the project root, run commands from the root.

The homepage CV section uses a card that links to `/cv/`. The navbar also has a
CV link. The `CV` icon was removed from the social/profile link list; the card
and the download button still use the document icon intentionally.

If you want the homepage card to download the PDF directly instead of opening
the CV page, change its `href` in `src/pages/index.astro` to
`/files/sadra-gholami-cv.pdf` and add the `download` attribute.

### 5.6 News

Edit `src/data/news.ts`. Each entry has:

```ts
{
  date: '2026-11',       // ISO year-month
  text: 'Short update.',
  href: '/research/',    // optional
}
```

- Use `YYYY-MM` format. `2026-09` is preferred over `2026-9` for consistency.
- The array is rendered in order; put newest entries at the top.
- `href` is optional. Without it, the text is plain text.
- Month precision is intentional, so no exact day has to be invented.
- The list has no separate empty state; if the array is empty, the section will
  simply have no entries.

### 5.7 Projects

Projects are Markdown files in `src/content/projects/`. The filename becomes
the URL:

```text
src/content/projects/my-project.md  →  /projects/my-project/
```

Use lowercase kebab-case filenames. A project file looks like this:

```yaml
---
title: "Project title"
description: "One sentence used in listings and page metadata."
category: "Machine Learning and AI"
technologies:
  - Python
  - scikit-learn
github: "https://github.com/gsadra/example"
demo: "https://example.com" # optional
featured: true
status: "Completed"
date: 2026-01-01
---

## Overview

Write the project here in Markdown.
```

**Required fields**

- `title` — string.
- `description` — string.
- `category` — must exactly match a value from `src/data/taxonomy.ts`.
- `status` — must exactly match a value from `src/data/taxonomy.ts`.
- `date` — an ISO date such as `2026-01-01`. Listings display the year.

**Optional fields**

- `technologies` — array of strings; defaults to an empty list.
- `github` — full URL; renders a repository button when present.
- `demo` — full URL; renders a live-demo button when present.
- `featured` — boolean; defaults to `false`. Featured projects appear on the
  homepage (the three newest by date).

**Allowed categories**

- `Machine Learning and AI`
- `Data Science and Analytics`
- `Operations Research and Optimization`
- `Python Development`

**Allowed statuses**

- `Completed`
- `In Progress`
- `Archived`

Changing `src/data/taxonomy.ts` also changes the allowed values in the schema.
If you rename or remove a category or status, update every project that uses
it.

**What happens automatically**

- The file becomes a route at `/projects/<filename>/`.
- The project appears on `/projects/` under its category.
- Featured projects are considered for the homepage.
- The project detail page shows status, category, year, technology tags, and
  repository/demo buttons.
- An invalid frontmatter value fails `npm run check` or the build with a schema
  error. That is the intended safety net.

**Project body**

The body is Markdown. Headings, lists, links, tables, blockquotes, and fenced
code blocks are styled by `.prose`. There is no MDX integration, so use `.md`
files.

The existing project pages follow a useful structure: Overview, Problem and
motivation, Methodology, Implementation, Results and evaluation, Limitations and
future work. It is a convention, not a requirement.

For equations, the site does not use KaTeX or LaTeX. Copy the `.math` markup
pattern from `src/content/projects/mdfh-scp.md` if you need a formatted
formula block.

Project images can be placed under `public/images/projects/` and referenced
with a root-relative path:

```md
![Diagram of the system](/images/projects/system-diagram.png)
```

Public images are copied unchanged, so resize or compress them first.

**Renaming a project.** Renaming the Markdown file changes its URL and leaves
the old URL as a 404. Update any links to it. In particular, the Research page
links directly to `/projects/cluster-scheduling/`.

### 5.8 Blog

Posts are Markdown files in `src/content/blog/`. The filename becomes the URL:

```text
src/content/blog/my-post.md  →  /blog/my-post/
```

Use lowercase kebab-case filenames. A post looks like this:

```yaml
---
title: "Post title"
description: "One or two sentences for the listing, feed, and search result."
date: 2026-11-02
tags: ["Research", "Methods"]
---

Your Markdown here.
```

- `title`, `description`, and `date` are required.
- `tags` defaults to an empty list.
- Posts are sorted newest first automatically on `/blog/`, tag pages, and the
  RSS feed. Do not reorder files by hand.
- Reading time is calculated from the body at roughly 200 words per minute.
- There is no draft flag. Every `.md` file in `src/content/blog/` is published.
- The starter post is `a-place-for-notes.md`. Edit it or delete it; the blog
  index shows an empty state if no posts exist.

**Tags**

Tags need no extra files. Every tag gets an archive:

```text
"Machine Learning"  →  /blog/tags/machine-learning/
```

The slug normalisation removes accents, lowercases, and replaces punctuation
and spaces with hyphens. Tags are listed with post counts at `/blog/tags/` and
linked from the post listing and each post page.

Renaming a tag changes its archive URL. The old URL will 404, so use stable tag
names if you care about inbound links. Tags that normalise to the same slug are
merged.

**RSS**

The feed is generated at `/blog/rss.xml` from the same posts. It includes each
post's title, description, date, link, and categories. It does not include the
full post HTML. To change the feed title or description, edit
`src/pages/blog/rss.xml.ts`.

Every page advertises the feed through `<link rel="alternate">`. The blog index
and post footers also link to it.

**Blog images**

Place images under `public/images/blog/` and reference them root-relatively:

```md
![A figure](/images/blog/figure.png)
```

Again, images are not processed automatically.

### 5.9 About page

The About page mixes hardcoded page copy with structured data:

- **Biography paragraphs** are written directly in `src/pages/about.astro` in
  the `Biography` section. Edit that markup to change the prose.
- `src/data/about.ts` holds `education`, `experience`, `skills`, and
  `certifications`.
- Empty `education`, `experience`, or `certifications` arrays hide their
  sections automatically. The current education entry is kept in the data file.
- `skills` is rendered as a two-column definition list. Keep at least one
  group.
- The Contact section uses the email and social links from `profile.ts`.

Education entries have this shape:

```ts
{
  institution: 'University',
  qualification: "Bachelor's degree",
  field: 'Industrial Engineering',
  period: '2022 - 2026',
  detail: 'Optional detail',
}
```

Experience entries have:

```ts
{
  organisation: 'Organisation',
  role: 'Role',
  period: '2025 - 2026',
  description: 'What you did.',
}
```

Certifications are plain strings.

### 5.10 Research page

`src/data/research.ts` contains:

- `researchAreas` — the interest cards shown on the homepage and the Research
  page. Each item has `name` and `description`.
- `currentResearch` — title, status, summary, questions, methods, and scope.
- `researchMethods` — a prepared list of tools/method groups. The current
  Research page does not render this list; it is available if you add a methods
  section.

The Research page itself is `src/pages/research.astro`. Its opening overview
copy and the link to the cluster-scheduling project are hardcoded there.

If you rename the project file `cluster-scheduling.md`, update the
`/projects/cluster-scheduling/` link in `research.astro`.

### 5.11 Navigation and contact

Navigation is defined in `src/data/navigation.ts`:

```ts
export const navigation = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about/' },
  // ...
];
```

- Reorder items by reordering the array.
- Add a page by creating the page file and adding an entry.
- Remove an entry to hide a page from the navbar without deleting the page.
- The active state is derived automatically, including nested paths.
- The contact page is intentionally **not** in the navbar. It is linked from
  the homepage sidebar and can be linked from anywhere else.
- The mobile menu is a native `<details>` element; it needs no JavaScript.

The contact page (`src/pages/contact.astro`) is a static page. It shows the
email from `profile.ts` and all external profiles. There is no contact form and
no backend; adding a form would require an external form service or a server.

### 5.12 404 page

`src/pages/404.astro` is the custom not-found page. It links to Home, Research,
Projects, Blog, and Contact and includes `noindex`.

`astro.config.mjs` sets:

```js
trailingSlash: 'ignore'
```

This lets unknown paths with or without a trailing slash reach the custom 404
page in development and preview. The build emits `dist/404.html`. GitHub Pages
serves that file automatically for unmatched routes. If you move to another
host, configure it to serve `404.html` with a 404 status.

The sitemap integration excludes pages containing `/404`.

## 6. Design and code customization

### 6.1 Design tokens

`src/styles/variables.css` is the fastest way to change the look. It defines:

- **Colour:** `--bg`, `--surface`, `--text`, `--muted`, `--border`,
  `--border-strong`, `--accent`, `--accent-hover`, `--accent-tint`.
- **Type scale:** `--fs-2xs` through `--fs-display`, plus line-height and
  letter-spacing variables.
- **Layout:** `--container` (1040px), `--container-reading` (760px), and
  `--gutter`.
- **Shape:** `--radius-xs`, `--radius-sm`, `--radius`, `--shadow-sm`.
- **Motion:** `--ease`, `--duration`.

Change a token once and every component that uses it follows. Prefer existing
tokens in component styles over new hardcoded values. The palette is deliberately
small; adding many one-off colours will make the site feel less coherent.

### 6.2 Typography and fonts

- Inter is the body/UI font; Source Serif 4 is used for headings.
- Fonts are self-hosted in `public/fonts/` with their OFL licence files.
- `src/styles/typography.css` defines the font faces and base element styles.
- `src/layouts/BaseLayout.astro` preloads the two main Latin font files.

To change fonts:

1. Add the `.woff2` files (and licence files) to `public/fonts/`.
2. Add `@font-face` rules in `typography.css`.
3. Update `--font-sans`, `--font-serif`, or `--font-mono` in `variables.css`.
4. Update the preload paths in `BaseLayout.astro`.

The site makes no third-party font requests at runtime.

### 6.3 Layout and responsive behaviour

Global layout primitives live in `src/styles/global.css`:

- `.container` — standard 1040px content column.
- `.container--reading` — 760px reading column.
- `.section` — top border plus vertical section spacing.
- `.prose` — long-form Markdown styling.
- Shared tags, status pills, metadata, skip link, focus styles, and reduced
  motion handling.

Current breakpoints:

- **760px:** desktop navigation becomes the compact `<details>` menu.
- **900px:** the homepage sidebar becomes a profile card above the content;
  the home grid becomes one column.
- **640px:** the profile photo and identity share a row on phones, with links
  below.
- **560px:** footer stacks; some card layouts switch to a two-row grid.
- **≤520–820px:** individual page layouts collapse depending on the component.

The sidebar is sticky only when the viewport is at least **901px wide and 760px
tall**. On shorter windows it becomes static so every link remains reachable.

The homepage grid column is 220px. If you widen or narrow the sidebar, update
`grid-template-columns` in `src/pages/index.astro` and the portrait sizes in
`src/components/Profile.astro` together.

### 6.4 Components and layouts

Reusable components:

- `Header.astro` — wordmark, desktop nav, native mobile menu.
- `Footer.astro` — copyright, last-updated line, email/GitHub icon links.
- `Profile.astro` — sticky sidebar, portrait, identity, links, contact.
- `SocialLinks.astro` — link list with `default`, `compact`, `stacked`, and
  `icons` variants.
- `SectionTitle.astro` — section heading with optional action link.
- `ResearchInterests.astro` — interest grid.
- `ProjectCard.astro` — project listing card.
- `NewsList.astro` — homepage news list.
- `BlogPostList.astro` — shared blog listing.
- `Icon.astro` — inline SVG icon set.

Layouts:

- `BaseLayout.astro` — page shell, SEO, metadata, header/footer. Use it for
  custom pages that do not fit `PageLayout`.
- `PageLayout.astro` — standard page header with `title`, `description`,
  `heading`, optional `kicker`, optional `lede`, and `width` (`reading` by
  default, or `default` for a wider 1040px column).
- `ProjectLayout.astro` — header, metadata, repository/demo buttons, and prose
  body for a project.

Page-specific CSS lives in the `.astro` file that owns the markup. Astro scopes
those styles to that component. When you need to style markup rendered by a
child component, use `:global(...)` deliberately rather than turning off
scoping globally.

### 6.5 Adding a page

Create a file under `src/pages/`. The filename is the route:

```astro
---
import PageLayout from '../layouts/PageLayout.astro';

const description = 'A short description for search engines and previews.';
---

<PageLayout
  title="Teaching | Sadra Gholami"
  description={description}
  heading="Teaching"
  lede="Courses, materials, and teaching notes."
  width="reading"
>
  <div class="prose">
    <p>Your content here.</p>
  </div>
</PageLayout>
```

This creates `/teaching/`. Then add it to `src/data/navigation.ts` if it should
appear in the navbar. Use `width="default"` for a wider 1040px layout.

For a page with a completely different design, import `BaseLayout.astro`
instead and write the full structure. Every page should have one `<h1>`, a
unique `<title>`, and a useful meta description.

### 6.6 Adding an icon

`src/components/Icon.astro` contains the icon type union and the inline SVG
paths.

1. Add the new name to the `IconName` union.
2. Add an entry to the `icons` record with `viewBox`, `filled`, and `body`.
3. Use `<Icon name="the-name" size={16} />`.

For filled brand logos, set `filled: true` and provide a path. For line icons,
set `filled: false` and use stroke-based paths. The component marks icons as
`aria-hidden`, so always provide a visible text label or an accessible name on
the link/button.

### 6.7 Metadata, social preview, and SEO

`BaseLayout.astro` handles the shared head:

- page title and meta description
- canonical URL derived from `Astro.site`
- author, Open Graph, and Twitter card metadata
- RSS alternate link and sitemap link
- favicon and font preloads
- optional JSON-LD
- `noindex` for the 404 page

The default social image is `public/images/og-card.png`, declared as 1200 × 630.
Replace that file with a new 1200 × 630 image if the design or identity changes.
If you change its dimensions, update the `og:image:width` and `og:image:height`
tags in `BaseLayout.astro`.

`public/favicon.svg` is the browser icon. Replace it with another SVG (or update
the `<link rel="icon">` if you use a different format).

The sitemap is generated by `@astrojs/sitemap`. It includes new pages, posts,
projects, and tag archives automatically, and excludes the 404 page.

`public/robots.txt` currently points at:

```text
Sitemap: https://gsadra.github.io/sitemap-index.xml
```

Update that URL if the domain changes.

### 6.8 Images and static files

Anything in `public/` is copied to the site root unchanged. A file at
`public/images/example.jpg` is available at `/images/example.jpg`.

- Use root-relative paths in markup and Markdown.
- Public images are not optimized, resized, or converted to WebP.
- Compress large images before adding them.
- Keep filenames lowercase and use hyphens.
- Do not put source files, drafts, or secrets in `public/`.

If you need Astro's automatic image optimization, that requires importing images
from `src/assets/` and using Astro's image components instead of a public path.
The current site intentionally uses public images for simplicity.

### 6.9 No client-side JavaScript

The production site ships no client-side framework. The mobile menu uses a
native `<details>` element; links, forms, and navigation are ordinary HTML.
If you add interactive behavior, add it deliberately as a small script or an
Astro island, and test keyboard and reduced-motion behavior.

### 6.10 Content schemas

`src/content.config.ts` defines the allowed frontmatter for projects and posts
using Zod. The schema is the contract:

- Required fields must be present.
- Project categories and statuses must come from `src/data/taxonomy.ts`.
- URLs must be valid URLs.
- Dates are parsed into JavaScript dates by `z.coerce.date()`.
- Blog tags default to an empty array; project technologies default to empty;
  `featured` defaults to `false`.

When the schema fails, `npm run check` and `npm run build` report the file and
field. Fix the content rather than weakening the schema.

## 7. Verification and troubleshooting

### 7.1 Checks to run

Before pushing a change:

```bash
npm run check
npm run build
npm run preview
```

Then inspect the built site at the preview URL:

- Click every navigation item.
- Open one project and one blog post.
- Check the tag index and a tag archive if you changed tags.
- Check `/cv/` if you changed the PDF.
- Check `/404/` or a random URL.
- Test desktop, tablet, and phone widths.
- Check the browser console for errors.
- Confirm the footer shows only the intended links.

There is no automated test suite in this project. `npm run check`, the build,
link crawling, and browser checks are the safety net.

### 7.2 Common problems

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| `npm run check` reports an unknown property on a data object | A template still uses a field that was removed from a data file | Update the template or restore the field |
| Build error: invalid enum / category / status | Project frontmatter uses a value not in `taxonomy.ts` | Use an allowed value or update the taxonomy and all affected projects |
| A project or post does not appear | Wrong folder, wrong extension, or missing frontmatter | Put `.md` files in `src/content/projects` or `src/content/blog`; rebuild |
| `/cv/` shows “not available” | PDF is missing or in the wrong path | Put it at `public/files/sadra-gholami-cv.pdf`; rebuild |
| An image is broken | File is not under `public/` or path is relative | Move it to `public/images/...` and use `/images/...` |
| A random route shows Astro's default 404 | Host is not serving `404.html`, or `trailingSlash` was changed | Keep `trailingSlash: 'ignore'`; serve `dist/404.html` |
| Dev server will not start | Port already in use | `npm run dev -- --port 4322` |
| Changes do not appear | Dev server stopped or browser cache | Restart the server and hard-refresh |
| Deploy does not update | Workflow failed or Pages is set to a branch | Check Actions; set Pages source to GitHub Actions |
| Fonts look wrong | Font files absent or preload paths changed | Check `public/fonts/` and `BaseLayout.astro` |
| Styles do not affect a child component | Astro scopes component styles | Use `:global(...)` or style the child component directly |

`npm run check` may print **hints** (for example, unused imports). Hints do not
fail the check. Errors do.

### 7.3 Node and dependency problems

- Use Node 22.23.4 or newer. `node --version` should confirm it.
- Use npm; `package-lock.json` is the locked dependency graph.
- Run `npm install` after changing `package.json`.
- Commit `package-lock.json` with dependency changes.
- Do not edit `node_modules/`.

## 8. Deployment

### 8.1 How it works

`.github/workflows/deploy.yml` builds the site and deploys it to GitHub Pages
whenever `main` is pushed, or when the workflow is run manually from the Actions
tab.

The workflow uses:

- `actions/checkout`
- `withastro/action`
- `actions/deploy-pages`

### 8.2 First deployment

1. Create a **public** GitHub repository named exactly
   `gsadra.github.io`.
2. If this folder is not already a Git repository, initialize and push it:

   ```bash
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/gsadra/gsadra.github.io.git
   git push -u origin main
   ```

3. In the repository, open **Settings → Pages → Build and deployment** and set
   **Source** to **GitHub Actions**.
4. Open the **Actions** tab and wait for the deployment to finish.
5. Visit <https://gsadra.github.io/>.

`astro.config.mjs` already sets:

```js
site: 'https://gsadra.github.io',
base: '/',
```

This is correct for a user site at the root of the domain.

### 8.3 Routine deployment

After editing:

```bash
npm run check
npm run build
git add .
git commit -m "Describe the change"
git push
```

The push triggers the workflow. The Actions tab shows the build and deploy
status. If the build fails, the live site is not replaced.

You can also run the workflow manually from **Actions → Deploy to GitHub Pages
→ Run workflow**.

### 8.4 Custom domain

1. Update `site` in `astro.config.mjs` to the custom domain.
2. Keep `base: '/'` for a root domain. If the site will live under a subpath,
   set `base` accordingly.
3. Add a `public/CNAME` file containing the domain, with a trailing newline.
4. Configure the domain and DNS in GitHub Pages, then enable HTTPS.
5. Update the sitemap URL in `public/robots.txt`.
6. Update the `url` in the JSON-LD object in `src/pages/index.astro` if you want
   structured data to point at the new domain.
7. Rebuild and deploy.

Canonical URLs and sitemap entries are derived from `site`, so they follow the
configuration automatically. Hardcoded absolute URLs in `robots.txt` and the
homepage JSON-LD do not.

### 8.5 Other static hosts

The build output is a normal static site in `dist/`. Upload that directory to
any static host. The host must:

- serve `index.html` files for directory URLs,
- serve `404.html` for unknown routes,
- preserve `/blog/rss.xml`, `/sitemap-index.xml`, and `/robots.txt`.

Update `site` in `astro.config.mjs` and `robots.txt` for the new domain.

## 9. Common tasks

### Add a project

1. Create `src/content/projects/my-project.md`.
2. Add valid frontmatter (see [5.7 Projects](#57-projects)).
3. Write the body in Markdown.
4. Set `featured: true` if it should appear on the homepage.
5. Run `npm run check`, `npm run build`, and open the project page.

### Add a blog post

1. Create `src/content/blog/my-post.md`.
2. Add `title`, `description`, `date`, and optional `tags`.
3. Write the body.
4. Run `npm run check`, `npm run build`, and open `/blog/my-post/`.

### Update the CV

1. Replace `public/files/sadra-gholami-cv.pdf`.
2. Update `siteMeta.lastUpdated` in `src/data/profile.ts`.
3. Run `npm run check` and `npm run build`.
4. Open `/cv/` and confirm the download.

### Change the portrait

1. Add the new image to `public/images/`.
2. Update `photo` and `photoAlt` in `src/data/profile.ts`.
3. Resize/compress the source before adding it; the site does not optimize
   public images.
4. Check the portrait at desktop, tablet, and phone widths.

### Change colours or spacing

1. Edit the tokens in `src/styles/variables.css`.
2. Run `npm run dev` and inspect the affected pages.
3. Do not hardcode new colours in individual components unless the value is
   genuinely one-off.

### Add a page to the navbar

1. Create `src/pages/my-page.astro` using `PageLayout` or `BaseLayout`.
2. Add `{ label: 'My page', href: '/my-page/' }` to
   `src/data/navigation.ts`.
3. Run the checks and build.

### Remove a page

1. Delete the page file.
2. Remove its entry from `src/data/navigation.ts`.
3. Remove links to it elsewhere (homepage cards, footer, prose).
4. Run a link crawl or click through the built site; deleted routes become 404.

### Change the footer

The footer intentionally shows copyright, “last updated”, and only email/GitHub
icon links. To change which profile links appear, edit `footerLinks` in
`src/data/profile.ts`. To change the layout or add text, edit
`src/components/Footer.astro`.

### Change the homepage order

Move the `<section>` blocks inside `.home__content` in
`src/pages/index.astro`. Keep the welcome intro first unless you intentionally
redesign the page.

## 10. Conventions and limitations

### Content conventions

- Use lowercase kebab-case filenames: `my-project.md`, `my-post.md`.
- Filenames become URLs; renaming changes the URL.
- Use ISO dates: `2026-11-02` for posts, `2026-01-01` for projects, `2026-11`
  for news.
- Quote YAML strings that contain a colon or other punctuation.
- Put newest news entries first; posts and projects sort themselves.
- Do not publish placeholder content. The site is intended to show only
  verified information.

### Known limitations

- **Static only.** There is no CMS, database, login, search, comments, or
  contact form. Editing files and rebuilding is the content workflow.
- **Public images are not optimized.** Resize and compress them before adding.
- **No draft flag.** Every file in a content folder is published.
- **No pagination.** The blog and project lists render all entries.
- **Tag URLs are derived from tag names.** Renaming a tag creates a new archive
  URL and leaves the old one as a 404.
- **RSS uses descriptions, not full post HTML.**
- **The calendar is a link, not an embedded iframe.** An embed URL opens the
  embed view; a public share link opens the full Google Calendar interface.
- **No automated test suite.** Use `npm run check`, `npm run build`, and browser
  checks.
- **Hardcoded page titles.** If you change the person's name, search
  `src/pages/` for `Sadra Gholami` and update the titles.
- **Hardcoded absolute URLs.** `public/robots.txt` and the homepage JSON-LD
  contain `https://gsadra.github.io/`; update them for a custom domain.

### Before you push

- [ ] `npm run check` passes with no errors.
- [ ] `npm run build` succeeds.
- [ ] New links resolve.
- [ ] The CV download works if the CV changed.
- [ ] The page looks correct at desktop and phone widths.
- [ ] No placeholder text or unverified claims were added.

## Credits

Built with [Astro](https://astro.build/). Inter and Source Serif 4 are
self-hosted under the SIL Open Font License; see the licence files in
`public/fonts/`.
