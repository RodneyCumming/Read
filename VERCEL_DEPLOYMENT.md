# Deploy to Vercel - Quick Guide

Vercel has excellent GitHub integration and is perfect for this React/Vite app!

---

## Method 1: Vercel Web Interface (Easiest)

### Step-by-Step:

1. **Go to Vercel**:
   - Visit: https://vercel.com
   - Click "Sign Up" or "Login"
   - Choose "Continue with GitHub"

2. **Import Your Project**:
   - Click "Add New..." → "Project"
   - You'll see "Import Git Repository"
   - Click "Import" next to your GitHub account name

3. **Select Repository**:
   - Look for "RodneyCumming/Read" or use the search box
   - Click "Import" next to it

   **If you don't see the repository:**
   - Click "Adjust GitHub App Permissions"
   - Grant Vercel access to the "Read" repository
   - Click "Save"
   - Go back and try importing again

4. **Configure Project**:
   Vercel should auto-detect everything from `vercel.json`, but verify:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **Deploy**:
   - Click "Deploy"
   - Wait 1-2 minutes
   - Done! Your site is live!

---

## Method 2: Vercel CLI (Alternative)

If you prefer command line:

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (from project root)
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - What's your project's name? epub-reader (or whatever you want)
# - In which directory is your code located? ./
# - Want to override settings? No (it will use vercel.json)

# For production deployment
vercel --prod
```

---

## What Happens After First Deploy?

✅ **Automatic Deployments**: Every time you push to your branch, Vercel automatically deploys

✅ **Preview Deployments**: Every PR gets its own preview URL

✅ **Custom Domain**: You can add your own domain in project settings

✅ **Analytics**: Free analytics to see how your site performs

---

## Troubleshooting

### Repository Not Showing Up?

1. Go to: https://github.com/settings/installations
2. Find "Vercel" in the list
3. Click "Configure"
4. Under "Repository access":
   - Either select "All repositories"
   - Or add "Read" to "Only select repositories"
5. Click "Save"
6. Go back to Vercel and refresh

### Build Fails?

Check the build logs. Common fixes:
- Make sure Node version is 16+
- Check that all dependencies are in package.json
- Verify build command is correct

### Site Loads but Breaks on Refresh?

The `vercel.json` rewrite rule should fix this. If not:
- Make sure `vercel.json` is committed to git
- Redeploy the project

---

## Recommended: Use Vercel Web Interface

For first-time deployment, the web interface is easiest:
1. https://vercel.com
2. Login with GitHub
3. Import your "Read" repository
4. Click Deploy
5. Done in under 2 minutes!

---

## Environment Variables

This app doesn't need any environment variables since everything runs client-side.

---

## Custom Domain (Optional)

Once deployed:
1. Go to your project in Vercel
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS setup instructions

---

## Vercel vs Netlify

Both are great, but Vercel tends to:
- ✅ Have smoother GitHub integration
- ✅ Be faster at builds
- ✅ Work better with React/Vite projects
- ✅ Have better free tier for personal projects

You made a good choice!
