# Netlify Repository Not Showing Up - Solutions

## Why Your "Read" Repo Isn't Visible

This happens because Netlify needs explicit permission to access your repositories. Here's how to fix it:

---

## Solution 1: Configure GitHub App Permissions (Most Common Fix)

### Step-by-Step:

1. **Go to GitHub Settings**:
   - Visit: https://github.com/settings/installations
   - Or: GitHub → Settings → Applications → Installed GitHub Apps

2. **Find "Netlify"**:
   - Look for "Netlify" in the list
   - Click "Configure" next to it

3. **Grant Repository Access**:
   - You'll see "Repository access" section
   - Check if it says "Only select repositories" or "All repositories"

   **Option A** - Grant access to specific repo:
   - If "Only select repositories" is selected
   - Click the "Select repositories" dropdown
   - Find and select "Read" from the list
   - Click "Save"

   **Option B** - Grant access to all repos (easier):
   - Select "All repositories"
   - Click "Save"

4. **Go back to Netlify**:
   - Refresh the "Import from Git" page
   - Your "Read" repository should now appear!

---

## Solution 2: Re-Authorize with Full Permissions

If the repository still doesn't show up:

1. **Disconnect GitHub from Netlify**:
   - In Netlify, go to User Settings → Connected accounts
   - Disconnect GitHub

2. **Disconnect Netlify from GitHub**:
   - Go to: https://github.com/settings/applications
   - Find "Netlify" under OAuth Apps
   - Click "Revoke"

3. **Reconnect**:
   - Go back to Netlify
   - Click "Add new site" → "Import an existing project"
   - Click GitHub
   - **IMPORTANT**: When GitHub asks for permissions, make sure to grant access to the "Read" repository

---

## Solution 3: Check Repository Visibility

Is your repository **private**? If so:

1. Go to your repository: https://github.com/RodneyCumming/Read
2. Click "Settings" (repository settings, not your account)
3. Scroll down to "Danger Zone"
4. Check if it says "Change repository visibility"
5. You can either:
   - **Option A**: Make it public (Click "Change visibility" → "Make public")
   - **Option B**: Ensure Netlify has permission to private repos (see Solution 1)

---

## Solution 4: Manual Search

If the repo list is long:

1. On Netlify's repository selection screen
2. Look for a **search box** at the top
3. Type: `Read` or `RodneyCumming/Read`
4. It might be there but just hard to find in a long list

---

## Solution 5: Use Direct Repository URL (If Available)

Some Netlify screens allow direct URL input:

1. Look for an option like "Import from Git URL" or similar
2. Enter your repository URL: `https://github.com/RodneyCumming/Read`
3. Or the Git URL: `git@github.com:RodneyCumming/Read.git`

---

## Solution 6: Deploy Another Way (Skip GitHub for Now)

### Use Netlify CLI Instead:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Link to new site and deploy
netlify init

# Or deploy directly
netlify deploy --prod
```

This completely bypasses the GitHub integration issue!

### Or Use Netlify Drop:

1. Build: `npm run build`
2. Go to: https://app.netlify.com/drop
3. Drag the `dist` folder
4. Done!

---

## Most Likely Fix

**99% of the time it's Solution 1** - You just need to grant Netlify permission to access the specific repository:

1. https://github.com/settings/installations
2. Click "Configure" next to Netlify
3. Add "Read" repository to the allowed list
4. Save and refresh Netlify

Try that first!

---

## Still Stuck?

If none of these work, I recommend using **Netlify CLI** (Solution 6) - it's actually easier and more reliable than the web interface for deployment.
