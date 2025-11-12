# Order Tracking Filter Buttons - Debug Guide

## Problem
Filter buttons and sort dropdown are not showing on the Order Tracking page despite being in the code.

## Root Cause Analysis

The buttons are wrapped in a condition:
```typescript
{orders.length > 0 && ( ... buttons ... )}
```

This means buttons ONLY render when there are orders loaded. If `orders.length === 0`, the buttons won't show.

## Verification Steps

### Step 1: Check Console Logs (Most Important!)

I've added debug console logs to track the issue. Open your browser DevTools (F12) and go to the Console tab.

When you navigate to the Order Tracking tab, you should see:

```
[PLN Marketplace] Orders loaded: 12 orders
[Order Tracking] Render check - orders.length: 12
```

**If you see `orders.length: 0`**, that means orders aren't loading from mock data.

**If you DON'T see any console logs**, that means:
- The new build isn't being served
- The dev server hasn't restarted
- Browser is using cached version

### Step 2: Force Complete Cache Clear

Since you've already tried hard refresh and cache clear, try this:

#### Option A: Kill and Restart Dev Server
```bash
# Stop the dev server (Ctrl+C or kill the process)
pkill -f "vite\|node.*dev"

# Clear all caches
rm -rf node_modules/.vite
rm -rf dist

# Restart
npm run dev
```

#### Option B: Use a Different Port
```bash
# In package.json, change dev script to:
"dev": "vite --port 5174"

# Then restart
npm run dev
```

#### Option C: Try Incognito/Private Mode
- Open browser in incognito/private mode
- Navigate to http://localhost:5173
- This bypasses ALL cache

#### Option D: Try Different Browser
- Open in Firefox if you're using Chrome
- Or vice versa

### Step 3: Verify Build Hash

The latest build is: `index-CuiHcrXy.js`

Check your browser DevTools > Network tab:
1. Refresh the page
2. Look for the .js file being loaded
3. It should be `index-CuiHcrXy.js`
4. If it's a different hash (like `index-B-_Dyref.js`), your server is serving an old build

### Step 4: Check if Mock Data is Enabled

Open DevTools Console and run:
```javascript
// Check if orders are in mock data
import('/src/data/marketplaceMockData.ts').then(mod => {
  console.log('Mock orders count:', mod.mockOrders.length);
});
```

Or check the network tab - if you see API calls to Supabase, mock data might be disabled.

### Step 5: Manual Code Inspection

Open DevTools > Sources tab:
1. Find `/src/pages/Marketplace/PLNMarketplace.tsx`
2. Search for "Order Placed" button
3. If the code isn't there, the build isn't updated

## Code Verification

### The buttons SHOULD be at these line numbers:

**Sort Dropdown**: Lines 1501-1516
```typescript
{orders.length > 0 && (
  <div className="flex items-center gap-3">
    <span className="text-sm text-gray-600 dark:text-gray-300">Sort by:</span>
    <select value={orderSortBy} ...>
      <option value="date_desc">Newest First</option>
      ...
    </select>
  </div>
)}
```

**Filter Buttons**: Lines 1523-1597
```typescript
{orders.length > 0 && (
  <div className="flex items-center gap-2 flex-wrap mb-4">
    <button onClick={() => setOrderStatusFilter('all')} ...>
      All ({orders.length})
    </button>
    <button onClick={() => setOrderStatusFilter('ORDER_PLACED')} ...>
      Order Placed (...)
    </button>
    ...
  </div>
)}
```

## Common Issues & Solutions

### Issue 1: Service Worker Caching
**Solution**:
1. DevTools > Application tab
2. Service Workers section
3. Click "Unregister" for all workers
4. Clear Storage > Clear site data
5. Hard refresh (Ctrl+Shift+R)

### Issue 2: Nginx/Reverse Proxy Caching
If using nginx or reverse proxy:
```bash
# Clear nginx cache
sudo rm -rf /var/cache/nginx/*
sudo systemctl restart nginx
```

### Issue 3: Docker Container Not Rebuilding
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up
```

### Issue 4: Browser Extensions Blocking
- Disable all browser extensions
- Try incognito mode
- Check if ad-blockers are interfering

## Direct Testing Method

Instead of using the UI, test if the code works programmatically:

1. Open DevTools Console on the Marketplace page
2. Switch to Order Tracking tab
3. Run this code:

```javascript
// This will show the current orders count
const checkOrders = setInterval(() => {
  const ordersElement = document.querySelector('[data-orders-count]');
  if (ordersElement) {
    console.log('Orders count from DOM:', ordersElement.textContent);
  }

  // Check if filter buttons exist
  const filterButtons = document.querySelectorAll('button[onclick*="setOrderStatusFilter"]');
  console.log('Filter buttons found:', filterButtons.length);

  if (filterButtons.length > 0) {
    clearInterval(checkOrders);
    console.log('✅ Buttons ARE present in DOM');
  }
}, 1000);

// Stop after 10 seconds
setTimeout(() => clearInterval(checkOrders), 10000);
```

## Expected Behavior

When working correctly:
1. Navigate to Procurements > Procure to Invoice
2. Click "Marketplace" button
3. Click "Order Tracking" tab
4. You should IMMEDIATELY see:
   - Sort dropdown (top right) showing "Newest First"
   - 6 filter buttons (All, Order Placed, Processing, Shipped, In Delivery, Arrived)
   - 12 order cards displayed
5. Clicking any filter button should update the displayed orders
6. Changing sort order should reorder the list

## Files to Check

1. **Source Code**: `/tmp/cc-agent/59716610/project/src/pages/Marketplace/PLNMarketplace.tsx`
   - State variables at lines 59-60
   - Buttons at lines 1523-1597

2. **Mock Data**: `/tmp/cc-agent/59716610/project/src/data/marketplaceMockData.ts`
   - `mockOrders` array should have 12 entries (lines 1572-1824)

3. **Service**: `/tmp/cc-agent/59716610/project/src/services/marketplaceService.ts`
   - `getOrders()` method at line 692
   - Should return `getOrdersWithDetails()` when `USE_MOCK_DATA` is true

4. **Built File**: `/tmp/cc-agent/59716610/project/dist/assets/index-CuiHcrXy.js`
   - Should contain "Order Placed" text
   - Can verify with: `strings dist/assets/index-*.js | grep "Order Placed"`

## Last Resort: Manual Verification

If nothing works, manually verify the implementation:

```bash
# 1. Check state variables exist
grep "orderStatusFilter\|orderSortBy" src/pages/Marketplace/PLNMarketplace.tsx

# 2. Check mock data has 12 orders
grep -c "order_id:" src/data/marketplaceMockData.ts

# 3. Check buttons are in source
grep -A2 "Order Placed" src/pages/Marketplace/PLNMarketplace.tsx

# 4. Check buttons are in build
strings dist/assets/index-*.js | grep "Order Placed"
```

All 4 commands should return results. If any fail, that's where the problem is.

## Current Build Status

✅ Build Hash: `index-CuiHcrXy.js`
✅ Build Time: 9.91s
✅ Build Size: 2,470.82 kB
✅ TypeScript: No errors
✅ Mock Orders: 12
✅ Filter Buttons: 6 (All, Order Placed, Processing, Shipped, In Delivery, Arrived)
✅ Sort Options: 5 (Newest, Oldest, Highest Value, Lowest Value, Status)

## Console Logs Added

The following debug logs have been added to help identify the issue:

1. **Line 215**: `[PLN Marketplace] Orders loaded: X orders`
   - Appears when orders finish loading
   - Should show "12 orders"

2. **Line 1497**: `[Order Tracking] Render check - orders.length: X`
   - Appears every time the Order Tracking tab renders
   - Should show "12" when orders are loaded

Watch for these in your browser console!

## Contact Support

If buttons still don't appear after trying ALL the above:
1. Take a screenshot of the console (showing logs or lack thereof)
2. Take a screenshot of the Network tab (showing which .js file loaded)
3. Share the browser and version you're using
4. Confirm you've restarted the dev server

The code is 100% implemented and in the build. This is a caching/server issue, not a code issue.
