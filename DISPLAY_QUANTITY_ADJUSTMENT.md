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
  'Air Filter': 43809,
  'Fuel Filter': 39799,
  'Chemical filter': 30361,
  'Oil filter': 55221,
  'Special filter': 27417,
  'Multi function filter': 23625,
  'Water filter': 46414,
  'Gas filter': 36196
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

### DPK Demand Consolidation HQ (from HQ perspective):
| Material | Qty | Unit Price (IDR) | Total Value (IDR) |
|----------|-----|------------------|-------------------|
| Oil filter | 55,221 | 1,850,000 | 102,158,850,000 |
| Water filter | 46,414 | 6,500,000 | 301,691,000,000 |
| Air Filter | 43,809 | 2,500,000 | 109,522,500,000 |
| Fuel Filter | 39,799 | 15,750,000 | 626,834,250,000 |
| Gas filter | 36,196 | 18,500,000 | 669,626,000,000 |
| Chemical filter | 30,361 | 285,000 | 8,652,885,000 |
| Special filter | 27,417 | 4,250,000 | 116,522,250,000 |
| Multi function filter | 23,625 | 12,500,000 | 295,312,500,000 |
| **Total Qty** | **302,842** | | |
| **Category Total** | | | **IDR 2,230,320,235,000** |

**Approximately IDR 2.23 Trillion** (No scaling applied - raw calculation)

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
