/*
  # Populate Material Price History Mock Data

  ## Overview
  This migration populates the fact_material_price_history table with realistic historical price trend data
  for materials across different categories and business units over a 24-month period.

  ## Data Coverage
  - Categories: Mechanical, Electrical, Renewable Energy
  - Time Period: January 2023 - December 2024 (24 months)
  - Business Units: Java 1, Java 2, Sumatra 1, Sumatra 2, Kalimantan 1, Bali
  - Price Trends: Various patterns (rising, declining, stable, volatile)
*/

-- Mechanical Category: Turbines (Price trend: Rising due to demand)
-- Base price: 850,000,000 IDR per unit, increasing ~2% per month
INSERT INTO fact_material_price_history (material_code, material_name, category_code, business_unit, fiscal_year, fiscal_month, period_label, price_per_unit, quantity_ordered, total_amount, vendor_name, po_count) VALUES
-- Java 1 - Turbines
('MAT-TRB-001', 'Gas Turbine Model GT-5000', 'mechanical', 'Java 1', 2023, 1, 'Jan 2023', 850000000, 2, 1700000000, 'Siemens Energy', 1),
('MAT-TRB-001', 'Gas Turbine Model GT-5000', 'mechanical', 'Java 1', 2023, 3, 'Mar 2023', 867000000, 1, 867000000, 'Siemens Energy', 1),
('MAT-TRB-001', 'Gas Turbine Model GT-5000', 'mechanical', 'Java 1', 2023, 5, 'May 2023', 884000000, 2, 1768000000, 'Siemens Energy', 1),
('MAT-TRB-001', 'Gas Turbine Model GT-5000', 'mechanical', 'Java 1', 2023, 7, 'Jul 2023', 901000000, 1, 901000000, 'GE Power', 1),
('MAT-TRB-001', 'Gas Turbine Model GT-5000', 'mechanical', 'Java 1', 2023, 9, 'Sep 2023', 919000000, 2, 1838000000, 'Siemens Energy', 1),
('MAT-TRB-001', 'Gas Turbine Model GT-5000', 'mechanical', 'Java 1', 2023, 11, 'Nov 2023', 937000000, 1, 937000000, 'Siemens Energy', 1),
('MAT-TRB-001', 'Gas Turbine Model GT-5000', 'mechanical', 'Java 1', 2024, 1, 'Jan 2024', 956000000, 2, 1912000000, 'GE Power', 1),
('MAT-TRB-001', 'Gas Turbine Model GT-5000', 'mechanical', 'Java 1', 2024, 3, 'Mar 2024', 975000000, 1, 975000000, 'Siemens Energy', 1),
('MAT-TRB-001', 'Gas Turbine Model GT-5000', 'mechanical', 'Java 1', 2024, 5, 'May 2024', 995000000, 2, 1990000000, 'Siemens Energy', 1),
('MAT-TRB-001', 'Gas Turbine Model GT-5000', 'mechanical', 'Java 1', 2024, 7, 'Jul 2024', 1015000000, 1, 1015000000, 'GE Power', 1),
('MAT-TRB-001', 'Gas Turbine Model GT-5000', 'mechanical', 'Java 1', 2024, 9, 'Sep 2024', 1035000000, 2, 2070000000, 'Siemens Energy', 1),
('MAT-TRB-001', 'Gas Turbine Model GT-5000', 'mechanical', 'Java 1', 2024, 11, 'Nov 2024', 1056000000, 1, 1056000000, 'Siemens Energy', 1),

-- Sumatra 1 - Turbines
('MAT-TRB-001', 'Gas Turbine Model GT-5000', 'mechanical', 'Sumatra 1', 2023, 2, 'Feb 2023', 858000000, 1, 858000000, 'GE Power', 1),
('MAT-TRB-001', 'Gas Turbine Model GT-5000', 'mechanical', 'Sumatra 1', 2023, 4, 'Apr 2023', 875000000, 2, 1750000000, 'GE Power', 1),
('MAT-TRB-001', 'Gas Turbine Model GT-5000', 'mechanical', 'Sumatra 1', 2023, 6, 'Jun 2023', 893000000, 1, 893000000, 'Siemens Energy', 1),
('MAT-TRB-001', 'Gas Turbine Model GT-5000', 'mechanical', 'Sumatra 1', 2023, 8, 'Aug 2023', 910000000, 2, 1820000000, 'GE Power', 1),
('MAT-TRB-001', 'Gas Turbine Model GT-5000', 'mechanical', 'Sumatra 1', 2023, 10, 'Oct 2023', 928000000, 1, 928000000, 'GE Power', 1),
('MAT-TRB-001', 'Gas Turbine Model GT-5000', 'mechanical', 'Sumatra 1', 2023, 12, 'Dec 2023', 946000000, 2, 1892000000, 'Siemens Energy', 1),
('MAT-TRB-001', 'Gas Turbine Model GT-5000', 'mechanical', 'Sumatra 1', 2024, 2, 'Feb 2024', 965000000, 1, 965000000, 'GE Power', 1),
('MAT-TRB-001', 'Gas Turbine Model GT-5000', 'mechanical', 'Sumatra 1', 2024, 4, 'Apr 2024', 984000000, 2, 1968000000, 'GE Power', 1),
('MAT-TRB-001', 'Gas Turbine Model GT-5000', 'mechanical', 'Sumatra 1', 2024, 6, 'Jun 2024', 1004000000, 1, 1004000000, 'Siemens Energy', 1),
('MAT-TRB-001', 'Gas Turbine Model GT-5000', 'mechanical', 'Sumatra 1', 2024, 8, 'Aug 2024', 1024000000, 2, 2048000000, 'GE Power', 1),
('MAT-TRB-001', 'Gas Turbine Model GT-5000', 'mechanical', 'Sumatra 1', 2024, 10, 'Oct 2024', 1045000000, 1, 1045000000, 'GE Power', 1),

-- Mechanical Category: Pumps (Price trend: Stable with minor fluctuations)
-- Base price: 125,000,000 IDR per unit, stable around this price
INSERT INTO fact_material_price_history (material_code, material_name, category_code, business_unit, fiscal_year, fiscal_month, period_label, price_per_unit, quantity_ordered, total_amount, vendor_name, po_count) VALUES
-- Java 2 - Pumps
('MAT-PMP-002', 'Centrifugal Pump CP-3000', 'mechanical', 'Java 2', 2023, 1, 'Jan 2023', 125000000, 5, 625000000, 'PT Barata', 2),
('MAT-PMP-002', 'Centrifugal Pump CP-3000', 'mechanical', 'Java 2', 2023, 3, 'Mar 2023', 126000000, 4, 504000000, 'PT Barata', 1),
('MAT-PMP-002', 'Centrifugal Pump CP-3000', 'mechanical', 'Java 2', 2023, 5, 'May 2023', 124000000, 6, 744000000, 'PT Barata', 2),
('MAT-PMP-002', 'Centrifugal Pump CP-3000', 'mechanical', 'Java 2', 2023, 7, 'Jul 2023', 125000000, 5, 625000000, 'Doosan Heavy', 1),
('MAT-PMP-002', 'Centrifugal Pump CP-3000', 'mechanical', 'Java 2', 2023, 9, 'Sep 2023', 127000000, 4, 508000000, 'PT Barata', 1),
('MAT-PMP-002', 'Centrifugal Pump CP-3000', 'mechanical', 'Java 2', 2023, 11, 'Nov 2023', 125000000, 5, 625000000, 'PT Barata', 2),
('MAT-PMP-002', 'Centrifugal Pump CP-3000', 'mechanical', 'Java 2', 2024, 1, 'Jan 2024', 126000000, 6, 756000000, 'Doosan Heavy', 2),
('MAT-PMP-002', 'Centrifugal Pump CP-3000', 'mechanical', 'Java 2', 2024, 3, 'Mar 2024', 124000000, 5, 620000000, 'PT Barata', 1),
('MAT-PMP-002', 'Centrifugal Pump CP-3000', 'mechanical', 'Java 2', 2024, 5, 'May 2024', 125000000, 4, 500000000, 'PT Barata', 1),
('MAT-PMP-002', 'Centrifugal Pump CP-3000', 'mechanical', 'Java 2', 2024, 7, 'Jul 2024', 126000000, 6, 756000000, 'Doosan Heavy', 2),
('MAT-PMP-002', 'Centrifugal Pump CP-3000', 'mechanical', 'Java 2', 2024, 9, 'Sep 2024', 125000000, 5, 625000000, 'PT Barata', 1),
('MAT-PMP-002', 'Centrifugal Pump CP-3000', 'mechanical', 'Java 2', 2024, 11, 'Nov 2024', 124000000, 4, 496000000, 'PT Barata', 1),

-- Kalimantan 1 - Pumps
('MAT-PMP-002', 'Centrifugal Pump CP-3000', 'mechanical', 'Kalimantan 1', 2023, 2, 'Feb 2023', 127000000, 3, 381000000, 'Doosan Heavy', 1),
('MAT-PMP-002', 'Centrifugal Pump CP-3000', 'mechanical', 'Kalimantan 1', 2023, 4, 'Apr 2023', 125000000, 4, 500000000, 'PT Barata', 1),
('MAT-PMP-002', 'Centrifugal Pump CP-3000', 'mechanical', 'Kalimantan 1', 2023, 6, 'Jun 2023', 126000000, 3, 378000000, 'Doosan Heavy', 1),
('MAT-PMP-002', 'Centrifugal Pump CP-3000', 'mechanical', 'Kalimantan 1', 2023, 8, 'Aug 2023', 124000000, 5, 620000000, 'PT Barata', 2),
('MAT-PMP-002', 'Centrifugal Pump CP-3000', 'mechanical', 'Kalimantan 1', 2023, 10, 'Oct 2023', 125000000, 4, 500000000, 'PT Barata', 1),
('MAT-PMP-002', 'Centrifugal Pump CP-3000', 'mechanical', 'Kalimantan 1', 2023, 12, 'Dec 2023', 126000000, 3, 378000000, 'Doosan Heavy', 1),
('MAT-PMP-002', 'Centrifugal Pump CP-3000', 'mechanical', 'Kalimantan 1', 2024, 2, 'Feb 2024', 125000000, 4, 500000000, 'PT Barata', 1),
('MAT-PMP-002', 'Centrifugal Pump CP-3000', 'mechanical', 'Kalimantan 1', 2024, 4, 'Apr 2024', 127000000, 3, 381000000, 'Doosan Heavy', 1),
('MAT-PMP-002', 'Centrifugal Pump CP-3000', 'mechanical', 'Kalimantan 1', 2024, 6, 'Jun 2024', 124000000, 5, 620000000, 'PT Barata', 2),
('MAT-PMP-002', 'Centrifugal Pump CP-3000', 'mechanical', 'Kalimantan 1', 2024, 8, 'Aug 2024', 125000000, 4, 500000000, 'PT Barata', 1),
('MAT-PMP-002', 'Centrifugal Pump CP-3000', 'mechanical', 'Kalimantan 1', 2024, 10, 'Oct 2024', 126000000, 3, 378000000, 'Doosan Heavy', 1),

-- Electrical Category: Transformers (Price trend: Declining due to increased competition)
-- Base price: 750,000,000 IDR per unit, declining ~1.5% per month
INSERT INTO fact_material_price_history (material_code, material_name, category_code, business_unit, fiscal_year, fiscal_month, period_label, price_per_unit, quantity_ordered, total_amount, vendor_name, po_count) VALUES
-- Java 1 - Transformers
('MAT-TRF-003', 'Power Transformer 150MVA', 'electrical', 'Java 1', 2023, 1, 'Jan 2023', 750000000, 3, 2250000000, 'ABB Indonesia', 1),
('MAT-TRF-003', 'Power Transformer 150MVA', 'electrical', 'Java 1', 2023, 3, 'Mar 2023', 728000000, 2, 1456000000, 'ABB Indonesia', 1),
('MAT-TRF-003', 'Power Transformer 150MVA', 'electrical', 'Java 1', 2023, 5, 'May 2023', 706000000, 3, 2118000000, 'Schneider Electric', 1),
('MAT-TRF-003', 'Power Transformer 150MVA', 'electrical', 'Java 1', 2023, 7, 'Jul 2023', 685000000, 2, 1370000000, 'ABB Indonesia', 1),
('MAT-TRF-003', 'Power Transformer 150MVA', 'electrical', 'Java 1', 2023, 9, 'Sep 2023', 665000000, 3, 1995000000, 'ABB Indonesia', 1),
('MAT-TRF-003', 'Power Transformer 150MVA', 'electrical', 'Java 1', 2023, 11, 'Nov 2023', 645000000, 2, 1290000000, 'Schneider Electric', 1),
('MAT-TRF-003', 'Power Transformer 150MVA', 'electrical', 'Java 1', 2024, 1, 'Jan 2024', 626000000, 3, 1878000000, 'ABB Indonesia', 1),
('MAT-TRF-003', 'Power Transformer 150MVA', 'electrical', 'Java 1', 2024, 3, 'Mar 2024', 607000000, 2, 1214000000, 'ABB Indonesia', 1),
('MAT-TRF-003', 'Power Transformer 150MVA', 'electrical', 'Java 1', 2024, 5, 'May 2024', 589000000, 3, 1767000000, 'Schneider Electric', 1),
('MAT-TRF-003', 'Power Transformer 150MVA', 'electrical', 'Java 1', 2024, 7, 'Jul 2024', 572000000, 2, 1144000000, 'ABB Indonesia', 1),
('MAT-TRF-003', 'Power Transformer 150MVA', 'electrical', 'Java 1', 2024, 9, 'Sep 2024', 555000000, 3, 1665000000, 'ABB Indonesia', 1),
('MAT-TRF-003', 'Power Transformer 150MVA', 'electrical', 'Java 1', 2024, 11, 'Nov 2024', 538000000, 2, 1076000000, 'Schneider Electric', 1),

-- Java 2 - Transformers
('MAT-TRF-003', 'Power Transformer 150MVA', 'electrical', 'Java 2', 2023, 2, 'Feb 2023', 739000000, 2, 1478000000, 'Schneider Electric', 1),
('MAT-TRF-003', 'Power Transformer 150MVA', 'electrical', 'Java 2', 2023, 4, 'Apr 2023', 717000000, 3, 2151000000, 'ABB Indonesia', 1),
('MAT-TRF-003', 'Power Transformer 150MVA', 'electrical', 'Java 2', 2023, 6, 'Jun 2023', 696000000, 2, 1392000000, 'Schneider Electric', 1),
('MAT-TRF-003', 'Power Transformer 150MVA', 'electrical', 'Java 2', 2023, 8, 'Aug 2023', 675000000, 3, 2025000000, 'ABB Indonesia', 1),
('MAT-TRF-003', 'Power Transformer 150MVA', 'electrical', 'Java 2', 2023, 10, 'Oct 2023', 655000000, 2, 1310000000, 'Schneider Electric', 1),
('MAT-TRF-003', 'Power Transformer 150MVA', 'electrical', 'Java 2', 2023, 12, 'Dec 2023', 635000000, 3, 1905000000, 'ABB Indonesia', 1),
('MAT-TRF-003', 'Power Transformer 150MVA', 'electrical', 'Java 2', 2024, 2, 'Feb 2024', 616000000, 2, 1232000000, 'Schneider Electric', 1),
('MAT-TRF-003', 'Power Transformer 150MVA', 'electrical', 'Java 2', 2024, 4, 'Apr 2024', 598000000, 3, 1794000000, 'ABB Indonesia', 1),
('MAT-TRF-003', 'Power Transformer 150MVA', 'electrical', 'Java 2', 2024, 6, 'Jun 2024', 580000000, 2, 1160000000, 'Schneider Electric', 1),
('MAT-TRF-003', 'Power Transformer 150MVA', 'electrical', 'Java 2', 2024, 8, 'Aug 2024', 563000000, 3, 1689000000, 'ABB Indonesia', 1),
('MAT-TRF-003', 'Power Transformer 150MVA', 'electrical', 'Java 2', 2024, 10, 'Oct 2024', 546000000, 2, 1092000000, 'Schneider Electric', 1),

-- Renewable Category: Solar Panels (Price trend: Declining sharply due to technology advancement)
-- Base price: 4,500,000 IDR per unit, declining ~3% per month
INSERT INTO fact_material_price_history (material_code, material_name, category_code, business_unit, fiscal_year, fiscal_month, period_label, price_per_unit, quantity_ordered, total_amount, vendor_name, po_count) VALUES
-- Java 1 Solar - Solar Panels
('MAT-SOL-004', 'Monocrystalline Solar Panel 400W', 'renewable', 'Java 1 Solar', 2023, 1, 'Jan 2023', 4500000, 1000, 4500000000, 'First Solar', 5),
('MAT-SOL-004', 'Monocrystalline Solar Panel 400W', 'renewable', 'Java 1 Solar', 2023, 3, 'Mar 2023', 4230000, 1200, 5076000000, 'JinkoSolar', 6),
('MAT-SOL-004', 'Monocrystalline Solar Panel 400W', 'renewable', 'Java 1 Solar', 2023, 5, 'May 2023', 3980000, 1500, 5970000000, 'First Solar', 7),
('MAT-SOL-004', 'Monocrystalline Solar Panel 400W', 'renewable', 'Java 1 Solar', 2023, 7, 'Jul 2023', 3745000, 1000, 3745000000, 'JinkoSolar', 5),
('MAT-SOL-004', 'Monocrystalline Solar Panel 400W', 'renewable', 'Java 1 Solar', 2023, 9, 'Sep 2023', 3525000, 1200, 4230000000, 'First Solar', 6),
('MAT-SOL-004', 'Monocrystalline Solar Panel 400W', 'renewable', 'Java 1 Solar', 2023, 11, 'Nov 2023', 3320000, 1500, 4980000000, 'JinkoSolar', 7),
('MAT-SOL-004', 'Monocrystalline Solar Panel 400W', 'renewable', 'Java 1 Solar', 2024, 1, 'Jan 2024', 3125000, 1800, 5625000000, 'First Solar', 9),
('MAT-SOL-004', 'Monocrystalline Solar Panel 400W', 'renewable', 'Java 1 Solar', 2024, 3, 'Mar 2024', 2940000, 1000, 2940000000, 'JinkoSolar', 5),
('MAT-SOL-004', 'Monocrystalline Solar Panel 400W', 'renewable', 'Java 1 Solar', 2024, 5, 'May 2024', 2768000, 1200, 3321600000, 'First Solar', 6),
('MAT-SOL-004', 'Monocrystalline Solar Panel 400W', 'renewable', 'Java 1 Solar', 2024, 7, 'Jul 2024', 2605000, 1500, 3907500000, 'JinkoSolar', 7),
('MAT-SOL-004', 'Monocrystalline Solar Panel 400W', 'renewable', 'Java 1 Solar', 2024, 9, 'Sep 2024', 2453000, 2000, 4906000000, 'First Solar', 10),
('MAT-SOL-004', 'Monocrystalline Solar Panel 400W', 'renewable', 'Java 1 Solar', 2024, 11, 'Nov 2024', 2309000, 1800, 4156200000, 'JinkoSolar', 9),

-- Bali Solar - Solar Panels
('MAT-SOL-004', 'Monocrystalline Solar Panel 400W', 'renewable', 'Bali Solar', 2023, 2, 'Feb 2023', 4365000, 800, 3492000000, 'JinkoSolar', 4),
('MAT-SOL-004', 'Monocrystalline Solar Panel 400W', 'renewable', 'Bali Solar', 2023, 4, 'Apr 2023', 4103000, 1000, 4103000000, 'First Solar', 5),
('MAT-SOL-004', 'Monocrystalline Solar Panel 400W', 'renewable', 'Bali Solar', 2023, 6, 'Jun 2023', 3860000, 800, 3088000000, 'JinkoSolar', 4),
('MAT-SOL-004', 'Monocrystalline Solar Panel 400W', 'renewable', 'Bali Solar', 2023, 8, 'Aug 2023', 3632000, 1000, 3632000000, 'First Solar', 5),
('MAT-SOL-004', 'Monocrystalline Solar Panel 400W', 'renewable', 'Bali Solar', 2023, 10, 'Oct 2023', 3419000, 1200, 4102800000, 'JinkoSolar', 6),
('MAT-SOL-004', 'Monocrystalline Solar Panel 400W', 'renewable', 'Bali Solar', 2023, 12, 'Dec 2023', 3218000, 800, 2574400000, 'First Solar', 4),
('MAT-SOL-004', 'Monocrystalline Solar Panel 400W', 'renewable', 'Bali Solar', 2024, 2, 'Feb 2024', 3028000, 1000, 3028000000, 'JinkoSolar', 5),
('MAT-SOL-004', 'Monocrystalline Solar Panel 400W', 'renewable', 'Bali Solar', 2024, 4, 'Apr 2024', 2850000, 1200, 3420000000, 'First Solar', 6),
('MAT-SOL-004', 'Monocrystalline Solar Panel 400W', 'renewable', 'Bali Solar', 2024, 6, 'Jun 2024', 2682000, 800, 2145600000, 'JinkoSolar', 4),
('MAT-SOL-004', 'Monocrystalline Solar Panel 400W', 'renewable', 'Bali Solar', 2024, 8, 'Aug 2024', 2524000, 1000, 2524000000, 'First Solar', 5),
('MAT-SOL-004', 'Monocrystalline Solar Panel 400W', 'renewable', 'Bali Solar', 2024, 10, 'Oct 2024', 2375000, 1200, 2850000000, 'JinkoSolar', 6),

-- Renewable Category: Wind Turbines (Price trend: Volatile due to market fluctuations)
-- Base price: 15,000,000,000 IDR per unit with fluctuations
INSERT INTO fact_material_price_history (material_code, material_name, category_code, business_unit, fiscal_year, fiscal_month, period_label, price_per_unit, quantity_ordered, total_amount, vendor_name, po_count) VALUES
-- Sumatra Wind - Wind Turbines
('MAT-WND-005', 'Wind Turbine 3MW', 'renewable', 'Sumatra Wind', 2023, 1, 'Jan 2023', 15000000000, 2, 30000000000, 'Vestas', 1),
('MAT-WND-005', 'Wind Turbine 3MW', 'renewable', 'Sumatra Wind', 2023, 3, 'Mar 2023', 15600000000, 1, 15600000000, 'Vestas', 1),
('MAT-WND-005', 'Wind Turbine 3MW', 'renewable', 'Sumatra Wind', 2023, 5, 'May 2023', 14800000000, 2, 29600000000, 'Vestas', 1),
('MAT-WND-005', 'Wind Turbine 3MW', 'renewable', 'Sumatra Wind', 2023, 7, 'Jul 2023', 16200000000, 1, 16200000000, 'Vestas', 1),
('MAT-WND-005', 'Wind Turbine 3MW', 'renewable', 'Sumatra Wind', 2023, 9, 'Sep 2023', 14500000000, 2, 29000000000, 'Vestas', 1),
('MAT-WND-005', 'Wind Turbine 3MW', 'renewable', 'Sumatra Wind', 2023, 11, 'Nov 2023', 15900000000, 1, 15900000000, 'Vestas', 1),
('MAT-WND-005', 'Wind Turbine 3MW', 'renewable', 'Sumatra Wind', 2024, 1, 'Jan 2024', 14200000000, 2, 28400000000, 'Vestas', 1),
('MAT-WND-005', 'Wind Turbine 3MW', 'renewable', 'Sumatra Wind', 2024, 3, 'Mar 2024', 15700000000, 1, 15700000000, 'Vestas', 1),
('MAT-WND-005', 'Wind Turbine 3MW', 'renewable', 'Sumatra Wind', 2024, 5, 'May 2024', 14000000000, 2, 28000000000, 'Vestas', 1),
('MAT-WND-005', 'Wind Turbine 3MW', 'renewable', 'Sumatra Wind', 2024, 7, 'Jul 2024', 16000000000, 1, 16000000000, 'Vestas', 1),
('MAT-WND-005', 'Wind Turbine 3MW', 'renewable', 'Sumatra Wind', 2024, 9, 'Sep 2024', 13800000000, 2, 27600000000, 'Vestas', 1),
('MAT-WND-005', 'Wind Turbine 3MW', 'renewable', 'Sumatra Wind', 2024, 11, 'Nov 2024', 15500000000, 1, 15500000000, 'Vestas', 1);
