# Power Capital CMS — Project Notes

> Current state of the `powercapital-cms` repo, updated 2026-11-12. Replaces the
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
| Production (`main`) | `https://powercapital-cms.jr-1791.workers.dev` |
| Branch previews | One per branch, listed under the Worker's **Previews** section |
| TinaCloud project | "Power Capital Site", client ID `aa8e00fd-4923-40cc-abc5-791d41d0f1d7` (public) |
| GA4 | `G-ZZ170WEYFW` (in `BaseLayout.astro`) |

### Decisions
- **Framework:** Astro. Pages are prerendered (static).
- **CMS:** TinaCMS + TinaCloud, with **live visual editing** (click text on the page, edit, see it update as you type).
- **Hosting: Cloudflare Workers, not Pages.** *Changed from the original plan.* Live editing needs a small on-demand server route (`/tina-island/[name]`), and Pages can't run it: it returned 405, and the editor showed "nothing to edit". Workers runs it. Branch previews still work.
- **Editing scope:** full. Pages are made of sections that can be reordered, shown or hidden, and edited, including the lists inside them.
- **Terminology:** never write "heavy infrastructure". Use "cloud infrastructure" or "data center finance".

## 2. Status

- ✅ Home page ported, editable in Tina, and live editing works on the Workers preview.
- ✅ `live-editing` branch merged into `main`.
- ⬜ Check that `main` builds and that live editing works on the production `workers.dev` address.
- ⬜ Port **About, Credentials, Services, Industries**, then **Contact** last (it has the Web3Forms form). Take the real text from the old `powercapital` repo.
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
tina/config.ts          schema: "page" collection (content/pages/*.json) with a multi-template `blocks` list
tina/tina-lock.json     MUST be committed whenever it changes (schema edits, Tina upgrades)
content/pages/home.json Home content (SEO fields + ordered blocks)
src/lib/tina/data.ts    getPage(slug) -> requestWithMetadata(client.queries.page(...))
src/lib/tina/islands.ts editable-region registry ("page" island -> PageBlocks)
src/pages/tina-island/[name].ts   editor-only on-demand route (prerender = false)
src/pages/index.astro   loads the page via Tina, wraps <PageBlocks> in <TinaIsland ... primary>
src/components/PageBlocks.astro   maps each block to a component (accepts _template or __typename)
src/components/blocks/*.astro     section components; each text element has data-tina-field
scripts/copy-bridge.mjs dev-only: copies Tina's bridge.js into public/admin (see §6)
public/assets/js/main.js site JS (nav, scroll reveal, contact form)
```

### Adding a new page (pattern)
1. Add any new block templates to `tina/config.ts` and register them in `PageBlocks.astro`.
2. Create `content/pages/<slug>.json` with real text from the old site.
3. Create `src/pages/<slug>.astro` by copying `index.astro`. Change it to `getPage("<slug>")` and `params={{ slug: "<slug>" }}`.
4. Add `data-tina-field={tinaField(...)}` to every editable element in new components.
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
2. Get the branch's preview address from the Worker's **Previews** section.
3. Add that address to TinaCloud → **Site URLs**, so the editor can log in there.
4. Test, then merge into `main`:
   `git checkout main; git pull; git merge <branch> --no-edit; git push`

**Saving in the cloud editor** commits to that branch on GitHub and starts a rebuild. Run `git pull` before editing locally.

**Commit carefully:** name the files in `git add` instead of using `git add .`. Never commit `.env`, `*.log`, `public/admin/`, `dist/`, or `tina/__generated__/`. All of these are in `.gitignore`.

## 6. Gotchas we already hit (and fixes)

| Symptom | Cause / fix |
|---|---|
| Cloud build: "Branch is not on TinaCloud" | Commit `tina/tina-lock.json`, push, then TinaCloud → Refresh Branches. To create the file the first time, run `npx tinacms dev`, because `tinacms build` checks TinaCloud first. |
| Cloud build: 403 "not authorized to access branch" | The TinaCloud token's branch setting must be `*`. |
| Cloud build: "local GraphQL schema doesn't match remote" | `tina/tina-lock.json` changed but wasn't committed. |
| Cloud build: "Missing clientId, token" | Set them in the Worker's **Settings → Build → Build variables and secrets** for **both Production and Preview**. The runtime "Variables & Secrets" section doesn't count. |
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

## 8. Cleanup still to do

- TinaCloud: delete old tokens and remove the `pages.dev` Site URLs.
- Cloudflare: delete the old **Pages** project `powercapital-cms`, or turn off its builds. **Not the Worker with the same name.**
- Update `README.md` and `PREVIEW_SETUP.md`. They still describe the Pages setup.

## 9. Content reference (for porting)

- Palette: navy + forest green, burnt-orange accent. Fonts: Lora (headings) and Inter (body).
- Voice: company ("we", "our President"). Niche: finance leadership for cloud infrastructure, data center construction, and real estate.
- Facts: 16 yrs in finance (15 at AWS/Amazon, 2010–2025); led $12B/yr data center capex; $1B+ P&L (AWS Networking); market cap 4,241% ($56.9B → $2.47T); President of Power Capital Consulting LLC since Jun 2025; CFI certs in Construction Finance and Real Estate Appraisal; UW Foster (Grad Accounting Cert); Appalachian State (BS Intl Business, Magna Cum Laude).
- Credentials page: vertical career timeline (current role = green dot, Amazon roles = orange dots) and 6 LinkedIn recommendations.
- Contact: Web3Forms (hCaptcha on). Fields: Name, Email, Company (optional), Service, Message. Services: CFO Advisory / Project CFO / Fractional CFO. Animated "Message sent!" with no page reload. **No free calls.**
- Footer: "Fractional CFO leadership for growing companies investing in Data Center Construction." + "Designed and built by Kala Roberts" → https://kalaroberts.github.io/
- SEO: canonical tags, Open Graph and Twitter cards, JSON-LD (ProfessionalService on Home, Person on About), page titles "Power Capital: <Page>".
