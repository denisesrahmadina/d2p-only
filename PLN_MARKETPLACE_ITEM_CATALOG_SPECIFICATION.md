# PLN Indonesia Power Marketplace - Item Catalog System Specification

**Document Version:** 1.0
**Last Updated:** November 6, 2025
**Owner:** PLN Indonesia Power Procurement Department
**System:** Accenture Intelligent Procurement Suite

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Complete Item Structure Definition](#2-complete-item-structure-definition)
3. [Category Taxonomy](#3-category-taxonomy)
4. [User Interface Specifications](#4-user-interface-specifications)
5. [Technical Requirements](#5-technical-requirements)
6. [Business Rules](#6-business-rules)
7. [Data Quality Standards](#7-data-quality-standards)
8. [Implementation Guidelines](#8-implementation-guidelines)

---

## 1. Executive Summary

### 1.1 Purpose
This document defines the comprehensive specifications for the PLN Indonesia Power Marketplace Item Catalog system, which manages procurement of filters, equipment, and related materials for power plant operations across Indonesia.

### 1.2 Scope
The catalog system encompasses 10 specialized filter categories and their associated subcategories, covering fuel filters, chemical filters, oil filters, air/gas filters, water filtration, steam filters, and spare parts with full technical specification management, compliance tracking, and supplier integration.

### 1.3 Key Objectives
- Standardize item data structure across all PLN power plants
- Enable advanced search and filtering capabilities
- Track compliance certifications (SNI, ISO, PLN standards)
- Integrate with BPA (Blanket Purchase Agreement) contracts
- Support multi-facility procurement workflows
- Maintain supplier performance metrics

---

## 2. Complete Item Structure Definition

### 2.1 Core Item Fields

#### 2.1.1 Item Identification

| Field Name | Data Type | Max Length | Required | Format/Pattern | Description |
|------------|-----------|------------|----------|----------------|-------------|
| `item_id` | text | 50 | Yes | `ITM-{YYYYMMDD}-{6DIGIT}` | Unique system-generated identifier |
| `item_code` | text | 50 | Yes | Alphanumeric, uppercase | PLN-standardized product code (e.g., `FLT-BBK-001`) |
| `item_name` | text | 200 | Yes | - | Full descriptive name in Bahasa Indonesia |
| `item_description` | text | 2000 | No | - | Detailed product description including use cases |

**Validation Rules:**
- `item_id` must be unique across the entire system
- `item_code` must follow PLN coding standards (see Section 2.4)
- `item_name` must not contain special characters except `-`, `/`, `&`
- `item_description` should include intended application and compatibility information

**Examples:**
```
item_id: ITM-20251106-000145
item_code: FLT-BBK-001
item_name: Filter Bahan Bakar Solar Premium - Kapasitas 500 L/jam
item_description: Filter bahan bakar tipe cartridge untuk pembangkit diesel dengan kapasitas 500 liter/jam. Cocok untuk PLTD dengan generator 500-1000 kVA. Material housing stainless steel 316L. Efisiensi penyaringan 99.9% untuk partikel >10 mikron.
```

#### 2.1.2 Categorization

| Field Name | Data Type | Max Length | Required | Format/Pattern | Description |
|------------|-----------|------------|----------|----------------|-------------|
| `category_id` | text | 50 | Yes | `CAT-{CODE}` | Foreign key to marketplace_categories |
| `category_name` | text | 200 | - | - | Denormalized for display (populated by join) |
| `subcategory` | jsonb | - | No | Array of strings | Secondary categorizations |
| `application_area` | jsonb | - | Recommended | Array of strings | Power plant areas where item is used |

**Validation Rules:**
- `category_id` must exist in marketplace_categories table
- `subcategory` must contain valid subcategory codes from approved list
- `application_area` values must be from predefined PLN facility zones

**Examples:**
```json
{
  "category_id": "CAT-FILTER-BBK",
  "subcategory": ["Cartridge Type", "High Flow", "Diesel Compatible"],
  "application_area": ["PLTD Generator Room", "Fuel Storage Facility", "Day Tank Area"]
}
```

#### 2.1.3 Supplier Information

| Field Name | Data Type | Max Length | Required | Format/Pattern | Description |
|------------|-----------|------------|----------|----------------|-------------|
| `supplier_id` | text | 50 | Yes | `SUP-{6DIGIT}` | Foreign key to marketplace_suppliers |
| `supplier_name` | text | 200 | - | - | Denormalized for display |
| `supplier_part_number` | text | 100 | Recommended | - | Manufacturer's original part number |
| `brand` | text | 100 | Recommended | - | Brand name (e.g., Donaldson, Parker, Pall) |
| `country_of_origin` | text | 100 | Recommended | ISO 3166-1 alpha-2 | Manufacturing country code |

**Validation Rules:**
- `supplier_id` must exist in marketplace_suppliers table
- `supplier_id` must reference PLN-approved supplier (is_pln_approved = true)
- `country_of_origin` must be valid ISO country code

#### 2.1.4 Pricing and Inventory

| Field Name | Data Type | Precision | Required | Constraints | Description |
|------------|-----------|-----------|----------|-------------|-------------|
| `unit_price` | numeric | 15,2 | Yes | >= 0 | Price per unit in IDR |
| `currency` | text | 3 | Yes | ISO 4217 | Default: 'IDR' |
| `stock_quantity` | integer | - | Yes | >= 0 | Current available stock |
| `minimum_order_quantity` | integer | - | Recommended | >= 1 | Minimum order quantity |
| `price_per_unit_basis` | text | 20 | Recommended | - | Pricing basis (e.g., "per piece", "per set", "per meter") |
| `price_valid_until` | timestamptz | - | No | - | Price validity expiration date |
| `last_price_update` | timestamptz | - | Auto | - | Timestamp of last price change |

**Validation Rules:**
- `unit_price` must be positive
- `currency` must be valid ISO 4217 code
- `stock_quantity` updates must trigger inventory alerts if below threshold
- Price changes must be logged in price_history table (audit trail)

**Pricing Examples:**
```
Basic Item:
  unit_price: 1250000.00
  currency: IDR
  price_per_unit_basis: per piece

Bulk Item:
  unit_price: 850000.00
  currency: IDR
  price_per_unit_basis: per meter
  minimum_order_quantity: 10
```

#### 2.1.5 Lead Time and Availability

| Field Name | Data Type | Max Length | Required | Constraints | Description |
|------------|-----------|------------|----------|-------------|-------------|
| `lead_time_days` | integer | - | Yes | >= 0 | Standard delivery time in days |
| `lead_time_basis` | text | 50 | Recommended | - | Basis for lead time (ex-stock, ex-factory, import) |
| `availability_status` | text | 50 | Yes | Enum | Current availability (In Stock, Low Stock, Out of Stock, On Order, Discontinued) |
| `reorder_point` | integer | - | Recommended | >= 0 | Stock level triggering reorder |
| `safety_stock_level` | integer | - | Recommended | >= 0 | Minimum safety stock requirement |

**Availability Status Enum Values:**
- `IN_STOCK` - Available for immediate delivery
- `LOW_STOCK` - Stock below reorder point
- `OUT_OF_STOCK` - No stock available, awaiting replenishment
- `ON_ORDER` - Currently being procured
- `DISCONTINUED` - No longer available from supplier
- `PRE_ORDER` - Available for advance ordering only

#### 2.1.6 Unit of Measure

| Field Name | Data Type | Max Length | Required | Format/Pattern | Description |
|------------|-----------|------------|----------|----------------|-------------|
| `unit_of_measure` | text | 20 | Yes | Standard UOM codes | Base unit of measure |
| `uom_conversion` | jsonb | - | No | Structured object | Conversion factors for alternate UOMs |
| `packaging_info` | text | 500 | No | - | Packaging and shipping details |

**Standard UOM Codes:**
- `PIECE` / `PCS` - Individual items
- `SET` - Complete sets
- `METER` / `M` - Linear measurement
- `LITER` / `L` - Volume
- `KILOGRAM` / `KG` - Weight
- `BOX` - Boxed quantity
- `ROLL` - Rolled materials
- `PALLET` - Pallet quantity

**UOM Conversion Example:**
```json
{
  "base_uom": "PIECE",
  "conversions": [
    {"uom": "BOX", "factor": 10, "description": "1 Box = 10 Pieces"},
    {"uom": "PALLET", "factor": 240, "description": "1 Pallet = 240 Pieces (24 Boxes)"}
  ]
}
```

#### 2.1.7 Technical Specifications

| Field Name | Data Type | Format | Required | Description |
|------------|-----------|--------|----------|-------------|
| `technical_specifications` | jsonb | Structured object | Highly Recommended | Complete technical specifications |
| `dimensions` | jsonb | Structured object | Recommended | Physical dimensions |
| `weight` | numeric(10,3) | Kilograms | Recommended | Net weight in kg |
| `material_composition` | text | 500 | Recommended | Materials used in construction |

**Technical Specifications Structure:**
```json
{
  "technical_specifications": {
    "filter_type": "Cartridge",
    "filtration_rating": "10 micron absolute",
    "flow_rate": {
      "value": 500,
      "unit": "L/hr",
      "condition": "@ 25°C, clean filter"
    },
    "pressure_rating": {
      "working_pressure": "10 bar",
      "burst_pressure": "40 bar",
      "test_pressure": "15 bar"
    },
    "temperature_range": {
      "min": -20,
      "max": 120,
      "unit": "°C"
    },
    "connections": {
      "inlet": "BSP 1 inch",
      "outlet": "BSP 1 inch",
      "drain": "BSP 1/2 inch"
    },
    "filter_media": {
      "type": "Cellulose + Synthetic blend",
      "area": "2.5 m²",
      "efficiency": "99.9% @ 10 micron"
    },
    "compatibility": {
      "fluids": ["Diesel fuel", "Biodiesel B20", "Light fuel oil"],
      "standards": ["ISO 4406", "ISO 16889"]
    }
  },
  "dimensions": {
    "length": 350,
    "width": 250,
    "height": 450,
    "unit": "mm",
    "installation_clearance": {
      "top": 200,
      "side": 150,
      "unit": "mm"
    }
  },
  "weight": 12.500
}
```

#### 2.1.8 Compliance Certifications

| Field Name | Data Type | Format | Required | Description |
|------------|-----------|--------|----------|-------------|
| `compliance_certifications` | jsonb | Array of objects | Critical | All applicable certifications |
| `compliance_status` | text | Enum | Yes | Overall compliance status |
| `last_compliance_check` | timestamptz | - | Auto | Last verification date |

**Compliance Status Enum:**
- `FULLY_COMPLIANT` - All required certifications valid
- `PENDING_RENEWAL` - Certifications expiring within 90 days
- `NON_COMPLIANT` - Missing required certifications
- `UNDER_REVIEW` - Compliance verification in progress

**Compliance Certifications Structure:**
```json
{
  "compliance_certifications": [
    {
      "certification_type": "SNI",
      "certification_number": "SNI 19-1234-2020",
      "certification_name": "Filter Bahan Bakar Diesel",
      "issuing_authority": "Badan Standardisasi Nasional",
      "issue_date": "2023-03-15",
      "expiry_date": "2026-03-14",
      "status": "VALID",
      "certificate_url": "https://storage.pln.com/certs/SNI-19-1234-2020.pdf"
    },
    {
      "certification_type": "ISO",
      "certification_number": "ISO 9001:2015",
      "certification_name": "Quality Management System",
      "issuing_authority": "TÜV SÜD",
      "issue_date": "2024-01-10",
      "expiry_date": "2027-01-09",
      "status": "VALID",
      "certificate_url": "https://storage.pln.com/certs/ISO-9001-2015.pdf"
    },
    {
      "certification_type": "PLN_APPROVAL",
      "certification_number": "PLN-APP-2024-00123",
      "certification_name": "PLN Technical Approval",
      "issuing_authority": "PLN Procurement Division",
      "issue_date": "2024-06-01",
      "expiry_date": "2025-05-31",
      "status": "VALID",
      "certificate_url": "https://storage.pln.com/certs/PLN-APP-2024-00123.pdf"
    }
  ]
}
```

**Required Certifications by Category:**

| Category | Required Certifications |
|----------|------------------------|
| Filter Bahan Bakar | SNI 19-xxx, ISO 9001, PLN Technical Approval |
| Filter Bahan Kimia | SNI, ISO 9001, ISO 14001, MSDS |
| Filter Udara dan Gas | SNI, ISO 9001, Efficiency Test Report |
| Safety Equipment | SNI, ISO 45001, PLN Safety Approval |

#### 2.1.9 Warranty Information

| Field Name | Data Type | Max Length | Required | Description |
|------------|-----------|------------|----------|-------------|
| `warranty_info` | text | 2000 | Recommended | Complete warranty terms |
| `warranty_period_months` | integer | - | Recommended | Standard warranty period |
| `warranty_conditions` | jsonb | - | No | Detailed warranty conditions |

**Warranty Information Example:**
```
warranty_info: "12 bulan garansi penuh dari tanggal instalasi. Garansi mencakup defect material dan workmanship. Tidak termasuk kerusakan akibat penggunaan tidak sesuai spesifikasi atau force majeure."

warranty_period_months: 12

warranty_conditions: {
  "coverage": [
    "Material defects",
    "Manufacturing defects",
    "Performance degradation beyond specification"
  ],
  "exclusions": [
    "Normal wear and tear",
    "Improper installation",
    "Use with incompatible fluids",
    "Exceeding rated capacity"
  ],
  "claim_process": "Submit claim through PLN procurement portal within 7 days of issue discovery",
  "replacement_turnaround": "5-10 working days"
}
```

#### 2.1.10 Image and Media

| Field Name | Data Type | Max Length | Required | Format | Description |
|------------|-----------|------------|----------|--------|-------------|
| `image_url` | text | 500 | No | URL | Primary product image URL |
| `image_gallery` | jsonb | - | No | Array of URLs | Additional product images |
| `video_url` | text | 500 | No | URL | Installation or demonstration video |
| `3d_model_url` | text | 500 | No | URL | 3D CAD model for engineering review |

**Image Requirements:**
- **Format:** JPEG or PNG
- **Dimensions:** Minimum 800x800 pixels, recommended 1200x1200 pixels
- **Aspect Ratio:** 1:1 (square) preferred
- **File Size:** Maximum 2 MB per image
- **Background:** White or transparent
- **Quality:** High resolution, clear product visibility
- **Placeholder:** Display "PLN Equipment - Image Coming Soon" for items without images

**Image Naming Convention:**
```
{item_code}_{view}_{index}.jpg

Examples:
FLT-BBK-001_front_01.jpg
FLT-BBK-001_side_02.jpg
FLT-BBK-001_installation_03.jpg
```

#### 2.1.11 Status and Lifecycle

| Field Name | Data Type | Max Length | Required | Default | Description |
|------------|-----------|------------|----------|---------|-------------|
| `is_active` | boolean | - | Yes | true | Item active status |
| `lifecycle_status` | text | 50 | Yes | ACTIVE | Current lifecycle stage |
| `created_at` | timestamptz | - | Auto | now() | Record creation timestamp |
| `updated_at` | timestamptz | - | Auto | now() | Last update timestamp |
| `created_by` | text | 100 | Auto | - | User who created the record |
| `updated_by` | text | 100 | Auto | - | User who last updated |

**Lifecycle Status Values:**
- `NEW` - Recently added, pending review
- `ACTIVE` - Approved and available for procurement
- `RESTRICTED` - Available with approval only
- `PHASE_OUT` - Being discontinued, limited availability
- `OBSOLETE` - No longer available, historical reference only
- `SUSPENDED` - Temporarily unavailable

### 2.2 Extended Fields for Filter Categories

#### 2.2.1 Filter-Specific Fields

**Common for All Filter Types:**
```json
{
  "filter_specifications": {
    "filter_class": "Primary/Secondary/Fine",
    "filter_efficiency": "99.9%",
    "particle_size_rating": "10 micron absolute",
    "flow_direction": "Inside-out / Outside-in",
    "differential_pressure_clean": "0.2 bar",
    "differential_pressure_dirty": "2.0 bar maximum",
    "service_life": "6 months / 2000 hours",
    "replacement_indicator": "Differential pressure gauge",
    "bypass_valve": "Yes/No",
    "anti_drainback_valve": "Yes/No"
  }
}
```

**Fuel Filter Specific:**
```json
{
  "fuel_filter_specs": {
    "fuel_type_compatibility": ["Diesel", "Biodiesel B20", "HSD", "MFO"],
    "water_separation": "Yes",
    "water_separation_efficiency": "95%",
    "contamination_capacity": "250 grams",
    "filter_media_type": "Cellulose blend",
    "coalescing_stage": "Yes/No"
  }
}
```

**Chemical Filter Specific:**
```json
{
  "chemical_filter_specs": {
    "chemical_compatibility": ["Acid", "Alkali", "Solvent", "Corrosive"],
    "chemical_resistance_rating": "PTFE rated",
    "ph_range": "2-12",
    "material_construction": "316L Stainless Steel / PTFE",
    "msds_available": true,
    "hazmat_classification": "Non-hazardous"
  }
}
```

**Air/Gas Filter Specific:**
```json
{
  "air_gas_filter_specs": {
    "gas_type": ["Compressed Air", "Natural Gas", "Flue Gas"],
    "pressure_drop_clean": "0.1 bar",
    "filtration_class": "ISO 8573-1 Class 1",
    "particle_retention": "0.01 micron",
    "oil_content_removal": "0.01 mg/m³",
    "air_flow_rate": "1000 Nm³/hr",
    "operating_temperature": "-40°C to +200°C"
  }
}
```

### 2.3 Optional Enhancement Fields

#### 2.3.1 Cross-Reference Fields

| Field Name | Data Type | Description |
|------------|-----------|-------------|
| `equivalent_items` | jsonb | Array of equivalent/substitute item_ids |
| `supersedes` | text | Item_id of product this replaces |
| `superseded_by` | text | Item_id of replacement product |
| `compatible_with` | jsonb | Compatible equipment/systems |
| `related_items` | jsonb | Related accessories or components |

**Example:**
```json
{
  "equivalent_items": [
    {
      "item_id": "ITM-20251106-000146",
      "item_code": "FLT-BBK-002",
      "equivalence_type": "Direct Substitute",
      "notes": "Alternative supplier, same specifications"
    }
  ],
  "supersedes": "ITM-20251101-000098",
  "compatible_with": [
    {
      "equipment_type": "Diesel Generator",
      "models": ["CAT 3512", "Cummins KTA50", "MTU 16V4000"],
      "application": "Primary fuel filtration"
    }
  ],
  "related_items": [
    {
      "item_id": "ITM-20251106-000200",
      "item_code": "FLT-BBK-CART-001",
      "relationship": "Replacement Cartridge",
      "quantity_per_assembly": 2
    }
  ]
}
```

#### 2.3.2 Performance Metrics

| Field Name | Data Type | Description |
|------------|-----------|-------------|
| `average_delivery_time` | integer | Actual average delivery days |
| `order_fulfillment_rate` | numeric(5,2) | Percentage of orders fulfilled |
| `defect_rate` | numeric(5,2) | Percentage of defective items |
| `total_orders_placed` | integer | Historical order count |
| `last_ordered_date` | timestamptz | Most recent order date |

### 2.4 Item Code Standardization

#### 2.4.1 Item Code Structure

**Format:** `{CATEGORY}-{SUBCATEGORY}-{SEQUENTIAL}`

**Components:**
- **CATEGORY** (3 chars): Primary category code
- **SUBCATEGORY** (3-5 chars): Subcategory identifier
- **SEQUENTIAL** (3-6 digits): Sequential number within category

**Examples:**
```
FLT-BBK-001    = Filter - Bahan Bakar - Item 001
FLT-BKM-015    = Filter - Bahan Kimia - Item 015
FLT-MNY-102    = Filter - Minyak - Item 102
FLT-UGS-450    = Filter - Udara dan Gas - Item 450
SRN-AIR-025    = Saringan - Air - Item 025
SRN-UAP-008    = Saringan - Uap - Item 008
SPR-FLT-1200   = Spare Part - Filter - Item 1200
```

#### 2.4.2 Category Code Reference

| Code | Category | Description |
|------|----------|-------------|
| FLT-BBK | Filter Bahan Bakar | Fuel filters |
| FLT-BKM | Filter Bahan Kimia | Chemical filters |
| FLT-MNY | Filter Minyak | Oil filters (lubricating) |
| FLT-DST | Filter Data Spesifikasi Tidak Lengkap | Incomplete spec filters |
| FLT-KHS | Filter Khusus | Specialized filters |
| FLT-MLF | Filter Multi Fungsi | Multifunctional filters |
| FLT-UGS | Filter Udara dan Gas | Air and gas filters |
| SRN-AIR | Saringan Air | Water filtration |
| SRN-UAP | Saringan Uap | Steam filters |
| SPR-FLT | Spare Part Filter | Filter spare parts |
| ACC-FLT | Accessories Filter | Filter accessories |

---

## 3. Category Taxonomy

### 3.1 Hierarchical Category Structure

#### 3.1.1 Level 1: Primary Categories

```
PLN Marketplace Catalog
├── Filter Bahan Bakar (Fuel Filters)
├── Filter Bahan Kimia (Chemical Filters)
├── Filter Bahan Minyak (Oil Filters)
├── Filter Data Spesifikasi Tidak Lengkap (Incomplete Specification Filters)
├── Filter Khusus (Specialized Filters)
├── Filter Multi Fungsi (Multifunctional Filters)
├── Filter Udara dan Gas (Air and Gas Filters)
├── Penyaringan Air (Water Filtration)
├── Saringan Uap (Steam Filters)
└── Spare Part dan Perlengkapan Filter (Spare Parts and Accessories)
```

### 3.2 Detailed Category Specifications

#### 3.2.1 Filter Bahan Bakar (Fuel Filters)

**Category ID:** `CAT-FILTER-BBK`
**Category Code:** `FLT-BBK`
**Display Order:** 1

**Description:**
Filters for all fuel types used in PLN power generation facilities, including diesel fuel, heavy fuel oil (HFO), marine fuel oil (MFO), and biodiesel blends.

**Subcategories:**
```
Filter Bahan Bakar
├── Filter Diesel Primer (Primary Diesel Filters)
│   ├── Spin-on Type
│   ├── Cartridge Type
│   └── Duplex/Simplex Assemblies
├── Filter Diesel Sekunder (Secondary Diesel Filters)
│   ├── Fine Filtration (2-10 micron)
│   └── Ultra-fine Filtration (<2 micron)
├── Filter HFO/MFO (Heavy Fuel Oil Filters)
│   ├── Preheater Integrated
│   ├── Magnetic Separators
│   └── Centrifugal Types
├── Filter Biodiesel (Biodiesel Filters)
│   ├── B20 Compatible
│   └── B30 Compatible
└── Water Separator Bahan Bakar (Fuel Water Separators)
    ├── Coalescing Type
    └── Centrifugal Type
```

**Required Fields:**
- `fuel_type_compatibility` (mandatory)
- `water_separation` capability (mandatory)
- `filtration_rating` (mandatory)
- `flow_rate` specifications (mandatory)
- SNI certification number (mandatory)

**Common Applications:**
- PLTD (Diesel Power Plant) fuel systems
- Emergency generator fuel systems
- Fuel storage and transfer systems
- Day tank filtration

**Example Items:**
1. Filter Diesel Cartridge Type - 500 L/hr - 10 micron
2. Fuel Water Separator Coalescing - 1000 L/hr - 95% efficiency
3. HFO Filter Assembly with Preheater - 2000 L/hr

#### 3.2.2 Filter Bahan Kimia (Chemical Filters)

**Category ID:** `CAT-FILTER-BKM`
**Category Code:** `FLT-BKM`
**Display Order:** 2

**Description:**
Filters for chemical processing, water treatment chemicals, and corrosive fluids used in power plant operations.

**Subcategories:**
```
Filter Bahan Kimia
├── Filter Asam (Acid Filters)
│   ├── Sulfuric Acid
│   ├── Hydrochloric Acid
│   └── Nitric Acid
├── Filter Alkali (Alkali Filters)
│   ├── Caustic Soda (NaOH)
│   └── Ammonia Solutions
├── Filter Solvent (Solvent Filters)
│   └── Industrial Solvents
├── Filter Treatment Chemicals
│   ├── Boiler Treatment Chemicals
│   ├── Cooling Water Treatment
│   └── Wastewater Treatment Chemicals
└── Filter Korosi (Corrosion-Resistant Filters)
    ├── PTFE-lined Filters
    └── 316L Stainless Steel
```

**Required Fields:**
- `chemical_compatibility` list (mandatory)
- `material_construction` (mandatory)
- `ph_range` (mandatory)
- `msds_available` (mandatory)
- ISO 14001 certification (recommended)

**Common Applications:**
- Water treatment plant chemical dosing
- Boiler water treatment systems
- Cooling tower treatment systems
- Wastewater treatment facilities

#### 3.2.3 Filter Bahan Minyak (Oil Filters)

**Category ID:** `CAT-FILTER-MNY`
**Category Code:** `FLT-MNY`
**Display Order:** 3

**Description:**
Lubricating oil filters for turbines, generators, hydraulic systems, and auxiliary equipment.

**Subcategories:**
```
Filter Bahan Minyak
├── Filter Oli Turbin (Turbine Oil Filters)
│   ├── Main Oil Filters
│   ├── Jacking Oil Filters
│   └── Control Oil Filters
├── Filter Oli Generator (Generator Oil Filters)
│   └── Bearing Lubrication
├── Filter Oli Hidraulik (Hydraulic Oil Filters)
│   ├── High Pressure (>210 bar)
│   ├── Medium Pressure (70-210 bar)
│   └── Low Pressure (<70 bar)
├── Filter Oli Pelumas Mesin (Engine Lube Oil Filters)
│   ├── Spin-on Type
│   ├── Cartridge Type
│   └── Bypass Filters
└── Filter Oli Transformer (Transformer Oil Filters)
    ├── Cellulose Type
    └── Activated Carbon Type
```

**Required Fields:**
- `oil_type_compatibility` (mandatory)
- `filtration_rating` (mandatory)
- `pressure_rating` (mandatory)
- `beta_ratio` (recommended)
- ISO 4406 cleanliness target (recommended)

**Common Applications:**
- Steam turbine lubrication systems
- Gas turbine lubrication systems
- Generator bearing lubrication
- Hydraulic actuator systems
- Transformer oil purification

#### 3.2.4 Filter Data Spesifikasi Tidak Lengkap (Incomplete Specification Filters)

**Category ID:** `CAT-FILTER-DST`
**Category Code:** `FLT-DST`
**Display Order:** 4

**Description:**
Legacy or special-order filters where complete technical specifications are not yet available in the system. These items require additional documentation review before procurement.

**Subcategories:**
```
Filter Data Spesifikasi Tidak Lengkap
├── Pending Technical Review
├── Legacy Items (Historical Reference)
├── Custom/Special Order Items
└── Supplier Data Pending
```

**Required Fields:**
- `incomplete_data_reason` (mandatory)
- `estimated_specifications` (if available)
- `contact_person_for_specs` (mandatory)
- `data_completion_target_date` (mandatory)

**Business Rules:**
- Items cannot be directly ordered from cart
- Require manual quotation request process
- Flag for specification completion project
- 90-day review cycle to move to proper category

#### 3.2.5 Filter Khusus (Specialized Filters)

**Category ID:** `CAT-FILTER-KHS`
**Category Code:** `FLT-KHS`
**Display Order:** 5

**Description:**
Specialized filters for unique applications, custom-engineered solutions, or advanced filtration technologies.

**Subcategories:**
```
Filter Khusus
├── Filter Vakum (Vacuum Filters)
│   └── Turbine Condenser Systems
├── Filter Bertekanan Tinggi (High Pressure Filters)
│   └── >350 bar applications
├── Filter Kriogenik (Cryogenic Filters)
│   └── LNG/Cryogenic applications
├── Filter Katalis (Catalyst Filters)
│   └── Chemical process protection
├── Filter Nano-teknologi (Nano-filtration)
│   └── Ultra-fine particle removal
└── Filter Custom Engineering
    └── Site-specific designs
```

**Required Fields:**
- `specialization_type` (mandatory)
- `custom_specifications` (mandatory)
- `engineering_approval_required` (mandatory)
- `lead_time_days` (typically >60 days)

#### 3.2.6 Filter Multi Fungsi (Multifunctional Filters)

**Category ID:** `CAT-FILTER-MLF`
**Category Code:** `FLT-MLF`
**Display Order:** 6

**Description:**
Filters combining multiple filtration technologies or serving multiple purposes in a single assembly.

**Subcategories:**
```
Filter Multi Fungsi
├── Filter-Separator Kombinasi
│   ├── Fuel + Water Separation
│   └── Oil + Particulate Removal
├── Filter-Cooler Assembly
│   └── Integrated heat exchanger
├── Filter-Pressure Regulator
│   └── Filtration + pressure control
├── Multi-Stage Filtration
│   ├── Coarse-Medium-Fine stages
│   └── Progressive filtration
└── Duplex/Triplex Assemblies
    └── Multiple filter vessels with valving
```

**Required Fields:**
- `primary_function` (mandatory)
- `secondary_functions` array (mandatory)
- `integrated_components` list (mandatory)

#### 3.2.7 Filter Udara dan Gas (Air and Gas Filters)

**Category ID:** `CAT-FILTER-UGS`
**Category Code:** `FLT-UGS`
**Display Order:** 7

**Description:**
Filters for compressed air systems, gas turbine intake, flue gas treatment, and pneumatic control systems.

**Subcategories:**
```
Filter Udara dan Gas
├── Filter Intake Udara Turbin Gas (GT Air Intake Filters)
│   ├── Pre-filters (G4, M5)
│   ├── Fine Filters (M6, F7)
│   └── HEPA Filters (offshore/dusty environments)
├── Filter Udara Tekan (Compressed Air Filters)
│   ├── Particulate Filters
│   ├── Coalescing Filters (oil removal)
│   ├── Adsorption Filters (vapor/odor removal)
│   └── Sterile Filters (instrumentation air)
├── Filter Gas Proses (Process Gas Filters)
│   ├── Natural Gas Filters
│   ├── Nitrogen Gas Filters
│   └── Hydrogen Gas Filters
├── Filter Gas Buang (Exhaust Gas Filters)
│   ├── Bag House Filters
│   ├── Electrostatic Precipitator Elements
│   └── SCR Catalyst Support Filters
└── Filter Udara Instrumen (Instrument Air Filters)
    └── 0.01 micron point-of-use
```

**Required Fields:**
- `gas_type` (mandatory)
- `filtration_class` per ISO 8573-1 (mandatory)
- `pressure_drop` characteristics (mandatory)
- `air_flow_rate` (mandatory)

**Common Applications:**
- Gas turbine intake filtration
- Compressed air generation and distribution
- Pneumatic control systems
- Instrument air for DCS/control valves

#### 3.2.8 Penyaringan Air (Water Filtration)

**Category ID:** `CAT-FILTER-AIR`
**Category Code:** `SRN-AIR`
**Display Order:** 8

**Description:**
Water filtration systems for raw water treatment, demineralized water production, cooling water, and potable water.

**Subcategories:**
```
Penyaringan Air
├── Filter Air Baku (Raw Water Filters)
│   ├── Multimedia Filters
│   ├── Sand Filters
│   └── Activated Carbon Filters
├── Filter Air Umpan Boiler (Boiler Feed Water Filters)
│   ├── Pre-RO Cartridge Filters
│   ├── Post-RO Polish Filters
│   └── Mixed Bed Polisher Filters
├── Filter Air Pendingin (Cooling Water Filters)
│   ├── Side-stream Filters
│   ├── Self-cleaning Strainers
│   └── Automatic Backwash Filters
├── Filter RO (Reverse Osmosis Filters)
│   ├── 5 micron Pre-filters
│   ├── 1 micron Pre-filters
│   └── Carbon Block Filters
├── Filter Air Minum (Potable Water Filters)
│   └── Activated carbon + sediment
└── Filter Air Limbah (Wastewater Filters)
    ├── Bag Filters
    └── Cartridge Filters
```

**Required Fields:**
- `water_type` (raw, treated, DM, cooling, potable)
- `filtration_rating` (mandatory)
- `flow_rate` (mandatory)
- `pressure_rating` (mandatory)
- `nsf_certification` (for potable water)

#### 3.2.9 Saringan Uap (Steam Filters)

**Category ID:** `CAT-FILTER-UAP`
**Category Code:** `SRN-UAP`
**Display Order:** 9

**Description:**
Steam strainers and filters for steam distribution systems, process steam, and turbine steam applications.

**Subcategories:**
```
Saringan Uap
├── Y-Strainer Uap (Y-type Steam Strainers)
│   ├── PN 16 / Class 150
│   ├── PN 40 / Class 300
│   └── PN 64 / Class 600
├── Basket Strainer Uap (Basket Steam Strainers)
│   └── Large flow applications
├── Filter Uap Turbin (Turbine Steam Filters)
│   ├── Main Steam Filters
│   └── Extraction Steam Filters
└── Filter Uap Proses (Process Steam Filters)
    ├── Low Pressure Steam (<10 bar)
    ├── Medium Pressure Steam (10-40 bar)
    └── High Pressure Steam (>40 bar)
```

**Required Fields:**
- `steam_pressure_rating` (mandatory)
- `steam_temperature_rating` (mandatory)
- `mesh_size` (mandatory)
- `material_construction` (mandatory - typically 316SS, WCB)
- `flange_standard` (ASME, DIN, JIS)

#### 3.2.10 Spare Part dan Perlengakapan Filter (Spare Parts and Accessories)

**Category ID:** `CAT-SPARE-FLT`
**Category Code:** `SPR-FLT`
**Display Order:** 10

**Description:**
Replacement parts, accessories, and consumables for all filter types.

**Subcategories:**
```
Spare Part dan Perlengakapan Filter
├── Cartridge dan Elemen Pengganti (Replacement Cartridges)
│   ├── By Filter Type
│   └── Universal Cartridges
├── O-Ring dan Seal Kit (Seals and Gaskets)
│   ├── Viton O-rings
│   ├── NBR O-rings
│   └── Complete Seal Kits
├── Housing dan Vessel (Filter Housings)
│   ├── Stainless Steel Housings
│   ├── Carbon Steel Housings
│   └── Plastic Housings
├── Differential Pressure Gauge
│   ├── Mechanical Gauges
│   └── Electronic Transmitters
├── Valve dan Fitting (Valves and Fittings)
│   ├── Drain Valves
│   ├── Vent Valves
│   └── Bypass Valves
├── Mounting Hardware
│   └── Brackets, bolts, clamps
└── Alat Instalasi (Installation Tools)
    ├── Filter Wrenches
    └── Housing Spanners
```

**Required Fields:**
- `compatible_filter_models` (mandatory)
- `part_category` (mandatory)
- `oem_part_number` (if applicable)
- `replacement_frequency` (recommended)

### 3.3 Category-Specific Required Fields Matrix

| Category | Tech Specs | Certifications | Material | Pressure Rating | Flow Rate |
|----------|-----------|----------------|----------|-----------------|-----------|
| Fuel Filters | Mandatory | SNI + PLN | Recommended | Mandatory | Mandatory |
| Chemical Filters | Mandatory | SNI + ISO14001 | Mandatory | Mandatory | Mandatory |
| Oil Filters | Mandatory | ISO 4406 | Recommended | Mandatory | Mandatory |
| Incomplete Spec | Partial | Variable | Variable | Variable | Variable |
| Specialized | Mandatory | Custom | Mandatory | Mandatory | Mandatory |
| Multifunctional | Mandatory | SNI | Recommended | Mandatory | Mandatory |
| Air/Gas Filters | Mandatory | ISO 8573-1 | Recommended | Mandatory | Mandatory |
| Water Filtration | Mandatory | NSF (potable) | Recommended | Mandatory | Mandatory |
| Steam Strainers | Mandatory | Pressure test | Mandatory | Mandatory | Mandatory |
| Spare Parts | If applicable | Not required | Variable | N/A | N/A |

---

## 4. User Interface Specifications

### 4.1 Item Card Layout

#### 4.1.1 Standard Item Card Dimensions

**Card Dimensions:**
- Width: 100% of grid column (responsive)
- Height: Auto (minimum 420px)
- Aspect Ratio: 3:4 (image) + content area
- Padding: 16px (internal)
- Border Radius: 8px
- Shadow: 0 2px 8px rgba(0,0,0,0.1)

**Responsive Breakpoints:**
- Mobile (<640px): 1 column, full width
- Tablet (640-1024px): 2 columns, 50% width each
- Desktop (1024-1440px): 3 columns, 33.33% width each
- Large Desktop (>1440px): 4 columns, 25% width each

#### 4.1.2 Item Card Structure (Wireframe)

```
┌─────────────────────────────────────────┐
│  ┌─────────────────────────────────┐   │  <- Image Container (300x300px)
│  │                                   │   │
│  │     [Product Image]              │   │
│  │     or                           │   │
│  │     PLN Equipment                │   │
│  │     Image Coming Soon            │   │
│  │                                   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─ Supplier Badge ──────────────┐    │  <- Supplier Name (max 2 lines)
│  │ 🏢 PT Supplier Name Indonesia  │    │     Font: 12px, Weight: 500
│  └────────────────────────────────┘    │
│                                         │
│  Item Name (max 3 lines)               │  <- Font: 14px, Weight: 600
│  Filter Bahan Bakar Solar Premium      │     Line Height: 1.4
│  Kapasitas 500 L/jam                   │     Color: Dark (light) / Light (dark)
│                                         │
│  ┌─ Category Tag ──┐                   │  <- Font: 11px, Weight: 500
│  │ 🏷️ Fuel Filter   │                   │     Padding: 4px 8px
│  └─────────────────┘                   │     Background: Blue-100 (light) / Blue-900 (dark)
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 📦 Stock: 45 units              │   │  <- Stock Status
│  │ 🚚 Lead Time: 7-14 days         │   │     Font: 12px, Icons: 16px
│  │ ⚙️  10 micron | 500 L/hr        │   │     Color: Gray-600 (light) / Gray-400 (dark)
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Rp 1.250.000                    │   │  <- Price (Bold, 18px)
│  │ per piece                       │   │     Color: Blue-600 (light) / Blue-400 (dark)
│  └─────────────────────────────────┘   │     Unit: 12px, Gray-600
│                                         │
│  ┌─ Certification Badges ─────────┐    │
│  │ [SNI] [ISO] [PLN]              │   │  <- 16x16px icons, max 4 visible
│  └────────────────────────────────┘    │
│                                         │
│  ┌────────────┐  ┌──────────────────┐  │
│  │ View Details│  │ Add to Cart 🛒  │  │  <- Action Buttons
│  └────────────┘  └──────────────────┘  │     Height: 40px
│                                         │     Full width on mobile
└─────────────────────────────────────────┘
```

#### 4.1.3 Image Placeholder Specifications

**When No Image Available:**
- Container Size: 300x300 pixels (fixed aspect ratio)
- Background: Linear gradient from blue-500 to blue-700
- Text: "PLN Equipment\nImage Coming Soon"
- Text Color: White (#FFFFFF)
- Font Size: 14px (line 1), 12px (line 2)
- Font Weight: 600 (line 1), 400 (line 2)
- Text Alignment: Center
- Icon: Package icon, 48x48px, centered above text
- Opacity on hover: 0.9

**CSS Implementation:**
```css
.product-image-placeholder {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  border-radius: 8px;
  transition: opacity 0.3s ease;
}

.product-image-placeholder:hover {
  opacity: 0.9;
}

.placeholder-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 12px;
}

.placeholder-text-line1 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
  text-align: center;
}

.placeholder-text-line2 {
  font-size: 12px;
  font-weight: 400;
  text-align: center;
}
```

#### 4.1.4 Item Card States

**Default State:**
- Border: 1px solid gray-200 (light) / gray-700 (dark)
- Background: white (light) / gray-900 (dark)
- Shadow: sm

**Hover State:**
- Border: 1px solid blue-400
- Shadow: md (elevated)
- Transform: translateY(-2px)
- Transition: all 0.2s ease

**Out of Stock State:**
- Opacity: 0.7
- Overlay: Semi-transparent gray
- Badge: "Out of Stock" - Red background
- Add to Cart button: Disabled, gray

**Low Stock State:**
- Warning badge: Orange/Yellow "Low Stock"
- Stock text: Orange color

### 4.2 Catalog Page Layout

#### 4.2.1 Page Structure

```
┌────────────────────────────────────────────────────────────────┐
│  Header: PLN Indonesia Power Marketplace                      │
│  [Search Bar]                          [Cart Icon (5)]        │
└────────────────────────────────────────────────────────────────┘
│
├── Breadcrumb: Home > Catalog > Filter Bahan Bakar
│
┌──────────────┬──────────────────────────────────────────────────┐
│              │  ┌─ Filters & Sorting ─────────────────────────┐ │
│  Sidebar     │  │ 🔍 Search: [____________] [Search Button]   │ │
│  (256px)     │  │ Found: 247 products | Sort by: [Price ▼]   │ │
│              │  └──────────────────────────────────────────────┘ │
│  Categories  │                                                   │
│  ┌─────────┐ │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐  │
│  │ All (✓) │ │  │ Card 1 │ │ Card 2 │ │ Card 3 │ │ Card 4 │  │
│  ├─────────┤ │  └────────┘ └────────┘ └────────┘ └────────┘  │
│  │ Fuel    │ │                                                   │
│  │ Filters │ │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐  │
│  ├─────────┤ │  │ Card 5 │ │ Card 6 │ │ Card 7 │ │ Card 8 │  │
│  │ Chemical│ │  └────────┘ └────────┘ └────────┘ └────────┘  │
│  │ Filters │ │                                                   │
│  ├─────────┤ │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐  │
│  │ ...     │ │  │ Card 9 │ │ Card 10│ │ Card 11│ │ Card 12│  │
│  └─────────┘ │  └────────┘ └────────┘ └────────┘ └────────┘  │
│              │                                                   │
│  Filters     │  [Load More Products] or [Pagination 1 2 3 >]  │
│  ┌─────────┐ │                                                   │
│  │ Price   │ │                                                   │
│  │ Min: __ │ │                                                   │
│  │ Max: __ │ │                                                   │
│  ├─────────┤ │                                                   │
│  │ Stock   │ │                                                   │
│  │ □ In    │ │                                                   │
│  │   Stock │ │                                                   │
│  ├─────────┤ │                                                   │
│  │ Lead    │ │                                                   │
│  │ Time    │ │                                                   │
│  │ < __ d  │ │                                                   │
│  └─────────┘ │                                                   │
└──────────────┴──────────────────────────────────────────────────┘
```

#### 4.2.2 Search and Filter Interface

**Search Bar:**
- Width: 100% of available space (flexible)
- Height: 48px
- Placeholder: "Search equipment, suppliers, product codes..."
- Icon: Magnifying glass (left, 20px)
- Border: 1px solid gray-300 (light) / gray-600 (dark)
- Border Radius: 8px
- Font Size: 14px
- Clear button: X icon (right side, appears when text entered)

**Search Behavior:**
- Real-time search suggestions after 3 characters
- Debounce: 300ms
- Search in: item_name, item_code, item_description, supplier_name
- Highlight matching terms in results

**Category Sidebar:**
- Width: 256px (desktop), full width (mobile - collapsible)
- Background: white (light) / gray-850 (dark)
- Border: 1px solid divider color
- Border Radius: 8px
- Padding: 16px

**Category Button Style:**
- Full width
- Height: 48px
- Text: 14px, left-aligned
- Icon: 20px (left side)
- Hover: Background change
- Active: Blue background, white text
- Count badge: (123) gray text, right-aligned

**Filter Controls:**
- Price Range: Two number inputs (min/max)
- Stock Status: Checkbox "In Stock Only"
- Lead Time: Number input with unit "days"
- Apply Filters Button: Full width, blue, 40px height

#### 4.2.3 Sorting Options

**Sort Dropdown:**
- Options:
  - Product Name (A-Z)
  - Product Name (Z-A)
  - Price: Low to High
  - Price: High to Low
  - Lead Time: Shortest First
  - Newest First
  - Most Popular
  - Best Rating (if review system implemented)

**Results Count Display:**
- Format: "Showing X-Y of Z products"
- Font: 14px, gray-600
- Position: Above product grid, left-aligned

### 4.3 Item Detail Page

#### 4.3.1 Layout Structure

```
┌────────────────────────────────────────────────────────────────┐
│  Breadcrumb: Home > Catalog > Fuel Filters > [Item Name]      │
└────────────────────────────────────────────────────────────────┘

┌─────────────────────────┬──────────────────────────────────────┐
│                         │  Item Name (H1, 24px, bold)          │
│  Image Gallery          │  Filter Bahan Bakar Solar Premium    │
│  ┌───────────────────┐  │  Kapasitas 500 L/jam                 │
│  │                   │  │                                      │
│  │   Main Image      │  │  Item Code: FLT-BBK-001              │
│  │   600x600px       │  │  Supplier: PT Supplier Name          │
│  │                   │  │  Category: Filter Bahan Bakar        │
│  └───────────────────┘  │                                      │
│                         │  ┌─────────────────────────────────┐│
│  [Thumb] [Thumb]        │  │ Rp 1.250.000 per piece         ││
│  [Thumb] [Thumb]        │  │                                 ││
│                         │  │ Stock: 45 units available       ││
│                         │  │ Lead Time: 7-14 days            ││
│                         │  │                                 ││
│                         │  │ Quantity: [- ] [5] [+]          ││
│                         │  │                                 ││
│                         │  │ [Add to Cart]   [Request Quote] ││
│                         │  └─────────────────────────────────┘│
│                         │                                      │
│                         │  Certifications: [SNI] [ISO] [PLN]  │
└─────────────────────────┴──────────────────────────────────────┘

┌─ Tabs ───────────────────────────────────────────────────────┐
│ [Description] [Technical Specs] [Certifications] [Documents] │
└──────────────────────────────────────────────────────────────┘

[Tab Content Area - Scrollable, min-height: 400px]

┌─ Related Products ───────────────────────────────────────────┐
│ "Customers Also Viewed" or "Equivalent Products"              │
│ [Card] [Card] [Card] [Card]                                  │
└──────────────────────────────────────────────────────────────┘
```

#### 4.3.2 Image Gallery Specifications

**Main Image:**
- Dimensions: 600x600px (desktop), 400x400px (tablet), 100% width (mobile)
- Zoom: Click to open lightbox at 1200x1200px
- Zoom hover: Magnifier effect on desktop

**Thumbnail Gallery:**
- Thumbnail Size: 80x80px
- Gap: 8px
- Horizontal scroll on mobile
- Active thumbnail: Border 2px solid blue

**Lightbox:**
- Background: rgba(0,0,0,0.9)
- Image: Max 90vw x 90vh
- Navigation: Arrow keys, on-screen arrows
- Close: X button, ESC key, click outside

### 4.4 Responsive Design Requirements

#### 4.4.1 Mobile (< 640px)

- Single column product grid
- Collapsible sidebar (drawer)
- Sticky search bar at top
- Card height: Auto (stacked layout)
- Image: 280x280px
- Font sizes: -2px from desktop

#### 4.4.2 Tablet (640-1024px)

- 2 column product grid
- Sidebar toggleable (icon button)
- Standard card dimensions
- Touch-friendly button sizes (min 44x44px)

#### 4.4.3 Desktop (> 1024px)

- 3-4 column product grid
- Persistent sidebar
- Hover effects enabled
- Keyboard navigation support

---

## 5. Technical Requirements

### 5.1 Database Integration

#### 5.1.1 Supabase Schema

**Primary Table:** `marketplace_items`

**Key Relationships:**
```sql
marketplace_items
├── FOREIGN KEY (category_id) → marketplace_categories(category_id)
├── FOREIGN KEY (supplier_id) → marketplace_suppliers(supplier_id)
└── referenced by marketplace_cart_items(item_id)

marketplace_item_documents
└── FOREIGN KEY (item_id) → marketplace_items(item_id)
```

**Indexes for Performance:**
```sql
CREATE INDEX idx_items_category ON marketplace_items(category_id);
CREATE INDEX idx_items_supplier ON marketplace_items(supplier_id);
CREATE INDEX idx_items_code ON marketplace_items(item_code);
CREATE INDEX idx_items_name ON marketplace_items(item_name);
CREATE INDEX idx_items_active ON marketplace_items(is_active);
CREATE INDEX idx_items_stock ON marketplace_items(stock_quantity);
CREATE INDEX idx_items_price ON marketplace_items(unit_price);
CREATE INDEX idx_items_lead_time ON marketplace_items(lead_time_days);
CREATE INDEX idx_items_specs ON marketplace_items USING gin(technical_specifications);

-- Full-text search index
CREATE INDEX idx_items_search ON marketplace_items
USING gin(to_tsvector('indonesian',
  item_name || ' ' || COALESCE(item_description, '') || ' ' || item_code));
```

#### 5.1.2 API Endpoints

**RESTful API Structure:**

```
GET    /api/v1/marketplace/items
       Query Parameters:
       - category_id (optional)
       - supplier_id (optional)
       - search_query (optional)
       - price_min (optional)
       - price_max (optional)
       - lead_time_max (optional)
       - in_stock_only (boolean)
       - sort_by (name|price_asc|price_desc|lead_time)
       - page (default: 1)
       - limit (default: 20, max: 100)

       Response: {
         data: MarketplaceItem[],
         total: number,
         page: number,
         pages: number
       }

GET    /api/v1/marketplace/items/:item_id
       Response: MarketplaceItemWithDetails

GET    /api/v1/marketplace/categories
       Response: MarketplaceCategory[]

GET    /api/v1/marketplace/suppliers
       Response: MarketplaceSupplier[]

POST   /api/v1/marketplace/items (Admin only)
       Body: MarketplaceItem
       Response: Created item

PUT    /api/v1/marketplace/items/:item_id (Admin only)
       Body: Partial<MarketplaceItem>
       Response: Updated item

DELETE /api/v1/marketplace/items/:item_id (Admin only)
       Response: Success message
```

### 5.2 Internal PLN System Integration

#### 5.2.1 ERP Integration

**SAP ERP Interface:**
- Real-time stock synchronization via RFC/BAPI
- Price updates from material master (MM module)
- Automatic PO creation from approved PRs
- GRN (Goods Receipt Note) updates to order tracking

**Integration Points:**
```
PLN Marketplace ↔ SAP ERP

Outbound (Marketplace → SAP):
- Purchase Requisitions (BAPI_REQUISITION_CREATE)
- Stock inquiries (BAPI_MATERIAL_AVAILABILITY)
- Vendor information requests
- Price history queries

Inbound (SAP → Marketplace):
- Stock level updates (real-time webhook)
- Price changes (daily batch)
- Contract updates (event-driven)
- Delivery confirmations
```

#### 5.2.2 BPA Contract Integration

**Contract Management:**
- Link items to active BPA contracts
- Enforce contract pricing
- Track contract utilization
- Alert on contract expiration
- Auto-apply contract terms (payment, delivery)

**Contract Data Structure:**
```json
{
  "contract_reference": {
    "contract_number": "BPA-2024-00123",
    "contract_line_item": "00010",
    "contract_start_date": "2024-01-01",
    "contract_end_date": "2024-12-31",
    "contracted_quantity": 1000,
    "utilized_quantity": 450,
    "remaining_quantity": 550,
    "contract_price": 1250000.00,
    "payment_terms": "Net 30",
    "delivery_terms": "DDP Destination"
  }
}
```

#### 5.2.3 Vendor Portal Integration

**Supplier Self-Service:**
- Suppliers update own item information
- Upload certificates and documents
- Update stock availability
- Respond to RFQs
- Track order fulfillment

**Vendor API Access:**
```
POST   /api/vendor/items/:item_id/stock
       Update stock quantity

POST   /api/vendor/items/:item_id/documents
       Upload certification documents

GET    /api/vendor/orders
       View assigned orders

PUT    /api/vendor/orders/:order_id/status
       Update order status
```

### 5.3 Compliance Tracking System

#### 5.3.1 Certification Management

**Automatic Expiration Monitoring:**
```typescript
interface CertificationAlert {
  item_id: string;
  certification_type: string;
  expiry_date: string;
  days_until_expiry: number;
  alert_level: 'GREEN' | 'YELLOW' | 'RED';
  notification_sent: boolean;
}

// Alert Thresholds:
// GREEN: > 90 days until expiry
// YELLOW: 31-90 days until expiry (notify procurement)
// RED: < 30 days until expiry (block ordering)
```

**Certification Workflow:**
1. Supplier uploads new certificate
2. System validates certificate format and expiry date
3. Procurement team reviews and approves
4. Certificate linked to item(s)
5. Auto-renewal reminder 90 days before expiry
6. Item flagged if certificate expires

#### 5.3.2 SNI/ISO Verification

**SNI Certificate Verification:**
- Integration with BSN (Badan Standardisasi Nasional) API
- Verify certificate authenticity
- Check certificate number validity
- Validate expiry dates
- Store verification timestamp

**ISO Certificate Verification:**
- Validate against accredited certification bodies
- Check scope of certification
- Verify facility/product coverage
- Annual reverification requirement

### 5.4 Document Management System

#### 5.4.1 Document Types and Storage

**Document Categories:**
```typescript
type DocumentType =
  | 'Technical Manual'
  | 'Safety Certificate'
  | 'Compliance Certificate'
  | 'Warranty Document'
  | 'Installation Guide'
  | 'Datasheet'
  | 'MSDS'  // Material Safety Data Sheet
  | 'Test Report'
  | 'Other';
```

**Storage Architecture:**
```
Supabase Storage Bucket: pln-marketplace-documents
├── certificates/
│   ├── sni/
│   ├── iso/
│   └── pln-approval/
├── technical/
│   ├── datasheets/
│   ├── manuals/
│   └── installation-guides/
├── compliance/
│   ├── msds/
│   └── test-reports/
└── supplier/
    └── {supplier_id}/
```

**File Naming Convention:**
```
{item_code}_{document_type}_{version}_{date}.{ext}

Examples:
FLT-BBK-001_SNI_v1_20240315.pdf
FLT-BBK-001_Datasheet_v2_20241106.pdf
FLT-BBK-001_InstallationGuide_v1_20240101.pdf
```

#### 5.4.2 Document Access Control

**RLS Policies:**
```sql
-- Public can view approved documents for active items
CREATE POLICY "Public read approved documents"
ON marketplace_item_documents FOR SELECT
USING (
  item_id IN (
    SELECT item_id FROM marketplace_items WHERE is_active = true
  )
  AND document_status = 'APPROVED'
);

-- Authenticated users can upload documents
CREATE POLICY "Authenticated users upload documents"
ON marketplace_item_documents FOR INSERT
TO authenticated
WITH CHECK (true);

-- Only document owner or admin can update
CREATE POLICY "Owner or admin update documents"
ON marketplace_item_documents FOR UPDATE
TO authenticated
USING (uploaded_by = auth.uid() OR is_admin(auth.uid()))
WITH CHECK (true);
```

### 5.5 Supplier Performance Tracking

#### 5.5.1 Performance Metrics

**Key Performance Indicators:**
```typescript
interface SupplierPerformance {
  supplier_id: string;
  period: string; // YYYY-MM
  metrics: {
    on_time_delivery_rate: number;     // Percentage (0-100)
    quality_acceptance_rate: number;    // Percentage (0-100)
    order_fulfillment_rate: number;     // Percentage (0-100)
    average_lead_time_days: number;
    price_competitiveness: number;      // Score (1-5)
    documentation_compliance: number;   // Percentage (0-100)
    responsiveness_score: number;       // Score (1-5)
  };
  overall_rating: number; // Calculated score (0-5)
  total_orders: number;
  total_value: number;
}
```

**Performance Calculation:**
```typescript
function calculateOverallRating(metrics: SupplierMetrics): number {
  const weights = {
    on_time_delivery: 0.25,
    quality_acceptance: 0.25,
    order_fulfillment: 0.20,
    documentation: 0.15,
    responsiveness: 0.10,
    price_competitiveness: 0.05
  };

  return (
    (metrics.on_time_delivery_rate / 20) * weights.on_time_delivery +
    (metrics.quality_acceptance_rate / 20) * weights.quality_acceptance +
    (metrics.order_fulfillment_rate / 20) * weights.order_fulfillment +
    (metrics.documentation_compliance / 20) * weights.documentation +
    metrics.responsiveness_score * weights.responsiveness +
    metrics.price_competitiveness * weights.price_competitiveness
  );
}
```

#### 5.5.2 Supplier Rating Display

**Public Rating Display:**
- Show aggregate rating (1-5 stars)
- Display metrics summary
- Show total orders and value
- Performance trend indicator (improving/declining)

**Detailed Metrics (Admin Only):**
- Full performance dashboard
- Historical trend analysis
- Comparative analysis across suppliers
- Issue tracking and resolution

---

## 6. Business Rules

### 6.1 Pricing Structure

#### 6.1.1 BPA Contract Pricing

**Pricing Hierarchy:**
1. **Contract Price** (Highest Priority)
   - If item is under active BPA contract
   - Contract price overrides catalog price
   - Display: "Contract Price: Rp X (BPA-2024-00123)"
   - Lock price changes during contract period

2. **Negotiated Price**
   - For high-value items (>Rp 100,000,000)
   - Requires quotation process
   - Display: "Price on Request"

3. **Catalog Price**
   - Standard marketplace price
   - Subject to approval workflow
   - Display: "Catalog Price: Rp X"

**Price Approval Workflow:**
```
Price Change Request
├── < 5% change → Auto-approved
├── 5-20% change → Manager approval
├── 20-50% change → Director approval
└── > 50% change → Tender Committee approval
```

#### 6.1.2 Volume-Based Pricing

**Quantity Breaks:**
```json
{
  "quantity_pricing": [
    {"min_qty": 1, "max_qty": 9, "unit_price": 1250000.00},
    {"min_qty": 10, "max_qty": 49, "unit_price": 1150000.00, "discount_pct": 8},
    {"min_qty": 50, "max_qty": 99, "unit_price": 1050000.00, "discount_pct": 16},
    {"min_qty": 100, "max_qty": null, "unit_price": 950000.00, "discount_pct": 24}
  ]
}
```

**Display Format:**
```
Pricing Tiers:
• 1-9 units: Rp 1.250.000 per piece
• 10-49 units: Rp 1.150.000 per piece (Save 8%)
• 50-99 units: Rp 1.050.000 per piece (Save 16%)
• 100+ units: Rp 950.000 per piece (Save 24%)
```

#### 6.1.3 Currency and Tax

**Currency:**
- Primary: Indonesian Rupiah (IDR)
- Display format: Rp 1.250.000,00
- No foreign currency pricing (convert to IDR)

**Tax Treatment:**
- All prices exclude VAT (PPN 11%)
- Tax calculated at checkout
- Display: "Harga belum termasuk PPN 11%"
- Government institutions may be VAT-exempt

### 6.2 Stock Management

#### 6.2.1 Stock Availability Rules

**Stock Status Definitions:**
```typescript
enum StockStatus {
  IN_STOCK = 'Available for immediate order',           // qty > safety_stock
  LOW_STOCK = 'Limited availability',                   // qty <= safety_stock, qty > 0
  OUT_OF_STOCK = 'Currently unavailable',              // qty = 0
  ON_ORDER = 'Replenishment in progress',              // qty = 0, PO active
  DISCONTINUED = 'No longer available',                 // lifecycle_status = OBSOLETE
  PRE_ORDER = 'Available for advance ordering'         // New product, not yet in stock
}
```

**Stock Reservation:**
- Items in cart reserved for 2 hours
- Automatic release after timeout
- Priority: First come, first served
- High-priority facility orders can override

**Stock Allocation:**
```
Total Stock: 100 units
├── Reserved (in carts): 15 units
├── Allocated (approved PRs): 30 units
└── Available for order: 55 units
```

#### 6.2.2 Lead Time Calculations

**Lead Time Components:**
```typescript
interface LeadTimeBreakdown {
  supplier_processing: number;  // Supplier order processing time
  manufacturing: number;         // If make-to-order
  shipping: number;             // Transportation time
  customs_clearance: number;    // For imports
  internal_processing: number;  // PLN receiving and QC
  total_days: number;          // Sum of above
}
```

**Lead Time Categories:**
```
Ex-Stock:       0-7 days   (from supplier warehouse)
Standard:       7-30 days  (normal procurement)
Extended:       31-90 days (special order/import)
Custom:         90+ days   (engineered solutions)
```

**Dynamic Lead Time Adjustment:**
- Based on supplier performance history
- Adjust for holidays and facility shutdowns
- Factor in destination facility location
- Weather/seasonal considerations (monsoon delays)

### 6.3 Approval Workflows

#### 6.3.1 New Item Approval

**Workflow Steps:**
```
New Item Submission
│
├─> Technical Review
│   ├─ Specifications completeness
│   ├─ Compliance verification
│   └─ Technical standards check
│
├─> Procurement Review
│   ├─ Supplier verification
│   ├─ Price reasonability check
│   └─ Contract alignment
│
├─> Quality Assurance Review
│   ├─ Certification validation
│   ├─ Test reports review
│   └─ Supplier audit status
│
└─> Final Approval
    ├─ Manager approval (<Rp 50M)
    └─ Director approval (≥Rp 50M)
```

**Approval SLA:**
- Technical Review: 3 working days
- Procurement Review: 2 working days
- QA Review: 2 working days
- Final Approval: 1 working day
- **Total: 8 working days maximum**

**Auto-Rejection Criteria:**
- Missing required certifications
- Supplier not PLN-approved
- Price >50% above market reference
- Incomplete technical specifications
- Expired compliance certificates

#### 6.3.2 Purchase Requisition Approval

**PR Approval Matrix:**
```
PR Value (IDR)          Approval Level           SLA
─────────────────────────────────────────────────────
< 10,000,000           Dept. Manager            1 day
10M - 50M              Division Manager          2 days
50M - 100M             Director                  3 days
100M - 500M            Director + Tender Comm.   5 days
> 500M                 Board of Directors        7 days
```

**Additional Approval Triggers:**
- Non-catalog item → Technical approval required
- New supplier → Supplier verification team
- Emergency procurement → Fast-track procedure
- Budget overrun → CFO approval

### 6.4 Data Quality Standards

#### 6.4.1 Mandatory Field Requirements

**Minimum Viable Item (Cannot be published without):**
- ✅ item_code (unique, validated format)
- ✅ item_name (descriptive, 10-200 characters)
- ✅ category_id (valid category)
- ✅ supplier_id (PLN-approved supplier)
- ✅ unit_price (> 0)
- ✅ unit_of_measure
- ✅ stock_quantity (≥ 0)
- ✅ lead_time_days (≥ 0)

**Recommended Fields (Item can be published with warnings):**
- ⚠️ item_description (detailed description)
- ⚠️ technical_specifications (key specs)
- ⚠️ compliance_certifications (at least 1)
- ⚠️ image_url (product image)
- ⚠️ warranty_info

**Optional Enhancement Fields:**
- ℹ️ video_url
- ℹ️ 3d_model_url
- ℹ️ equivalent_items
- ℹ️ related_items

#### 6.4.2 Data Validation Rules

**Item Code Validation:**
```regex
^[A-Z]{3}-[A-Z]{3}-[0-9]{3,6}$

Examples (valid):
- FLT-BBK-001
- SRN-AIR-1234
- SPR-FLT-000123

Examples (invalid):
- flt-bbk-001 (lowercase)
- FLT-BBK-1 (insufficient digits)
- FLT-BBK-ABC (non-numeric sequence)
```

**Item Name Validation:**
```typescript
function validateItemName(name: string): ValidationResult {
  const errors: string[] = [];

  if (name.length < 10) {
    errors.push("Name must be at least 10 characters");
  }

  if (name.length > 200) {
    errors.push("Name must not exceed 200 characters");
  }

  if (!/^[a-zA-Z0-9\s\-\/&(),\.]+$/.test(name)) {
    errors.push("Name contains invalid characters");
  }

  if (!name.match(/[a-zA-Z]{3,}/)) {
    errors.push("Name must contain meaningful words");
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
```

**Price Validation:**
```typescript
function validatePrice(price: number, category: string): ValidationResult {
  const errors: string[] = [];

  if (price <= 0) {
    errors.push("Price must be greater than zero");
  }

  if (price < 1000) {
    errors.push("Price seems unusually low (< Rp 1.000)");
  }

  // Check against category averages
  const categoryAvg = getCategoryAveragePrice(category);
  if (price > categoryAvg * 5) {
    errors.push(`Price significantly exceeds category average (>${5 * categoryAvg})`);
  }

  if (price < categoryAvg * 0.1) {
    errors.push(`Price significantly below category average (<${0.1 * categoryAvg})`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
```

#### 6.4.3 Data Completeness Scoring

**Quality Score Calculation:**
```typescript
function calculateItemQualityScore(item: MarketplaceItem): number {
  let score = 0;

  // Core fields (40 points)
  if (item.item_code) score += 5;
  if (item.item_name && item.item_name.length >= 20) score += 5;
  if (item.item_description && item.item_description.length >= 100) score += 10;
  if (item.category_id) score += 5;
  if (item.supplier_id) score += 5;
  if (item.unit_price > 0) score += 5;
  if (item.unit_of_measure) score += 5;

  // Technical specs (30 points)
  const specsKeys = Object.keys(item.technical_specifications || {});
  if (specsKeys.length >= 5) score += 10;
  if (specsKeys.length >= 10) score += 10;
  if (item.dimensions) score += 5;
  if (item.weight) score += 5;

  // Compliance (20 points)
  const certCount = (item.compliance_certifications || []).length;
  if (certCount >= 1) score += 5;
  if (certCount >= 2) score += 5;
  if (certCount >= 3) score += 10;

  // Media (10 points)
  if (item.image_url) score += 5;
  if (item.image_gallery && item.image_gallery.length > 0) score += 3;
  if (item.video_url) score += 2;

  return Math.min(score, 100);
}
```

**Quality Badges:**
```
Score 90-100: 🏆 Premium Quality Listing
Score 70-89:  ✅ Complete Information
Score 50-69:  ⚠️  Basic Information
Score <50:    ❌ Incomplete - Enhancement Needed
```

#### 6.4.4 Data Update Procedures

**Regular Data Maintenance:**
```
Daily:
- Stock level updates from suppliers
- Price updates from contracts
- Order status updates

Weekly:
- Performance metrics calculation
- Low stock alerts
- Certificate expiry checks

Monthly:
- Supplier performance review
- Category pricing analysis
- Data quality audit
- Inactive item cleanup

Quarterly:
- Comprehensive data quality review
- Supplier certification reverification
- Category taxonomy review
```

**Change Auditing:**
```typescript
interface ItemChangeLog {
  change_id: string;
  item_id: string;
  changed_by: string;
  change_timestamp: string;
  field_name: string;
  old_value: any;
  new_value: any;
  change_reason: string;
  approval_required: boolean;
  approved_by?: string;
  approval_timestamp?: string;
}
```

---

## 7. Data Quality Standards

### 7.1 Item Description Guidelines

#### 7.1.1 Description Structure

**Template Format:**
```
[Product Type] [Key Specification] - [Capacity/Size] - [Application]

Technical Details:
• [Feature 1]
• [Feature 2]
• [Feature 3]

Suitable for:
• [Application 1]
• [Application 2]

Compatible with:
• [Equipment 1]
• [Equipment 2]
```

**Example - Good Description:**
```
Filter Bahan Bakar Solar Premium - Kapasitas 500 L/jam - Aplikasi PLTD

Filter cartridge type dengan efisiensi tinggi untuk penyaringan bahan bakar solar pada sistem pembangkit listrik diesel. Dilengkapi water separator dengan efisiensi 95%.

Spesifikasi Teknis:
• Material housing: Stainless steel 316L
• Filtration rating: 10 micron absolute (Beta ratio >1000)
• Tekanan kerja maksimum: 10 bar
• Suhu operasi: -20°C hingga +120°C
• Kapasitas aliran: 500 liter/jam @ 25°C
• Koneksi: BSP 1 inch (inlet/outlet)
• Dimensi: 350mm (T) x 250mm (L) x 450mm (P)

Cocok untuk:
• PLTD dengan generator 500-1000 kVA
• Day tank fuel system
• Transfer pump protection
• Emergency generator fuel line

Kompatibel dengan:
• Caterpillar 3512, 3516 series
• Cummins KTA38, KTA50 series
• Mitsubishi S16R-PTA series

Sertifikasi:
• SNI 19-1234-2020
• ISO 9001:2015
• PLN Technical Approval PLN-APP-2024-00123

Garansi: 12 bulan dari tanggal instalasi
```

**Example - Poor Description (Do Not Use):**
```
Filter bagus untuk solar. Kapasitas besar. Harga murah.
```

#### 7.1.2 Technical Writing Standards

**Writing Style:**
- Use Bahasa Indonesia (formal/technical)
- Active voice preferred
- Short sentences (max 25 words)
- Bullet points for specifications
- Numeric values with units
- Proper capitalization for brands/standards

**Prohibited Content:**
- Subjective claims without proof ("terbaik", "paling bagus")
- Exaggerated marketing language
- Comparison to competitors by name
- Pricing information (displayed separately)
- Contact information (use supplier profile)

### 7.2 Image Quality Standards

#### 7.2.1 Photography Guidelines

**Technical Requirements:**
```yaml
Image Specifications:
  Format: JPEG or PNG
  Minimum Resolution: 1200x1200 pixels
  Recommended Resolution: 2000x2000 pixels
  Aspect Ratio: 1:1 (square)
  Color Space: sRGB
  File Size: 500KB - 2MB per image
  Background: White (#FFFFFF) or transparent (PNG)
  Lighting: Even, shadow-free
  Focus: Sharp, no blur
```

**Required Views:**
1. **Front View** (Primary image)
   - Product centered
   - Full product visible
   - Scale reference if appropriate

2. **Side View** (Secondary)
   - Show connection ports
   - Highlight key features

3. **Detail Shots** (Tertiary)
   - Certification labels
   - Part numbers
   - Unique features

4. **Installation View** (Optional)
   - Mounted/installed state
   - Size comparison
   - Application context

**Prohibited:**
- Watermarks (except subtle corner logo)
- Heavy filters/editing
- Text overlays (except dimensions)
- Multiple products in one image (confusion)
- Low resolution/blurry images
- Dark/poorly lit photos

#### 7.2.2 Image Optimization

**Automated Processing Pipeline:**
```typescript
async function processProductImage(file: File): Promise<ProcessedImage> {
  // 1. Validate format and size
  const validation = await validateImage(file);
  if (!validation.valid) throw new Error(validation.error);

  // 2. Resize to standard dimensions
  const resized = await sharp(file)
    .resize(1200, 1200, { fit: 'contain', background: '#FFFFFF' })
    .toFormat('jpeg', { quality: 85 })
    .toBuffer();

  // 3. Generate thumbnail
  const thumbnail = await sharp(resized)
    .resize(300, 300, { fit: 'cover' })
    .toFormat('jpeg', { quality: 80 })
    .toBuffer();

  // 4. Upload to storage
  const imageUrl = await uploadToStorage(resized, 'images');
  const thumbUrl = await uploadToStorage(thumbnail, 'thumbnails');

  // 5. Generate metadata
  const metadata = await sharp(resized).metadata();

  return {
    image_url: imageUrl,
    thumbnail_url: thumbUrl,
    width: metadata.width,
    height: metadata.height,
    file_size: resized.length
  };
}
```

### 7.3 Certification Documentation

#### 7.3.1 Certificate Upload Requirements

**Acceptable Formats:**
- PDF (preferred)
- JPG/JPEG (high resolution scan)
- PNG (high resolution scan)

**Document Quality:**
- Minimum 300 DPI for scanned documents
- All text clearly readable
- Complete certificate (no cropped edges)
- Official stamps/seals visible
- Certification body information visible

**Required Information Extraction:**
```typescript
interface CertificateData {
  certificate_number: string;
  certificate_type: 'SNI' | 'ISO' | 'PLN_APPROVAL' | 'OTHER';
  issuing_authority: string;
  issue_date: string;           // YYYY-MM-DD
  expiry_date: string;          // YYYY-MM-DD
  scope: string;                // What is certified
  accreditation_body?: string;  // KAN, IAF, etc.
  file_url: string;
  file_hash: string;            // SHA-256 for integrity
}
```

#### 7.3.2 Certificate Verification Process

**Verification Workflow:**
```
Certificate Upload
│
├─> Automated Checks
│   ├─ File format validation
│   ├─ Text extraction (OCR if needed)
│   ├─ Expiry date extraction
│   └─ Certificate number extraction
│
├─> API Verification (if available)
│   ├─ BSN API for SNI certificates
│   └─ Certification body API for ISO
│
├─> Manual Review (if auto-check fails)
│   ├─ Quality team validates document
│   ├─ Cross-check with issuing authority
│   └─ Mark as verified or rejected
│
└─> Approval & Linking
    ├─ Certificate marked as valid
    ├─ Linked to item(s)
    └─ Expiry monitoring activated
```

---

## 8. Implementation Guidelines

### 8.1 Phase 1: Foundation (Weeks 1-2)

**Deliverables:**
- ✅ Database schema implementation
- ✅ Basic CRUD API endpoints
- ✅ Category taxonomy structure
- ✅ Item data model and validation

**Tasks:**
1. Execute database migration scripts
2. Implement service layer for item management
3. Create category management interfaces
4. Build item creation/editing forms with validation
5. Set up image upload to Supabase Storage

**Acceptance Criteria:**
- Can create new categories
- Can create items with all mandatory fields
- Validation prevents invalid data entry
- Images upload successfully

### 8.2 Phase 2: Catalog Interface (Weeks 3-4)

**Deliverables:**
- ✅ Product catalog page with grid layout
- ✅ Category filtering sidebar
- ✅ Search functionality
- ✅ Item detail pages
- ✅ Responsive design (mobile/tablet/desktop)

**Tasks:**
1. Build ProductCard component with specifications
2. Implement catalog grid with pagination
3. Create search and filter UI
4. Build item detail page with tabs
5. Implement image gallery with lightbox
6. Add responsive breakpoints

**Acceptance Criteria:**
- Catalog displays all active items
- Filtering by category works correctly
- Search returns relevant results
- Item details show complete information
- UI adapts to all screen sizes

### 8.3 Phase 3: Advanced Features (Weeks 5-6)

**Deliverables:**
- ✅ Compliance tracking system
- ✅ Document management
- ✅ BPA contract integration
- ✅ Supplier performance metrics

**Tasks:**
1. Build certification management system
2. Implement document upload and storage
3. Create compliance monitoring dashboard
4. Integrate with ERP for contract data
5. Build supplier performance tracking
6. Create admin dashboards

**Acceptance Criteria:**
- Certificates tracked with expiry alerts
- Documents properly categorized and stored
- Contract prices override catalog prices
- Supplier ratings calculated correctly
- Admin can view all metrics

### 8.4 Phase 4: Testing & Optimization (Weeks 7-8)

**Deliverables:**
- ✅ Comprehensive testing
- ✅ Performance optimization
- ✅ Data quality audits
- ✅ User acceptance testing

**Tasks:**
1. Unit testing for all services
2. Integration testing for workflows
3. Performance testing (load testing)
4. Security testing (penetration testing)
5. UAT with procurement team
6. Bug fixes and refinements

**Success Metrics:**
- Page load time < 2 seconds
- Search results < 500ms
- 99.9% uptime
- Zero critical security issues
- UAT approval from stakeholders

### 8.5 Data Migration Plan

#### 8.5.1 Legacy Data Import

**Data Sources:**
```
Legacy Systems:
├── SAP MM Material Master
├── Excel spreadsheets (supplier data)
├── SharePoint documents (certificates)
└── Email archives (product specs)
```

**Migration Process:**
```typescript
async function migrateItems() {
  // 1. Extract data from SAP
  const sapData = await extractFromSAP();

  // 2. Transform to marketplace schema
  const transformedData = sapData.map(item => ({
    item_code: item.materialNumber,
    item_name: item.description,
    category_id: mapSAPCategoryToMarketplace(item.materialGroup),
    supplier_id: mapSAPVendorToSupplier(item.vendorNumber),
    unit_price: item.standardPrice,
    // ... other mappings
  }));

  // 3. Validate data quality
  const validatedData = await validateBulkImport(transformedData);

  // 4. Import to marketplace
  for (const batch of chunk(validatedData, 100)) {
    await bulkInsertItems(batch);
  }

  // 5. Generate migration report
  await generateMigrationReport();
}
```

**Data Cleansing:**
1. Remove duplicates
2. Standardize naming conventions
3. Validate all mandatory fields
4. Fill missing data where possible
5. Flag items requiring manual review

#### 8.5.2 Initial Catalog Population

**Seed Data Requirements:**
- Minimum 500 items across all categories
- At least 20 items per category
- 50+ suppliers
- 100+ certificates
- Complete technical specifications for top 100 items

**Priority Order:**
1. High-turnover items (frequently ordered)
2. Critical spare parts (essential for operations)
3. Contract items (active BPA items)
4. New products (recently introduced)
5. Long-tail items (infrequently ordered)

### 8.6 Training and Documentation

#### 8.6.1 User Training

**Procurement Staff Training:**
- Catalog navigation and search
- Item evaluation and comparison
- Cart management and checkout
- PR creation and tracking
- Reporting and analytics

**Supplier Training:**
- Item information maintenance
- Certificate upload
- Stock updates
- Order fulfillment
- Performance monitoring

**Admin Training:**
- Item approval workflow
- Category management
- Data quality monitoring
- Compliance tracking
- System configuration

#### 8.6.2 Documentation Deliverables

**User Guides:**
- Procurement User Manual (Bahasa Indonesia)
- Supplier Portal Guide
- Admin Configuration Guide
- API Integration Documentation

**Technical Documentation:**
- Database Schema Documentation
- API Reference
- Integration Guides (SAP, ERP)
- Deployment Guide
- Troubleshooting Guide

### 8.7 Go-Live Checklist

**Pre-Launch Requirements:**
```
☐ Database schema deployed
☐ Minimum 500 items loaded
☐ All categories configured
☐ Supplier accounts created
☐ Integration testing completed
☐ Security audit passed
☐ Performance benchmarks met
☐ Backup and recovery tested
☐ User training completed
☐ Documentation published
☐ Support team ready
☐ Communication plan executed
☐ Rollback plan prepared
```

**Launch Day Activities:**
```
T-1 Day:
- Final data sync from legacy systems
- Freeze legacy system changes
- Full system backup

Launch Day:
00:00 - System cutover
01:00 - Smoke tests
02:00 - User access verification
08:00 - Staff login and testing
09:00 - Official launch announcement
12:00 - First checkpoint review
17:00 - End of day review

T+1 Day:
- Issue triage
- Performance monitoring
- User feedback collection
```

---

## Appendix A: Sample Item Records

### Sample 1: Fuel Filter
```json
{
  "item_id": "ITM-20251106-000001",
  "item_code": "FLT-BBK-001",
  "item_name": "Filter Bahan Bakar Solar Premium - Kapasitas 500 L/jam",
  "item_description": "Filter cartridge type dengan efisiensi tinggi untuk penyaringan bahan bakar solar pada sistem pembangkit listrik diesel. Dilengkapi water separator dengan efisiensi 95%. Material housing stainless steel 316L. Cocok untuk PLTD dengan generator 500-1000 kVA. Efisiensi penyaringan 99.9% untuk partikel >10 mikron.",
  "category_id": "CAT-FILTER-BBK",
  "supplier_id": "SUP-000123",
  "unit_price": 1250000.00,
  "currency": "IDR",
  "stock_quantity": 45,
  "lead_time_days": 10,
  "unit_of_measure": "PIECE",
  "technical_specifications": {
    "filter_type": "Cartridge",
    "filtration_rating": "10 micron absolute",
    "beta_ratio": ">1000 @ 10 micron",
    "flow_rate": {"value": 500, "unit": "L/hr", "condition": "@ 25°C, clean filter"},
    "pressure_rating": {
      "working_pressure": "10 bar",
      "burst_pressure": "40 bar",
      "test_pressure": "15 bar"
    },
    "temperature_range": {"min": -20, "max": 120, "unit": "°C"},
    "connections": {
      "inlet": "BSP 1 inch",
      "outlet": "BSP 1 inch",
      "drain": "BSP 1/2 inch"
    },
    "filter_media": {
      "type": "Cellulose + Synthetic blend",
      "area": "2.5 m²",
      "efficiency": "99.9% @ 10 micron"
    },
    "water_separation": {
      "capability": true,
      "efficiency": "95%",
      "type": "Coalescing"
    },
    "bypass_valve": "Built-in @ 2.5 bar differential",
    "anti_drainback_valve": true,
    "service_life": "6 months or 2000 operating hours"
  },
  "dimensions": {
    "length": 350,
    "width": 250,
    "height": 450,
    "unit": "mm"
  },
  "weight": 12.500,
  "compliance_certifications": [
    {
      "certification_type": "SNI",
      "certification_number": "SNI 19-1234-2020",
      "certification_name": "Filter Bahan Bakar Diesel",
      "issuing_authority": "Badan Standardisasi Nasional",
      "issue_date": "2023-03-15",
      "expiry_date": "2026-03-14",
      "status": "VALID"
    },
    {
      "certification_type": "ISO",
      "certification_number": "ISO 9001:2015",
      "certification_name": "Quality Management System",
      "issuing_authority": "TÜV SÜD",
      "issue_date": "2024-01-10",
      "expiry_date": "2027-01-09",
      "status": "VALID"
    }
  ],
  "warranty_info": "12 bulan garansi penuh dari tanggal instalasi",
  "image_url": "https://storage.supabase.co/pln-marketplace/products/FLT-BBK-001_main.jpg",
  "is_active": true,
  "created_at": "2024-11-01T08:00:00Z",
  "updated_at": "2024-11-06T10:30:00Z"
}
```

---

## Document Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-06 | PLN Procurement Team | Initial comprehensive specification |

---

**Document Status:** APPROVED FOR IMPLEMENTATION
**Next Review Date:** 2025-12-06
**Document Owner:** PLN Indonesia Power - Procurement Division
