/*
  # Update Inventory Tolerance Mock Data for Realistic Scenario
  
  1. Changes
    - Update all units to have at least 100 materials each
    - Create more granular and spread tolerance percentages (ranging from 75% to 98%)
    - Calculate corresponding out-of-tolerance counts based on percentages
    
  2. Data Distribution
    - HO-001 (Head Office): 450 materials
    - Major units (Suralaya, Priok, Kamojang, etc.): 180-250 materials
    - Medium units: 120-180 materials
    - Smaller units: 100-120 materials
    - Tolerance ranges from 75% to 98% for realistic variance
*/

-- Update inventory tolerance data with realistic material counts
UPDATE inventory_planning_tolerance SET
  total_materials = 450,
  tolerance_percentage = 92.4,
  materials_out_of_tolerance = 34
WHERE unit_id = 'HO-001';

-- Major Power Plants (Large scale operations)
UPDATE inventory_planning_tolerance SET
  total_materials = 245,
  tolerance_percentage = 89.8,
  materials_out_of_tolerance = 25
WHERE unit_id = 'UBP-SRY'; -- Suralaya

UPDATE inventory_planning_tolerance SET
  total_materials = 220,
  tolerance_percentage = 91.4,
  materials_out_of_tolerance = 19
WHERE unit_id = 'UBP-PRK'; -- Priok

UPDATE inventory_planning_tolerance SET
  total_materials = 210,
  tolerance_percentage = 87.6,
  materials_out_of_tolerance = 26
WHERE unit_id = 'UBP-MKS'; -- Makassar

UPDATE inventory_planning_tolerance SET
  total_materials = 200,
  tolerance_percentage = 93.5,
  materials_out_of_tolerance = 13
WHERE unit_id = 'UBP-KMJ'; -- Kamojang

UPDATE inventory_planning_tolerance SET
  total_materials = 195,
  tolerance_percentage = 88.2,
  materials_out_of_tolerance = 23
WHERE unit_id = 'UBP-LBN'; -- Labuhan

-- Medium-sized Power Plants
UPDATE inventory_planning_tolerance SET
  total_materials = 175,
  tolerance_percentage = 94.3,
  materials_out_of_tolerance = 10
WHERE unit_id = 'UBP-PSG'; -- Pesanggaran

UPDATE inventory_planning_tolerance SET
  total_materials = 165,
  tolerance_percentage = 86.1,
  materials_out_of_tolerance = 23
WHERE unit_id = 'UBP-PLM'; -- Palembang

UPDATE inventory_planning_tolerance SET
  total_materials = 160,
  tolerance_percentage = 90.6,
  materials_out_of_tolerance = 15
WHERE unit_id = 'UBP-ASM'; -- Asam Asam

UPDATE inventory_planning_tolerance SET
  total_materials = 155,
  tolerance_percentage = 92.9,
  materials_out_of_tolerance = 11
WHERE unit_id = 'UBP-BRU'; -- Barru

UPDATE inventory_planning_tolerance SET
  total_materials = 150,
  tolerance_percentage = 85.3,
  materials_out_of_tolerance = 22
WHERE unit_id = 'UBP-LTR'; -- Lontar

UPDATE inventory_planning_tolerance SET
  total_materials = 145,
  tolerance_percentage = 91.0,
  materials_out_of_tolerance = 13
WHERE unit_id = 'UBP-BKP'; -- Bangka

UPDATE inventory_planning_tolerance SET
  total_materials = 140,
  tolerance_percentage = 87.9,
  materials_out_of_tolerance = 17
WHERE unit_id = 'UBP-PRK2'; -- Priok 2

UPDATE inventory_planning_tolerance SET
  total_materials = 135,
  tolerance_percentage = 93.3,
  materials_out_of_tolerance = 9
WHERE unit_id = 'UBP-GRT'; -- Grati

-- Smaller units but still realistic
UPDATE inventory_planning_tolerance SET
  total_materials = 130,
  tolerance_percentage = 89.2,
  materials_out_of_tolerance = 14
WHERE unit_id = 'UBP-PBR'; -- Paiton Baru

UPDATE inventory_planning_tolerance SET
  total_materials = 125,
  tolerance_percentage = 95.2,
  materials_out_of_tolerance = 6
WHERE unit_id = 'UBP-SGG'; -- Saguling

UPDATE inventory_planning_tolerance SET
  total_materials = 120,
  tolerance_percentage = 84.2,
  materials_out_of_tolerance = 19
WHERE unit_id = 'UBP-ADP'; -- Adipala

UPDATE inventory_planning_tolerance SET
  total_materials = 115,
  tolerance_percentage = 90.4,
  materials_out_of_tolerance = 11
WHERE unit_id = 'UBP-BNG'; -- Bengkok

UPDATE inventory_planning_tolerance SET
  total_materials = 110,
  tolerance_percentage = 88.2,
  materials_out_of_tolerance = 13
WHERE unit_id = 'UBP-GLM'; -- Gilimanuk

UPDATE inventory_planning_tolerance SET
  total_materials = 108,
  tolerance_percentage = 92.6,
  materials_out_of_tolerance = 8
WHERE unit_id = 'UBP-BKL'; -- Bangkalan

UPDATE inventory_planning_tolerance SET
  total_materials = 105,
  tolerance_percentage = 86.7,
  materials_out_of_tolerance = 14
WHERE unit_id = 'UBP-PSU'; -- Pesanggaran Utara

UPDATE inventory_planning_tolerance SET
  total_materials = 102,
  tolerance_percentage = 91.2,
  materials_out_of_tolerance = 9
WHERE unit_id = 'UBP-KRY'; -- Karangkates

UPDATE inventory_planning_tolerance SET
  total_materials = 100,
  tolerance_percentage = 87.0,
  materials_out_of_tolerance = 13
WHERE unit_id = 'UBP-JRH'; -- Jeranjang

UPDATE inventory_planning_tolerance SET
  total_materials = 100,
  tolerance_percentage = 93.0,
  materials_out_of_tolerance = 7
WHERE unit_id = 'UBP-PMK'; -- Pematang Keb

UPDATE inventory_planning_tolerance SET
  total_materials = 100,
  tolerance_percentage = 89.0,
  materials_out_of_tolerance = 11
WHERE unit_id = 'UBP-PML'; -- Pamulang

UPDATE inventory_planning_tolerance SET
  total_materials = 100,
  tolerance_percentage = 85.0,
  materials_out_of_tolerance = 15
WHERE unit_id = 'UBP-BEU'; -- Beureu

UPDATE inventory_planning_tolerance SET
  total_materials = 100,
  tolerance_percentage = 94.0,
  materials_out_of_tolerance = 6
WHERE unit_id = 'UBP-SMD'; -- Samarinda

UPDATE inventory_planning_tolerance SET
  total_materials = 100,
  tolerance_percentage = 88.0,
  materials_out_of_tolerance = 12
WHERE unit_id = 'UBP-AMB'; -- Ambon
