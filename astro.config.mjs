import { defineConfig } from 'astro/config';
import tina from '@tinacms/astro/integration';
import cloudflare from '@astrojs/cloudflare';

// Pages stay static (prerendered). The Cloudflare adapter is only needed so the
// editor-only /tina-island/[name] endpoint can render on demand for live preview.
export default defineConfig({
  site: 'https://powercapital.cloud',
  output: 'static',
  adapter: cloudflare(),
  integrations: [tina()],
  build: {
    assets: 'astro-assets'
  }
});
