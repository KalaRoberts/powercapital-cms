import { defineConfig } from 'astro/config';
import tina from '@tinacms/astro/integration';
import cloudflare from '@astrojs/cloudflare';

// Pages are prerendered (static). The Cloudflare adapter deploys to Cloudflare
// Workers so the editor-only /tina-island/[name] endpoint can render on demand
// for live visual editing. Sessions and the Images binding are not used, so
// they're turned off to avoid provisioning extra Cloudflare resources.
export default defineConfig({
  site: 'https://powercapital.cloud',
  output: 'static',
  adapter: cloudflare({ imageService: 'passthrough' }),
  session: false,
  integrations: [tina()],
  build: {
    assets: 'astro-assets'
  }
});
