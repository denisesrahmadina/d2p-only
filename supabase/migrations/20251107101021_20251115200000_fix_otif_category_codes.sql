/*
  # Fix OTIF Category Codes
  
  1. Purpose
    - Map main_category names to main_category_code (A-E)
    - Update all existing supplier_otif_deliveries records
    
  2. Mappings
    - Peralatan dan Komponen Mesin → A
    - Peralatan Listrik dan Elektronik → B
    - Jasa Pemeliharaan dan Perbaikan → C
    - Bahan Kimia dan Material → D
    - Peralatan Keselamatan → E
*/

-- Update main_category_code based on main_category names
UPDATE supplier_otif_deliveries
SET main_category_code = CASE main_category
  WHEN 'Peralatan dan Komponen Mesin' THEN 'A'
  WHEN 'Peralatan Listrik dan Elektronik' THEN 'B'
  WHEN 'Jasa Pemeliharaan dan Perbaikan' THEN 'C'
  WHEN 'Bahan Kimia dan Material' THEN 'D'
  WHEN 'Peralatan Keselamatan' THEN 'E'
  ELSE NULL
END
WHERE main_category_code IS NULL;
