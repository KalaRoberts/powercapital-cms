# Power Capital Site Editing Account Setup

Follow this guide to take over controls of powercapital.cloud and setup the ability to edit. If something goes wrong at any time, take a screenshot and send it to us.

## Step 1: Create a free GitHub account and share the username
This is the repository where the website's files are stored. This will remain free unless you upgrade for enterprise security or advanced collaboration controls.

1. Go to **https://github.com/signup**.
2. Create an account & verify your email
3. Send your GitHub username **(not your password)** to us

## Step 2: Accept the GitHub invitation

1. We will invite you to the `powercapital-cms` repository.
2. You'll get an email from GitHub. Click **View invitation**, then **Accept invitation**.

## Step 3: Create a free TinaCloud account
This enables the editing capability we've built for your site to be used by you. 
1. Go to **https://app.tina.io** and choose **Sign in with GitHub**. Approve the permissions it asks for.
   
**Decision on next steps**:

A TinaCloud account is free for up to 2 users on the account. You are one of those users.
* **Option 1**: Add us to your account. We will take the last free seat and complete the below steps for you (and/or have the ability to consult in the future) - **Skip to Step 6**.
* **Option 2**: If you prefer to complete these steps yourself and save that second seat - **Continue to Step 4**.

## Step 4: Setup the project in TinaCloud
You have chosen to **_complete the steps yourself without sharing the second seat_** with us. Please complete the below steps.

1. Go to **https://app.tina.io** and choose **Sign in with GitHub**. Approve the permissions it asks for.
2. Click to create a **new project** and connect it to a GitHub repository.
3. Choose the repository **powercapital-cms**.
4. Fill in the project settings:
   - **Project name:** `Power Capital Site` (can be whatever you'd like to call it)
   - **Site URLs:** Add a URL entry for each of the below (5 separate entries). This one-time setup gives you the rights to edit the site in production as well as any test environments in the future if needed.

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
   - **Type:** `Content` (read-only)
   - **Name:** `Website build`
   - **Git branches:** `*` (just an asterisk)
   - Click **Create**.

## Step 5: Send us your token IDs

Share your token IDs with us so that we can connect the site to your Tina account for editing.

| Item | Where to find it | Private? |
|---|---|---|
| **Client ID** | Project → **Overview** tab | No, this one is safe to share |
| **Content token** | Project → **Tokens** tab → the "Website build" token | **Yes. Treat it like a password.** |

**Please don't send the token by regular email or text.** Instead read it to us on a call so we can enter it directly.

## Step 6: 
You've decided to **_share the second seat with us_** so we can do the setup for you. Please follow these steps.
1. In your TinaCloud project, open **Collaborators** (or **User management**).
2. Invite our account: **karoberts2014@gmail.com**.
3. We will let you know when the site is connected and ready for you.

## Step 7: Try the editor (after we confirm the connection)

**Your everyday editing address is:**
**https://powercapital.cloud/admin**

1. Go to the editing address.
2. Sign in with your TinaCloud account.
3. Click any text on the page then enter your change(s) in the editor on the left (you should see the preview change in real time for most text).
4. Click **Save**. The change(s) will take effect in the preview immediately for everything except Menu Bar changes.
5. Wait up to 5 minutes and refresh the main site (**https://powercapital.cloud**). Your change(s) should be live.

**Congratulations! You can now manage your editing needs on your site!**
