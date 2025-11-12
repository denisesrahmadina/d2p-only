/*
  # Populate Materials Data

  1. Content
    - Insert 70+ material records across multiple categories
    - Categories: Construction, Office Supplies, Industrial Equipment, Electronics, Raw Materials
    - Realistic pricing in IDR from 1,000 to 10,000,000
    - Proper unit of measure for each material type

  2. Material Categories
    - Construction: Cement, Steel, Wood, Paint, Tiles
    - Office Supplies: Paper, Stationery, Furniture
    - Industrial Equipment: Machinery, Tools, Safety Equipment
    - Electronics: Computers, Cables, Components
    - Raw Materials: Chemicals, Metals, Plastics
*/

INSERT INTO dim_material (material_id, material_description, material_category, material_category_sa, material_category_level1, material_category_level2, material_map_price, unit_of_measure, material_type, is_active) VALUES
-- Construction Materials
('MAT-001', 'Portland Cement Type I 50kg', 'Construction', 'Building Materials', 'Cement & Concrete', 'Cement', '75000', 'BAG', 'Direct', true),
('MAT-002', 'Steel Rebar 10mm x 12m', 'Construction', 'Building Materials', 'Steel & Metal', 'Rebar', '85000', 'PCS', 'Direct', true),
('MAT-003', 'Steel Rebar 12mm x 12m', 'Construction', 'Building Materials', 'Steel & Metal', 'Rebar', '120000', 'PCS', 'Direct', true),
('MAT-004', 'Red Clay Brick Standard', 'Construction', 'Building Materials', 'Bricks & Blocks', 'Brick', '1200', 'PCS', 'Direct', true),
('MAT-005', 'Ceramic Floor Tile 40x40cm', 'Construction', 'Building Materials', 'Tiles & Flooring', 'Tile', '45000', 'M2', 'Direct', true),
('MAT-006', 'Granite Floor Tile 60x60cm Premium', 'Construction', 'Building Materials', 'Tiles & Flooring', 'Tile', '250000', 'M2', 'Direct', true),
('MAT-007', 'Acrylic Paint White 5L', 'Construction', 'Building Materials', 'Paint & Coatings', 'Paint', '350000', 'PAIL', 'Direct', true),
('MAT-008', 'Wood Paint Gloss Finish 1L', 'Construction', 'Building Materials', 'Paint & Coatings', 'Paint', '125000', 'LITER', 'Direct', true),
('MAT-009', 'Teak Wood Plank 2m x 20cm x 3cm', 'Construction', 'Building Materials', 'Wood & Timber', 'Wood', '450000', 'PCS', 'Direct', true),
('MAT-010', 'Plywood 122x244cm 18mm', 'Construction', 'Building Materials', 'Wood & Timber', 'Plywood', '285000', 'SHEET', 'Direct', true),
('MAT-011', 'Ready Mix Concrete K-300', 'Construction', 'Building Materials', 'Cement & Concrete', 'Concrete', '950000', 'M3', 'Direct', true),
('MAT-012', 'River Sand Clean Grade A', 'Construction', 'Building Materials', 'Aggregates', 'Sand', '350000', 'M3', 'Direct', true),
('MAT-013', 'Crushed Stone 1-2cm', 'Construction', 'Building Materials', 'Aggregates', 'Stone', '425000', 'M3', 'Direct', true),
('MAT-014', 'PVC Pipe 4 inch x 4m', 'Construction', 'Building Materials', 'Pipes & Fittings', 'Pipe', '95000', 'PCS', 'Direct', true),
('MAT-015', 'Copper Wire Cable 2.5mm NYM', 'Construction', 'Building Materials', 'Electrical', 'Cable', '12500', 'M', 'Direct', true),

-- Office Supplies
('MAT-016', 'A4 Copy Paper 80gsm Box 5 Reams', 'Office Supplies', 'Stationery', 'Paper Products', 'Paper', '225000', 'BOX', 'Indirect', true),
('MAT-017', 'Ballpoint Pen Blue Box of 50', 'Office Supplies', 'Stationery', 'Writing Instruments', 'Pen', '75000', 'BOX', 'Indirect', true),
('MAT-018', 'Permanent Marker Black Set of 12', 'Office Supplies', 'Stationery', 'Writing Instruments', 'Marker', '85000', 'SET', 'Indirect', true),
('MAT-019', 'Stapler Heavy Duty', 'Office Supplies', 'Stationery', 'Office Tools', 'Stapler', '125000', 'PCS', 'Indirect', true),
('MAT-020', 'File Folder A4 Box of 100', 'Office Supplies', 'Stationery', 'Filing & Storage', 'Folder', '350000', 'BOX', 'Indirect', true),
('MAT-021', 'Office Desk 120x60cm', 'Office Supplies', 'Furniture', 'Desks & Tables', 'Desk', '1850000', 'UNIT', 'Indirect', true),
('MAT-022', 'Ergonomic Office Chair with Armrest', 'Office Supplies', 'Furniture', 'Chairs & Seating', 'Chair', '2250000', 'UNIT', 'Indirect', true),
('MAT-023', 'Filing Cabinet 4 Drawer Steel', 'Office Supplies', 'Furniture', 'Cabinets & Storage', 'Cabinet', '3500000', 'UNIT', 'Indirect', true),
('MAT-024', 'Whiteboard 120x90cm Magnetic', 'Office Supplies', 'Furniture', 'Boards & Displays', 'Whiteboard', '650000', 'PCS', 'Indirect', true),
('MAT-025', 'Printer Toner Cartridge Black', 'Office Supplies', 'IT Supplies', 'Printer Supplies', 'Toner', '450000', 'PCS', 'Indirect', true),

-- Industrial Equipment
('MAT-026', 'Electric Drill 13mm Variable Speed', 'Industrial Equipment', 'Power Tools', 'Drilling Tools', 'Drill', '1250000', 'UNIT', 'Capital', true),
('MAT-027', 'Angle Grinder 4 inch 850W', 'Industrial Equipment', 'Power Tools', 'Grinding Tools', 'Grinder', '650000', 'UNIT', 'Capital', true),
('MAT-028', 'Circular Saw 7 inch 1200W', 'Industrial Equipment', 'Power Tools', 'Cutting Tools', 'Saw', '1850000', 'UNIT', 'Capital', true),
('MAT-029', 'Welding Machine 200A Inverter', 'Industrial Equipment', 'Welding Equipment', 'Welding Machines', 'Welder', '3250000', 'UNIT', 'Capital', true),
('MAT-030', 'Air Compressor 50L 2HP', 'Industrial Equipment', 'Pneumatic Tools', 'Compressors', 'Compressor', '4500000', 'UNIT', 'Capital', true),
('MAT-031', 'Industrial Generator 5000W Diesel', 'Industrial Equipment', 'Generators', 'Diesel Generators', 'Generator', '8500000', 'UNIT', 'Capital', true),
('MAT-032', 'Hydraulic Floor Jack 3 Ton', 'Industrial Equipment', 'Lifting Equipment', 'Jacks & Lifts', 'Jack', '1450000', 'UNIT', 'Direct', true),
('MAT-033', 'Toolbox Rolling 7 Drawer', 'Industrial Equipment', 'Storage Solutions', 'Tool Storage', 'Toolbox', '3500000', 'UNIT', 'Capital', true),
('MAT-034', 'Safety Helmet Hard Hat ANSI', 'Industrial Equipment', 'Safety Equipment', 'Head Protection', 'Helmet', '85000', 'PCS', 'Direct', true),
('MAT-035', 'Safety Goggles Clear Anti-Fog', 'Industrial Equipment', 'Safety Equipment', 'Eye Protection', 'Goggles', '45000', 'PCS', 'Direct', true),
('MAT-036', 'Work Gloves Leather Heavy Duty', 'Industrial Equipment', 'Safety Equipment', 'Hand Protection', 'Gloves', '95000', 'PAIR', 'Direct', true),
('MAT-037', 'Safety Vest High Visibility Orange', 'Industrial Equipment', 'Safety Equipment', 'Body Protection', 'Vest', '75000', 'PCS', 'Direct', true),
('MAT-038', 'Fire Extinguisher 6kg ABC Powder', 'Industrial Equipment', 'Safety Equipment', 'Fire Protection', 'Extinguisher', '450000', 'UNIT', 'Capital', true),
('MAT-039', 'First Aid Kit Complete 50 Person', 'Industrial Equipment', 'Safety Equipment', 'Medical Supplies', 'Kit', '650000', 'SET', 'Direct', true),
('MAT-040', 'Measuring Tape 5m Steel', 'Industrial Equipment', 'Measuring Tools', 'Distance Measurement', 'Tape', '35000', 'PCS', 'Direct', true),

-- Electronics & IT
('MAT-041', 'Desktop Computer Core i5 8GB RAM', 'Electronics', 'Computers', 'Desktop Computers', 'Computer', '8500000', 'UNIT', 'Capital', true),
('MAT-042', 'Laptop Core i7 16GB RAM 512GB SSD', 'Electronics', 'Computers', 'Laptops', 'Laptop', '12500000', 'UNIT', 'Capital', true),
('MAT-043', 'LED Monitor 24 inch Full HD', 'Electronics', 'Computer Peripherals', 'Monitors', 'Monitor', '1850000', 'UNIT', 'Capital', true),
('MAT-044', 'Wireless Keyboard and Mouse Combo', 'Electronics', 'Computer Peripherals', 'Input Devices', 'Keyboard', '350000', 'SET', 'Direct', true),
('MAT-045', 'Laser Printer Monochrome A4', 'Electronics', 'Office Electronics', 'Printers', 'Printer', '2250000', 'UNIT', 'Capital', true),
('MAT-046', 'Network Switch 24 Port Gigabit', 'Electronics', 'Networking Equipment', 'Switches', 'Switch', '3500000', 'UNIT', 'Capital', true),
('MAT-047', 'WiFi Router Dual Band AC1200', 'Electronics', 'Networking Equipment', 'Routers', 'Router', '850000', 'UNIT', 'Capital', true),
('MAT-048', 'UPS 1500VA Line Interactive', 'Electronics', 'Power Equipment', 'UPS Systems', 'UPS', '2500000', 'UNIT', 'Capital', true),
('MAT-049', 'Cat6 Ethernet Cable 305m Roll', 'Electronics', 'Networking Equipment', 'Cables', 'Cable', '1250000', 'ROLL', 'Direct', true),
('MAT-050', 'HDMI Cable 2.0 5m High Speed', 'Electronics', 'Computer Peripherals', 'Cables', 'Cable', '95000', 'PCS', 'Direct', true),
('MAT-051', 'External Hard Drive 2TB USB 3.0', 'Electronics', 'Storage Devices', 'External Storage', 'HDD', '1250000', 'UNIT', 'Capital', true),
('MAT-052', 'USB Flash Drive 64GB Metal Body', 'Electronics', 'Storage Devices', 'Flash Storage', 'USB', '125000', 'PCS', 'Direct', true),
('MAT-053', 'Webcam 1080p Full HD with Mic', 'Electronics', 'Computer Peripherals', 'Cameras', 'Webcam', '650000', 'UNIT', 'Capital', true),
('MAT-054', 'Headset USB Noise Cancelling', 'Electronics', 'Computer Peripherals', 'Audio Devices', 'Headset', '450000', 'UNIT', 'Direct', true),
('MAT-055', 'Power Strip 6 Outlet with Surge Protection', 'Electronics', 'Power Equipment', 'Power Strips', 'Strip', '185000', 'PCS', 'Direct', true),

-- Raw Materials & Chemicals
('MAT-056', 'Industrial Lubricant Oil 20L', 'Raw Materials', 'Chemicals', 'Lubricants', 'Oil', '850000', 'DRUM', 'Direct', true),
('MAT-057', 'Hydraulic Oil ISO 68 20L', 'Raw Materials', 'Chemicals', 'Hydraulic Fluids', 'Oil', '950000', 'DRUM', 'Direct', true),
('MAT-058', 'Grease Multi-Purpose 5kg', 'Raw Materials', 'Chemicals', 'Greases', 'Grease', '250000', 'PAIL', 'Direct', true),
('MAT-059', 'Cleaning Solvent 20L Industrial', 'Raw Materials', 'Chemicals', 'Solvents', 'Solvent', '450000', 'DRUM', 'Direct', true),
('MAT-060', 'Aluminum Sheet 1mm 4x8ft', 'Raw Materials', 'Metals', 'Aluminum', 'Sheet', '650000', 'SHEET', 'Direct', true),
('MAT-061', 'Stainless Steel Sheet 2mm 4x8ft', 'Raw Materials', 'Metals', 'Stainless Steel', 'Sheet', '1850000', 'SHEET', 'Direct', true),
('MAT-062', 'Carbon Steel Pipe 2 inch SCH40', 'Raw Materials', 'Metals', 'Carbon Steel', 'Pipe', '285000', 'M', 'Direct', true),
('MAT-063', 'Copper Sheet 1mm 4x8ft', 'Raw Materials', 'Metals', 'Copper', 'Sheet', '2250000', 'SHEET', 'Direct', true),
('MAT-064', 'PVC Resin Grade SG-5', 'Raw Materials', 'Plastics', 'PVC', 'Resin', '25000', 'KG', 'Direct', true),
('MAT-065', 'Polyethylene Pellets HDPE', 'Raw Materials', 'Plastics', 'Polyethylene', 'Pellets', '22000', 'KG', 'Direct', true),
('MAT-066', 'Polypropylene Pellets PP', 'Raw Materials', 'Plastics', 'Polypropylene', 'Pellets', '23000', 'KG', 'Direct', true),
('MAT-067', 'Silicone Sealant Clear 300ml', 'Raw Materials', 'Chemicals', 'Sealants', 'Sealant', '35000', 'TUBE', 'Direct', true),
('MAT-068', 'Epoxy Adhesive 2-Part 1kg', 'Raw Materials', 'Chemicals', 'Adhesives', 'Epoxy', '185000', 'SET', 'Direct', true),
('MAT-069', 'Cutting Oil Soluble 20L', 'Raw Materials', 'Chemicals', 'Cutting Fluids', 'Oil', '650000', 'DRUM', 'Direct', true),
('MAT-070', 'Rust Prevention Spray 500ml', 'Raw Materials', 'Chemicals', 'Protective Coatings', 'Spray', '95000', 'CAN', 'Direct', true);
