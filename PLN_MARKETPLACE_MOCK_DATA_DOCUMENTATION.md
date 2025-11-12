# PLN Indonesia Power Marketplace - Mock Data Documentation

**Version:** 1.0
**Generated:** November 6, 2025
**System:** Procure-to-Invoice Platform

---

## Table of Contents

1. [Overview](#overview)
2. [Data Generation Scripts](#data-generation-scripts)
3. [Marketplace Mock Data](#marketplace-mock-data)
4. [APBA Workflow Mock Data](#apba-workflow-mock-data)
5. [Usage Instructions](#usage-instructions)
6. [Data Visualization](#data-visualization)
7. [Testing Scenarios](#testing-scenarios)

---

## 1. Overview

This document describes the comprehensive mock data generated for the PLN Indonesia Power Marketplace and APBA (Automated Procurement Business Application) workflows. The mock data simulates realistic industrial filtration product procurement scenarios across 9 specialized categories.

### Purpose
- **Marketplace Testing:** Demonstrate product catalog, search, filtering, and cart functionality
- **APBA Simulation:** Showcase end-to-end procurement workflow from requisition to delivery
- **User Training:** Provide realistic data for staff training and system walkthrough
- **System Demo:** Enable complete feature demonstration for stakeholders

### Data Coverage
- **9 Filter Categories** with 50+ unique products
- **8 PLN-Approved Suppliers** with complete contact information
- **5 PLN Facilities** across Indonesia
- **6 Purchase Requisitions** in various approval stages
- **4 Purchase Orders** with real-time tracking
- **Complete Technical Specifications** for all products
- **Compliance Certifications** (SNI, ISO, PLN Approvals)

---

## 2. Data Generation Scripts

### Script 1: Filter Marketplace Mock Data
**File:** `scripts/generateFilterMarketplaceMockData.ts`

**Purpose:** Generates product catalog data including categories, suppliers, and filter products.

**What It Creates:**
- 9 specialized filter categories
- 8 PLN-approved suppliers with complete profiles
- 50+ filter products with detailed technical specifications
- Pricing information (IDR)
- Stock levels and lead times
- Compliance certifications

**Execution:**
```bash
npx ts-node scripts/generateFilterMarketplaceMockData.ts
```

### Script 2: APBA Workflow Mock Data
**File:** `scripts/generateAPBAWorkflowMockData.ts`

**Purpose:** Generates procurement workflow data simulating the complete procure-to-invoice cycle.

**What It Creates:**
- 5 PLN power plant facilities
- 6 purchase requisitions with approval workflows
- 4 purchase orders with real-time tracking
- Order tracking with GPS coordinates
- 5-step delivery monitoring data

**Execution:**
```bash
npx ts-node scripts/generateAPBAWorkflowMockData.ts
```

---

## 3. Marketplace Mock Data

### 3.1 Product Categories

#### Filter Bahan Bakar (Fuel Filters)
**Products:** 4 items
**Price Range:** Rp 850,000 - Rp 8,500,000
**Applications:** Diesel fuel filtration, HFO filtration, biodiesel, fuel-water separation

**Sample Products:**
- Filter Bahan Bakar Solar Premium - 500 L/jam (Rp 1,250,000)
- Filter HFO Duplex Assembly - 2000 L/jam (Rp 8,500,000)
- Filter Biodiesel B30 Compatible - 750 L/jam (Rp 1,850,000)
- Fuel Water Separator Coalescing - 1200 L/jam (Rp 2,450,000)

#### Filter Bahan Kimia (Chemical Filters)
**Products:** 3 items
**Price Range:** Rp 1,850,000 - Rp 5,750,000
**Applications:** Acid filtration, alkali filtration, chemical dosing systems

**Sample Products:**
- Filter Asam Sulfat PTFE Lined - DN50 (Rp 4,250,000)
- Filter Caustic Soda 316L SS - DN80 (Rp 5,750,000)
- Filter Boiler Treatment Chemical - 50 L/min (Rp 1,850,000)

#### Filter Bahan Minyak (Oil Filters)
**Products:** 4 items
**Price Range:** Rp 850,000 - Rp 12,500,000
**Applications:** Turbine oil, generator bearing lubrication, hydraulic systems, transformer oil

**Sample Products:**
- Filter Oli Turbin Uap Main Lube Oil - 3 Micron (Rp 6,250,000)
- Filter Oli Generator Bearing Spin-on - 10 Micron (Rp 850,000)
- Filter Oli Hidraulik High Pressure - 5 Micron - 350 Bar (Rp 4,850,000)
- Filter Oli Transformer Activated Carbon - 200 L/min (Rp 12,500,000)

#### Filter Khusus (Specialized Filters)
**Products:** 2 items
**Price Range:** Rp 3,850,000 - Rp 8,250,000
**Applications:** Vacuum systems, high-pressure nitrogen filtration

**Sample Products:**
- Filter Vakum Turbin Condenser - Air Ejector System (Rp 3,850,000)
- Filter Bertekanan Tinggi Gas Nitrogen - 420 Bar (Rp 8,250,000)

#### Filter Multi Fungsi (Multifunctional Filters)
**Products:** 2 items
**Price Range:** Rp 4,850,000 - Rp 15,250,000
**Applications:** Filter-cooler combinations, multi-stage separation

**Sample Products:**
- Filter-Cooler Combination Hydraulic - 100 L/min (Rp 15,250,000)
- Filter Multi-Stage Fuel-Water-Particulate Separator (Rp 4,850,000)

#### Filter Udara dan Gas (Air and Gas Filters)
**Products:** 4 items
**Price Range:** Rp 3,250,000 - Rp 12,500,000
**Applications:** Gas turbine intake, compressed air systems, natural gas pipelines

**Sample Products:**
- Filter Intake Udara Turbin Gas Pre-Filter M5 - 50000 m³/hr (Rp 3,250,000)
- Filter HEPA H13 Offshore Gas Turbine - 10000 m³/hr (Rp 8,500,000)
- Filter Udara Tekan Coalescing Oil Removal - 100 Nm³/min (Rp 4,250,000)
- Filter Natural Gas Pipeline Cartridge - DN100 (Rp 12,500,000)

#### Penyaringan Air (Water Filtration)
**Products:** 4 items
**Price Range:** Rp 450,000 - Rp 125,000,000
**Applications:** Raw water treatment, RO pre-filtration, cooling water intake

**Sample Products:**
- Filter Air Baku Multimedia - 50 m³/hr (Rp 35,000,000)
- Filter Cartridge Pre-RO 5 Micron - 40 inch (Rp 18,500,000)
- Filter Activated Carbon Block Chlorine Removal - 10 inch (Rp 450,000)
- Self-Cleaning Strainer Cooling Water - 1000 m³/hr (Rp 125,000,000)

#### Saringan Uap (Steam Filters)
**Products:** 3 items
**Price Range:** Rp 1,850,000 - Rp 28,500,000
**Applications:** Steam line strainers, turbine inlet protection

**Sample Products:**
- Y-Strainer Uap Steam PN40 - DN80 - 316 SS (Rp 6,250,000)
- Basket Strainer Steam PN64 - DN150 - Cast Steel WCB (Rp 28,500,000)
- Filter Uap Proses Low Pressure - 5 bar - DN50 (Rp 1,850,000)

#### Spare Part dan Perlengkapan Filter (Spare Parts)
**Products:** 6 items
**Price Range:** Rp 185,000 - Rp 3,250,000
**Applications:** Replacement cartridges, seal kits, tools, accessories

**Sample Products:**
- Replacement Cartridge 10 Micron - 10 inch (Rp 185,000)
- O-Ring Seal Kit Viton - Various Sizes (Rp 650,000)
- Differential Pressure Gauge 0-2.5 bar (Rp 850,000)
- Filter Housing SS 316L Single Cartridge 10" (Rp 3,250,000)
- Automatic Drain Valve Float Type (Rp 1,250,000)
- Filter Wrench Tool Universal 3"-6" (Rp 450,000)

### 3.2 Supplier Profiles

#### 1. PT Donaldson Indonesia (SUP-000001)
- **Location:** Bekasi, Jawa Barat
- **Specialization:** Fuel and air filtration systems
- **Performance Rating:** 4.8/5.0
- **Certifications:** ISO 9001:2015, ISO 14001:2015, SNI Certified
- **Products:** Fuel filters, air filters, spare cartridges

#### 2. PT Parker Hannifin Indonesia (SUP-000002)
- **Location:** Bekasi, Jawa Barat
- **Specialization:** Hydraulic and fuel filtration
- **Performance Rating:** 4.9/5.0
- **Certifications:** ISO 9001:2015, ISO 45001, PLN Approved
- **Products:** HFO filters, steam strainers, high-pressure filters

#### 3. PT Pall Indonesia (SUP-000003)
- **Location:** Jakarta Selatan, DKI Jakarta
- **Specialization:** Industrial filtration and separation
- **Performance Rating:** 4.7/5.0
- **Certifications:** ISO 9001:2015, ISO 14001:2015, ASME Certified
- **Products:** Chemical filters, fuel-water separators, transformer oil filters

#### 4. PT Hydac Indonesia (SUP-000004)
- **Location:** Cikarang, Jawa Barat
- **Specialization:** Hydraulic filtration and conditioning
- **Performance Rating:** 4.6/5.0
- **Certifications:** ISO 9001:2015, ISO 16889, PLN Approved
- **Products:** Hydraulic filters, chemical filters, multifunctional filters

#### 5. PT Mann+Hummel Indonesia (SUP-000005)
- **Location:** Tangerang, Banten
- **Specialization:** Automotive and industrial filtration
- **Performance Rating:** 4.5/5.0
- **Certifications:** ISO 9001:2015, ISO/TS 16949, SNI Certified
- **Products:** Compressed air filters, spare parts

#### 6. PT Filtrex Indonesia (SUP-000006)
- **Location:** Jakarta Timur, DKI Jakarta
- **Specialization:** General industrial filtration
- **Performance Rating:** 4.4/5.0
- **Certifications:** ISO 9001:2015, PLN Approved
- **Products:** Cartridges, housings, water filters, spare parts

#### 7. PT Camfil Indonesia (SUP-000007)
- **Location:** Jakarta Pusat, DKI Jakarta
- **Specialization:** Air filtration and cleanroom technology
- **Performance Rating:** 4.7/5.0
- **Certifications:** ISO 9001:2015, ISO 14644, Eurovent Certified
- **Products:** Gas turbine intake filters, HEPA filters

#### 8. PT Pentair Indonesia (SUP-000008)
- **Location:** Tangerang Selatan, Banten
- **Specialization:** Water treatment and filtration
- **Performance Rating:** 4.6/5.0
- **Certifications:** ISO 9001:2015, NSF Certified, PLN Approved
- **Products:** Water filtration systems, self-cleaning strainers, filter housings

### 3.3 Technical Specifications Structure

Each product includes comprehensive technical specifications:

```json
{
  "filter_type": "String - Type of filter",
  "filtration_rating": "String - Micron rating or mesh size",
  "flow_rate": {
    "value": Number,
    "unit": "String - L/hr, m³/hr, etc.",
    "condition": "String - Operating conditions"
  },
  "pressure_rating": {
    "working": "String - Bar or PSI",
    "burst": "String - Maximum pressure",
    "test": "String - Test pressure"
  },
  "temperature_range": {
    "min": Number,
    "max": Number,
    "unit": "°C or °F"
  },
  "connections": {
    "inlet": "String - Connection type and size",
    "outlet": "String - Connection type and size",
    "drain": "String - Drain connection"
  },
  "material": {
    "housing": "String - Body material",
    "element": "String - Filter media material",
    "seals": "String - Gasket/O-ring material"
  },
  "dimensions": {
    "length": Number,
    "width": Number,
    "height": Number,
    "unit": "mm or inches"
  },
  "weight": Number (kg)
}
```

---

## 4. APBA Workflow Mock Data

### 4.1 PLN Facilities

#### 1. PLTU Suralaya (FAC-PLN-001)
- **Type:** Steam Power Plant
- **Location:** Cilegon, Banten
- **Capacity:** 3,400 MW
- **Contact:** Ir. Bambang Sutrisno

#### 2. PLTU Paiton (FAC-PLN-002)
- **Type:** Steam Power Plant
- **Location:** Probolinggo, Jawa Timur
- **Capacity:** 2,045 MW
- **Contact:** Ir. Hadi Purnomo

#### 3. PLTGU Cikarang Listrindo (FAC-PLN-003)
- **Type:** Gas Turbine Combined Cycle
- **Location:** Cikarang, Jawa Barat
- **Capacity:** 1,500 MW
- **Contact:** Ir. Siti Aminah, MT

#### 4. PLTD Belawan (FAC-PLN-004)
- **Type:** Diesel Power Plant
- **Location:** Medan, Sumatera Utara
- **Capacity:** 120 MW
- **Contact:** Drs. Ahmad Rahman

#### 5. PLTP Kamojang (FAC-PLN-005)
- **Type:** Geothermal Power Plant
- **Location:** Bandung, Jawa Barat
- **Capacity:** 200 MW
- **Contact:** Ir. Eko Prasetyo, MSc

### 4.2 Purchase Requisition Workflow

#### PR-2025110001 (Approved)
**Facility:** PLTU Suralaya
**Status:** Approved
**Requestor:** Ir. Bambang Sutrisno
**Total Value:** Rp 17,000,000

**Line Items:**
1. Filter Bahan Bakar Solar Premium (10 units) - Rp 12,500,000
2. Fuel Water Separator Coalescing (5 units) - Rp 12,250,000
3. Replacement Cartridge 10 Micron (50 units) - Rp 9,250,000

**Notes:** Urgent requirement for fuel filter replacement - scheduled maintenance

#### PR-2025110002 (Approved)
**Facility:** PLTU Paiton
**Status:** Approved
**Requestor:** Ir. Hadi Purnomo
**Total Value:** Rp 75,200,000

**Line Items:**
1. Filter Oli Turbin Main Lube Oil (4 units) - Rp 25,000,000
2. Filter Oli Generator Bearing (12 units) - Rp 10,200,000
3. Y-Strainer Uap Steam PN40 (8 units) - Rp 50,000,000

**Notes:** Quarterly maintenance stock replenishment

#### PR-2025110003 (In Procurement)
**Facility:** PLTGU Cikarang
**Status:** In Procurement
**Requestor:** Ir. Siti Aminah, MT
**Total Value:** Rp 179,800,000

**Line Items:**
1. Filter Intake Udara Turbin Gas Pre-Filter (24 units) - Rp 78,000,000
2. Filter HEPA H13 Offshore (12 units) - Rp 102,000,000
3. Filter Udara Tekan Coalescing (6 units) - Rp 25,500,000

**Notes:** Gas turbine air intake filter replacement project

#### PR-2025110004 (Pending Approval)
**Facility:** PLTD Belawan
**Status:** Pending Approval
**Requestor:** Drs. Ahmad Rahman
**Total Value:** Rp 31,800,000

**Line Items:**
1. Filter HFO Duplex Assembly (2 units) - Rp 17,000,000
2. Filter Biodiesel B30 Compatible (8 units) - Rp 14,800,000

**Notes:** Emergency procurement for fuel system upgrade

#### PR-2025110005 (Approved)
**Facility:** PLTP Kamojang
**Status:** Approved
**Requestor:** Ir. Eko Prasetyo, MSc
**Total Value:** Rp 98,500,000

**Line Items:**
1. Filter Air Baku Multimedia (1 unit) - Rp 35,000,000
2. Filter Cartridge Pre-RO (1 unit) - Rp 18,500,000
3. Filter Activated Carbon Block (100 units) - Rp 45,000,000

**Notes:** DM water plant filter renewal

#### PR-2025110006 (Draft)
**Facility:** PLTU Suralaya
**Status:** Draft
**Requestor:** Ir. Bambang Sutrisno
**Total Value:** Rp 42,000,000

**Line Items:**
1. Filter Oli Hidraulik High Pressure (6 units) - Rp 29,100,000
2. O-Ring Seal Kit Viton (10 units) - Rp 6,500,000
3. Differential Pressure Gauge (15 units) - Rp 12,750,000

**Notes:** Planning for next month maintenance - pending budget approval

### 4.3 Purchase Order Tracking

#### PO-2025110001 (Arrived)
**Status:** ARRIVED_AT_DESTINATION ✅
**PR Reference:** PR-2025110001
**Supplier:** PT Donaldson Indonesia
**Facility:** PLTU Suralaya
**Expected Delivery:** 2025-11-04
**Actual Arrival:** 2025-11-03 (1 day early)
**Tracking:** TRK-DNL-20251101-001

**Tracking Timeline:**
1. **2025-11-01 10:00** - Order Placed (Bekasi)
2. **2025-11-01 14:00** - Processing Order (Warehouse)
3. **2025-11-02 08:00** - Shipped (Distribution Center)
4. **2025-11-03 09:00** - In Delivery (En Route)
5. **2025-11-03 15:30** - Arrived at Destination (PLTU Suralaya) ✅

#### PO-2025110002 (In Transit)
**Status:** DELIVERY 🚚
**PR Reference:** PR-2025110002
**Supplier:** PT Parker Hannifin Indonesia
**Facility:** PLTU Paiton
**Expected Delivery:** 2025-11-06
**Current Location:** Surabaya Transit Hub
**Tracking:** TRK-PKR-20251102-002

**Tracking Timeline:**
1. **2025-11-02 11:00** - Order Placed (Bekasi)
2. **2025-11-02 16:00** - Processing Order (Manufacturing)
3. **2025-11-04 07:00** - Shipped (Jakarta Hub)
4. **2025-11-05 10:00** - In Delivery (Surabaya) 🚚 **← Current Status**

#### PO-2025110003 (Manufacturing)
**Status:** PROCESSING_ORDER ⚙️
**PR Reference:** PR-2025110003
**Supplier:** PT Camfil Indonesia
**Facility:** PLTGU Cikarang
**Expected Delivery:** 2025-11-18
**Lead Time:** 14 days (custom HEPA filters)
**Tracking:** TRK-CAM-20251104-003

**Tracking Timeline:**
1. **2025-11-04 09:00** - Order Placed (Jakarta)
2. **2025-11-04 15:00** - Processing Order (Manufacturing) ⚙️ **← Current Status**

#### PO-2025110005 (Shipped)
**Status:** SHIPPED 📦
**PR Reference:** PR-2025110005
**Supplier:** PT Pentair Indonesia
**Facility:** PLTP Kamojang
**Expected Delivery:** 2025-11-08
**Current Location:** Tangerang Loading Bay
**Tracking:** TRK-PEN-20251105-005

**Tracking Timeline:**
1. **2025-11-05 10:00** - Order Placed (Tangerang)
2. **2025-11-05 14:00** - Processing Order (Warehouse)
3. **2025-11-06 08:00** - Shipped (Oversized Load) 📦 **← Current Status**

### 4.4 Order Status Distribution

| Status | Count | Percentage |
|--------|-------|------------|
| Arrived at Destination | 1 | 25% |
| In Delivery | 1 | 25% |
| Shipped | 1 | 25% |
| Processing Order | 1 | 25% |
| **Total Orders** | **4** | **100%** |

---

## 5. Usage Instructions

### 5.1 Running the Mock Data Generators

#### Prerequisites
```bash
# Ensure dependencies are installed
npm install

# Ensure .env file has Supabase credentials
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

#### Step 1: Generate Marketplace Data
```bash
# Generate categories, suppliers, and products
npx ts-node scripts/generateFilterMarketplaceMockData.ts
```

**Expected Output:**
```
🚀 Starting PLN Marketplace Filter Products Mock Data Generation...

📦 Step 1: Inserting Filter Categories...
✅ Inserted 9 categories

🏢 Step 2: Inserting Suppliers...
✅ Inserted 8 suppliers

🔧 Step 3: Inserting Filter Products...
   ✓ Inserted batch 1 (20 items)
   ✓ Inserted batch 2 (20 items)
   ✓ Inserted batch 3 (10 items)
✅ Inserted 50 filter products

📊 Mock Data Generation Summary:
═══════════════════════════════════════════════════════════
✓ Categories: 9
✓ Suppliers: 8
✓ Filter Products: 50
✨ Mock data generation completed successfully!
```

#### Step 2: Generate APBA Workflow Data
```bash
# Generate PRs, POs, and tracking data
npx ts-node scripts/generateAPBAWorkflowMockData.ts
```

**Expected Output:**
```
🚀 Starting APBA Workflow Mock Data Generation...

🏭 Step 1: Inserting PLN Facilities...
✅ Inserted 5 PLN facilities

📋 Step 2: Fetching item prices...
✅ Loaded 50 item prices

📝 Step 3: Inserting Purchase Requisitions...
   ✓ Created PR PR-2025110001 (3 lines, Total: Rp 17,000,000)
   ✓ Created PR PR-2025110002 (3 lines, Total: Rp 75,200,000)
   ... (6 total)
✅ Inserted 6 purchase requisitions

📦 Step 4: Inserting Purchase Orders...
   ✓ Created PO PO-2025110001 (Status: ARRIVED_AT_DESTINATION, 5 tracking points)
   ✓ Created PO PO-2025110002 (Status: DELIVERY, 4 tracking points)
   ... (4 total)
✅ Inserted 4 purchase orders with tracking

✨ APBA workflow mock data generation completed successfully!
```

### 5.2 Verifying Data in Database

#### Check Categories
```sql
SELECT category_code, category_name, COUNT(marketplace_items.item_id) as item_count
FROM marketplace_categories
LEFT JOIN marketplace_items ON marketplace_categories.category_id = marketplace_items.category_id
GROUP BY category_code, category_name
ORDER BY category_code;
```

#### Check Purchase Requisitions
```sql
SELECT pr_number, pr_status, requestor_name, total_value,
       (SELECT COUNT(*) FROM marketplace_pr_lines WHERE pr_id = marketplace_pr_header.pr_id) as line_count
FROM marketplace_pr_header
ORDER BY pr_date DESC;
```

#### Check Order Tracking
```sql
SELECT po_number, current_status, current_step,
       supplier:marketplace_suppliers(supplier_name),
       facility:marketplace_pln_facilities(facility_name)
FROM marketplace_orders
ORDER BY order_placed_date DESC;
```

---

## 6. Data Visualization

### 6.1 Marketplace Catalog View

The generated data will appear in the marketplace as:

```
┌─────────────────────────────────────────────────────────────┐
│ 🔍 Search: [fuel filter]                    Sort: Price ▼  │
│ Found: 4 products in Filter Bahan Bakar                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐         │
│  │ [IMG]  │  │ [IMG]  │  │ [IMG]  │  │ [IMG]  │         │
│  │        │  │        │  │        │  │        │         │
│  │ Filter │  │ Filter │  │ Filter │  │  Fuel  │         │
│  │ Diesel │  │  HFO   │  │Biodisl │  │ Water  │         │
│  │Premium │  │ Duplex │  │  B30   │  │Sepratr │         │
│  │        │  │        │  │        │  │        │         │
│  │ Rp 1.2M│  │ Rp 8.5M│  │ Rp 1.8M│  │ Rp 2.4M│         │
│  │[Add]   │  │[Add]   │  │[Add]   │  │[Add]   │         │
│  └────────┘  └────────┘  └────────┘  └────────┘         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 APBA Workflow Visualization

The procurement workflow is visualized as:

```
Purchase Requisition Flow:
┌─────────┐    ┌──────────┐    ┌─────────┐    ┌───────────┐
│  DRAFT  │ →  │ PENDING  │ →  │APPROVED │ →  │    IN     │
│         │    │ APPROVAL │    │         │    │PROCUREMENT│
└─────────┘    └──────────┘    └─────────┘    └───────────┘
     1              1               3                1


Order Tracking (5-Step Process):
Step 1          Step 2           Step 3         Step 4        Step 5
┌─────────┐    ┌──────────┐    ┌─────────┐    ┌────────┐    ┌────────┐
│ ORDER   │ →  │PROCESSING│ →  │ SHIPPED │ →  │DELIVERY│ →  │ARRIVED │
│ PLACED  │    │  ORDER   │    │         │    │        │    │        │
└─────────┘    └──────────┘    └─────────┘    └────────┘    └────────┘
   (100%)         (25%)          (25%)         (25%)         (25%)
```

---

## 7. Testing Scenarios

### 7.1 Marketplace Testing

#### Scenario 1: Product Search and Filter
**Steps:**
1. Navigate to Marketplace
2. Select "Filter Bahan Bakar" category
3. Search for "diesel"
4. Sort by "Price: Low to High"

**Expected Results:**
- 4 fuel filter products displayed
- Filter Bahan Bakar Solar Premium appears first (Rp 1,250,000)
- Technical specifications visible in detail view

#### Scenario 2: Cart Management
**Steps:**
1. Add "Filter Diesel Premium" (quantity: 5)
2. Add "Fuel Water Separator" (quantity: 2)
3. View cart
4. Update quantities
5. Proceed to checkout

**Expected Results:**
- Cart shows 2 line items
- Subtotal calculated correctly
- Tax (11%) applied
- Facility selection required

#### Scenario 3: Purchase Request Creation
**Steps:**
1. Complete cart checkout
2. Select delivery facility (e.g., PLTU Suralaya)
3. Submit PR
4. View PR in "My Purchase Requests"

**Expected Results:**
- PR created with unique number
- Status: "Draft"
- All line items transferred from cart
- Cart cleared after submission

### 7.2 APBA Workflow Testing

#### Scenario 1: PR Approval Flow
**Test PR:** PR-2025110004 (Status: Pending Approval)

**Steps:**
1. View PR details
2. Check approval workflow
3. Simulate approval action
4. Verify status change to "Approved"

**Expected Results:**
- Approval history logged
- Status updated
- Email notifications sent (if configured)

#### Scenario 2: Order Tracking
**Test PO:** PO-2025110002 (Status: In Delivery)

**Steps:**
1. View order tracking page
2. Check current status: "DELIVERY"
3. View tracking history
4. Check GPS location on map

**Expected Results:**
- 5-step progress indicator shows step 4
- 4 tracking updates visible
- Last location: Surabaya Transit Hub
- ETA displayed: 2025-11-06

#### Scenario 3: End-to-End Workflow
**Complete Flow Test:**

1. **Create PR** (PR-2025110006 - Draft)
   - Review line items
   - Submit for approval

2. **Approve PR** (Change status to Approved)
   - Manager approval simulation

3. **Convert to PO** (Create PO from PR)
   - Select supplier
   - Generate PO number

4. **Track Delivery** (Monitor 5 steps)
   - Order Placed → Processing → Shipped → Delivery → Arrived

5. **Create Goods Receipt** (Upon arrival)
   - Verify quantities
   - Quality check

6. **Process Invoice** (Complete cycle)
   - Match GR with PO
   - 3-way matching
   - Payment approval

---

## 8. Data Maintenance

### 8.1 Updating Mock Data

To refresh mock data:

```bash
# Re-run both generators (will upsert/update existing data)
npx ts-node scripts/generateFilterMarketplaceMockData.ts
npx ts-node scripts/generateAPBAWorkflowMockData.ts
```

### 8.2 Clearing Mock Data

To remove all mock data:

```sql
-- Clear in reverse order of dependencies
DELETE FROM marketplace_order_tracking;
DELETE FROM marketplace_order_lines;
DELETE FROM marketplace_orders;
DELETE FROM marketplace_pr_lines;
DELETE FROM marketplace_pr_approvals;
DELETE FROM marketplace_pr_header;
DELETE FROM marketplace_cart_items;
DELETE FROM marketplace_pln_facilities;
DELETE FROM marketplace_items;
DELETE FROM marketplace_suppliers;
DELETE FROM marketplace_categories;
```

### 8.3 Adding Custom Products

To add your own products:

1. Edit `scripts/generateFilterMarketplaceMockData.ts`
2. Add product object to `filterProducts` array
3. Follow the structure of existing products
4. Re-run the generator script

**Example:**
```typescript
{
  item_code: 'FLT-BBK-NEW',
  item_name: 'Your New Filter Product',
  item_description: 'Detailed description...',
  category_id: 'CAT-FILTER-BBK',
  supplier_id: 'SUP-000001',
  unit_price: 2500000.00,
  currency: 'IDR',
  stock_quantity: 20,
  lead_time_days: 14,
  unit_of_measure: 'PIECE',
  technical_specifications: { /* ... */ },
  compliance_certifications: ['SNI', 'ISO 9001'],
  warranty_info: '12 months warranty',
  is_active: true
}
```

---

## 9. Troubleshooting

### Common Issues

#### Issue 1: "Item not found in marketplace"
**Cause:** APBA script running before marketplace data populated
**Solution:** Run `generateFilterMarketplaceMockData.ts` first

#### Issue 2: Duplicate key errors
**Cause:** Data already exists
**Solution:** Scripts use upsert - safe to re-run, or clear data first

#### Issue 3: Invalid foreign key
**Cause:** Referenced supplier_id or category_id doesn't exist
**Solution:** Verify all suppliers and categories inserted successfully

#### Issue 4: Price calculation mismatch
**Cause:** Item prices updated but PR totals not recalculated
**Solution:** Delete PRs and regenerate after price updates

---

## 10. Support and Contact

For questions or issues with mock data:

**Technical Support:**
- PLN Procurement IT Team
- Email: procurement-support@pln.co.id

**Data Quality:**
- Verify all products have complete specifications
- Check that prices are realistic for industrial equipment
- Ensure lead times align with actual supplier capabilities

---

**Document Version:** 1.0
**Last Updated:** November 6, 2025
**Next Review:** December 6, 2025
