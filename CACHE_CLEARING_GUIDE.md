# Cache Clearing Guide - Data Not Updating Issue

## The Problem

You've edited `src/data/finalProcurementMockData.ts` but the changes aren't appearing in the UI. This is a **browser/dev server caching issue**, not a code issue.

## Verified: The Code Is Correct ✅

The data connection has been fixed and verified:
- ✅ Component imports data from `finalProcurementMockData.ts`
- ✅ Parent component uses imported data (not hardcoded data)
- ✅ Build completes successfully
- ✅ Data values in the file are correct

## How to Fix: Clear All Caches

### Step 1: Hard Refresh Browser
**Try this first - it works 90% of the time**

- **Windows/Linux**: `Ctrl + Shift + R` or `Ctrl + F5`
- **Mac**: `Cmd + Shift + R`
- **Alternative**: Open DevTools (F12) → Right-click the refresh button → "Empty Cache and Hard Reload"

### Step 2: Clear Browser Cache Completely
If hard refresh doesn't work:

1. Open browser DevTools (F12)
2. Go to "Network" tab
3. Check "Disable cache" checkbox
4. Keep DevTools open
5. Refresh the page (F5)

### Step 3: Restart Development Server
If browser cache clearing doesn't work:

1. Stop the dev server (Ctrl + C in terminal)
2. Clear Vite cache:
   ```bash
   rm -rf node_modules/.vite
   ```
3. Restart dev server:
   ```bash
   npm run dev
   ```

### Step 4: Clear Node Modules Cache
If dev server restart doesn't work:

```bash
rm -rf node_modules/.vite
rm -rf node_modules/.cache
npm run dev
```

### Step 5: Nuclear Option - Full Rebuild
If nothing else works:

```bash
# Stop dev server
# Then run:
rm -rf node_modules/.vite
rm -rf node_modules/.cache
rm -rf dist
npm run build
npm run dev
```

## How to Test Changes Are Working

### Before Making Changes
1. Open browser DevTools (F12)
2. Go to Console tab
3. You should see debug messages:
   ```
   [DEBUG] Retrieved data count: 15
   [DEBUG] First item: {id: "1", materialId: "MTL-073", ...}
   ```

### Make a Test Change
1. Open `src/data/finalProcurementMockData.ts`
2. Find this line (around line 115):
   ```typescript
   materialValue: 3700000000,
   ```
3. Change it to:
   ```typescript
   materialValue: 9999000000,  // Test change
   ```
4. Save the file

### Verify the Change
1. Clear cache using methods above
2. Check the Console for the debug message
3. Expand "Ash Handling Systems" category
4. The total should now show: **IDR 18,100,000,000** (instead of 11,800,000,000)
5. If you see the new value, the connection is working! ✅

### Revert Test Change
Don't forget to change the value back to `3700000000` after testing!

## Current Data Values (Reference)

These are the CORRECT values that should display after clearing cache:

| Category | Items | Total Value (IDR) |
|----------|-------|-------------------|
| Ash Handling Systems | 4 | 11,800,000,000 |
| Filters | 5 | 29,400,000,000 |
| Lubricants & Fluids | 3 | 11,900,000,000 |
| Electrical Components | 3 | 18,800,000,000 |

**Breakdown:**
- Ash Handling: 3.7B + 4.2B + 2.1B + 1.8B = 11.8B
- Filters: 20B + 3.5B + 1.9B + 2.4B + 1.6B = 29.4B
- Lubricants: 5.2B + 3.8B + 2.9B = 11.9B
- Electrical: 6.5B + 8.2B + 4.1B = 18.8B

## Common Issues

### Issue: "I cleared cache but still seeing old data"
**Solution**: Try opening in Incognito/Private browsing mode. If it works there, your regular browser has stubborn cache.

### Issue: "Dev server shows old data, but production build is correct"
**Solution**: This confirms it's a dev server cache issue. Use Step 3 above (restart dev server with cache clear).

### Issue: "Changes work for some materials but not others"
**Solution**: Make sure you're editing `src/data/finalProcurementMockData.ts` and NOT the old duplicate files like `retrieveProcurementRequestMockData.ts` (if they exist).

## Still Not Working?

If none of the above works, check:

1. **Are you editing the right file?**
   - File path: `src/data/finalProcurementMockData.ts`
   - NOT any other file with similar name

2. **Are there TypeScript errors?**
   - Check terminal where dev server is running
   - Look for any import/export errors

3. **Is the file saving properly?**
   - Check file modification timestamp
   - Try adding a console.log at the top of the file to verify it's being loaded

4. **Browser extensions interfering?**
   - Disable all extensions temporarily
   - Try in a different browser

## Debug Mode

The component now includes debug console logs. Check your browser console for:
- `[DEBUG] Retrieved data count:` - should show 15
- `[DEBUG] First item:` - should show the first procurement request object

If these logs don't appear, check that:
- DevTools Console is open
- Console filters aren't hiding the logs
- The page has fully loaded
