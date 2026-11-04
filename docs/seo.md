# Technical SEO

Production URL: `https://gsadra.github.io/` (GitHub Pages user site).

## What is automatic

Every built page (except the 404) gets:

- a unique `<title>` and meta description, plus `meta name="author"`;
- an absolute self-referencing `<link rel="canonical">` using the trailing-slash URL;
- `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">`;
- Open Graph and Twitter/X card tags, including the 1200×630 `images/og-card.png`;
- `article:*` tags on blog posts;
- one JSON-LD `@graph` containing `Person`, `WebSite` and `WebPage` nodes with stable `@id`s;
- `<html lang="en">`.

The 404 page is `noindex, follow`, has no canonical URL and carries no JSON-LD.

Page-specific JSON-LD:

| Page | Additional nodes |
| --- | --- |
| `/` and `/about/` | `WebPage.mainEntity` → the Person node |
| `/blog/` | `Blog` |
| `/blog/<post>/` | `BlogPosting`, `BreadcrumbList` |
| `/projects/<project>/` | `CreativeWork`, or `SoftwareSourceCode` when a repository is linked, plus `BreadcrumbList` |
| `/cv/` | `DigitalDocument` for the PDF |

All structured data is generated from `src/data/profile.ts`, `src/data/research.ts`
and the content collections. `sameAs` uses only the social profiles configured in
`profile.social`. Nothing is invented.

## Generated crawl files

- `dist/robots.txt` (from `public/robots.txt`) — allows all paths and points to the sitemap index.
- `dist/sitemap-index.xml` → `dist/sitemap-0.xml` — 14 indexable URLs, produced by `@astrojs/sitemap`.
  The 404 is filtered out.
- `dist/blog/rss.xml` — discovery link is in every page head.

The sitemap intentionally has no `lastmod`: there is no reliable per-page
modification date, and a build-time timestamp is ignored by Google.

## Verify locally

```bash
npm run build
npm run seo:audit
npx astro check
```

`npm run seo:audit` (`scripts/seo-audit.mjs`, no dependencies) checks titles,
descriptions, canonicals, robots directives, Open Graph/Twitter tags, JSON-LD
types and required fields, internal links, image alt text, sitemap coverage and
robots.txt. It exits non-zero on errors.

Current result: 15 pages built, 14 indexable, 14 sitemap URLs, 0 errors,
0 warnings; `astro check` reports 0 errors.

## Canonical policy

- Every internal link, canonical URL, sitemap entry and `og:url` uses a trailing
  slash (`/about/`, not `/about`).
- `trailingSlash: 'ignore'` in `astro.config.mjs` only affects dev/preview; the
  static host serves `about/index.html` for either form, and the canonical tag
  consolidates any duplicate form.
- There are no query-string or `index.html` variants in the sitemap.
- The 404 page is not canonicalised, because `/404/` is not a real page.

## Google Search Console — manual steps

These require the site owner's Google account and a deploy; they cannot be
completed from the repository.

1. **Add the property.** Open <https://search.google.com/search-console> and add
   a **URL prefix** property: `https://gsadra.github.io/`.
   A Domain property cannot be used here because the DNS zone belongs to
   `github.io`, not to this project.
2. **Verify ownership.** In Search Console choose the **HTML file** method,
   download the `google<token>.html` file it gives you, place it in `public/`,
   commit and push to `main`, wait for the GitHub Actions deploy, confirm
   `https://gsadra.github.io/google<token>.html` returns 200, then click
   **Verify**. Keep the file in `public/` so verification does not lapse.
   (The HTML-tag method is also possible, but it would add a
   `google-site-verification` meta tag to every page; use only the real token
   from Search Console.)
3. **Submit the sitemap.** In *Indexing → Sitemaps*, submit
   `https://gsadra.github.io/sitemap-index.xml` (not `sitemap-0.xml`).
   `robots.txt` already advertises the same URL.
4. **Request indexing.** Use *URL Inspection* on `/`, `/about/`, `/research/`,
   `/projects/`, `/blog/` and the three project pages, and click
   **Request indexing** for each.
5. **Monitor.** Check *Page indexing* after a few days. New sites commonly show
   "Discovered – currently not indexed" or "Crawled – currently not indexed"
   for a while; that is a Google scheduling decision, not a technical error.
6. Then add the same property to Bing using the steps below.

Do not expect a new deployment to be indexed immediately. Indexing status can
only be confirmed from Search Console or by a `site:gsadra.github.io` query.

## Bing Webmaster Tools (also powers DuckDuckGo and Yahoo)

1. Sign in at <https://www.bing.com/webmasters> and choose **Add site**.
2. Pick **Import from Google Search Console** and select the verified
   `https://gsadra.github.io/` property. Bing imports the ownership verification
   and the sitemaps automatically.
3. If you add it manually instead, download `BingSiteAuth.xml` from Bing, place
   it in `public/`, deploy, then verify. The sitemap URL is the same:
   `https://gsadra.github.io/sitemap-index.xml`.

## Other engines (optional)

- **Brave Search** has its own index: submit the homepage at
  <https://search.brave.com/submit-url>.
- **Yandex**: add the site at <https://webmaster.yandex.com> and submit the same
  sitemap. Bing and Yandex also accept IndexNow pings (below).

## IndexNow (optional, faster recrawl requests)

GitHub Pages cannot run server code, so IndexNow needs a key file in `public/`
and something to submit URLs after a deploy (a GitHub Action or a manual call).

1. Generate a key of 8–128 hexadecimal characters, and save it as
   `public/<key>.txt` containing exactly that key.
2. After the deploy, POST the changed URLs to `https://api.indexnow.org/indexnow`:

   ```json
   {
     "host": "gsadra.github.io",
     "key": "<key>",
     "urlList": ["https://gsadra.github.io/"]
   }
   ```

3. An HTTP 200/202 only means the URLs were received; it does not guarantee
   indexing.

## Being found by name and handle

Technical crawlability is done; ranking is decided by the search engines.

- **Reciprocal links matter most.** Add `https://gsadra.github.io/` to the
  Website field of the GitHub profile (<https://github.com/gsadra>), to LinkedIn
  contact info, and to the X, Medium, and Telegram bios. The site already links
  out to those profiles, so the association becomes two-way.
- Keep the name consistently written as `Sadra Gholami`; the page titles,
  Person schema and `sameAs` links already do this.
- `gsadra` is often autocorrected to **Ghidra** (the NSA reverse-engineering
  tool), so a bare `gsadra` query is noisy. Check `"gsadra"` in quotes and
  `"Sadra Gholami"` instead.
- If the Bluesky profile `@gsadra.bsky.social` is yours, add it to
  `profile.social` so it joins the `sameAs` list.
- Expect days to weeks for a new site. Avoid paid "indexing services" and bulk
  backlinks.

## Performance notes

- The site ships **no client-side JavaScript**; navigation uses native `<details>`.
- Self-hosted WOFF2 fonts are preloaded and use `font-display: swap`.
- The portrait has explicit dimensions and `fetchpriority="high"`, and the LCP
  element is a text paragraph, so layout shift is 0 in local lab runs.
- `public/images/profile.webp` is 189 KB (down from 356 KB as JPEG) for a
  portrait displayed at roughly 220 px wide on desktop. A responsive ~440 px
  derivative is the remaining image optimization.
- Head metadata adds about 0.2–0.6 KB gzipped per page.

Local lab measurement (`astro preview`, Chromium): FCP/LCP ≈ 0.28 s at 390×844
and ≈ 0.65 s at 1280×900, CLS 0. These are local numbers, not field data.

## Deploy checklist

1. `npm run build && npm run seo:audit` — must pass.
2. Push to `main`; the GitHub Actions workflow deploys `dist/`.
3. After deploy, confirm:
   - `https://gsadra.github.io/robots.txt` → 200
   - `https://gsadra.github.io/sitemap-index.xml` → 200
   - `https://gsadra.github.io/sitemap-0.xml` → 200 and lists the expected URLs
4. Then complete the Search Console steps above.
