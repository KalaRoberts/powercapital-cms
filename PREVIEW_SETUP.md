# Preview Setup — Branch previews on Cloudflare Workers

How to work on a change (for example, porting a page) on its own branch and check it on a **Cloudflare Workers preview**, with the **Tina live editor** working, before it goes to `main`. The live site at `powercapital.cloud` (GitHub Pages) is never touched.

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
- Editor: `http://localhost:4321/admin/index.html#/~/`. Click text, type, and check the page updates.

### 3. Commit and push
Name the files in `git add` (avoid `git add .`). If `tina/tina-lock.json` changed, **commit it**: the cloud build fails without it.
```powershell
git status
git add <the files you changed> tina/tina-lock.json
git commit -m "Port About page"
git push -u origin port-about
```

### 4. TinaCloud + Cloudflare settings
1. **app.tina.io → Power Capital Site → Configuration → Refresh Branches.** Wait for the new branch to show as indexed.
2. **Cloudflare:** if the branch's first build fails with "Missing clientId, token", add `NEXT_PUBLIC_TINA_CLIENT_ID` and `TINA_TOKEN` to **that branch's Preview** (or to **Previews Base**, so future branches inherit them), then retry. `port-about` needed this.
3. **Site URLs:** add the branch's preview address (step 5) so the editor can log in there.

### 5. Check the Cloudflare preview
1. **Workers & Pages → `powercapital-cms` (the Worker) → Previews.** Open the branch's preview address.
2. Check the pages look right.
3. Open `<preview address>/admin/index.html#/~/`, log in, click a heading, and type. The page should update live.
   - If it doesn't, press F12 → Network → filter `tina-island`. It should return **200**.
4. Build failed? Open the build under *Deployments → View build history* and copy the log.

### 6. Merge into `main`
```powershell
git checkout main
git pull
git merge port-about --no-edit
git push
```
`main` builds to `https://powercapital-cms.jr-1791.workers.dev` (Home at `/`, other pages at `/<slug>`). That's still **not** `powercapital.cloud`.

### 7. Tidy up
```powershell
git branch -d port-about
git push origin --delete port-about
```
Remove the branch's preview address from TinaCloud **Site URLs**.

---

## Common build errors

| Error | Fix |
|---|---|
| "Branch is not on TinaCloud" | Commit `tina/tina-lock.json`, push, then **Refresh Branches**. |
| 403 "not authorized to access branch" | The TinaCloud token's branch access must be `*`. |
| "local GraphQL schema doesn't match remote" | `tina/tina-lock.json` changed but wasn't committed. |
| "Missing clientId, token" | Set both variables in *Settings → Build → Build variables and secrets* for **Production and Preview**. A new branch preview may need them added to it directly (or via Previews Base). |
| Editor: "config is missing for domain" | Add that exact address to TinaCloud **Site URLs**. |

More in **PROJECT-NOTES.md §6**.

---

## One-time setup (reference)

1. **TinaCloud:** project "Power Capital Site" connected to `KalaRoberts/powercapital-cms`. *Path to Tina Folder* left **blank**. Content token with branch access `*`.
2. **Cloudflare:** *Workers & Pages → Create application → GitHub →* `powercapital-cms`
   - Worker name `powercapital-cms` (must match `wrangler.jsonc`)
   - Production branch `main` · preview builds **on** for other branches
   - Build `npm run build` · Deploy `npx wrangler deploy` · Preview `npx wrangler preview`
   - Build variables and secrets (Production **and** Preview): `NEXT_PUBLIC_TINA_CLIENT_ID`, `TINA_TOKEN` (secret)
3. **TinaCloud Site URLs:** `http://localhost:4321`, the production `workers.dev` address, and each branch preview.

---

## Important notes

- **powercapital.cloud is untouched** until the deliberate DNS cutover (PROJECT-NOTES.md §7).
- **`public/CNAME`** holds `powercapital.cloud` for that cutover. Leave it alone.
- **Secrets:** never commit `.env` or a token. They live only in Cloudflare build settings.
