/*
  # Populate Market Intelligence Mock Data

  This migration populates comprehensive market intelligence data for 20 real power generation suppliers:
  - Supplier profiles with scores and risk ratings
  - Recent news mentions with sentiment analysis
  - Financial data for multiple fiscal periods
  - Patent filings and innovation tracking
  - Ownership structure and executive details
  - Historical performance data for trend analysis

  Suppliers Include:
  - General Electric (GE Power)
  - Siemens Energy
  - Schneider Electric
  - Mitsubishi Power
  - ABB
  - Bharat Heavy Electricals Ltd. (BHEL)
  - Doosan Heavy Industries
  - Alstom Power
  - And 12 more leading power generation companies
*/

-- Insert 20 Power Generation Suppliers
INSERT INTO market_intelligence_suppliers (supplier_id, company_name, category, contract_status, location_country, location_region, location_coordinates, supplier_score, market_position, global_reach_countries, revenue_usd, employee_count, founded_year, website, description, key_products, certifications, risk_rating, innovation_score) VALUES
  ('SUP-001', 'General Electric Power', 'Power Generation', 'Contracted', 'United States', 'North America', '{"lat": 42.3601, "lng": -71.0589}'::jsonb, 88.5, 1, 120, 18000000000, 38000, 1892, 'www.ge.com/power', 'Global leader in power generation equipment and services, specializing in gas turbines, steam turbines, and renewable energy solutions', '["Gas Turbines", "Steam Turbines", "Wind Turbines", "Grid Solutions"]'::jsonb, '["ISO 9001", "ISO 14001", "ISO 45001"]'::jsonb, 'Low', 90.5),

  ('SUP-002', 'Siemens Energy', 'Power Generation', 'Contracted', 'Germany', 'Europe', '{"lat": 48.1351, "lng": 11.5820}'::jsonb, 92.0, 2, 95, 29000000000, 91000, 2020, 'www.siemens-energy.com', 'Leading energy technology company providing solutions for power generation, transmission, and energy storage', '["Gas Turbines", "Steam Power", "Transmission Systems", "Energy Storage"]'::jsonb, '["ISO 9001", "ISO 14001", "ISO 50001"]'::jsonb, 'Low', 94.0),

  ('SUP-003', 'Schneider Electric', 'Electrical Systems', 'Contracted', 'France', 'Europe', '{"lat": 48.8566, "lng": 2.3522}'::jsonb, 89.5, 3, 100, 34000000000, 135000, 1836, 'www.se.com', 'Global specialist in energy management and industrial automation with focus on digital transformation', '["Smart Grid Solutions", "Automation Systems", "Energy Management", "Power Distribution"]'::jsonb, '["ISO 9001", "ISO 14001", "ISO 27001"]'::jsonb, 'Low', 91.0),

  ('SUP-004', 'Mitsubishi Power', 'Turbine Equipment', 'Contracted', 'Japan', 'Asia', '{"lat": 35.6762, "lng": 139.6503}'::jsonb, 87.0, 4, 85, 15000000000, 23000, 2020, 'power.mhi.com', 'Leading provider of advanced power generation equipment including gas and steam turbines', '["Gas Turbines", "Steam Turbines", "GTCC Plants", "Energy Transition Solutions"]'::jsonb, '["ISO 9001", "ISO 14001"]'::jsonb, 'Low', 88.5),

  ('SUP-005', 'ABB', 'Smart Grid Technology', 'Contracted', 'Switzerland', 'Europe', '{"lat": 47.3769, "lng": 8.5417}'::jsonb, 90.5, 5, 110, 28000000000, 105000, 1988, 'new.abb.com', 'Technology leader in electrification and automation with strong focus on smart grid solutions', '["Grid Automation", "Transformers", "SCADA Systems", "Energy Storage"]'::jsonb, '["ISO 9001", "ISO 14001", "ISO 45001", "ISO 50001"]'::jsonb, 'Low', 92.5),

  ('SUP-006', 'Bharat Heavy Electricals Ltd. (BHEL)', 'Power Generation', 'Watchlist', 'India', 'Asia', '{"lat": 28.6139, "lng": 77.2090}'::jsonb, 75.0, 12, 40, 5800000000, 40000, 1964, 'www.bhel.com', 'Largest engineering and manufacturing company in India focused on power plant equipment', '["Thermal Power Plants", "Gas Turbines", "Steam Turbines", "Boilers"]'::jsonb, '["ISO 9001", "ISO 14001"]'::jsonb, 'Moderate', 70.5),

  ('SUP-007', 'Doosan Heavy Industries', 'Power Generation', 'Watchlist', 'South Korea', 'Asia', '{"lat": 35.8569, "lng": 128.5810}'::jsonb, 78.5, 10, 50, 8500000000, 15000, 1962, 'www.doosan.com', 'Major Korean heavy industries company with focus on power plant equipment and desalination', '["Boilers", "Turbines", "Nuclear Components", "Desalination Plants"]'::jsonb, '["ISO 9001", "ISO 14001"]'::jsonb, 'Moderate', 74.0),

  ('SUP-008', 'Alstom Power (GE Steam Power)', 'Turbine Equipment', 'Contracted', 'France', 'Europe', '{"lat": 48.8566, "lng": 2.3522}'::jsonb, 86.5, 6, 75, 12000000000, 28000, 1928, 'www.ge.com/steam-power', 'Specializes in steam power generation technology and services for thermal power plants', '["Steam Turbines", "Boilers", "Generators", "Maintenance Services"]'::jsonb, '["ISO 9001", "ISO 14001"]'::jsonb, 'Low', 85.0),

  ('SUP-009', 'Harbin Electric International', 'Power Generation', 'Other', 'China', 'Asia', '{"lat": 45.8038, "lng": 126.5340}'::jsonb, 72.0, 15, 45, 7200000000, 35000, 1994, 'www.hei.com.cn', 'Major Chinese power equipment manufacturer providing complete power generation solutions', '["Thermal Power Equipment", "Hydro Power", "Nuclear Power", "Wind Power"]'::jsonb, '["ISO 9001"]'::jsonb, 'Moderate', 68.0),

  ('SUP-010', 'Ansaldo Energia', 'Turbine Equipment', 'Other', 'Italy', 'Europe', '{"lat": 44.4056, "lng": 8.9463}'::jsonb, 81.0, 9, 60, 4500000000, 5000, 1853, 'www.ansaldoenergia.com', 'Italian engineering company specializing in power generation systems and services', '["Gas Turbines", "Steam Turbines", "Combined Cycle Plants", "Microturbines"]'::jsonb, '["ISO 9001", "ISO 14001", "ISO 45001"]'::jsonb, 'Low', 83.5),

  ('SUP-011', 'Toshiba Energy Systems', 'Power Generation', 'Contracted', 'Japan', 'Asia', '{"lat": 35.6532, "lng": 139.6870}'::jsonb, 84.5, 7, 70, 10500000000, 22000, 1875, 'www.global.toshiba', 'Provider of comprehensive energy solutions including thermal and renewable power generation', '["Steam Turbines", "Generators", "Control Systems", "Renewable Energy"]'::jsonb, '["ISO 9001", "ISO 14001"]'::jsonb, 'Low', 86.0),

  ('SUP-012', 'Vestas Wind Systems', 'Renewable Energy', 'Contracted', 'Denmark', 'Europe', '{"lat": 56.1629, "lng": 10.2039}'::jsonb, 91.5, 1, 85, 15000000000, 29000, 1945, 'www.vestas.com', 'Global leader in sustainable energy solutions, specializing in wind turbine manufacturing', '["Wind Turbines", "Service & Maintenance", "Wind Farm Development", "Energy Storage"]'::jsonb, '["ISO 9001", "ISO 14001", "ISO 45001"]'::jsonb, 'Low', 93.5),

  ('SUP-013', 'Eaton Corporation', 'Electrical Systems', 'Contracted', 'Ireland', 'Europe', '{"lat": 53.3498, "lng": -6.2603}'::jsonb, 87.5, 8, 90, 20000000000, 85000, 1911, 'www.eaton.com', 'Power management company providing energy-efficient solutions for electrical systems', '["Power Distribution", "Circuit Breakers", "UPS Systems", "Control Systems"]'::jsonb, '["ISO 9001", "ISO 14001", "ISO 50001"]'::jsonb, 'Low', 88.0),

  ('SUP-014', 'Wartsila Energy', 'Power Generation', 'Watchlist', 'Finland', 'Europe', '{"lat": 60.1699, "lng": 24.9384}'::jsonb, 80.0, 11, 65, 5300000000, 17000, 1834, 'www.wartsila.com', 'Provides flexible power generation solutions with focus on gas and multi-fuel engines', '["Gas Engines", "Diesel Engines", "Energy Storage", "Power Plants"]'::jsonb, '["ISO 9001", "ISO 14001"]'::jsonb, 'Moderate', 79.0),

  ('SUP-015', 'Hitachi Energy', 'Smart Grid Technology', 'Contracted', 'Switzerland', 'Europe', '{"lat": 47.3769, "lng": 8.5417}'::jsonb, 89.0, 4, 95, 12000000000, 38000, 2020, 'www.hitachienergy.com', 'Technology leader in the energy sector with focus on grid modernization and digitalization', '["HVDC Systems", "Grid Automation", "Transformers", "Digital Solutions"]'::jsonb, '["ISO 9001", "ISO 14001", "ISO 45001", "ISO 50001"]'::jsonb, 'Low', 90.0),

  ('SUP-016', 'Cummins Power Generation', 'Power Generation', 'Other', 'United States', 'North America', '{"lat": 39.7684, "lng": -86.1581}'::jsonb, 83.0, 13, 80, 8900000000, 35000, 1919, 'www.cummins.com', 'Leading provider of power generation systems including diesel and natural gas generators', '["Diesel Generators", "Gas Generators", "Alternators", "Control Systems"]'::jsonb, '["ISO 9001", "ISO 14001"]'::jsonb, 'Low', 82.5),

  ('SUP-017', 'Caterpillar Energy Solutions', 'Power Generation', 'Other', 'Germany', 'Europe', '{"lat": 48.0833, "lng": 11.8000}'::jsonb, 85.0, 9, 70, 6700000000, 8000, 1999, 'www.cat.com/energy', 'Provides distributed power generation solutions with focus on gas engines and energy storage', '["Gas Engines", "Diesel Engines", "Microgrids", "Energy Management"]'::jsonb, '["ISO 9001", "ISO 14001", "ISO 50001"]'::jsonb, 'Low', 84.5),

  ('SUP-018', 'Shanghai Electric Power Generation', 'Power Generation', 'Other', 'China', 'Asia', '{"lat": 31.2304, "lng": 121.4737}'::jsonb, 76.5, 14, 55, 9800000000, 45000, 1880, 'www.shanghai-electric.com', 'Major Chinese power equipment manufacturer with comprehensive product portfolio', '["Steam Turbines", "Gas Turbines", "Boilers", "Wind Power"]'::jsonb, '["ISO 9001", "ISO 14001"]'::jsonb, 'Moderate', 75.0),

  ('SUP-019', 'Rolls-Royce Power Systems', 'Power Generation', 'Watchlist', 'United Kingdom', 'Europe', '{"lat": 52.9547, "lng": -1.1581}'::jsonb, 82.5, 10, 75, 7400000000, 11000, 1884, 'www.rolls-royce.com', 'Provider of power systems for marine, industrial, and power generation applications', '["Gas Turbines", "MTU Engines", "Energy Storage", "Hybrid Systems"]'::jsonb, '["ISO 9001", "ISO 14001", "ISO 45001"]'::jsonb, 'Moderate', 81.0),

  ('SUP-020', 'First Solar', 'Renewable Energy', 'Contracted', 'United States', 'North America', '{"lat": 40.4093, "lng": -104.8214}'::jsonb, 88.0, 6, 45, 2700000000, 7000, 1999, 'www.firstsolar.com', 'Leading global provider of photovoltaic solar energy solutions with advanced thin-film technology', '["Solar Modules", "Solar Power Plants", "O&M Services", "Energy Storage"]'::jsonb, '["ISO 9001", "ISO 14001", "ISO 50001"]'::jsonb, 'Low', 89.5)
ON CONFLICT (supplier_id) DO NOTHING;

-- Continue in next part due to length...
