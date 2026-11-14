# Power Capital Site Editing Account Setup

Follow this guide to take over controls of powercapital.cloud and setup the ability for non-tech users to edit the site.

You'll create two free accounts:
- **GitHub**, the repository where the website's files are stored. This will remain free unless you upgrade for enterprise security or advanced collaboration controls.
- **TinaCloud**, the editing capability. Sign in to it with your GitHub account.

---

## Step 1: Create a GitHub account and share the username

1. Go to **https://github.com/signup**.
2. Create an account & verify your email
3. Send your GitHub username **(not your password)** to us

## Step 2: Accept the GitHub invitation

1. We will invite you to the `powercapital-cms` repository.
2. You'll get an email from GitHub. Click **View invitation**, then **Accept invitation**.

## Step 3: Create your TinaCloud account and project

1. Go to **https://app.tina.io** and choose **Sign in with GitHub**. Approve the permissions it asks for.
2. Click to create a **new project** and connect it to a GitHub repository.
3. Choose the repository **powercapital-cms**.
4. Fill in the project settings:
   - **Project name:** `Power Capital Site` (can by whatever you'd like to call it)
   - **Site URLs:** Add each of the below as its own Site URL entry (copy button for your convenience). This one-time setup gives you the rights to edit the site in production as well as any test environments in the future if needed.

     ```
     http://localhost:4321
     ```

     ```
     https://powercapital-cms.jr-1791.workers.dev
     ```

     ```
     https://*-powercapital-cms.jr-1791.workers.dev
     ```

     ```
     https://powercapital.cloud
     ```

     ```
     https://www.powercapital.cloud
     ```

   - **Advanced settings → Path to Tina folder:** leave it **blank**.
5. Click **Save** or **Create project**.
6. Open the **Media** tab and click **Sync Media**. This lets the editor show the site's images.
7. Open the **Tokens** tab and click **New token**:
   - **Type:** Content (read-only)
   - **Name:** `Website build`
   - **Git branches:** `*` (just an asterisk)
   - Click **Create**.

## Step 4: Send us your token IDs 

Share your token IDs with us so that we can connect the site to your Tina account for editing.

| Item | Where to find it | Private? |
|---|---|---|
| **Client ID** | Project → **Overview** tab | No, this one is safe to share |
| **Content token** | Project → **Tokens** tab → the "Website build" token | **Yes. Treat it like a password.** |

**Please don't send the token by regular email or text.** Instead read it to us on a call so we can enter it directly.

## Step 5: (Optional) Add Kala to your project

TinaCloud accounts stay free if they have 2 users or fewer. You are one of those users. If you add us, we will take the last free seat. If you need someone else to have that seat, talk to us about how to coordinate without adding us on your account.

If you want to give the second seat to us, follow these steps:
- In your TinaCloud project, open **Collaborators** (or **User management**).
- Invite Kala's email: **karoberts2014@gmail.com**.

## Step 6: Try the editor (after we confirm the connection)

**Your everyday editing address is:**
**https://powercapital.cloud/admin**

1. Go to the editing address.
2. Sign in with your TinaCloud account.
3. Click any text on the page then enter your change(s) in the editor on the left (you should see the preview change in real time for most text).
4. Click **Save**. The change(s) will take effect in the preview immediately for everything except Menu Bar changes.
5. Wait up to 5 minutes and refresh the main site (**https://powercapital.cloud**). Your change(s) should be live.

---

### If something goes wrong
- **"Repository not found" in TinaCloud:** check that you accepted the GitHub invitation in Step 2. Then, in TinaCloud, reconnect GitHub and allow access to `powercapital-cms`.
- **The image picker says "Media needs to be turned on":** go to your project's **Media** tab and click **Sync Media**.
- **Anything else:** take a screenshot and send it to us.
