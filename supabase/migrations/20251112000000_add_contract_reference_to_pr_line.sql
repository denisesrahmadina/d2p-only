/*
  # Add Contract Reference to PR Line Items

  1. Changes
    - Add contract_reference column to fact_pr_line table
    - Stores the source contract ID for traceability
    - Enables tracking which contract each line item originated from
    - Useful for multi-vendor consolidated PRs

  2. Security
    - No RLS changes needed (inherits from existing policies)
*/

-- Add contract_reference column if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fact_pr_line' AND column_name = 'contract_reference'
  ) THEN
    ALTER TABLE fact_pr_line ADD COLUMN contract_reference text REFERENCES dim_contract(contract_id);
  END IF;
END $$;

-- Create index for efficient contract lookups
CREATE INDEX IF NOT EXISTS idx_pr_line_contract_reference ON fact_pr_line(contract_reference);

-- Add comment for documentation
COMMENT ON COLUMN fact_pr_line.contract_reference IS 'Source contract ID for traceability in multi-item PRs';
