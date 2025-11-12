/*
  # Create Unique OTIF Leaderboards for All Categories
  
  1. Purpose
    - Generate unique, sequential OTIF scores with no duplicates
    - Create Top 10 suppliers for Overall and each category (A-F)
    - Ensure Overall Top 10 matches the Control Tower page
    
  2. Data Structure
    - Overall Top 10: 98.5%, 98.0%, 97.5%, 97.0%, 96.5%, 96.0%, 95.5%, 95.0%, 94.5%, 94.0%
    - Category A: 97.8% down to 88.8% (1.0% steps)
    - Category B: 96.5% down to 87.5% (1.0% steps)
    - Category C: 95.2% down to 86.2% (1.0% steps)
    - Category D: 94.7% down to 85.7% (1.0% steps)
    - Category E: 93.4% down to 84.4% (1.0% steps)
    - Category F: 97.2% down to 88.2% (1.0% steps)
*/

-- Clear existing OTIF data
TRUNCATE TABLE supplier_otif_deliveries CASCADE;
TRUNCATE TABLE supplier_otif_performance CASCADE;
