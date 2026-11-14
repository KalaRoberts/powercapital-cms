# Full-Site Check & Cutover Plan

> ✅ **COMPLETE — 2026-11-14.** Every phase is done. `powercapital.cloud` is live on Cloudflare Workers. Editing runs through John's TinaCloud project (client ID `0a2ead54-1e42-49c6-be31-bd39ee5b0cec`). The client owns Cloudflare and GA4; Kala stays on as a Cloudflare admin. This file now serves as a record, plus the rollback steps at the bottom.
>
> **Kept as fallbacks, not deleted:** the old GitHub Pages repo (`KalaRoberts/powercapital`, with Pages still on), Kala's old TinaCloud project (`aa8e00fd-…`), and `public/CNAME`.
>
> **GA4 tested 2026-11-14:** all custom events arrive in Realtime.

> Goal: replace the old GitHub Pages site at **powercapital.cloud** with the new Astro + TinaCMS site on Cloudflare Workers, and hand editing over to the client.
>
> **Ownership:** the client owns `powercapital.cloud` and the Cloudflare account (DNS + the Worker). Kala stays on as an admin after handover (Phase 6, updated 2026-11-14). The GitHub repo stays in Kala's account. Work top to bottom. **Don't touch DNS until Phases 1–3 are done.**

---

## Phase 0 — Prep fixes (branch `cutover-prep`) ✅ merged 2026-11-13

Already written, waiting to be committed:
- [x] **`public/sitemap.xml`** now lists the new addresses (`/about`, not `/about.html`).
- [x] **`public/_redirects`** sends old `.html` addresses (Google results, shared LinkedIn links, bookmarks) to the new pages with permanent (301) redirects.

Test after the branch preview builds:
- [x] `<preview>/about.html` lands on `<preview>/about`, and the same for each of the 6 pages.
- [x] `<preview>/sitemap.xml` shows the new addresses.

---

## Phase 0.5 — Google Analytics custom dimensions (branch `ga-dimensions`) ✅

The GA4 property `G-ZZ170WEYFW` belongs to the client (John). Finish this before the switch, so the new site's reports are complete from launch day.
- [x] Code: `page_type` on every hit; events `contact_cta_click` (`cta_location`, `cta_text`), `linkedin_click` (`link_location`, `cta_text`) and `generate_lead` (`form_service`). Nothing is tracked inside the editor, and no personal details are sent.
- [x] GA4 Admin → Custom definitions: 5 event-scoped dimensions (Page type, CTA location, CTA text, Link location, Form service).
- [x] **Tested on the live site (2026-11-14)** in GA4 Realtime: `contact_cta_click`, `linkedin_click` and `generate_lead` (with `form_service`) all arrive. A fix was needed first: `gtag` wasn't global (`window.gtag` in `BaseLayout.astro`; see PROJECT-NOTES §6).

---

## Phase 1 — Full-site check (on `https://powercapital-cms.jr-1791.workers.dev`) ✅

Check each page side by side with the live `powercapital.cloud`.

### Every page (Home, About, Credentials, Services, Industries, Contact)
- [x] Looks the same as the live page: sections, order, colors, fonts (Lora headings, Inter body), icons
- [x] All images load (portrait, profile photo, logo)
- [x] Wording matches the live page, apart from changes you approved
- [x] No "heavy infrastructure" anywhere
- [x] Header menu: every link works, and the current page is highlighted
- [x] Footer: tagline, links, LinkedIn, copyright year, "Designed and built by Kala Roberts" link
- [x] Every button and link goes to the right place (Contact Us → `/contact`, LinkedIn opens in a new tab)
- [x] Scroll fade-in works; nothing stays invisible
- [x] Browser tab title reads "Power Capital: <Page>" (Home: as set in the editor)

### Mobile (phone, or browser DevTools → device toolbar)
- [x] Menu button opens and closes the menu
- [x] Nothing spills off the side; cards stack into one column
- [x] Contact form is usable on a phone

### Contact form (on the workers.dev address)
- [x] hCaptcha box appears. If not, add `powercapital-cms.jr-1791.workers.dev` to the allowed domains in Web3Forms / hCaptcha.
- [x] Empty submit shows the required-fields message
- [x] Submit without hCaptcha shows the "I am human" prompt
- [x] A real test message arrives with subject "New Power Capital form submission from <name>"
- [x] The "Message sent!" pop-up appears with no page reload

### Search & sharing
- [x] View source on each page: `<link rel="canonical">` points to `https://powercapital.cloud/<page>`
- [x] Share preview looks right. Paste the workers.dev link into the LinkedIn Post Inspector or opengraph.xyz: title, description, og-cover image.
- [x] GA4: open the site, then check GA4 → Reports → Realtime shows a visit (ID `G-ZZ170WEYFW`)
- [x] `/robots.txt` and `/sitemap.xml` load

### Editor
- [x] Menu Label on each page: rename one, save, and the menu and footer update within about 5 minutes; the breadcrumb follows; the url is unchanged
- [x] Media Manager opens and shows images (media sync is on)
- [x] `/admin/index.html#/~/<page>` works for all 6 pages: click text, type, the page updates, Save works
- [x] Footer tagline editable from any page
- [x] A save on `main` triggers a rebuild, and the change appears on the site in about 2–3 minutes

---

## Phase 2 — Client editor access (TinaCloud) ✅

**Goal:** the client edits with their own TinaCloud account, and Kala's free plan keeps its second seat.

**What TinaCloud's docs say (checked 2026-11-12):**
- A TinaCloud **project** links TinaCloud to one GitHub repo. Editors must be added in **User Management** and then given access in the project's **Collaborators** tab.
- The **Free plan includes 2 users**. Team is $29 per project per month with 3 users, plus $9 per extra seat.
- A project's repo can be changed later in Configuration ("Change Repository").

**Recommended approach: the client owns their own TinaCloud project.**
1. **Client creates a GitHub account**, if they don't have one.
2. **Kala adds the client to the repo:** GitHub → `KalaRoberts/powercapital-cms` → Settings → Collaborators → Add people (role: **Write**). The client accepts the email invite.
   - **Decided (2026-11-12): the repo stays in Kala's account** (`KalaRoberts`). The client gets Write access only; Cloudflare and the existing connections stay as they are.
3. **Client creates a TinaCloud account** at app.tina.io, signing in with GitHub.
4. **Client creates a TinaCloud project** connected to `powercapital-cms`:
   - Path to Tina folder: **blank**
   - Site URLs: `http://localhost:4321`, `https://powercapital-cms.jr-1791.workers.dev`, and at cutover `https://powercapital.cloud` and `https://www.powercapital.cloud`. A glob such as `https://*-powercapital-cms.jr-1791.workers.dev` should cover branch previews, since TinaCloud supports glob patterns in Site URLs.
   - Tokens → create a **content token** with branch access `*`
   - Media → **Sync Media**, if the editor's image picker says "Media needs to be turned on"
5. **Client sends Kala** the new **Client ID** (public) and **content token** (private; share it securely, not by email).
6. **Kala updates Cloudflare:** Worker → Settings → Build → Build variables and secrets. Replace `NEXT_PUBLIC_TINA_CLIENT_ID` and `TINA_TOKEN` for **Production and Previews Base**. Rebuild `main`.
7. **Optional:** the client adds Kala as a collaborator on *their* project (using their 2nd seat), so Kala can still help in the editor.
8. Once the client's project works, **delete Kala's old "Power Capital Site" project**, so two projects aren't watching one repo.
9. Update the client ID in `PROJECT-NOTES.md` and `README.md`.

**Not confirmed:**
- **Whether the client needs Write access to the GitHub repo** to create the project and save. TinaCloud commits through its GitHub app, but setting up the project requires authorizing a repo the account can see.
- **Whether a user added to another account's project counts as one of that owner's 2 seats.** I believe it does, which is why the client owns the project.

Check both in TinaCloud while setting up.

**Client handover** (send with their login):
- How to edit: go to `https://powercapital.cloud/admin/index.html#/~/`, log in, click text, type, Save. Changes appear in about 2–3 minutes.
- Site Settings → Footer tagline changes the footer everywhere.
- Contact form dropdown options are edited in the side panel. They can't be clicked on the page.
- Bold text: wrap it in `**double asterisks**`.
- Don't edit SEO fields unless you mean to; they affect Google results and link previews.

---

## Phase 3 — Pre-cutover checklist ✅
- [x] Phase 0 merged to `main`; Phase 1 all ticked
- [x] Client's TinaCloud project works on the workers.dev address (Phase 2)
- [x] **Write down the current DNS records** for `powercapital.cloud` (Cloudflare → DNS → Records → screenshot or export). This is the rollback.
- [x] Note which records **must not be touched**: any **MX**, **TXT** (SPF/DKIM/verification), or other records not listed below. Deleting them can break email.
- [x] Pick a quiet time; the switch-over takes minutes, but allow an hour to test.

---

## Phase 4 — Cutover (DNS) ✅

Current records to replace (from the original handoff):
- 4 × `A` `powercapital.cloud` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (GitHub Pages)
- `CNAME` `www` → `kalaroberts.github.io`

Steps:
1. Cloudflare → **DNS → Records**: delete **only** the 4 GitHub Pages `A` records and the `www` CNAME. Leave everything else.
2. Cloudflare → Workers & Pages → **powercapital-cms** (Worker) → Settings → **Domains & Routes → Add → Custom domain**:
   - `powercapital.cloud`
   - `www.powercapital.cloud`
   
   Cloudflare creates the DNS records and the HTTPS certificate itself. It may refuse if an old record still exists; that's why step 1 comes first.
3. Wait for both domains to show **Active**. HTTPS may take a few minutes.
4. **TinaCloud** (client's project) → Site URLs: confirm `https://powercapital.cloud` and `https://www.powercapital.cloud` are there.
5. **Web3Forms / hCaptcha:** confirm `powercapital.cloud` is still an allowed domain.
6. **Old GitHub Pages repo** (`powercapital`): Settings → Pages → remove the custom domain, so GitHub stops trying to serve it. **Keep the repo** as the rollback.

---

## Phase 5 — After cutover ✅
- [x] `https://powercapital.cloud` and `https://www.powercapital.cloud` both load the new site with a padlock
- [x] `https://powercapital.cloud/about.html` redirects to `/about` (and the other old addresses)
- [x] Contact form: send one real message from the live domain
- [x] Editor: log in at `https://powercapital.cloud/admin/index.html#/~/` (client and Kala), edit and save
- [x] GA4 Realtime shows visits on the live domain
- [x] GA4 custom events: Contact buttons, LinkedIn, one test form (`generate_lead`)
- [x] Google Search Console: Domain property verified through Cloudflare (TXT record kept), `https://powercapital.cloud/sitemap.xml` submitted, home page indexing requested, John added as Owner
- [x] LinkedIn Post Inspector: re-scrape `https://powercapital.cloud` so link previews refresh
- [x] Update `PROJECT-NOTES.md`: live domain now served by the Worker; GitHub Pages retired

### `www` vs bare domain
Both work after step 2. Canonical tags point to `https://powercapital.cloud`, so Google treats the bare domain as the main one. A redirect from `www` to the bare domain is optional (Cloudflare Rules → Redirect Rules).

---

## Phase 6 — Cloudflare handover ✅

**Updated 2026-11-14:** the client owns `powercapital.cloud` and the Cloudflare account, including the Worker. **Kala stays on as an admin** for ongoing maintenance, so nothing below depends on her access being removed.

- [x] Client's TinaCloud client ID and token are in the Worker build variables (Production and Previews Base), and a build has passed with them.
- [x] GitHub connection builds on every push to `main`.
- [x] Client knows where build logs are, how to retry a build, where the two build secrets live, and that the email DNS records (MX, TXT) must be left alone.

**If Kala is ever removed as an admin:** first have the client, logged in as themselves, create a new Workers Builds API token (Worker → Settings → Build → API token). Then push a test commit and check that the build passes. Workers Builds uses a token tied to the user who set up builds (currently Kala), so builds might stop when her user leaves the account; this isn't confirmed.

---

## Rollback (if something goes badly wrong)

> Kala (still a Cloudflare admin) or the client can do steps 1–2. The old GitHub Pages setting was **left on** on purpose, so step 3 may already be in place.

Steps 1–2 need Cloudflare access (Kala or the client). Step 3 is in Kala's GitHub account.
1. Worker → Domains & Routes → remove the `powercapital.cloud` and `www` custom domains.
2. DNS: re-add the 4 GitHub Pages `A` records and the `www` CNAME (from your Phase 3 screenshot), all **DNS only (grey cloud)**.
3. Old `powercapital` repo → Settings → Pages → re-enter `powercapital.cloud` as the custom domain; enforce HTTPS.

The old site comes back within minutes, though HTTPS on GitHub Pages can take longer to reissue.
