/*
  # DPK Performance Enhancements and Auto-Timestamp Updates

  1. New Features
    - Add trigger function for automatic `modified_date` updates on dim_unit table
    - Add composite indexes for better query performance on frequently accessed data
    - Add indexes for text search operations on unit_name and unit_code

  2. Triggers
    - `update_modified_date_trigger` - Automatically updates modified_date when a unit record is updated

  3. Performance Indexes
    - Composite index on (fiscal_year, is_active, unit_name) for filtered searches
    - Composite index on (unit_id, fiscal_year) for join operations
    - Text search index on unit_name for case-insensitive searches
    - Composite index on fact_dpk_submission for common queries
    - Composite index on fact_forecast_accuracy for bottom performers queries

  4. Notes
    - These enhancements improve query performance for dashboard operations
    - Auto-timestamp trigger ensures data audit trail accuracy
    - Indexes are designed for the most common query patterns in the DPK module
*/

-- Create trigger function for automatic modified_date updates
CREATE OR REPLACE FUNCTION update_modified_date_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.modified_date = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to dim_unit table
DROP TRIGGER IF EXISTS update_dim_unit_modified_date ON dim_unit;
CREATE TRIGGER update_dim_unit_modified_date
  BEFORE UPDATE ON dim_unit
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_date_column();

-- Add composite index for common filtered queries on dim_unit
CREATE INDEX IF NOT EXISTS idx_unit_active_fiscal_name 
  ON dim_unit(fiscal_year, is_active, unit_name) 
  WHERE is_active = true;

-- Add index for join operations
CREATE INDEX IF NOT EXISTS idx_unit_id_fiscal 
  ON dim_unit(unit_id, fiscal_year);

-- Add text search index for unit names (case-insensitive)
CREATE INDEX IF NOT EXISTS idx_unit_name_lower 
  ON dim_unit(LOWER(unit_name));

-- Add text search index for unit codes (case-insensitive)
CREATE INDEX IF NOT EXISTS idx_unit_code_lower 
  ON dim_unit(LOWER(unit_code));

-- Add composite index for DPK submission queries
CREATE INDEX IF NOT EXISTS idx_dpk_submission_type_status_fiscal 
  ON fact_dpk_submission(submission_type, submission_status, fiscal_year);

-- Add composite index for forecast accuracy bottom performers query
CREATE INDEX IF NOT EXISTS idx_forecast_accuracy_fiscal_percentage 
  ON fact_forecast_accuracy(fiscal_year, accuracy_percentage);

-- Add index for faster unit lookups in forecast accuracy
CREATE INDEX IF NOT EXISTS idx_forecast_accuracy_unit_fiscal 
  ON fact_forecast_accuracy(unit_id, fiscal_year, accuracy_percentage);

-- Create materialized view for quick dashboard statistics (optional performance boost)
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_dpk_dashboard_stats AS
SELECT 
  du.fiscal_year,
  COUNT(DISTINCT du.unit_id) as total_units,
  SUM(du.opex_budget) as total_opex,
  SUM(du.capex_budget) as total_capex,
  SUM(du.total_budget) as total_budget,
  COUNT(DISTINCT CASE WHEN fds.submission_status = 'Submitted' AND fds.submission_type = 'DPK' THEN fds.unit_id END) as dpk_submitted,
  COUNT(DISTINCT CASE WHEN fds.submission_status = 'Submitted' AND fds.submission_type = 'PR' THEN fds.unit_id END) as pr_submitted,
  COUNT(DISTINCT CASE WHEN fds.submission_status = 'Submitted' AND fds.submission_type = 'STR' THEN fds.unit_id END) as str_submitted
FROM dim_unit du
LEFT JOIN fact_dpk_submission fds ON du.unit_id = fds.unit_id AND du.fiscal_year = fds.fiscal_year
WHERE du.is_active = true
GROUP BY du.fiscal_year;

-- Create index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_dpk_stats_fiscal 
  ON mv_dpk_dashboard_stats(fiscal_year);

-- Add comment explaining the materialized view
COMMENT ON MATERIALIZED VIEW mv_dpk_dashboard_stats IS 
  'Aggregated dashboard statistics for DPK module. Refresh periodically for updated data using REFRESH MATERIALIZED VIEW CONCURRENTLY mv_dpk_dashboard_stats;';
