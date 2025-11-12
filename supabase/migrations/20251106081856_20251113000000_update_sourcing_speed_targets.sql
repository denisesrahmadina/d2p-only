/*
  # Update Procurement Sourcing Speed Targets by Category

  1. Updates
    - Update target_sourcing_days for each main category based on new requirements:
      - Category A (Energi Primer): 36 days
      - Category B (Peralatan Mekanikal/Elektrikal): 16 days
      - Category C (Material & Consumable): 16 days
      - Category D (Asset Non-Operasional): 27 days
      - Category E (Jasa & Kontrak Pendukung): 83 days
      - Category F (Peralatan Utama & EPC): 70 days

  2. Notes
    - This updates the average target for each main category
    - Subcategories will use their parent category's target
    - Existing contract data will be reevaluated against new targets
*/

-- Update Category A: Energi Primer dan Jasa Penunjangnya (36 days)
UPDATE ref_procurement_categories
SET target_sourcing_days = 36
WHERE main_category_code = 'A';

-- Update Category B: Peralatan Penunjang dan Sistem Mechanical/Electrical (16 days)
UPDATE ref_procurement_categories
SET target_sourcing_days = 16
WHERE main_category_code = 'B';

-- Update Category C: Material, Consumable, dan General Supply (16 days)
UPDATE ref_procurement_categories
SET target_sourcing_days = 16
WHERE main_category_code = 'C';

-- Update Category D: Asset Non-Operasional dan Penunjang Manajemen (27 days)
UPDATE ref_procurement_categories
SET target_sourcing_days = 27
WHERE main_category_code = 'D';

-- Update Category E: Jasa dan Kontrak Pendukung (83 days)
UPDATE ref_procurement_categories
SET target_sourcing_days = 83
WHERE main_category_code = 'E';

-- Update Category F: Peralatan Utama Pembangkit dan Project EPC (70 days)
UPDATE ref_procurement_categories
SET target_sourcing_days = 70
WHERE main_category_code = 'F';
