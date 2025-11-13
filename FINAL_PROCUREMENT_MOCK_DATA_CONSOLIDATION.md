# Final Procurement Mock Data Consolidation

## Overview
All Final Procurement Table mock data has been consolidated into a single comprehensive file for easier maintenance and consistency.

## Consolidated File
**Location**: `src/data/finalProcurementMockData.ts`

## What Was Merged

### 1. Annual Budget Data
- Total Budget: Rp 848,457,012,000
- Total Units: 3,234,734
- Currency: IDR

### 2. Category Budget Distribution
- **Others**: Rp 776,557,012,000 (91.5%)
- **Ash Handling Systems**: Rp 11,800,000,000 (1.39%)
- **Electrical Components**: Rp 18,800,000,000 (2.22%)
- **Filters**: Rp 29,400,000,000 (3.47%)
- **Lubricants & Fluids**: Rp 11,900,000,000 (1.4%)

### 3. Category Summaries
Four main procurement categories with item counts and totals:
- Ash Handling Systems (4 items)
- Filters (5 items)
- Lubricants & Fluids (3 items)
- Electrical Components (3 items)

### 4. Procurement Requests
15 detailed procurement request items including:
- Material ID
- Material Name
- Material Value
- Category
- Unit Requests (breakdown by PLN units)
- Total Quantity

### 5. Material Procurement Data
Monthly breakdown for all 15 materials including:
- Monthly net procurement quantities
- Unit prices
- Total amounts per month
- Annual totals

## Data Structure

```typescript
// Main exports
export const annualBudget: AnnualBudgetData
export const categoryBudgetDistribution: CategoryBudgetData[]
export const categorySummaries: CategorySummary[]
export const procurementRequests: ProcurementRequestItem[]
export const materialProcurementData: Record<string, MaterialProcurementData>

// Helper functions
export const formatBudget(value: number): string
export const formatUnits(value: number): string
export const getProcurementSummary()
export const getCategoryByName(categoryName: string)
export const getItemsByCategory(categoryName: string)
export const getAllItems()
export const getMaterialMonthlyData(materialName: string)
```

## Materials Included

### Ash Handling Systems
1. Bottom Ash Removal Systems (5 systems)
2. Fly Ash Handling Equipment (7 sets)
3. Ash Conveyors (21 units)
4. Ash Silos (9 units)

### Filters
5. Filter air (8,000 pcs)
6. Filter Udara Cartridge (1,060 pcs)
7. Oil Filter (1,320 pcs)
8. Filter Gas (790 pcs)
9. Filter Udara Kassa (1,290 pcs)

### Lubricants & Fluids
10. Turbine Oil (37,000 liters)
11. Hydraulic Oil (21,500 liters)
12. Gear Oil (16,000 liters)

### Electrical Components
13. Circuit Breakers (140 units)
14. Transformers (30 units)
15. Power Cables (43,500 meters)

## Previous Files (Now Consolidated)
- `src/data/annualBudgetMockData.ts` ➡️ Merged
- `src/data/finalProcurementData.ts` ➡️ Merged
- `src/data/retrieveProcurementRequestMockData.ts` ➡️ Merged

## Updated Components
The following components now use the consolidated mock data:
- `src/components/DemandToPlan/RetrieveProcurementRequestTable.tsx`
- `src/pages/DemandToPlan/DPK/DPKFinalProcurement.tsx`

## Benefits
1. **Single Source of Truth**: All Final Procurement data in one file
2. **Consistency**: Ensures data alignment across all views
3. **Easier Maintenance**: Update data in one place
4. **No Database Dependency**: Pure TypeScript mock data
5. **Type Safety**: Full TypeScript interfaces for all data structures

## Usage Example

```typescript
import {
  annualBudget,
  categorySummaries,
  procurementRequests,
  materialProcurementData,
  formatBudget,
  getProcurementSummary
} from '../data/finalProcurementMockData';

// Get annual budget
const totalBudget = annualBudget.totalBudget;

// Get all procurement requests
const allRequests = procurementRequests;

// Get monthly data for a specific material
const filterAirData = materialProcurementData['Filter air'];

// Get summary
const summary = getProcurementSummary();
```

## Monthly Data Structure
Each material includes 12 months of data with:
- Month name
- Net procurement quantity
- Unit price
- Total amount

This enables detailed monthly forecasting, trend analysis, and export functionality.
