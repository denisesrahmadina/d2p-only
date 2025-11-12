/*
  # Add Foreign Key Constraints to Reference Tables

  This migration adds missing foreign key relationships to reference tables
  that should have relationships to dimension tables.

  ## Tables Modified
  1. ref_market_intelligence - No FK needed (external market data)
  2. ref_bundling_recommendation - Links to material
  3. ref_kpi - No FK needed (general KPI metrics)
  4. ref_strategic_initiative - No FK needed (strategic planning data)

  ## Foreign Key Constraints
  - All constraints use ON DELETE RESTRICT to prevent accidental deletion
  - Only adds FKs where they make business sense
*/

-- Add material_id FK to ref_bundling_recommendation if it has the column
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ref_bundling_recommendation' 
    AND column_name = 'material_id'
  ) THEN
    -- Check if constraint doesn't already exist
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'ref_bundling_recommendation_material_id_fkey'
    ) THEN
      ALTER TABLE ref_bundling_recommendation
        ADD CONSTRAINT ref_bundling_recommendation_material_id_fkey 
          FOREIGN KEY (material_id) REFERENCES dim_material(material_id) ON DELETE RESTRICT;
    END IF;
  END IF;
END $$;

-- Add vendor_id FK to ref_bundling_recommendation if it has the column
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ref_bundling_recommendation' 
    AND column_name = 'vendor_id'
  ) THEN
    -- Check if constraint doesn't already exist
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'ref_bundling_recommendation_vendor_id_fkey'
    ) THEN
      ALTER TABLE ref_bundling_recommendation
        ADD CONSTRAINT ref_bundling_recommendation_vendor_id_fkey 
          FOREIGN KEY (vendor_id) REFERENCES dim_vendor(vendor_id) ON DELETE RESTRICT;
    END IF;
  END IF;
END $$;
