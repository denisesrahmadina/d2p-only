# Retrieve Procurement Request - Data Connection Guide

## Data Flow Overview

The "Retrieve Procurement Request" table gets its data directly from `finalProcurementMockData.ts`. All values are calculated dynamically - **there are no hardcoded summaries**.

## Source File
**Location**: `src/data/finalProcurementMockData.ts`

### Main Data Export
```typescript
export const procurementRequests: ProcurementRequestItem[] = [
  // 15 items total:
  // - 4 Ash Handling Systems
  // - 5 Filters
  // - 3 Lubricants & Fluids
  // - 3 Electrical Components
]
```

## Component Connection
**Location**: `src/components/DemandToPlan/RetrieveProcurementRequestTable.tsx`

### Import Statement
```typescript
import {
  procurementRequests,
  materialProcurementData
} from '../../data/finalProcurementMockData';

const mockProcurementData: ProcurementRequest[] = procurementRequests as ProcurementRequest[];
```

### Data Usage Flow
1. **Line 239**: `const retrievedData = mockProcurementData;`
2. **Lines 277-283**: Groups data by category
3. **Line 307**: Calculates total value per category
4. **Lines 309-311**: Finds most requested item per category
5. **Line 344**: Shows items count per category

## Dynamic Calculations

All displayed values are calculated in real-time from the data:

| Display Field | Calculation | Code Line |
|--------------|-------------|-----------|
| **Items Count** | `items.length` | 344 |
| **Total Value** | `items.reduce((sum, item) => sum + item.materialValue, 0)` | 307 |
| **Most Requested** | `items.reduce((max, item) => ...)` | 309-311 |

## How to Update Data

### To Change a Material's Value:
1. Open `src/data/finalProcurementMockData.ts`
2. Find the material in `procurementRequests` array
3. Update the `materialValue` field
4. Save and refresh - changes appear immediately

**Example:**
```typescript
{
  id: '1',
  materialId: 'MTL-073',
  materialName: 'Bottom Ash Removal Systems',
  materialValue: 5000000000, // Changed from 3700000000
  category: 'Ash Handling Systems',
  // ...
}
```

### To Add a New Item:
1. Open `src/data/finalProcurementMockData.ts`
2. Add new object to `procurementRequests` array
3. Also add corresponding monthly data to `materialProcurementData` object
4. Save and refresh

### To Change a Category:
1. Open `src/data/finalProcurementMockData.ts`
2. Find the item and change its `category` field
3. Save and refresh - item moves to new category

## Current Data Summary

Based on current `procurementRequests` data:

### Ash Handling Systems (4 items)
- Bottom Ash Removal Systems: IDR 3,700,000,000
- Fly Ash Handling Equipment: IDR 4,200,000,000
- Ash Conveyors: IDR 2,100,000,000
- Ash Silos: IDR 1,800,000,000
- **Total**: IDR 11,800,000,000

### Filters (5 items)
- Filter air: IDR 20,000,000,000
- Filter Udara Cartridge: IDR 3,500,000,000
- Oil Filter: IDR 1,900,000,000
- Filter Gas: IDR 2,400,000,000
- Filter Udara Kassa: IDR 1,600,000,000
- **Total**: IDR 29,400,000,000

### Lubricants & Fluids (3 items)
- Turbine Oil: IDR 5,200,000,000
- Hydraulic Oil: IDR 3,800,000,000
- Gear Oil: IDR 2,900,000,000
- **Total**: IDR 11,900,000,000

### Electrical Components (3 items)
- Circuit Breakers: IDR 6,500,000,000
- Transformers: IDR 8,200,000,000
- Power Cables: IDR 4,100,000,000
- **Total**: IDR 18,800,000,000

## Important Notes

✅ **Direct Connection**: Changes to `procurementRequests` immediately reflect in the UI

✅ **Dynamic Calculations**: All summary values are computed on-the-fly

✅ **No Cache Issues**: Component recalculates on every render

✅ **Type Safety**: Full TypeScript support with proper interfaces

❌ **Note**: The `categorySummaries` export exists but is NOT used by this component (reserved for other features)

## Troubleshooting

### Changes not appearing?
1. Check you're editing the correct file: `src/data/finalProcurementMockData.ts`
2. Make sure you're updating the `procurementRequests` array
3. Verify the file saved properly
4. Hard refresh the browser (Ctrl+Shift+R or Cmd+Shift+R)
5. Check browser console for any errors

### Incorrect totals?
The component calculates totals by summing `materialValue` for all items in a category. Verify your material values are correct in the `procurementRequests` array.
