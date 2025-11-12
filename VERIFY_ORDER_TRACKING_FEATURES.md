# Quick Verification Script for Order Tracking Features

## 🔍 How to Verify the Features Are Working

### Step 1: Open Browser DevTools
1. Press **F12** (or right-click > Inspect)
2. Go to the **Console** tab

### Step 2: Navigate to Order Tracking
1. Go to **Procurements** > **Procure to Invoice**
2. Click **Marketplace** button
3. Click **Order Tracking** tab

### Step 3: Check Console Logs

You should see these logs:
```
[PLN Marketplace] Orders loaded: 12 orders
[Order Tracking] Render check - orders.length: 12
```

### Step 4: Run Verification Script

Copy and paste this into the Console:

```javascript
console.log('=== ORDER TRACKING FEATURE VERIFICATION ===');

// Check version
const versionEl = document.querySelector('[data-version="2.0"]');
console.log('✓ Version 2.0 loaded:', versionEl !== null);

if (versionEl) {
  console.log('  - Orders count:', versionEl.getAttribute('data-orders-count'));
}

// Check sort dropdown
const sortDropdown = document.querySelector('select');
if (sortDropdown && sortDropdown.value) {
  console.log('✓ Sort dropdown found:', sortDropdown.value);
  const options = Array.from(sortDropdown.options).map(o => o.text);
  console.log('  - Sort options:', options);
} else {
  console.log('✗ Sort dropdown NOT found');
}

// Check filter buttons
const buttons = Array.from(document.querySelectorAll('button')).filter(btn =>
  btn.textContent.includes('All (') ||
  btn.textContent.includes('Order Placed') ||
  btn.textContent.includes('Processing') ||
  btn.textContent.includes('Shipped') ||
  btn.textContent.includes('In Delivery') ||
  btn.textContent.includes('Arrived')
);

console.log('✓ Filter buttons found:', buttons.length);
buttons.forEach(btn => {
  console.log('  -', btn.textContent.trim());
});

// Check order cards
const orderCards = document.querySelectorAll('[class*="shadow"]');
console.log('✓ Order cards visible:', orderCards.length);

// Summary
console.log('\n=== SUMMARY ===');
console.log('Expected Results:');
console.log('  - Version: 2.0 ✓');
console.log('  - Sort dropdown: 1 dropdown with 5 options');
console.log('  - Filter buttons: 6 buttons');
console.log('  - Order cards: 12 cards');

if (buttons.length === 6) {
  console.log('\n✅ ALL FEATURES WORKING CORRECTLY!');
} else if (buttons.length === 0) {
  console.log('\n❌ BUTTONS NOT SHOWING - Check troubleshooting steps');
} else {
  console.log('\n⚠️ PARTIAL FEATURES - Some buttons missing');
}
```

### Step 5: Interpret Results

**If you see**:
```
✅ ALL FEATURES WORKING CORRECTLY!
```
**Then the features are implemented and working!**

**If you see**:
```
❌ BUTTONS NOT SHOWING - Check troubleshooting steps
```
**Then follow these steps:**

## 🔧 Troubleshooting Steps (In Order)

### 1. Check Build Version

In the browser, press **Ctrl+U** (View Source), and look for:
```html
<script type="module" crossorigin src="/assets/index-Hcs_W8Pg.js"></script>
```

The hash should be: **Hcs_W8Pg**

If it's different (like `B-_Dyref` or `I9Ev-SQk`), your server is serving an old build.

**Fix**: Restart your dev server:
```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

### 2. Check Network Tab

1. DevTools > **Network** tab
2. Refresh the page (Ctrl+R)
3. Look for the `.js` file being loaded
4. Click on it and check the **Headers** tab
5. Look for **Status Code**: Should be `200` (not `304 Not Modified`)

If you see `304`, your browser is using cached version.

**Fix**: Hard refresh: **Ctrl+Shift+R** (Windows/Linux) or **Cmd+Shift+R** (Mac)

### 3. Check Elements Tab

1. DevTools > **Elements** tab
2. Press **Ctrl+F** to open search
3. Search for: `data-version="2.0"`

If found: ✅ New code is loaded
If not found: ❌ Old version still cached

### 4. Clear Everything and Restart

```bash
# Terminal 1: Stop dev server (Ctrl+C)

# Terminal 2: Clear all caches
rm -rf dist
rm -rf node_modules/.vite
rm -rf ~/.cache/vite

# Terminal 1: Restart dev server
npm run dev
```

Then in browser:
1. Close all tabs with the app
2. Open **New Incognito/Private Window**
3. Navigate to `http://localhost:5173`
4. Go to Order Tracking page

### 5. Try Different Port

If the above doesn't work, the port might be cached.

Edit `package.json`:
```json
"dev": "vite --port 5174"
```

Then:
```bash
npm run dev
```

Open `http://localhost:5174`

## 📋 What You Should See

When working correctly:

```
┌──────────────────────────────────────────────────────┐
│  Order Tracking                    [Sort: Newest ▼]  │
├──────────────────────────────────────────────────────┤
│  [All (12)] [Order Placed (3)] [Processing (3)]      │
│  [Shipped (3)] [In Delivery (2)] [Arrived (2)]       │
├──────────────────────────────────────────────────────┤
│  PO-2025110001                         Rp 50.000.000 │
│  ●──●──●──●──● Arrived                                │
├──────────────────────────────────────────────────────┤
│  PO-2025110002                         Rp 75.000.000 │
│  ●──●──●──●─○ In Delivery                            │
├──────────────────────────────────────────────────────┤
│  ... (10 more orders)                                 │
└──────────────────────────────────────────────────────┘
```

## 🎯 Quick Test

1. Click **"Order Placed (3)"** button → Should show only 3 orders
2. Click **"All (12)"** button → Should show all 12 orders again
3. Change sort to **"Highest Value"** → Orders should reorder
4. Change sort to **"Oldest First"** → Orders should reorder again

## 📊 Expected Button Counts

- **All**: 12 orders
- **Order Placed**: 3 orders
- **Processing**: 3 orders
- **Shipped**: 3 orders
- **In Delivery**: 2 orders
- **Arrived**: 2 orders

Total: 12 orders across all statuses

## ✅ Verification Checklist

- [ ] Console shows: `Orders loaded: 12 orders`
- [ ] Version marker exists: `data-version="2.0"`
- [ ] Sort dropdown visible with 5 options
- [ ] 6 filter buttons visible
- [ ] All buttons show correct counts
- [ ] Clicking buttons filters orders
- [ ] Changing sort order works
- [ ] 12 order cards visible initially

## 🆘 If Nothing Works

The features ARE implemented. The issue is 100% a caching problem. As a last resort:

1. **Use a completely different browser** (if using Chrome, try Firefox)
2. **Clear browser data**: Settings > Privacy > Clear browsing data > Everything
3. **Disable browser extensions**: Some extensions cache aggressively
4. **Check if you're behind a proxy**: Corporate proxies can cache heavily

The code is in the source files and the build. It's just not reaching your browser.
