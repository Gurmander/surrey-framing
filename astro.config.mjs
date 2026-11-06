// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from 'vite';
import { readdirSync, readFileSync } from 'node:fs';

const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');

// Production URL: used for canonical tags, Open Graph URLs and the sitemap.
// Set PUBLIC_SITE_URL in .env / Netlify once the domain is confirmed (SRS 2.5).
const site = env.PUBLIC_SITE_URL || 'https://surreyframing.ca';

// Pages that must never appear in the sitemap (NFR-13): the thank-you page and
// placeholder projects, which stay noindex until real content replaces them.
const placeholderProjects = readdirSync('src/content/projects')
  .filter((name) => name.endsWith('.md'))
  .filter((name) =>
    /^placeholder:\s*true\s*$/m.test(readFileSync(`src/content/projects/${name}`, 'utf8')),
  )
  .map((name) => `/projects/${name.replace(/\.md$/, '')}/`);
const NOINDEX_PATHS = ['/thank-you/', ...placeholderProjects];

export default defineConfig({
  site,
  output: 'static',
  // Directory build format + trailing slashes = one canonical URL per page on any static host.
  trailingSlash: 'always',
  // Inline the (small) stylesheet: removes a render-blocking request (NFR-02).
  build: { format: 'directory', inlineStylesheets: 'always' },
  // FR-90: English only at launch, structured so /pa/ (Punjabi) can be added later.
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    icon(),
    sitemap({
      filter: (page) => !NOINDEX_PATHS.some((path) => new URL(page).pathname === path),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
