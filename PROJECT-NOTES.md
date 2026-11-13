# Power Capital CMS — Project Notes

> Current state of the `powercapital-cms` repo, updated 2026-11-12 (all 6 pages ported). Replaces the
> earlier HANDOFF.md. **No secrets in this file.** Tokens live only in TinaCloud
> and in Cloudflare build settings.

## 1. What this is

The new site for **Power Capital** (John Roberts, fractional CFO, Raleigh NC),
built with **Astro + TinaCMS**. It replaces the hand-written 6-page HTML site.

| | |
|---|---|
| Live domain | `powercapital.cloud` — **still served by the old `powercapital` repo on GitHub Pages.** Do not change DNS until all 6 pages are ported and checked. |
| This repo | `github.com/KalaRoberts/powercapital-cms` |
| Old site (rollback + source of real page text) | `github.com/KalaRoberts/powercapital` |
| Hosting | **Cloudflare Workers** (Worker name `powercapital-cms`) |
| Production (`main`) | `https://powercapital-cms.jr-1791.workers.dev` (Home at `/`, then `/about`, `/credentials`, …) |
| Branch previews | `https://<branch>-powercapital-cms.jr-1791.workers.dev`, listed under the Worker's **Previews** section. Each one shows the **whole site as of that branch** (Home at `/`, the ported page at `/<slug>`). |
| TinaCloud project | "Power Capital Site", client ID `aa8e00fd-4923-40cc-abc5-791d41d0f1d7` (public) |
| GA4 | `G-ZZ170WEYFW` (in `BaseLayout.astro`) |

### Decisions
- **Framework:** Astro. Pages are prerendered (static).
- **CMS:** TinaCMS + TinaCloud, with **live visual editing** (click text on the page, edit, see it update as you type).
- **Hosting: Cloudflare Workers, not Pages.** *Changed from the original plan.* Live editing needs a small on-demand server route (`/tina-island/[name]`), and Pages can't run it: it returned 405, and the editor showed "nothing to edit". Workers runs it. Branch previews still work.
- **Editing scope:** full. Pages are made of sections that can be reordered, shown or hidden, and edited, including the lists inside them.
- **Terminology:** never write "heavy infrastructure". Use "cloud infrastructure" or "data center finance".

## 2. Status

- ✅ Home page ported, with live editing on Workers (`live-editing` branch, merged).
- ✅ **About page ported** (`port-about` branch, merged). It includes the 9-role career timeline. The Philosophy text was changed from "heavy-capital builds" to "data-center and cloud-infrastructure builds".
- ✅ **Credentials page ported** (`port-credentials` branch, merged). It has Certifications, Education, 6 LinkedIn Recommendations and a closing call-to-action. The wording is kept as-is by choice, including "build-heavy finance" and the share text's "infrastructure finance". It has **no** career timeline; that's only on About.
- ✅ **Services page ported** (`port-services` branch, merged). It has 8 core-service cards, 4 numbered pillars, and 3 engagement plans with an **editable "Most popular" highlight** (an on/off toggle on each plan). The share text's "capital-intensive builds" is kept as-is by choice.
- ✅ All cleanup done: old tokens, `pages.dev` and merged-branch Site URLs removed, the Pages project removed, merged branches deleted. **No outstanding housekeeping.**
- ✅ **Industries page ported** (`port-industries` branch, merged). It has 3 industry cards and 4 "Is it time?" sign cards with a closing note. Wording is kept as-is ("build-heavy", "covenant-heavy", "capital-intensive"). The intro reads "data centers construction and real estate", which is missing commas; it's left as-is and can be fixed in the editor.
- ✅ **Footer tagline is editable site-wide** (Site Settings → Footer tagline, stored in `content/settings/site.json`). Change it once and it updates on every page; it updates live as you type.
- ✅ **Contact page ported** (`port-contact` branch, merged). It has the Web3Forms form plus the direct-contact panel. Text, dropdown options, button label, success message and the message-box hint text are editable. The access key, spam protection and field names are fixed in code.
- ⬜ **Full-site check** on `https://powercapital-cms.jr-1791.workers.dev`: every page, the nav, footer, mobile view, SEO tags and the contact form (including hCaptcha on that address). (it has the Web3Forms form). Take the real text from the old `powercapital` repo, now at `C:\dev\Powercapital`.
- ⬜ Check the whole site on Workers, then do the cutover (§7).

## 3. Versions (what's installed and working)

| Package | Version |
|---|---|
| Node | 22.x (pinned in `.nvmrc` and `engines`) |
| astro | 7.4.x |
| tinacms / @tinacms/cli | 3.15.x / 4.0.x |
| @tinacms/astro | 0.8.x (live editing without React) |
| @astrojs/cloudflare | 14.4.x (targets Workers) |
| wrangler | 4.161.x |
| cookie | 2.0.x — **pinned on purpose** (see §6) |

Don't use Node 26: Tina's `better-sqlite3` fails to compile on it. Node 20 is end-of-life.

## 4. How the code fits together

```
astro.config.mjs        output 'static', cloudflare adapter (imageService passthrough), session:false, tina()
wrangler.jsonc          Worker name "powercapital-cms" (must match the dashboard), nodejs_compat, previews: {}
tina/config.ts          schema: "settings" collection (content/settings/site.json, global, single doc) + "page" collection (content/pages/*.json) with a multi-template `blocks` list
tina/tina-lock.json     MUST be committed whenever it changes (schema edits, Tina upgrades)
content/pages/*.json    page content (SEO fields + ordered blocks): home.json, about.json, credentials.json, services.json, industries.json, contact.json
content/settings/site.json   site-wide settings: footerTagline
src/lib/tina/data.ts    getPage(slug) and getSettings() -> requestWithMetadata(client.queries...)
src/lib/tina/islands.ts editable-region registry: "page" -> PageBlocks, "footer" -> FooterContent
src/pages/tina-island/[name].ts   editor-only on-demand route (prerender = false)
src/pages/index.astro   Home: loads the page via Tina, wraps <PageBlocks> in <TinaIsland ... primary>
src/pages/about.astro   About: same pattern, slug "about", Person JSON-LD
src/pages/credentials.astro   Credentials: same pattern, slug "credentials"
src/pages/services.astro      Services: same pattern, slug "services"
src/pages/industries.astro    Industries: same pattern, slug "industries"
src/pages/contact.astro       Contact: same pattern, slug "contact"; also loads the Web3Forms client script (renders hCaptcha)
src/components/Footer.astro         loads Site Settings, wraps FooterContent in <TinaIsland name="footer"> (not primary)
src/components/FooterContent.astro  footer markup; tagline tagged with data-tina-field
src/components/PageBlocks.astro   maps each block to a component (accepts _template or __typename)
src/components/blocks/*.astro     section components; each text element has data-tina-field
src/lib/inline.ts       inline(): **bold** in text fields -> <strong>; localImg(): fixes TinaCloud image paths
scripts/copy-bridge.mjs dev-only: copies Tina's bridge.js into public/admin (see §6)
public/assets/js/main.js site JS (nav, scroll reveal, contact form)
```

### Section types (block templates) available

| Template | Component | Used on | Notes |
|---|---|---|---|
| `hero` | Hero | Home | big hero with portrait, stats, badge |
| `painPoints` | PainPoints | Home, Industries | accent-bordered cards. Options: background `theme` (plain/mint/soft), `columns` (3 or 2), `centered` heading, optional closing `note`; card body accepts **bold** |
| `positioningBanner` | PositioningBanner | Home | navy/mint centered banner |
| `process` | Process | Home | numbered steps + button |
| `ctaBand` | CtaBand | Home, About, Credentials, Services, Industries | closing call to action |
| `contactSection` | ContactSection | Contact | Web3Forms form + details panel. Editable: form heading/intro, service dropdown options (list of {text}), message hint text, button label, success message, details heading/intro, detail rows {icon, label, value}, LinkedIn label/link, profile photo/name/role. Fixed in code: access key, honeypot, hCaptcha, field names, email subject, required-field check |
| `pageHero` | PageHero | About, Credentials, Services, Industries, Contact | interior-page title banner with breadcrumb |
| `bio` | Bio | About | photo + paragraphs + checklist + button |
| `timeline` | Timeline | About | career timeline (first item = green dot) |
| `featureCards` | FeatureCards | About, Credentials, Services, Industries | icon cards. Options: background `theme` (soft/mint/plain), `columns` (3 or 2), `cardStyle` ("card" default, or "industry" = gradient top stripe + hover lift), optional `lead`; each card has icon, title, optional grey `subtitle`, body (**bold** OK) |
| `textSection` | TextSection | About | centered eyebrow, heading, paragraph |
| `recommendations` | Recommendations | Credentials | quote cards: eyebrow, heading, lead + list of {quote, name, role} |
| `numberedList` | NumberedList | Services | numbered "pillars": background theme + list of {number, title, body} |
| `plans` | Plans | Services | engagement/pricing cards: {featured toggle, badge text, name, summary, bullets, "Good fit" line}. `featured` = orange border + badge (badge defaults to "Most popular") |

Reuse these before creating new ones. Fields marked "use **bold**" accept `**text**` for emphasis.

**Rule: every list must be a list of objects, not a list of plain strings.** Example: `{ type: "object", list: true, fields: [{ name: "text", ... }] }`, rendered with `tinaField(item, "text")`. Plain string lists (`type: "string", list: true`) can be clicked and saved, but **live typing doesn't refresh them**. We hit this on the About bio paragraphs and checklist.

### Contact form notes
- Submission logic is in `public/assets/js/main.js`: required-field check, hCaptcha check, a JSON POST to Web3Forms, and a dynamic subject "New Power Capital form submission from [Name]". The success text comes from the form's `data-success` attribute (the editor's "success message"), with a built-in fallback.
- Web3Forms access key `b98fb3af-5915-41e0-9919-e3706c71046c` is in `ContactSection.astro`. It's a public form key, not a secret.
- **Dropdown options can't be clicked to edit.** The browser draws the open list itself, so Tina can't attach to it. Edit them in the side panel under *Contact Form + Details → Service dropdown options*; the page still updates live.
- hCaptcha may only allow approved domains. If it doesn't show on a preview or `workers.dev` address, add that domain in the Web3Forms/hCaptcha settings. Re-check this at cutover for `powercapital.cloud`.

### Site-wide (global) content
The footer tagline lives in the **settings** collection, not in a page. Add more site-wide text (footer links, contact email, etc.) as fields there. Render it in `FooterContent.astro` (or another component) with `tinaField(settings, "<field>")`. Pages mark their own `<TinaIsland ... primary>`, so the editor opens the page's sections first; the footer island is not primary.

### Adding a new page (pattern)
1. Add any new block templates to `tina/config.ts` and register them in `PageBlocks.astro`.
2. Create `content/pages/<slug>.json` with real text from the old site.
3. Create `src/pages/<slug>.astro` by copying `index.astro`. Change it to `getPage("<slug>")` and `params={{ slug: "<slug>" }}`.
4. Add `data-tina-field={tinaField(...)}` to every editable element in new components. Use `inline()` and `localImg()` from `src/lib/inline.ts` for bold text and images.
5. Run `npm run dev` and test, then commit, **including `tina/tina-lock.json` if it changed**.

## 5. Day-to-day workflow

**Local** (PowerShell 7, in `C:\dev\powercapital-cms`):
```powershell
npm run dev          # site: http://localhost:4321  editor: http://localhost:4321/admin/index.html#/~/
npx tinacms build --local --skip-cloud-checks -c "astro build"   # offline build check
```
Saving in the local editor writes to `content/pages/*.json` on disk.

**Branches:** one branch per piece of work (e.g. `port-about`), then push.
1. TinaCloud → **Refresh Branches**.
2. **Give the new preview its Tina settings.** On `port-about`, the first build failed until `NEXT_PUBLIC_TINA_CLIENT_ID` and `TINA_TOKEN` were added to **that branch's Preview** in Cloudflare. Cloudflare copies Previews Base settings only into *new* previews, and only if Base has them, so check **Previews Base** has both and new branches should inherit them. Until that's confirmed, check each new preview and add them there if the build says "Missing clientId, token". Then retry.
3. Get the branch's preview address from the Worker's **Previews** section.
4. Add that address to TinaCloud → **Site URLs**, so the editor can log in there.
5. Test, then merge into `main`:
   `git checkout main; git pull; git merge <branch> --no-edit; git push`

**Saving in the cloud editor** commits to that branch on GitHub and starts a rebuild. Run `git pull` before editing locally.

**Commit carefully:** name the files in `git add` instead of using `git add .`. Never commit `.env`, `*.log`, `public/admin/`, `dist/`, or `tina/__generated__/`. All of these are in `.gitignore`.

## 6. Gotchas we already hit (and fixes)

| Symptom | Cause / fix |
|---|---|
| Cloud build: "Branch is not on TinaCloud" | Commit `tina/tina-lock.json`, push, then TinaCloud → Refresh Branches. To create the file the first time, run `npx tinacms dev`, because `tinacms build` checks TinaCloud first. |
| Cloud build: 403 "not authorized to access branch" | The TinaCloud token's branch setting must be `*`. |
| Cloud build: "local GraphQL schema doesn't match remote" | `tina/tina-lock.json` changed but wasn't committed. |
| Cloud build: "Missing clientId, token" | Set them in the Worker's **Settings → Build → Build variables and secrets** for **both Production and Preview**. The runtime "Variables & Secrets" section doesn't count. **A new branch preview may not inherit them:** add them to that preview (needed for `port-about`), and/or set them in **Previews Base** so future previews get them. Then retry. |
| Live typing doesn't update some text, but clicking and saving work | That field is a plain string list. Change it to a list of objects with a `text` field (see §4). |
| Editor: "TinaCloud config is missing for domain" | Add that exact address to TinaCloud → Site URLs. |
| Editor: "nothing to edit" on a deployed site | The address is running code without live editing, e.g. `main` before a merge, or Pages. Check that `/tina-island/page?slug=...` returns 200. |
| Local dev: `/admin/bridge.js` 404 | The @tinacms/astro dev route isn't reached in this setup. `scripts/copy-bridge.mjs` runs at the start of `npm run dev` and copies it into `public/admin`. |
| Local build: "Named export 'parseCookie' not found" | Astro 7 needs `cookie@2`; an old Tina dependency installs 0.7. Fixed by pinning `cookie@^2` in `package.json`. |
| Cards/steps blank in the editor preview | The scroll fade-in (`.reveal`) ran before the editor re-rendered those sections. `main.js` now shows everything inside the editor and watches for re-rendered sections. |
| Portrait broken in the cloud build | TinaCloud rewrites image paths to `assets.tina.io`. `Hero.astro` maps them back to `/assets/img/<file>`. Reuse that helper (`localImg`) for images on new pages. |
| `npm audit` lists many vulnerabilities | They're in build tools only, and the visitor site is static. **Don't run `npm audit fix --force`** — it breaks the build. |
| Git opens a black screen (Vim) | Press Esc, type `:wq`, Enter. Git is now set to `code --wait` (VS Code). Use `--no-edit` on merges to skip the message. |
| "npm is not recognized" in a new window | Open PowerShell 7 as Administrator and run `nvm use 22`. |

## 7. Cutover (later — not yet)

Only after all 6 pages are ported and checked on Workers:
1. Add `powercapital.cloud` (and `www`) as **Custom Domains** on the Worker.
2. Update Cloudflare DNS: replace the 4 GitHub Pages `A` records and the `www` CNAME. Keep the old `powercapital` repo as a rollback.
3. Add `https://powercapital.cloud` and `https://www.powercapital.cloud` to TinaCloud Site URLs.
4. Submit `sitemap.xml` in Google Search Console (optional).

## 8. Housekeeping

**Nothing outstanding** as of 2026-11-12. Done: old TinaCloud tokens deleted; `pages.dev` and merged-branch Site URLs removed; the Cloudflare Pages project removed; merged branches deleted (`live-editing`, `port-about`, `port-credentials`, `port-services`, `port-industries`, `port-contact`).

TinaCloud **Site URLs** should contain only `http://localhost:4321` and `https://powercapital-cms.jr-1791.workers.dev`, plus the preview of whatever branch is in progress. At cutover, add `https://powercapital.cloud` and `https://www.powercapital.cloud`.

After merging each future branch:
```powershell
git branch -d <branch>
git push origin --delete <branch>
```
Then remove its preview address from TinaCloud → Site URLs. Deleted branches may linger in TinaCloud's Branches list until the next Refresh Branches; that's harmless.

## 9. Content reference (for porting)

- Palette: navy + forest green, burnt-orange accent. Fonts: Lora (headings) and Inter (body).
- Voice: company ("we", "our President"). Niche: finance leadership for cloud infrastructure, data center construction, and real estate.
- Facts: 16 yrs in finance (15 at AWS/Amazon, 2010–2025); led $12B/yr data center capex; $1B+ P&L (AWS Networking); market cap 4,241% ($56.9B → $2.47T); President of Power Capital Consulting LLC since Jun 2025; CFI certs in Construction Finance and Real Estate Appraisal; UW Foster (Grad Accounting Cert); Appalachian State (BS Intl Business, Magna Cum Laude).
- About page: vertical career timeline (current role = green dot, Amazon roles = orange dots).
- Credentials page: CFI certifications, education, and 6 LinkedIn recommendations (no timeline).
- Footer tagline (editable in Site Settings): "Fractional CFO leadership for growing companies investing in Data Center Construction."
- Contact (ported): Web3Forms (hCaptcha on). Fields: Name, Email, Company (optional), Service, Message. Services: CFO Advisory / Project CFO / Fractional CFO. Animated "Message sent!" with no page reload. **No free calls.**
- Footer: tagline (above) + "Designed and built by Kala Roberts" → https://kalaroberts.github.io/. Links, LinkedIn and copyright are fixed in code.
- SEO: canonical tags, Open Graph and Twitter cards, JSON-LD (ProfessionalService on Home, Person on About), page titles "Power Capital: <Page>".
