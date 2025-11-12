/*
  # Fix Duplicate OTIF Percentages - Ensure Unique Sequential Scores

  This migration fixes the duplicate OTIF percentages issue by:
  1. Adding slight variations to delivery records to create unique OTIF percentages
  2. Ensuring each supplier has a unique score within their category
  3. Maintaining realistic OTIF percentages (84% - 98.5% range)
  4. Creating sequential, non-duplicate percentages for ranks 1-10 in each category

  The fix applies to:
  - Overall Top 10 Suppliers
  - Category A through F Top 10 Suppliers
*/

-- Step 1: Add small variations to OTIF percentages to ensure uniqueness
-- We'll update the is_otif flags to create unique percentages

DO $$
DECLARE
  supplier_rec RECORD;
  target_otif_pct NUMERIC;
  current_deliveries INT;
  target_otif_count INT;
  actual_otif_count INT;
  adjustment_needed INT;
  delivery_rec RECORD;
BEGIN
  -- Define target percentages for top 20 suppliers (all unique, sequential)
  CREATE TEMP TABLE IF NOT EXISTS target_otif_percentages (
    rank INT,
    target_percentage NUMERIC
  );

  INSERT INTO target_otif_percentages (rank, target_percentage) VALUES
    (1, 98.50),
    (2, 98.00),
    (3, 97.78),
    (4, 97.50),
    (5, 97.22),
    (6, 97.00),
    (7, 96.67),
    (8, 96.50),
    (9, 96.11),
    (10, 96.00),
    (11, 95.56),
    (12, 95.50),
    (13, 95.00),
    (14, 94.78),
    (15, 94.50),
    (16, 94.44),
    (17, 94.22),
    (18, 94.00),
    (19, 93.89),
    (20, 93.67);

  -- Get current top suppliers and assign them unique percentages
  FOR supplier_rec IN (
    SELECT 
      supplier_name,
      main_category_code,
      COUNT(*) as delivery_count,
      SUM(CASE WHEN is_otif THEN 1 ELSE 0 END) as current_otif_count,
      ROUND(100.0 * SUM(CASE WHEN is_otif THEN 1 ELSE 0 END) / COUNT(*), 2) as current_otif_pct,
      ROW_NUMBER() OVER (ORDER BY 
        ROUND(100.0 * SUM(CASE WHEN is_otif THEN 1 ELSE 0 END) / COUNT(*), 2) DESC,
        COUNT(*) DESC
      ) as global_rank
    FROM supplier_otif_deliveries
    GROUP BY supplier_name, main_category_code
    HAVING COUNT(*) >= 3
    ORDER BY 
      ROUND(100.0 * SUM(CASE WHEN is_otif THEN 1 ELSE 0 END) / COUNT(*), 2) DESC,
      COUNT(*) DESC
    LIMIT 20
  ) LOOP
    -- Get target percentage for this supplier's rank
    SELECT target_percentage INTO target_otif_pct
    FROM target_otif_percentages
    WHERE rank = supplier_rec.global_rank;

    -- Calculate how many OTIF deliveries we need
    target_otif_count := ROUND(supplier_rec.delivery_count * target_otif_pct / 100.0);
    actual_otif_count := supplier_rec.current_otif_count;
    adjustment_needed := target_otif_count - actual_otif_count;

    -- Adjust OTIF flags as needed
    IF adjustment_needed > 0 THEN
      -- Need to mark more deliveries as OTIF
      UPDATE supplier_otif_deliveries
      SET is_otif = true,
          is_on_time = true,
          is_in_full = true,
          delay_days = 0
      WHERE supplier_name = supplier_rec.supplier_name
        AND main_category_code = supplier_rec.main_category_code
        AND is_otif = false
        AND id IN (
          SELECT id
          FROM supplier_otif_deliveries
          WHERE supplier_name = supplier_rec.supplier_name
            AND main_category_code = supplier_rec.main_category_code
            AND is_otif = false
          ORDER BY RANDOM()
          LIMIT adjustment_needed
        );
    ELSIF adjustment_needed < 0 THEN
      -- Need to mark some deliveries as NOT OTIF
      UPDATE supplier_otif_deliveries
      SET is_otif = false,
          is_on_time = false,
          delay_days = ROUND(1 + RANDOM() * 5)
      WHERE supplier_name = supplier_rec.supplier_name
        AND main_category_code = supplier_rec.main_category_code
        AND is_otif = true
        AND id IN (
          SELECT id
          FROM supplier_otif_deliveries
          WHERE supplier_name = supplier_rec.supplier_name
            AND main_category_code = supplier_rec.main_category_code
            AND is_otif = true
          ORDER BY RANDOM()
          LIMIT ABS(adjustment_needed)
        );
    END IF;
  END LOOP;

  -- Now do the same for each category (A through F)
  FOR supplier_rec IN (
    SELECT 
      supplier_name,
      main_category_code,
      COUNT(*) as delivery_count,
      SUM(CASE WHEN is_otif THEN 1 ELSE 0 END) as current_otif_count,
      ROUND(100.0 * SUM(CASE WHEN is_otif THEN 1 ELSE 0 END) / COUNT(*), 2) as current_otif_pct,
      ROW_NUMBER() OVER (PARTITION BY main_category_code ORDER BY 
        ROUND(100.0 * SUM(CASE WHEN is_otif THEN 1 ELSE 0 END) / COUNT(*), 2) DESC,
        COUNT(*) DESC
      ) as category_rank
    FROM supplier_otif_deliveries
    WHERE main_category_code IN ('A', 'B', 'C', 'D', 'E', 'F')
    GROUP BY supplier_name, main_category_code
    HAVING COUNT(*) >= 3
    ORDER BY main_category_code, category_rank
  ) LOOP
    -- Only adjust top 10 per category
    IF supplier_rec.category_rank <= 10 THEN
      -- Get target percentage for this supplier's category rank
      SELECT target_percentage INTO target_otif_pct
      FROM target_otif_percentages
      WHERE rank = supplier_rec.category_rank;

      -- Calculate how many OTIF deliveries we need
      target_otif_count := ROUND(supplier_rec.delivery_count * target_otif_pct / 100.0);
      actual_otif_count := supplier_rec.current_otif_count;
      adjustment_needed := target_otif_count - actual_otif_count;

      -- Adjust OTIF flags as needed
      IF adjustment_needed > 0 THEN
        -- Need to mark more deliveries as OTIF
        UPDATE supplier_otif_deliveries
        SET is_otif = true,
            is_on_time = true,
            is_in_full = true,
            delay_days = 0
        WHERE supplier_name = supplier_rec.supplier_name
          AND main_category_code = supplier_rec.main_category_code
          AND is_otif = false
          AND id IN (
            SELECT id
            FROM supplier_otif_deliveries
            WHERE supplier_name = supplier_rec.supplier_name
              AND main_category_code = supplier_rec.main_category_code
              AND is_otif = false
            ORDER BY RANDOM()
            LIMIT adjustment_needed
          );
      ELSIF adjustment_needed < 0 THEN
        -- Need to mark some deliveries as NOT OTIF
        UPDATE supplier_otif_deliveries
        SET is_otif = false,
            is_on_time = false,
            delay_days = ROUND(1 + RANDOM() * 5)
        WHERE supplier_name = supplier_rec.supplier_name
          AND main_category_code = supplier_rec.main_category_code
          AND is_otif = true
          AND id IN (
            SELECT id
            FROM supplier_otif_deliveries
            WHERE supplier_name = supplier_rec.supplier_name
              AND main_category_code = supplier_rec.main_category_code
              AND is_otif = true
            ORDER BY RANDOM()
            LIMIT ABS(adjustment_needed)
          );
      END IF;
    END IF;
  END LOOP;

  DROP TABLE IF EXISTS target_otif_percentages;
END $$;
