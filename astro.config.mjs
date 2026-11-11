import { defineConfig } from 'astro/config';

// Static output — ideal for Cloudflare Pages + TinaCloud.
// The custom domain is set via the site field for correct canonical/SEO URLs.
export default defineConfig({
  site: 'https://powercapital.cloud',
  output: 'static',
  build: {
    assets: 'astro-assets'
  }
});
