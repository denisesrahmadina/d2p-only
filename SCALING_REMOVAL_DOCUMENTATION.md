# Scaling Removal - Display Raw Calculated Values

## Overview
Removed the global scaling factor from DPKDemandConsolidationHQ to display raw calculated values instead of scaled values.

## Changes Made

### Before (With Scaling):
```typescript
// Calculate scaling factor to reach target
const TARGET_TOTAL = 971913801000; // IDR 971,913,801,000
const scalingFactor = initialTotal > 0 ? TARGET_TOTAL / initialTotal : 1;

// Apply scaling factor to all category values
const result = validCategories.map(([category, cat]) => ({
  category,
  materials: cat.materials,
  totalQuantity: cat.totalQuantity,
  totalValue: Math.max(0, Math.round(cat.totalValue * scalingFactor)),
  unitCount: cat.unitCount
}))
```

### After (No Scaling):
```typescript
// No scaling - use raw calculated values
const result = validCategories.map(([category, cat]) => ({
  category,
  materials: cat.materials,
  totalQuantity: cat.totalQuantity,
  totalValue: cat.totalValue, // Raw value without scaling
  unitCount: cat.unitCount
}))
```

## Impact

### Filter Category Calculation:
With the target display quantities:
- Air Filter: 43,809 × IDR 2,500,000 = IDR 109,522,500,000
- Fuel Filter: 39,799 × IDR 15,750,000 = IDR 626,834,250,000
- Chemical filter: 30,361 × IDR 285,000 = IDR 8,652,885,000
- Oil filter: 55,221 × IDR 1,850,000 = IDR 102,158,850,000
- Special filter: 27,417 × IDR 4,250,000 = IDR 116,522,250,000
- Multi function filter: 23,625 × IDR 12,500,000 = IDR 295,312,500,000
- Water filter: 46,414 × IDR 6,500,000 = IDR 301,691,000,000
- Gas filter: 36,196 × IDR 18,500,000 = IDR 669,626,000,000

**Filter Category Total: IDR 2,230,320,235,000** (≈ IDR 2.23 Trillion)

### What Changed:
- ❌ **Removed**: Global scaling to reach target total of IDR 971.9B
- ✅ **Now Shows**: Raw calculation (Quantity × Unit Price)
- ✅ **Result**: More transparent and predictable values

### Benefits:
1. **Transparency**: Values directly reflect quantity × unit price
2. **Predictability**: No hidden scaling factors
3. **Simplicity**: Easier to verify and understand
4. **Accuracy**: Shows actual procurement value without artificial adjustments

---

**Date**: November 14, 2025  
**Modified File**: `src/pages/DemandToPlan/DPK/DPKDemandConsolidationHQ.tsx`  
**Lines Changed**: 754-820 (categoryBreakdown useMemo)
