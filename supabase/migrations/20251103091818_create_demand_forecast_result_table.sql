/*
  # Create Demand Forecast Result Table

  1. New Table
    - `demand_forecast_result`
      - Monthly demand forecast data for materials
      - Stores projected quantities and requirement dates
      - Unique constraint on material_id and requirement_date combination
      - Auto-updating timestamp fields

  2. Indexes
    - Composite index on material_id and requirement_date for faster queries
    - Single index on requirement_date for date-based filtering

  3. Security
    - Enable RLS on the table
    - Authenticated users can read data
    - Service role has full access
    - Auto-update trigger for updated_at field

  4. Features
    - Decimal precision for quantity values (12,2)
    - Automatic timestamp management
    - Prevents duplicate entries for same material and date
*/

-- Drop old table if exists
DROP TABLE IF EXISTS public.demand_forecast_result;

-- Create new simplified table with monthly data
CREATE TABLE IF NOT EXISTS public.demand_forecast_result (
    id BIGSERIAL PRIMARY KEY,
    material_id VARCHAR(50) NOT NULL,
    proyeksi_qty DECIMAL(12,2) NOT NULL,
    requirement_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT unique_material_requirement UNIQUE (material_id, requirement_date)
);

-- Index for faster queries
CREATE INDEX idx_material_req_date ON public.demand_forecast_result(material_id, requirement_date);
CREATE INDEX idx_req_date ON public.demand_forecast_result(requirement_date);

-- Enable RLS
ALTER TABLE public.demand_forecast_result ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow authenticated read access" ON public.demand_forecast_result
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow service role full access" ON public.demand_forecast_result
    FOR ALL USING (auth.role() = 'service_role');

-- Add a trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_demand_forecast_result_updated_at
    BEFORE UPDATE ON public.demand_forecast_result
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
