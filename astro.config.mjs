import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://freetrustdocs.com',
  integrations: [preact(), sitemap()],
  output: 'static',
  prefetch: true,
});