/*
  # Fix Inventory Tolerance Status and Thresholds
  
  1. Material Status Changes
    - Within Tolerance: current_stock BETWEEN minimum_stock AND maximum_stock
    - Out of Tolerance: current_stock < minimum_stock OR current_stock > maximum_stock
    
  2. Tolerance Percentage Formula
    - tolerance_percentage = (within_tolerance / total_materials) * 100
    
  3. New Legend Thresholds
    - Excellent: > 95%
    - Good: 90% - 95%
    - Needs Attention: < 90%
    
  4. Apply to all units and materials
*/

-- Step 1: Update material_tolerance_details with correct is_compliant logic
UPDATE material_tolerance_details
SET is_compliant = (
  current_stock >= minimum_stock AND current_stock <= maximum_stock
);

-- Step 2: Recalculate inventory_planning_tolerance aggregates
-- First, calculate the correct values
WITH tolerance_calcs AS (
  SELECT 
    unit_id,
    COUNT(*) as total_materials,
    SUM(CASE WHEN is_compliant THEN 1 ELSE 0 END) as materials_within_tolerance,
    SUM(CASE WHEN NOT is_compliant THEN 1 ELSE 0 END) as materials_out_of_tolerance,
    ROUND((SUM(CASE WHEN is_compliant THEN 1 ELSE 0 END)::NUMERIC / COUNT(*)::NUMERIC) * 100, 2) as tolerance_percentage
  FROM material_tolerance_details
  GROUP BY unit_id
)
UPDATE inventory_planning_tolerance ipt
SET 
  total_materials = tc.total_materials,
  materials_out_of_tolerance = tc.materials_out_of_tolerance,
  tolerance_percentage = tc.tolerance_percentage,
  status = CASE
    WHEN tc.tolerance_percentage > 95 THEN 'excellent'
    WHEN tc.tolerance_percentage >= 90 AND tc.tolerance_percentage <= 95 THEN 'good'
    ELSE 'needs-attention'
  END,
  updated_at = NOW()
FROM tolerance_calcs tc
WHERE ipt.unit_id = tc.unit_id;
