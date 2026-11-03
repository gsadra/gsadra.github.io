// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages user site: https://gsadra.github.io/
  site: 'https://gsadra.github.io',
  base: '/',
  // Accept both /about and /about/ in dev and preview. Static hosts still
  // serve the generated /about/index.html for either form, and every internal
  // link and canonical URL uses the trailing-slash version.
  trailingSlash: 'ignore',

  // HTML-aware whitespace handling. Astro 7 defaults to JSX rules, which can
  // drop the space between inline elements and their neighbours.
  compressHTML: true,

  // Code blocks stay in the site's monochrome palette: no Shiki theme, just
  // the shared `.prose pre` styling from global.css.
  markdown: {
    syntaxHighlight: false,
  },

  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
});
