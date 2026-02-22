# Carousel — Get Your Message Around

Swipeable slide deck builder for messaging apps.

## File Structure

```
index.html                    ← The whole app
functions/api/deck.js         ← Cloudflare Worker for Firebase reads/writes
```

## Deploy to Cloudflare Pages (free)

### Step 1: Get your GitHub repo ready

Your repo should have these files:
- `index.html` (in the root)
- `functions/api/deck.js` (in a functions/api folder)

To create files on GitHub:
- Go to your repo → Add file → Create new file
- For the function, type `functions/api/deck.js` as the filename (GitHub creates the folders automatically)
- Paste the content → Commit changes

### Step 2: Create a Cloudflare account

1. Go to dash.cloudflare.com → Sign up (free)
2. Verify your email

### Step 3: Connect your repo

1. In the Cloudflare dashboard sidebar, click **Workers & Pages**
2. Click **Create** → select the **Pages** tab
3. Click **Connect to Git**
4. Authorize GitHub → select your carousel repo
5. Build settings — leave EVERYTHING blank:
   - Framework preset: None
   - Build command: (empty)
   - Build output directory: (empty)
6. Click **Save and Deploy**

### Step 4: Connect your domain

1. After deploy, go to your project → **Custom domains** tab
2. Click **Set up a custom domain**
3. Enter `makeacarousel.com`
4. Cloudflare will give you a CNAME record
5. Go to GoDaddy → DNS → add the CNAME record pointing to your Cloudflare Pages URL

### Future updates

Edit files on GitHub → Cloudflare auto-deploys within seconds!

## How it works

- **Share as Link** → POSTs to `/api/deck` → Cloudflare Worker writes to Firebase → short URL like `?v=my-deck`
- **View a link** → GETs from `/api/deck?slug=my-deck` → Worker reads from Firebase → renders viewer
- **?d= links** still work as a fallback (data encoded in URL, no backend needed)
