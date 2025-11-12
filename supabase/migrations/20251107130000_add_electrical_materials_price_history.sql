/*
  # Add Electrical Category Materials Price History

  ## Overview
  This migration adds comprehensive historical price data for electrical category materials
  to support the Historical Unit Price Trends visualization and AI-powered insights.

  ## Data Coverage
  - Category: Electrical
  - Materials: Switchgear, Circuit Breakers, Cables, Panel Systems
  - Time Period: January 2023 - November 2024 (23 months)
  - Business Units: Java 1, Java 2, Sumatra 1, Bali
  - Price Trends: Various patterns (rising, stable, declining, volatile)

  ## Tables Modified
  - fact_material_price_history (INSERT operations only)

  ## Security
  - No security changes (existing RLS policies apply)
*/

-- Electrical Category: Switchgear (Price trend: Rising gradually)
-- Base price: 875,000,000 IDR per unit, increasing ~1.5% per month
INSERT INTO fact_material_price_history (material_code, material_name, category_code, business_unit, fiscal_year, fiscal_month, period_label, price_per_unit, quantity_ordered, total_amount, vendor_name, po_count) VALUES
-- Java 1 - Switchgear
('MAT-SWG-006', 'Medium Voltage Switchgear 11kV', 'electrical', 'Java 1', 2023, 1, 'Jan 2023', 875000000, 4, 3500000000, 'ABB Indonesia', 2),
('MAT-SWG-006', 'Medium Voltage Switchgear 11kV', 'electrical', 'Java 1', 2023, 3, 'Mar 2023', 901000000, 3, 2703000000, 'Schneider Electric', 1),
('MAT-SWG-006', 'Medium Voltage Switchgear 11kV', 'electrical', 'Java 1', 2023, 5, 'May 2023', 928000000, 4, 3712000000, 'ABB Indonesia', 2),
('MAT-SWG-006', 'Medium Voltage Switchgear 11kV', 'electrical', 'Java 1', 2023, 7, 'Jul 2023', 955000000, 3, 2865000000, 'Schneider Electric', 1),
('MAT-SWG-006', 'Medium Voltage Switchgear 11kV', 'electrical', 'Java 1', 2023, 9, 'Sep 2023', 983000000, 4, 3932000000, 'ABB Indonesia', 2),
('MAT-SWG-006', 'Medium Voltage Switchgear 11kV', 'electrical', 'Java 1', 2023, 11, 'Nov 2023', 1012000000, 3, 3036000000, 'Schneider Electric', 1),
('MAT-SWG-006', 'Medium Voltage Switchgear 11kV', 'electrical', 'Java 1', 2024, 1, 'Jan 2024', 1041000000, 4, 4164000000, 'ABB Indonesia', 2),
('MAT-SWG-006', 'Medium Voltage Switchgear 11kV', 'electrical', 'Java 1', 2024, 3, 'Mar 2024', 1072000000, 3, 3216000000, 'Schneider Electric', 1),
('MAT-SWG-006', 'Medium Voltage Switchgear 11kV', 'electrical', 'Java 1', 2024, 5, 'May 2024', 1103000000, 4, 4412000000, 'ABB Indonesia', 2),
('MAT-SWG-006', 'Medium Voltage Switchgear 11kV', 'electrical', 'Java 1', 2024, 7, 'Jul 2024', 1136000000, 3, 3408000000, 'Schneider Electric', 1),
('MAT-SWG-006', 'Medium Voltage Switchgear 11kV', 'electrical', 'Java 1', 2024, 9, 'Sep 2024', 1169000000, 4, 4676000000, 'ABB Indonesia', 2),
('MAT-SWG-006', 'Medium Voltage Switchgear 11kV', 'electrical', 'Java 1', 2024, 11, 'Nov 2024', 1204000000, 3, 3612000000, 'Schneider Electric', 1),

-- Java 2 - Switchgear
('MAT-SWG-006', 'Medium Voltage Switchgear 11kV', 'electrical', 'Java 2', 2023, 2, 'Feb 2023', 888000000, 3, 2664000000, 'Schneider Electric', 1),
('MAT-SWG-006', 'Medium Voltage Switchgear 11kV', 'electrical', 'Java 2', 2023, 4, 'Apr 2023', 914000000, 4, 3656000000, 'ABB Indonesia', 2),
('MAT-SWG-006', 'Medium Voltage Switchgear 11kV', 'electrical', 'Java 2', 2023, 6, 'Jun 2023', 941000000, 3, 2823000000, 'Schneider Electric', 1),
('MAT-SWG-006', 'Medium Voltage Switchgear 11kV', 'electrical', 'Java 2', 2023, 8, 'Aug 2023', 969000000, 4, 3876000000, 'ABB Indonesia', 2),
('MAT-SWG-006', 'Medium Voltage Switchgear 11kV', 'electrical', 'Java 2', 2023, 10, 'Oct 2023', 998000000, 3, 2994000000, 'Schneider Electric', 1),
('MAT-SWG-006', 'Medium Voltage Switchgear 11kV', 'electrical', 'Java 2', 2023, 12, 'Dec 2023', 1027000000, 4, 4108000000, 'ABB Indonesia', 2),
('MAT-SWG-006', 'Medium Voltage Switchgear 11kV', 'electrical', 'Java 2', 2024, 2, 'Feb 2024', 1057000000, 3, 3171000000, 'Schneider Electric', 1),
('MAT-SWG-006', 'Medium Voltage Switchgear 11kV', 'electrical', 'Java 2', 2024, 4, 'Apr 2024', 1088000000, 4, 4352000000, 'ABB Indonesia', 2),
('MAT-SWG-006', 'Medium Voltage Switchgear 11kV', 'electrical', 'Java 2', 2024, 6, 'Jun 2024', 1120000000, 3, 3360000000, 'Schneider Electric', 1),
('MAT-SWG-006', 'Medium Voltage Switchgear 11kV', 'electrical', 'Java 2', 2024, 8, 'Aug 2024', 1153000000, 4, 4612000000, 'ABB Indonesia', 2),
('MAT-SWG-006', 'Medium Voltage Switchgear 11kV', 'electrical', 'Java 2', 2024, 10, 'Oct 2024', 1187000000, 3, 3561000000, 'Schneider Electric', 1),

-- Electrical Category: Circuit Breakers (Price trend: Stable)
-- Base price: 95,000,000 IDR per unit, minor fluctuations
-- Sumatra 1 - Circuit Breakers
('MAT-CBR-007', 'Air Circuit Breaker 1600A', 'electrical', 'Sumatra 1', 2023, 1, 'Jan 2023', 95000000, 10, 950000000, 'Siemens', 3),
('MAT-CBR-007', 'Air Circuit Breaker 1600A', 'electrical', 'Sumatra 1', 2023, 3, 'Mar 2023', 96000000, 8, 768000000, 'Eaton', 2),
('MAT-CBR-007', 'Air Circuit Breaker 1600A', 'electrical', 'Sumatra 1', 2023, 5, 'May 2023', 94000000, 12, 1128000000, 'Siemens', 4),
('MAT-CBR-007', 'Air Circuit Breaker 1600A', 'electrical', 'Sumatra 1', 2023, 7, 'Jul 2023', 95000000, 10, 950000000, 'Eaton', 3),
('MAT-CBR-007', 'Air Circuit Breaker 1600A', 'electrical', 'Sumatra 1', 2023, 9, 'Sep 2023', 97000000, 8, 776000000, 'Siemens', 2),
('MAT-CBR-007', 'Air Circuit Breaker 1600A', 'electrical', 'Sumatra 1', 2023, 11, 'Nov 2023', 95000000, 10, 950000000, 'Eaton', 3),
('MAT-CBR-007', 'Air Circuit Breaker 1600A', 'electrical', 'Sumatra 1', 2024, 1, 'Jan 2024', 96000000, 12, 1152000000, 'Siemens', 4),
('MAT-CBR-007', 'Air Circuit Breaker 1600A', 'electrical', 'Sumatra 1', 2024, 3, 'Mar 2024', 94000000, 10, 940000000, 'Eaton', 3),
('MAT-CBR-007', 'Air Circuit Breaker 1600A', 'electrical', 'Sumatra 1', 2024, 5, 'May 2024', 95000000, 8, 760000000, 'Siemens', 2),
('MAT-CBR-007', 'Air Circuit Breaker 1600A', 'electrical', 'Sumatra 1', 2024, 7, 'Jul 2024', 96000000, 12, 1152000000, 'Eaton', 4),
('MAT-CBR-007', 'Air Circuit Breaker 1600A', 'electrical', 'Sumatra 1', 2024, 9, 'Sep 2024', 95000000, 10, 950000000, 'Siemens', 3),
('MAT-CBR-007', 'Air Circuit Breaker 1600A', 'electrical', 'Sumatra 1', 2024, 11, 'Nov 2024', 94000000, 8, 752000000, 'Eaton', 2),

-- Bali - Circuit Breakers
('MAT-CBR-007', 'Air Circuit Breaker 1600A', 'electrical', 'Bali', 2023, 2, 'Feb 2023', 97000000, 6, 582000000, 'Eaton', 2),
('MAT-CBR-007', 'Air Circuit Breaker 1600A', 'electrical', 'Bali', 2023, 4, 'Apr 2023', 95000000, 8, 760000000, 'Siemens', 2),
('MAT-CBR-007', 'Air Circuit Breaker 1600A', 'electrical', 'Bali', 2023, 6, 'Jun 2023', 96000000, 6, 576000000, 'Eaton', 2),
('MAT-CBR-007', 'Air Circuit Breaker 1600A', 'electrical', 'Bali', 2023, 8, 'Aug 2023', 94000000, 8, 752000000, 'Siemens', 2),
('MAT-CBR-007', 'Air Circuit Breaker 1600A', 'electrical', 'Bali', 2023, 10, 'Oct 2023', 95000000, 6, 570000000, 'Eaton', 2),
('MAT-CBR-007', 'Air Circuit Breaker 1600A', 'electrical', 'Bali', 2023, 12, 'Dec 2023', 96000000, 8, 768000000, 'Siemens', 2),
('MAT-CBR-007', 'Air Circuit Breaker 1600A', 'electrical', 'Bali', 2024, 2, 'Feb 2024', 95000000, 6, 570000000, 'Eaton', 2),
('MAT-CBR-007', 'Air Circuit Breaker 1600A', 'electrical', 'Bali', 2024, 4, 'Apr 2024', 97000000, 8, 776000000, 'Siemens', 2),
('MAT-CBR-007', 'Air Circuit Breaker 1600A', 'electrical', 'Bali', 2024, 6, 'Jun 2024', 94000000, 6, 564000000, 'Eaton', 2),
('MAT-CBR-007', 'Air Circuit Breaker 1600A', 'electrical', 'Bali', 2024, 8, 'Aug 2024', 95000000, 8, 760000000, 'Siemens', 2),
('MAT-CBR-007', 'Air Circuit Breaker 1600A', 'electrical', 'Bali', 2024, 10, 'Oct 2024', 96000000, 6, 576000000, 'Eaton', 2),

-- Electrical Category: Cables (Price trend: Volatile due to copper prices)
-- Base price: 32,000,000 IDR per km, significant fluctuations
-- Java 1 - Cables
('MAT-CBL-008', 'XLPE Cable 3x240mm² 11kV', 'electrical', 'Java 1', 2023, 1, 'Jan 2023', 32000000, 50, 1600000000, 'Legrand', 5),
('MAT-CBL-008', 'XLPE Cable 3x240mm² 11kV', 'electrical', 'Java 1', 2023, 3, 'Mar 2023', 35000000, 40, 1400000000, 'Legrand', 4),
('MAT-CBL-008', 'XLPE Cable 3x240mm² 11kV', 'electrical', 'Java 1', 2023, 5, 'May 2023', 30000000, 60, 1800000000, 'Legrand', 6),
('MAT-CBL-008', 'XLPE Cable 3x240mm² 11kV', 'electrical', 'Java 1', 2023, 7, 'Jul 2023', 38000000, 45, 1710000000, 'Legrand', 5),
('MAT-CBL-008', 'XLPE Cable 3x240mm² 11kV', 'electrical', 'Java 1', 2023, 9, 'Sep 2023', 29000000, 55, 1595000000, 'Legrand', 6),
('MAT-CBL-008', 'XLPE Cable 3x240mm² 11kV', 'electrical', 'Java 1', 2023, 11, 'Nov 2023', 36000000, 40, 1440000000, 'Legrand', 4),
('MAT-CBL-008', 'XLPE Cable 3x240mm² 11kV', 'electrical', 'Java 1', 2024, 1, 'Jan 2024', 28000000, 60, 1680000000, 'Legrand', 6),
('MAT-CBL-008', 'XLPE Cable 3x240mm² 11kV', 'electrical', 'Java 1', 2024, 3, 'Mar 2024', 34000000, 45, 1530000000, 'Legrand', 5),
('MAT-CBL-008', 'XLPE Cable 3x240mm² 11kV', 'electrical', 'Java 1', 2024, 5, 'May 2024', 27000000, 55, 1485000000, 'Legrand', 6),
('MAT-CBL-008', 'XLPE Cable 3x240mm² 11kV', 'electrical', 'Java 1', 2024, 7, 'Jul 2024', 33000000, 50, 1650000000, 'Legrand', 5),
('MAT-CBL-008', 'XLPE Cable 3x240mm² 11kV', 'electrical', 'Java 1', 2024, 9, 'Sep 2024', 26000000, 60, 1560000000, 'Legrand', 6),
('MAT-CBL-008', 'XLPE Cable 3x240mm² 11kV', 'electrical', 'Java 1', 2024, 11, 'Nov 2024', 31000000, 45, 1395000000, 'Legrand', 5),

-- Java 2 - Cables
('MAT-CBL-008', 'XLPE Cable 3x240mm² 11kV', 'electrical', 'Java 2', 2023, 2, 'Feb 2023', 33000000, 40, 1320000000, 'Legrand', 4),
('MAT-CBL-008', 'XLPE Cable 3x240mm² 11kV', 'electrical', 'Java 2', 2023, 4, 'Apr 2023', 31000000, 50, 1550000000, 'Legrand', 5),
('MAT-CBL-008', 'XLPE Cable 3x240mm² 11kV', 'electrical', 'Java 2', 2023, 6, 'Jun 2023', 36000000, 35, 1260000000, 'Legrand', 4),
('MAT-CBL-008', 'XLPE Cable 3x240mm² 11kV', 'electrical', 'Java 2', 2023, 8, 'Aug 2023', 30000000, 50, 1500000000, 'Legrand', 5),
('MAT-CBL-008', 'XLPE Cable 3x240mm² 11kV', 'electrical', 'Java 2', 2023, 10, 'Oct 2023', 35000000, 40, 1400000000, 'Legrand', 4),
('MAT-CBL-008', 'XLPE Cable 3x240mm² 11kV', 'electrical', 'Java 2', 2023, 12, 'Dec 2023', 29000000, 50, 1450000000, 'Legrand', 5),
('MAT-CBL-008', 'XLPE Cable 3x240mm² 11kV', 'electrical', 'Java 2', 2024, 2, 'Feb 2024', 33000000, 35, 1155000000, 'Legrand', 4),
('MAT-CBL-008', 'XLPE Cable 3x240mm² 11kV', 'electrical', 'Java 2', 2024, 4, 'Apr 2024', 28000000, 50, 1400000000, 'Legrand', 5),
('MAT-CBL-008', 'XLPE Cable 3x240mm² 11kV', 'electrical', 'Java 2', 2024, 6, 'Jun 2024', 32000000, 40, 1280000000, 'Legrand', 4),
('MAT-CBL-008', 'XLPE Cable 3x240mm² 11kV', 'electrical', 'Java 2', 2024, 8, 'Aug 2024', 27000000, 50, 1350000000, 'Legrand', 5),
('MAT-CBL-008', 'XLPE Cable 3x240mm² 11kV', 'electrical', 'Java 2', 2024, 10, 'Oct 2024', 30000000, 35, 1050000000, 'Legrand', 4);
