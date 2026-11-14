# Preview Setup — Branch previews on Cloudflare Workers

How to work on a change (for example, porting a page) on its own branch and check it on a **Cloudflare Workers preview**, with the **Tina live editor** working, before it goes to `main`. **Merging to `main` publishes to the live site, `powercapital.cloud`**, so check on the preview first.

> One-time setup (Worker, TinaCloud project, build variables) is already done. It's described at the end in case it ever has to be redone.

---

## Per-change workflow

### 1. Create a branch
```powershell
cd C:\dev\powercapital-cms
git checkout main
git pull
git checkout -b port-about        # one branch per piece of work
```

### 2. Work and test locally
```powershell
npm run dev
```
- Site: `http://localhost:4321`
- Editor: `http://localhost:4321/admin`. Click text, type, and check the page updates.

### 3. Commit and push
Name the files in `git add` (avoid `git add .`). If `tina/tina-lock.json` changed, **commit it**: the cloud build fails without it.
```powershell
git status
git add <the files you changed> tina/tina-lock.json
git commit -m "Port About page"
git push -u origin port-about
```

### 4. TinaCloud + Cloudflare settings
1. **app.tina.io →** top-left dropdown: select **John's organization** → **Power Capital Site** (client ID `0a2ead54-1e42-49c6-be31-bd39ee5b0cec`) **→ Refresh Branches.** Wait for the new branch to show as indexed.
2. **Cloudflare:** if the branch's first build fails with "Missing clientId, token", add `NEXT_PUBLIC_TINA_CLIENT_ID` and `TINA_TOKEN` to **that branch's Preview** (or to **Previews Base**, so future branches inherit them), then retry. `port-about` needed this.
3. **Site URLs:** nothing to add. The wildcard `https://*-powercapital-cms.jr-1791.workers.dev` already covers every branch preview.

### 5. Check the Cloudflare preview
1. **Workers & Pages → `powercapital-cms` (the Worker) → Previews.** Open the branch's preview address.
2. Check the pages look right.
3. Open `<preview address>/admin`, log in, click a heading, and type. The page should update live.
   - If it doesn't, press F12 → Network → filter `tina-island`. It should return **200**.
4. Build failed? Open the build under *Deployments → View build history* and copy the log.

### 6. Merge into `main`
```powershell
git checkout main
git pull
git merge port-about --no-edit
git push
```
`main` builds and deploys to the **live site**, `https://powercapital.cloud` (also at `https://powercapital-cms.jr-1791.workers.dev`), within a few minutes. If a deploy fails with `[code: 10013]`, retry the build.

### 7. Tidy up
```powershell
git branch -d port-about
git push origin --delete port-about
```
No Site URL cleanup is needed, because of the wildcard.

---

## Common build errors

| Error | Fix |
|---|---|
| "Branch is not on TinaCloud" | Commit `tina/tina-lock.json`, push, then **Refresh Branches**. |
| 403 "not authorized to access branch" | The TinaCloud token's branch access must be `*`. |
| "local GraphQL schema doesn't match remote" | `tina/tina-lock.json` changed but wasn't committed. |
| "Missing clientId, token" | Set both variables in *Settings → Build → Build variables and secrets* for **Production and Preview**. A new branch preview may need them added to it directly (or via Previews Base). |
| Editor: "config is missing for domain" | Add that exact address to TinaCloud **Site URLs** (John's project). |
| Deploy fails `[code: 10013]` | Temporary Cloudflare error. Retry the build. |
| Saved in the editor but no deploy shows | Refresh Cloudflare's Deployments page. Check GitHub for the TinaCloud commit. |

More in **PROJECT-NOTES.md §6**.

---

## One-time setup (reference)

1. **TinaCloud:** John's project "Power Capital Site" (client ID `0a2ead54-1e42-49c6-be31-bd39ee5b0cec`, in John's organization; Kala is an Admin collaborator), connected to `KalaRoberts/powercapital-cms`. *Path to Tina Folder* left **blank**. Content token with branch access `*`. Media synced. (Kala's old project `aa8e00fd-…` is kept as an unconnected fallback.)
2. **Cloudflare:** *Workers & Pages → Create application → GitHub →* `powercapital-cms`
   - Worker name `powercapital-cms` (must match `wrangler.jsonc`)
   - Production branch `main` · preview builds **on** for other branches
   - Build `npm run build` · Deploy `npx wrangler deploy` · Preview `npx wrangler preview`
   - Build variables and secrets (Production **and** Preview): `NEXT_PUBLIC_TINA_CLIENT_ID`, `TINA_TOKEN` (secret)
3. **TinaCloud Site URLs:** `https://powercapital.cloud`, `https://www.powercapital.cloud`, `https://powercapital-cms.jr-1791.workers.dev`, `https://*-powercapital-cms.jr-1791.workers.dev` (all previews), `http://localhost:4321`.
4. **Custom domains** on the Worker: `powercapital.cloud`, `www.powercapital.cloud`.

---

## Important notes

- **`main` is the live site** (`powercapital.cloud`, cutover 2026-11-14; see PROJECT-NOTES.md §7). Test on a branch preview first.
- **`public/CNAME`** is a harmless leftover from GitHub Pages.
- **Secrets:** never commit `.env` or a token. They live only in Cloudflare build settings.
