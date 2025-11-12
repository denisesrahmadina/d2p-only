/*
  # Add Demand Forecasts for EAM-ERP Materials (No Date Conflicts)
  
  Materials: MAT-00000086 to MAT-00000135 (20 materials)
  Focus: Annual + Monthly rolling forecasts aligned with actual consumption
*/

-- Monthly Forecasts: 20 materials × 24 months = 480 records
INSERT INTO demand_forecast_result (material_id, proyeksi_qty, requirement_date)
SELECT 
    m.material_id,
    CASE 
        WHEN m.material_id IN ('MAT-00000086','MAT-00000087','MAT-00000088','MAT-00000089') THEN
            ROUND(((180 + RANDOM() * 120) * 
                CASE WHEN EXTRACT(MONTH FROM md) IN (4,5,6) THEN 1.30
                     WHEN EXTRACT(MONTH FROM md) IN (10,11) THEN 1.35
                     WHEN EXTRACT(MONTH FROM md) IN (1,7,8) THEN 0.80
                     ELSE 1.0 END * (1 + mo * 0.003))::numeric, 2)
        WHEN m.material_id IN ('MAT-00000090','MAT-00000091','MAT-00000092','MAT-00000093','MAT-00000094') THEN
            ROUND(((120 + RANDOM() * 80) * 
                CASE WHEN EXTRACT(MONTH FROM md) IN (5,6,10,11) THEN 1.20
                     WHEN EXTRACT(MONTH FROM md) IN (1,2,7,8) THEN 0.85
                     ELSE 1.0 END * (1 + mo * 0.0035))::numeric, 2)
        WHEN m.material_id IN ('MAT-00000095','MAT-00000096','MAT-00000097','MAT-00000098','MAT-00000099') THEN
            ROUND(((80 + RANDOM() * 60) * 
                CASE WHEN EXTRACT(MONTH FROM md) IN (6,12) THEN 1.25
                     WHEN EXTRACT(MONTH FROM md) IN (3,9) THEN 1.10
                     ELSE 0.95 END * (1 + mo * 0.004))::numeric, 2)
        ELSE
            ROUND(((100 + RANDOM() * 70) * 
                CASE WHEN EXTRACT(MONTH FROM md) IN (3,6,9,12) THEN 1.40
                     WHEN EXTRACT(MONTH FROM md) IN (1,4,7,10) THEN 0.70
                     ELSE 0.90 END * (1 + mo * 0.0038))::numeric, 2)
    END,
    md
FROM (
    SELECT DISTINCT material_id FROM asset 
    WHERE material_id IN (
        'MAT-00000086','MAT-00000087','MAT-00000088','MAT-00000089','MAT-00000090',
        'MAT-00000091','MAT-00000092','MAT-00000093','MAT-00000094','MAT-00000095',
        'MAT-00000096','MAT-00000097','MAT-00000098','MAT-00000099',
        'MAT-00000130','MAT-00000131','MAT-00000132','MAT-00000133','MAT-00000134','MAT-00000135'
    )
) m
CROSS JOIN (
    SELECT 
        DATE '2025-01-01' + (o || ' months')::interval as md,
        o as mo
    FROM generate_series(0, 23) o
) d;

-- Annual Forecasts: 20 materials × 2 years = 40 records (using Dec 31)
INSERT INTO demand_forecast_result (material_id, proyeksi_qty, requirement_date)
SELECT 
    m.material_id,
    CASE 
        WHEN m.material_id IN ('MAT-00000086','MAT-00000087','MAT-00000088','MAT-00000089') THEN
            ROUND(((2500 + RANDOM() * 800) * (1 + y * 0.04))::numeric, 2)
        WHEN m.material_id IN ('MAT-00000090','MAT-00000091','MAT-00000092','MAT-00000093','MAT-00000094') THEN
            ROUND(((1800 + RANDOM() * 600) * (1 + y * 0.045))::numeric, 2)
        WHEN m.material_id IN ('MAT-00000095','MAT-00000096','MAT-00000097','MAT-00000098','MAT-00000099') THEN
            ROUND(((1200 + RANDOM() * 400) * (1 + y * 0.05))::numeric, 2)
        ELSE
            ROUND(((1500 + RANDOM() * 500) * (1 + y * 0.048))::numeric, 2)
    END,
    DATE '2025-12-31' + (y || ' years')::interval
FROM (
    SELECT DISTINCT material_id FROM asset 
    WHERE material_id IN (
        'MAT-00000086','MAT-00000087','MAT-00000088','MAT-00000089','MAT-00000090',
        'MAT-00000091','MAT-00000092','MAT-00000093','MAT-00000094','MAT-00000095',
        'MAT-00000096','MAT-00000097','MAT-00000098','MAT-00000099',
        'MAT-00000130','MAT-00000131','MAT-00000132','MAT-00000133','MAT-00000134','MAT-00000135'
    )
) m
CROSS JOIN generate_series(0, 1) y;

-- Quarterly Forecasts using 15th of last month of quarter: 20 materials × 8 quarters = 160 records
INSERT INTO demand_forecast_result (material_id, proyeksi_qty, requirement_date)
SELECT 
    m.material_id,
    CASE 
        WHEN m.material_id IN ('MAT-00000086','MAT-00000087','MAT-00000088','MAT-00000089') THEN
            ROUND(((600 + RANDOM() * 250) * CASE WHEN q IN (2,4,6,8) THEN 1.22 ELSE 0.94 END)::numeric, 2)
        WHEN m.material_id IN ('MAT-00000090','MAT-00000091','MAT-00000092','MAT-00000093','MAT-00000094') THEN
            ROUND(((450 + RANDOM() * 200) * CASE WHEN q IN (2,4,6,8) THEN 1.20 ELSE 0.96 END)::numeric, 2)
        ELSE
            ROUND(((300 + RANDOM() * 150) * CASE WHEN q IN (2,4,6,8) THEN 1.18 ELSE 0.98 END)::numeric, 2)
    END,
    DATE '2025-03-15' + ((q - 1) * INTERVAL '3 months')
FROM (
    SELECT DISTINCT material_id FROM asset 
    WHERE material_id IN (
        'MAT-00000086','MAT-00000087','MAT-00000088','MAT-00000089','MAT-00000090',
        'MAT-00000091','MAT-00000092','MAT-00000093','MAT-00000094','MAT-00000095',
        'MAT-00000096','MAT-00000097','MAT-00000098','MAT-00000099',
        'MAT-00000130','MAT-00000131','MAT-00000132','MAT-00000133','MAT-00000134','MAT-00000135'
    )
) m
CROSS JOIN generate_series(1, 8) q;

-- Weekly Forecasts for top 5: 5 materials × 26 weeks = 130 records
INSERT INTO demand_forecast_result (material_id, proyeksi_qty, requirement_date)
SELECT 
    material_id,
    ROUND(((40 + RANDOM() * 30) *
        CASE WHEN w % 4 = 1 THEN 0.85 WHEN w % 4 IN (3,0) THEN 1.15 ELSE 1.0 END)::numeric, 2),
    DATE '2025-01-13' + ((w - 1) * INTERVAL '1 week')
FROM (VALUES 
    ('MAT-00000086'),('MAT-00000087'),('MAT-00000088'),
    ('MAT-00000090'),('MAT-00000091')
) t(material_id)
CROSS JOIN generate_series(1, 26) w;
