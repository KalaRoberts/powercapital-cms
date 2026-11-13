# Power Capital Website: Your Editing Account Setup

This guide sets up your own login for editing the Power Capital website. It takes about 20–30 minutes. Kala can walk you through it on a screen-share, or you can follow it on your own and send Kala the two items in Step 4.

You'll create two free accounts:
- **GitHub**, where the website's files are stored
- **TinaCloud**, the editor you'll use to change text and images on the site. You sign in to it with your GitHub account.

**Before you start:** have your phone handy. GitHub asks you to set up a security code app or text messages.

---

## Step 1: Create your GitHub account (about 5 minutes)

1. Go to **https://github.com/signup**.
2. Enter **your own email address**. Use one you'll keep long-term, such as your business email.
3. Choose a password and a username (for example `jroberts-powercapital`).
4. Check your email for GitHub's code and enter it.
5. If GitHub offers a paid plan, choose **Free**.
6. **Set up two-factor authentication** when GitHub asks (or under Settings → Password and authentication):
   - Using an authenticator app on your phone, such as Google Authenticator or Microsoft Authenticator, is the most reliable option.
   - **Save the recovery codes** GitHub shows you somewhere safe, such as a password manager or a printed copy. They're the only way back in if you lose your phone.
7. **Send Kala your GitHub username** (not your password).

## Step 2: Accept the invitation to the website files (about 1 minute)

1. Kala will invite you to the website's files, called the `powercapital-cms` repository.
2. You'll get an email from GitHub. Click **View invitation**, then **Accept invitation**.
   - You can also find it at **https://github.com/KalaRoberts/powercapital-cms/invitations** while signed in.

## Step 3: Create your TinaCloud account and project (about 10 minutes)

1. Go to **https://app.tina.io** and choose **Sign in with GitHub**. Approve the permissions it asks for.
2. If TinaCloud offers a plan, choose **Free**.
3. Click to create a **new project** and connect it to a GitHub repository.
   - If GitHub asks which repositories TinaCloud may use, allow **KalaRoberts/powercapital-cms**, or "All repositories".
4. Choose the repository **powercapital-cms**.
5. Fill in the project settings:
   - **Project name:** `Power Capital Site`
   - **Site URLs:** add each of these on its own line. They tell TinaCloud which web addresses can use the editor.
     ```
     http://localhost:4321
     https://powercapital-cms.jr-1791.workers.dev
     https://*-powercapital-cms.jr-1791.workers.dev
     https://powercapital.cloud
     https://www.powercapital.cloud
     ```
   - **Advanced settings → Path to Tina folder:** leave it **blank**.
6. Click **Save** or **Create project**.
7. Open the **Media** tab and click **Sync Media**. This lets the editor show the site's images.
8. Open the **Tokens** tab and click **New token**:
   - **Type:** Content (read-only)
   - **Name:** `Website build`
   - **Git branches:** `*` (just an asterisk)
   - Click **Create**.

## Step 4: Send Kala two items, securely

Kala needs these to connect the website to your new project:

| Item | Where to find it | Private? |
|---|---|---|
| **Client ID** | Project → **Overview** tab | No, this one is safe to share |
| **Content token** | Project → **Tokens** tab → the "Website build" token | **Yes. Treat it like a password.** |

**Please don't send the token by regular email or text.** Instead, either:
- paste it into a password manager's secure share, such as 1Password or Bitwarden Send, or
- read it out on the call so Kala can enter it directly.

## Step 5: (Optional) Add Kala to your project

So Kala can still help with the editor later:
1. In your TinaCloud project, open **Collaborators** (or **User management**).
2. Invite Kala's email: **karoberts2014@gmail.com**.

Your free plan includes 2 users: you and Kala.

## Step 6: Try the editor (after Kala confirms the connection)

1. Go to **https://powercapital-cms.jr-1791.workers.dev/admin/index.html#/~/**. After the site moves to its own address, this becomes **https://powercapital.cloud/admin/index.html#/~/**.
2. Sign in with your TinaCloud account.
3. Click any text on the page and type a small change, then click **Save**.
4. Wait about 5 minutes and reload the page in a normal browser window. Your change should be live.
5. Change it back and save.

Kala will send a separate guide covering everyday editing.

---

### If something goes wrong
- **"Repository not found" in TinaCloud:** check that you accepted the GitHub invitation in Step 2. Then, in TinaCloud, reconnect GitHub and allow access to `powercapital-cms`.
- **The image picker says "Media needs to be turned on":** go to your project's **Media** tab and click **Sync Media**.
- **Locked out of GitHub:** use one of the recovery codes you saved in Step 1.
- **Anything else:** take a screenshot and send it to Kala.
