# Deployment Guide

## Method 1: Netlify Drop (Easiest - No GitHub needed)

1. Build your project locally:
   ```bash
   npm run build
   ```

2. Go to https://app.netlify.com/drop

3. Drag and drop the entire `dist` folder onto the page

4. Done! Your site is live instantly.

**Pros**: Super simple, no authentication issues
**Cons**: Manual process, no automatic updates

---

## Method 2: Netlify CLI (Recommended)

1. Install Netlify CLI globally:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Initialize and deploy:
   ```bash
   netlify init
   ```

   Follow the prompts:
   - Create & configure a new site
   - Choose your team
   - Site name: (choose a unique name)
   - Build command: `npm run build`
   - Publish directory: `dist`

4. Deploy:
   ```bash
   netlify deploy --prod
   ```

**Pros**: Easy continuous deployment, version control
**Cons**: Requires CLI installation

---

## Method 3: GitHub Integration (If OAuth Works)

### If you're still getting stuck on the "Authorized" page:

1. **Go back to Netlify** manually:
   - Open a new tab and go to https://app.netlify.com
   - Try clicking "Add new site" → "Import an existing project"
   - GitHub should now appear as a connected option

2. **Re-authorize GitHub**:
   - Go to https://github.com/settings/applications
   - Find "Netlify" under "Authorized OAuth Apps"
   - Click "Revoke" and then try connecting again

3. **Use GitHub Desktop App**:
   - If you use GitHub Desktop, make sure you're logged in there
   - Sometimes this helps with OAuth issues

### Once Connected:

1. Select your repository: `RodneyCumming/Read`
2. Select branch: `claude/epub-reader-webapp-011CUirbZNvTTouBzRYD4NUH`
3. Build settings (should auto-detect from netlify.toml):
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Click "Deploy site"

**Pros**: Automatic deploys on every push
**Cons**: OAuth setup can be tricky

---

## Method 4: Direct Git Integration (Alternative)

If GitHub OAuth doesn't work, try connecting via Git URL:

1. In Netlify, choose "Deploy with Git"
2. If available, select "Deploy with Git URL" or "GitLab/Bitbucket"
3. Use your repository URL

---

## Quick Deploy Script

We've created a helper script. Run:

```bash
./deploy-manual.sh
```

This will build the project and give you instructions for manual deployment.

---

## Troubleshooting

### Build Fails on Netlify

If the build fails, check:
- Node version (should be 16+)
- Add a `.nvmrc` file with your Node version
- Check build logs for specific errors

### Site Loads but Breaks on Refresh

This is already fixed with the `netlify.toml` redirect rule, but if you still have issues:
- Make sure `netlify.toml` is in your repository root
- Check that the redirect rule is present

### Environment Variables

This app doesn't need any environment variables since everything runs client-side.

---

## Recommended: Use Netlify CLI

For the best experience without OAuth issues:

```bash
# One-time setup
npm install -g netlify-cli
netlify login
netlify init

# Every time you want to deploy
npm run build
netlify deploy --prod
```

This gives you all the benefits of Netlify without dealing with OAuth redirects!
