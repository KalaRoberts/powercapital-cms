# Full-Site Check & Cutover Plan

> Goal: replace the old GitHub Pages site at **powercapital.cloud** with the new Astro + TinaCMS site on Cloudflare Workers, and hand editing over to the client. Work top to bottom. **Don't touch DNS until Phases 1–3 are done.**

---

## Phase 0 — Prep fixes (branch `cutover-prep`)

Already written, waiting to be committed:
- [ ] **`public/sitemap.xml`** now lists the new addresses (`/about`, not `/about.html`).
- [ ] **`public/_redirects`** sends old `.html` addresses (Google results, shared LinkedIn links, bookmarks) to the new pages with permanent (301) redirects.

Test after the branch preview builds:
- [ ] `<preview>/about.html` lands on `<preview>/about`, and the same for each of the 6 pages.
- [ ] `<preview>/sitemap.xml` shows the new addresses.

---

## Phase 1 — Full-site check (on `https://powercapital-cms.jr-1791.workers.dev`)

Check each page side by side with the live `powercapital.cloud`.

### Every page (Home, About, Credentials, Services, Industries, Contact)
- [ ] Looks the same as the live page: sections, order, colors, fonts (Lora headings, Inter body), icons
- [ ] All images load (portrait, profile photo, logo)
- [ ] Wording matches the live page, apart from changes you approved
- [ ] No "heavy infrastructure" anywhere
- [ ] Header menu: every link works, and the current page is highlighted
- [ ] Footer: tagline, links, LinkedIn, copyright year, "Designed and built by Kala Roberts" link
- [ ] Every button and link goes to the right place (Contact Us → `/contact`, LinkedIn opens in a new tab)
- [ ] Scroll fade-in works; nothing stays invisible
- [ ] Browser tab title reads "Power Capital: <Page>" (Home: as set in the editor)

### Mobile (phone, or browser DevTools → device toolbar)
- [ ] Menu button opens and closes the menu
- [ ] Nothing spills off the side; cards stack into one column
- [ ] Contact form is usable on a phone

### Contact form (on the workers.dev address)
- [ ] hCaptcha box appears. If not, add `powercapital-cms.jr-1791.workers.dev` to the allowed domains in Web3Forms / hCaptcha.
- [ ] Empty submit shows the required-fields message
- [ ] Submit without hCaptcha shows the "I am human" prompt
- [ ] A real test message arrives with subject "New Power Capital form submission from <name>"
- [ ] The "Message sent!" pop-up appears with no page reload

### Search & sharing
- [ ] View source on each page: `<link rel="canonical">` points to `https://powercapital.cloud/<page>`
- [ ] Share preview looks right. Paste the workers.dev link into the LinkedIn Post Inspector or opengraph.xyz: title, description, og-cover image.
- [ ] GA4: open the site, then check GA4 → Reports → Realtime shows a visit (ID `G-ZZ170WEYFW`)
- [ ] `/robots.txt` and `/sitemap.xml` load

### Editor
- [ ] `/admin/index.html#/~/<page>` works for all 6 pages: click text, type, the page updates, Save works
- [ ] Footer tagline editable from any page
- [ ] A save on `main` triggers a rebuild, and the change appears on the site in about 2–3 minutes

---

## Phase 2 — Client editor access (TinaCloud)

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

## Phase 3 — Pre-cutover checklist
- [ ] Phase 0 merged to `main`; Phase 1 all ticked
- [ ] Client's TinaCloud project works on the workers.dev address (Phase 2)
- [ ] **Write down the current DNS records** for `powercapital.cloud` (Cloudflare → DNS → Records → screenshot or export). This is the rollback.
- [ ] Note which records **must not be touched**: any **MX**, **TXT** (SPF/DKIM/verification), or other records not listed below. Deleting them can break email.
- [ ] Pick a quiet time; the switch-over takes minutes, but allow an hour to test.

---

## Phase 4 — Cutover (DNS)

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

## Phase 5 — After cutover
- [ ] `https://powercapital.cloud` and `https://www.powercapital.cloud` both load the new site with a padlock
- [ ] `https://powercapital.cloud/about.html` redirects to `/about` (and the other old addresses)
- [ ] Contact form: send one real message from the live domain
- [ ] Editor: log in at `https://powercapital.cloud/admin/index.html#/~/` (client and Kala), edit and save
- [ ] GA4 Realtime shows visits on the live domain
- [ ] Google Search Console: submit `https://powercapital.cloud/sitemap.xml` and request indexing of the home page
- [ ] LinkedIn Post Inspector: re-scrape `https://powercapital.cloud` so link previews refresh
- [ ] Update `PROJECT-NOTES.md`: live domain now served by the Worker; GitHub Pages retired

### `www` vs bare domain
Both work after step 2. Canonical tags point to `https://powercapital.cloud`, so Google treats the bare domain as the main one. A redirect from `www` to the bare domain is optional (Cloudflare Rules → Redirect Rules).

---

## Rollback (if something goes badly wrong)
1. Worker → Domains & Routes → remove the `powercapital.cloud` and `www` custom domains.
2. DNS: re-add the 4 GitHub Pages `A` records and the `www` CNAME (from your Phase 3 screenshot), all **DNS only (grey cloud)**.
3. Old `powercapital` repo → Settings → Pages → re-enter `powercapital.cloud` as the custom domain; enforce HTTPS.

The old site comes back within minutes, though HTTPS on GitHub Pages can take longer to reissue.
