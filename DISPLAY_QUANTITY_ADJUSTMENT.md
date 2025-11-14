# Display Quantity Adjustment Documentation

## Overview
This document explains the display quantity adjustment feature implemented in the DPK Demand Consolidation HQ page.

## Problem Statement
The total quantities displayed in the material breakdown table were too high due to the random generation function. However, we needed to maintain the existing forecast generation mechanism, including the deviation alerts system.

## Solution Approach
Instead of modifying the core forecast generation logic (which would break the deviation alerts), we implemented a **display-only scaling layer** that adjusts the quantities shown in the summary tables while keeping the underlying forecast mechanism intact.

## Implementation Details

### 1. Target Display Quantities
A new constant `TARGET_DISPLAY_QUANTITIES` was added with the desired target quantities for Filter category materials:

```typescript
const TARGET_DISPLAY_QUANTITIES: { [key: string]: number } = {
  'Air Filter': 43775,
  'Fuel Filter': 39807,
  'Chemical filter': 30517,
  'Oil filter': 55041,
  'Special filter': 27263,
  'Multi function filter': 23786,
  'Water filter': 46321,
  'Gas filter': 36143
};
```

### 2. Modified finalProcurementSummary
The `finalProcurementSummary` calculation was updated to apply target quantities for display:

```typescript
.map(item => {
  // Apply target display quantity if available for this material
  const displayQuantity = TARGET_DISPLAY_QUANTITIES[item.materialName] || item.totalQuantity;
  
  return {
    ...item,
    totalQuantity: displayQuantity,
    unitRequestorsCount: item.unitRequestors.size,
    unitRequestorsList: Array.from(item.unitRequestors).join(', ')
  };
})
```

## What This Changes

### ✅ Changed (Display Only)
- **Material breakdown table quantities**: Now shows target quantities from `TARGET_DISPLAY_QUANTITIES`
- **Category total values**: Calculated based on adjusted display quantities
- **Summary statistics**: Reflect the new display quantities

### ✅ Unchanged (Core Functionality)
- **Forecast generation mechanism**: Still uses original random-based logic
- **Deviation alerts**: Continue to work as designed (comparing AI vs Final forecasts)
- **Alert cards**: Show correct deviation percentages (54.0% and 34.6%)
- **Unit-level data**: Individual unit forecasts remain untouched
- **Data flow**: All underlying calculations and business logic intact

## Benefits

1. **Non-Breaking**: Deviation alerts and all existing functionality continue to work
2. **Flexible**: Easy to add target quantities for other material categories
3. **Maintainable**: Clear separation between data generation and display logic
4. **Reversible**: Can easily remove or modify target quantities without affecting core logic

## Target Quantities Matching Attachment

Based on the provided attachment, the following total quantities are now displayed:

| Material | Target Qty | Status |
|----------|-----------|--------|
| Oil filter | 55,041 | ✅ Matches |
| Water filter | 46,321 | ✅ Matches |
| Air Filter | 43,775 | ✅ Matches |
| Fuel Filter | 39,807 | ✅ Matches |
| Gas filter | 36,143 | ✅ Matches |
| Chemical filter | 30,517 | ✅ Matches |
| Special filter | 27,263 | ✅ Matches |
| Multi function filter | 23,786 | ✅ Matches |

**Category Total**: IDR 658,789,723,343 (calculated from target quantities × unit prices)

## Future Enhancements

To extend this feature to other categories:

1. Add target quantities to `TARGET_DISPLAY_QUANTITIES` object
2. Values will automatically be applied in the display layer
3. No changes needed to forecast generation or alert mechanisms

## Example

```typescript
const TARGET_DISPLAY_QUANTITIES: { [key: string]: number } = {
  // Existing Filter category
  'Air Filter': 43775,
  // Add new categories as needed
  'Boiler Tubes': 4620,
  'Concrete': 162000,
  // etc...
};
```

---

**Last Updated**: November 14, 2025
**Modified File**: `src/pages/DemandToPlan/DPK/DPKDemandConsolidationHQ.tsx`
