# Power Capital — CMS Site (Astro + TinaCMS)

The marketing website for **Power Capital**, the fractional-CFO practice of John Roberts, rebuilt as an **Astro** static site with a **TinaCMS / TinaCloud** content layer so non-technical editors can update the site through a visual editor — no code required.

**Live site (current):** https://powercapital.cloud — served by the original static-HTML repo. This Astro + TinaCMS repo is in the build/preview phase and will take over the domain at cutover.
**Stack:** Astro (static output) · TinaCMS + TinaCloud · Cloudflare Pages · vanilla CSS/JS

---

## Why this repo exists

The site originally shipped as hand-authored static HTML (a separate repo deployed on GitHub Pages). Once the design and content were settled, it was migrated here into Astro so that:

- **A non-technical person can edit every page** — all copy, images, and page structure — through TinaCMS's visual editor, with changes committed back to this repo automatically.
- **The site stays fast and static** — Astro outputs plain HTML/CSS/JS; there's no server to run.
- **Hosting runs the build automatically** — Cloudflare Pages builds and deploys on every push.

This repo is the **permanent home** of the live site. (The original hand-HTML repo is kept only as a short-term rollback.)

---

## How content editing works

Every page is data-driven. Instead of hardcoding copy into templates, each page's content lives in a JSON file under `content/pages/`, structured as an ordered list of **section blocks**:

```
content/pages/home.json   →   { title, description, blocks: [ hero, painPoints, ... ] }
```

- `src/pages/*.astro` reads the page's JSON and renders each block by mapping its
  `_template` to a component in `src/components/blocks/`.
- `tina/config.ts` defines the editing **schema** — the fields an editor sees, and the
  set of section types available.

Because sections are a **reorderable, add/removable list**, an editor can (via `/admin`):
- Edit any headline, paragraph, card, or button
- Swap images
- **Reorder** sections, **show/hide** them, and **add/remove** items in repeatable lists
  (stats, cards, steps)

Structural plumbing — SEO tags, Google Analytics, favicons, fonts, the contact-form
integration — lives in code (`src/layouts/BaseLayout.astro`) and is intentionally **not**
editable, so the layout and integrations can't be broken from the CMS.

---

## Project structure

```
powercapital-cms/
├── astro.config.mjs        # Astro config (static output, site = powercapital.cloud)
├── package.json            # scripts: dev (tinacms + astro), build (tinacms build && astro build)
├── tina/
│   └── config.ts           # TinaCMS schema: the "page" collection + section block templates
├── content/
│   └── pages/              # editable page content as JSON (home.json, …)
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro # <head>, SEO, Open Graph, Google Analytics (GA4), fonts, Header + Footer
│   ├── components/
│   │   ├── Header.astro · Footer.astro
│   │   └── blocks/          # one component per section type (Hero, PainPoints, …)
│   ├── pages/              # Astro routes; each reads its JSON and renders blocks
│   └── styles/global.css   # the full design system (ported from the original site)
└── public/
    ├── assets/img/         # logo, favicons, portraits, OG image
    ├── assets/js/main.js   # nav toggle, sticky header, scroll reveals, contact form
    ├── robots.txt · sitemap.xml · site.webmanifest · CNAME
```

---

## Local development

Requires Node.js. Install dependencies and run the dev server (which runs TinaCMS alongside Astro):

```bash
npm install
npm run dev
```

- Site: `http://localhost:4321`
- Visual editor: `http://localhost:4321/admin`

Editing in `/admin` requires TinaCloud credentials (see below). The site itself renders without them.

---

## Deployment (Cloudflare Pages)

Cloudflare Pages is connected to this repo and builds on every push to `main`:

- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Environment variables** (set in the Cloudflare Pages project, Production + Preview):
  - `NEXT_PUBLIC_TINA_CLIENT_ID` — from the TinaCloud project
  - `TINA_TOKEN` — a TinaCloud read-only token

Every branch/PR gets its own preview URL; `main` publishes to the custom domain.

---

## Content management (TinaCloud)

- The TinaCloud project is connected to this repo and tracks `main`.
- Editors visit `/admin` on the live site, sign in, and edit visually.
- Saving in Tina commits the changed JSON back to this repo, which triggers a Cloudflare
  rebuild — so edits go live automatically.

Credentials are never committed; they live only as environment variables (see `.env.example`).

---

## Notes

- **Secrets:** never commit a `.env` file or the Tina token. Use env vars only.
- **The contact form** posts to Web3Forms (static-friendly, no backend) with hCaptcha spam
  protection; analytics run through Google Analytics (GA4).
- **Custom domain:** `public/CNAME` holds `powercapital.cloud` for a future cutover. This
  repo is currently in the build/preview phase (served at a `*.pages.dev` URL) and will
  replace the existing GitHub Pages repo as the site serving `powercapital.cloud` once the
  DNS is pointed at Cloudflare Pages.

---

## Author

Designed and built by **[Kala Roberts](https://kalaroberts.github.io/)**.
