# Preview Setup — Validate the Home page (Astro + TinaCMS on Cloudflare Pages)

Goal: get the new Astro site building on a **Cloudflare Pages preview URL** — with
the **TinaCloud editor** working — so we can validate the Home page before porting
the other pages. **No terminal / no local npm required.** Your current live site on
GitHub Pages stays untouched the whole time.

---

## Overview of the flow
1. Put this project in a **new GitHub repo** named `powercapital-cms`.
2. Create a **TinaCloud project** pointed at that repo → get a Client ID + token.
3. Create a **Cloudflare Pages** project pointed at the same repo, with the build
   command + the two Tina env vars.
4. Cloudflare builds it and gives you a **preview URL**. Open it, check the Home page,
   and open `/admin` to try the editor.

---

## Step 1 — Put the project in GitHub (web upload, no terminal)

Keep it separate from your current site repo so nothing live is affected.

1. Go to **https://github.com/new** → name it `powercapital-cms` → **Public** (or Private;
   both work with Cloudflare + Tina) → **Create repository**.
2. On the empty repo page → **uploading an existing file**.
3. In Finder, open `~/powercapital-astro` (the local project folder — copy it out of the session workspace
   first, same as before). Select **all contents** — including the `src`, `public`,
   `content`, `tina` **folders** — and drag them in. Commit.
   - The web uploader preserves subfolders when you drag the top-level folders in.
   - Dotfiles like `.gitignore` / `.env.example` may not drag; that's fine.
   - **Do NOT upload** a `.env` file or your token — those go in env vars only (Step 3).

> If the folder upload is fussy in the browser, this is the one place GitHub Desktop
> (no terminal, syncs folders flawlessly) is worth it — but web upload works.

---

## Step 2 — Create the TinaCloud project

1. Go to **https://app.tina.io** and sign in to your TinaCloud account.
2. **Create a project** → **Connect to GitHub** → authorize and pick the
   `powercapital-cms` repo.
3. Set the **branch** TinaCloud tracks to **`main`**.
4. From the project's **Overview**, copy the **Client ID**.
5. Go to **Tokens** → create/copy a **Read-Only Token**.

Keep these two values handy for Step 3:
- `NEXT_PUBLIC_TINA_CLIENT_ID` = the Client ID
- `TINA_TOKEN` = the Read-Only token

---

## Step 3 — Create the Cloudflare Pages project

1. Go to **https://dash.cloudflare.com** → **Workers & Pages** → **Create** →
   **Pages** → **Connect to Git**.
2. Pick the `powercapital-cms` repo → **Begin setup**.
3. Build settings:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. **Environment variables** (expand "Environment variables (advanced)") — add BOTH,
   for **Production AND Preview**:
   - `NEXT_PUBLIC_TINA_CLIENT_ID` = (your Client ID)
   - `TINA_TOKEN` = (your read-only token)
5. **Save and Deploy.**

Cloudflare runs `npm install` + `npm run build` on their servers. First build takes a
couple of minutes. When it finishes you get a URL like
`https://powercapital-cms.pages.dev` (production) and per-commit preview URLs.

---

## Step 4 — Validate

- Open the deployed URL → confirm the **Home page** renders correctly (hero, pain
  points, navy banner, how-it-works, CTA, header/footer, logo, fonts).
- Open **`/admin`** on that same URL → the **TinaCMS editor** loads. Open the Home
  page and confirm you can edit text, reorder/add/remove sections, and that fields
  look right.

> The `/admin` editor only works once the TinaCloud Client ID + token are set
> (Step 3). Without them the site still renders, but the editor won't load.

---

## Important notes

- **This does NOT touch your live site.** `powercapital.cloud` keeps pointing at the
  current GitHub Pages site until we deliberately switch DNS at the very end.
- **`CNAME` file:** this project's `public/CNAME` contains `powercapital.cloud`. Leave
  it alone for now — we only use it when we cut the domain over to Cloudflare at the
  end. (It's harmless on the `.pages.dev` preview.)
- **If a build fails:** open the Cloudflare build log, copy the error, and send it over
  — we fix the code and you re-push. That's the debugging loop.
- **Secrets:** never commit `.env` or the token to the repo. They live only in
  Cloudflare's env-var settings.

---

## What to report back
- Does the Home page render correctly on the preview URL?
- Does `/admin` load and let you edit / reorder sections?
- Any build errors (paste the log)?

Once Home checks out, we port the other five pages using the same pattern.
