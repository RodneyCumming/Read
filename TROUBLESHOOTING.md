# Troubleshooting: "Can't Read Book" Issue

If you can upload books but can't read them, follow these debugging steps:

---

## Step 1: Check Browser Console

1. **Open Developer Tools**:
   - Press `F12` (Windows/Linux) or `Cmd+Option+I` (Mac)
   - Or right-click → "Inspect"

2. **Go to Console Tab**:
   - Look for red error messages
   - Common errors and solutions:

### Error: "Book file is missing"
**Cause**: Book wasn't saved properly to IndexedDB
**Solution**:
- Clear browser data for the site
- Try uploading the book again
- Make sure the EPUB file isn't corrupted

### Error: "Failed to construct 'Blob'"
**Cause**: ArrayBuffer issue with IndexedDB
**Solution**:
- This is a known issue in some browsers
- Try a different browser (Chrome recommended)
- Clear site data and re-upload

### Error: "Cannot read properties of undefined"
**Cause**: EPUB file structure issue
**Solution**:
- The EPUB file might be corrupted
- Try a different EPUB file
- Download the EPUB again from source

---

## Step 2: Check Application Tab (Storage)

1. **Open Application Tab** in DevTools
2. **Check IndexedDB**:
   - Expand "IndexedDB"
   - Look for "epub-reader"
   - Click on "books" store
   - Do you see your uploaded books?
   - Check if the "file" field has data

**If books are missing**: The upload failed silently
- Try uploading a smaller EPUB file
- Check browser storage limits

---

## Step 3: Test with a Sample EPUB

Some EPUBs are malformed or use unsupported features. Try:

1. Download a test EPUB from: https://github.com/IDPF/epub3-samples
2. Try uploading "Moby Dick" or "Alice in Wonderland"
3. If these work but yours doesn't, the issue is with your specific EPUB file

---

## Step 4: Check What's Logged

When you click a book, the console should show:
```
Loading book: [Book Title]
Book file size: [number] bytes
EPUB initialized
```

**If you see**:
- "Book file size: 0 bytes" → File didn't save properly
- Nothing at all → Click handler isn't working
- Error after "EPUB initialized" → Problem with epub.js rendering

---

## Step 5: Browser-Specific Issues

### Chrome/Edge
Usually works best. If issues:
- Clear site data: DevTools → Application → Clear storage
- Disable extensions in incognito mode

### Firefox
- Check if "IndexedDB" is enabled in settings
- Try disabling tracking protection for the site

### Safari
- Enable "Develop" menu
- Check "Disable Local Storage Restrictions"
- Safari can be finicky with IndexedDB

---

## Step 6: Quick Fixes to Try

### Fix 1: Clear Everything and Start Fresh
```javascript
// In browser console, run:
indexedDB.deleteDatabase('epub-reader');
localStorage.clear();
// Then refresh page and try again
```

### Fix 2: Check File Size Limits
- Some browsers limit IndexedDB storage
- Try with a smaller EPUB (< 5MB)
- Large books might not fit in browser storage

### Fix 3: Use Incognito/Private Mode
- Rules out extension interference
- Fresh storage environment
- If it works here, an extension is causing issues

---

## Step 7: Known Issues & Workarounds

### Issue: Blank white screen when opening book
**Cause**: CSS/layout issue or epub.js loading problem
**Fix**: Check if the loading spinner appears first

### Issue: Book opens but shows no content
**Cause**: EPUB structure incompatibility
**Fix**:
- Try a different EPUB
- Check console for specific epub.js errors

### Issue: "Cannot read properties of null"
**Cause**: React rendering race condition
**Fix**: Refresh the page and try again

---

## Step 8: Report the Issue

If none of the above work, please provide:

1. **Browser & version**: (e.g., Chrome 120)
2. **Console errors**: Copy/paste full error messages
3. **Book details**: File size, where you got it
4. **What you see**:
   - Loading spinner?
   - Blank screen?
   - Error message?
5. **IndexedDB check**: Do you see books stored?

---

## Quick Debug Checklist

- [ ] Console shows errors?
- [ ] IndexedDB has the book stored?
- [ ] Book file size is > 0?
- [ ] Tried different EPUB file?
- [ ] Tried different browser?
- [ ] Tried incognito mode?
- [ ] Cleared browser data for site?
- [ ] EPUB file is valid (opens in other readers)?

---

## Most Common Solutions

**90% of issues are solved by**:
1. Using Chrome or Edge (best compatibility)
2. Trying a different EPUB file
3. Clearing browser data and re-uploading
4. Making sure EPUB is < 10MB

**Still stuck?** The updated version includes:
- ✅ Better error messages
- ✅ Loading indicators
- ✅ Console logging for debugging
- ✅ Validation checks

Redeploy and you'll see exactly what's failing!
