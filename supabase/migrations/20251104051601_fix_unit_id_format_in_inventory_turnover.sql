/*
  # Fix unit_id format in material_inventory_turnover

  1. Changes
    - Update unit_id format from space (e.g., 'UBP SRY') to hyphen (e.g., 'UBP-SRY')
    - Ensure consistency with unit_locations table
    
  2. Purpose
    - Enable proper foreign key joins between tables
    - Support inventory turnover panel display
*/

-- Update unit_ids to use hyphen format
UPDATE material_inventory_turnover SET unit_id = 'UBP-SRY' WHERE unit_id = 'UBP SRY';
UPDATE material_inventory_turnover SET unit_id = 'UBP-LBN' WHERE unit_id = 'UBP LBN';
UPDATE material_inventory_turnover SET unit_id = 'UBP-PRK' WHERE unit_id = 'UBP PRK';
UPDATE material_inventory_turnover SET unit_id = 'UBP-BKL' WHERE unit_id = 'UBP BKL';
UPDATE material_inventory_turnover SET unit_id = 'UBP-ASM' WHERE unit_id = 'UBP ASM';
UPDATE material_inventory_turnover SET unit_id = 'UBP-MKS' WHERE unit_id = 'UBP MKS';
UPDATE material_inventory_turnover SET unit_id = 'UBP-PSG' WHERE unit_id = 'UBP PSG';
UPDATE material_inventory_turnover SET unit_id = 'UBP-AMB' WHERE unit_id = 'UBP AMB';
UPDATE material_inventory_turnover SET unit_id = 'UBP-GRT' WHERE unit_id = 'UBP GRT';
UPDATE material_inventory_turnover SET unit_id = 'UBP-PRK2' WHERE unit_id = 'UBP PRK2';
UPDATE material_inventory_turnover SET unit_id = 'UBP-PML' WHERE unit_id = 'UBP PML';
UPDATE material_inventory_turnover SET unit_id = 'UBP-GLM' WHERE unit_id = 'UBP GLM';
UPDATE material_inventory_turnover SET unit_id = 'UBP-BEU' WHERE unit_id = 'UBP BEU';
UPDATE material_inventory_turnover SET unit_id = 'UBP-SGG' WHERE unit_id = 'UBP SGG';
UPDATE material_inventory_turnover SET unit_id = 'UBP-LTR' WHERE unit_id = 'UBP LTR';
UPDATE material_inventory_turnover SET unit_id = 'UBP-ADP' WHERE unit_id = 'UBP ADP';
UPDATE material_inventory_turnover SET unit_id = 'UBP-JRH' WHERE unit_id = 'UBP JRH';
UPDATE material_inventory_turnover SET unit_id = 'UBP-BRU' WHERE unit_id = 'UBP BRU';
UPDATE material_inventory_turnover SET unit_id = 'UBP-KMJ' WHERE unit_id = 'UBP KMJ';
UPDATE material_inventory_turnover SET unit_id = 'UBP-PBR' WHERE unit_id = 'UBP PBR';
UPDATE material_inventory_turnover SET unit_id = 'UBP-PSU' WHERE unit_id = 'UBP PSU';
UPDATE material_inventory_turnover SET unit_id = 'UBP-KRY' WHERE unit_id = 'UBP KRY';
UPDATE material_inventory_turnover SET unit_id = 'UBP-PMK' WHERE unit_id = 'UBP PMK';
UPDATE material_inventory_turnover SET unit_id = 'UBP-BNG' WHERE unit_id = 'UBP BNG';
UPDATE material_inventory_turnover SET unit_id = 'UBP-PLM' WHERE unit_id = 'UBP PLM';
UPDATE material_inventory_turnover SET unit_id = 'UBP-BKP' WHERE unit_id = 'UBP BKP';
UPDATE material_inventory_turnover SET unit_id = 'UBP-SMD' WHERE unit_id = 'UBP SMD';
