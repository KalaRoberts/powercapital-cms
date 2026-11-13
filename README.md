# Power Capital — CMS Site (Astro + TinaCMS)

The website for **Power Capital**, the fractional-CFO practice of John Roberts. It's built with **Astro**, with a **TinaCMS / TinaCloud** content layer, so non-technical editors can update the site in a visual editor. They click text on the page, type, and see the change straight away. No code is needed.

**Live site (current):** https://powercapital.cloud is still served by the original static-HTML repo. This repo is in the build/preview phase and takes over the domain at cutover.
**Pages ported:** Home, About. Still to do: Credentials, Services, Industries, Contact.
**Stack:** Astro 7 (prerendered pages) · TinaCMS 3 + TinaCloud · `@tinacms/astro` live visual editing · Cloudflare Workers · vanilla CSS/JS

> Maintainers: see **[PROJECT-NOTES.md](PROJECT-NOTES.md)** for versions, the full workflow, known issues and fixes, and the cutover checklist.

---

## Why this repo exists

The site first shipped as hand-written static HTML (a separate repo on GitHub Pages). It was moved here so that:

- **A non-technical person can edit every page** (all text, images, and page structure) in TinaCMS's visual editor. Changes are committed back to this repo automatically.
- **The site stays fast:** every visitor-facing page is prerendered to plain HTML/CSS/JS.
- **Hosting builds itself:** Cloudflare Workers Builds builds and deploys on every push, and each branch gets its own preview.

This repo is the **permanent home** of the live site. The original HTML repo is kept only as a short-term rollback.

---

## How content editing works

Every page is data-driven. Each page's content is a JSON file under `content/pages/`, structured as an ordered list of **section blocks**:

```
content/pages/home.json   →   { title, description, ogTitle, ogDescription, blocks: [ hero, painPoints, ... ] }
```

- `tina/config.ts` defines the editing **schema**: the fields an editor sees and the section types available.
- `src/pages/*.astro` loads its page **through Tina** (`src/lib/tina/data.ts`). It wraps the sections in `<TinaIsland>` and renders them with `src/components/PageBlocks.astro`.
- Each section component in `src/components/blocks/` tags its editable elements with `data-tina-field`. That's what makes them clickable in the editor.

Sections are a **reorderable list that items can be added to or removed from**, so in `/admin` an editor can:
- Click any headline, paragraph, card, stat, or button and edit it, with the page updating as they type
- Swap images
- **Reorder**, **add**, or **remove** sections, and add or remove items in lists (stats, cards, steps)

The underlying setup (SEO tags, Google Analytics, favicons, fonts, the contact-form integration) lives in code (`src/layouts/BaseLayout.astro`). It is deliberately **not** editable in the CMS, so the layout and integrations can't be broken from there.

### How live editing works (and why Workers)

Pages are prerendered. When a page is opened inside the Tina editor, a small script (`/admin/bridge.js`) asks the site for an up-to-date copy of each section as you type. It does that through one on-demand route, `src/pages/tina-island/[name].ts`. That route needs a server, which is why the site runs on **Cloudflare Workers** instead of Cloudflare Pages: Pages only serves fixed files, and live editing fails there. Ordinary visitors never call the route.

---

## Project structure

```
powercapital-cms/
├── astro.config.mjs        # static output + Cloudflare adapter + tina() integration
├── wrangler.jsonc          # Cloudflare Workers config (Worker name must match the dashboard)
├── package.json            # dev: copy bridge + tinacms dev + astro dev · build: tinacms build && astro build
├── tina/
│   ├── config.ts           # TinaCMS schema: "page" collection + section block templates
│   └── tina-lock.json      # generated; MUST be committed whenever it changes
├── content/pages/          # editable page content as JSON (home.json, about.json, …)
├── scripts/copy-bridge.mjs # dev-only: puts Tina's bridge.js in public/admin
├── src/
│   ├── layouts/BaseLayout.astro    # <head>, SEO, Open Graph, GA4, fonts, Header + Footer
│   ├── lib/tina/data.ts            # Tina data loaders (requestWithMetadata)
│   ├── lib/tina/islands.ts         # editable-region registry
│   ├── lib/inline.ts               # **bold** support + TinaCloud image-path fix
│   ├── components/
│   │   ├── Header.astro · Footer.astro
│   │   ├── PageBlocks.astro        # renders a page's blocks
│   │   └── blocks/                 # one component per section type (Hero, PainPoints, PageHero, Bio, Timeline, …)
│   ├── pages/
│   │   ├── index.astro             # Home
│   │   ├── about.astro             # About
│   │   └── tina-island/[name].ts   # editor-only on-demand route
│   └── styles/global.css           # the design system
└── public/
    ├── assets/img/          # logo, favicons, portraits, OG image
    ├── assets/js/main.js    # nav toggle, sticky header, scroll reveals, contact form
    └── robots.txt · sitemap.xml · site.webmanifest · CNAME
```

---

## Local development

Requires **Node 22** (see `.nvmrc`; on Windows use nvm-windows: `nvm use 22`). Don't use Node 26.

```bash
npm install
npm run dev
```

- Site: `http://localhost:4321`
- Visual editor: `http://localhost:4321/admin/index.html#/~/`

Local editing runs in Tina's **local mode**: no credentials are needed, and saving writes straight to `content/pages/*.json`.

Offline production build check:

```bash
npx tinacms build --local --skip-cloud-checks -c "astro build"
```

---

## Deployment (Cloudflare Workers)

The Worker `powercapital-cms` is connected to this repo through Workers Builds:

- **Production branch:** `main` → `https://powercapital-cms.jr-1791.workers.dev`
- **Every other branch** gets its own **Preview**, listed in the Worker's *Previews* section
- **Build command:** `npm run build`
- **Deploy command:** `npx wrangler deploy` · **Preview command:** `npx wrangler preview`
- **Build variables and secrets** (*Settings → Build*, set for **both Production and Preview**):
  - `NEXT_PUBLIC_TINA_CLIENT_ID`: the TinaCloud client ID
  - `TINA_TOKEN`: a TinaCloud content token with branch access `*`

These are needed while the site is **building**, so they go in the Build settings, not the runtime *Variables & Secrets*.

**New branch previews:** a new branch's Preview may not pick these up automatically. If its first build fails with "Missing clientId, token", add both to that Preview, then retry. Setting them in **Previews Base** should let new previews inherit them.

---

## Content management (TinaCloud)

- TinaCloud project "Power Capital Site" is connected to this repo. After pushing a new branch, click **Refresh Branches**.
- Every address the editor is used on must be listed under **Site URLs** in TinaCloud: production, each branch preview, `localhost`, and later the real domain.
- Editors open `/admin/index.html#/~/` on the site, sign in, and edit. **Saving** commits the changed JSON to that branch, which triggers a rebuild.

Credentials are never committed. They live only in Cloudflare build settings (see `.env.example` for the names).

---

## Notes

- **Secrets:** never commit a `.env` file or a Tina token.
- **Contact form:** posts to Web3Forms with hCaptcha spam protection. Analytics run through Google Analytics (GA4).
- **Custom domain:** `public/CNAME` holds `powercapital.cloud` for the future cutover. At cutover, `powercapital.cloud` is added as a Custom Domain on the Worker and DNS is pointed there (see PROJECT-NOTES.md §7).

---

## Author

Designed and built by **[Kala Roberts](https://kalaroberts.github.io/)**.
