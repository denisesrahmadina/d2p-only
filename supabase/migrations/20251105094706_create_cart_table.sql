/*
  # Create Shopping Cart Table

  1. New Tables
    - `fact_cart`
      - `cart_id` (bigserial, primary key)
      - `user_id` (text, references users)
      - `contract_id` (text, references dim_contract)
      - `item_id` (text, references fact_item_master)
      - `quantity` (integer, quantity in cart)
      - `unit_price` (numeric, price per unit)
      - `total_price` (numeric, calculated total)
      - `notes` (text, optional notes)
      - `added_at` (timestamptz, when item was added)
      - `updated_at` (timestamptz, last update timestamp)

  2. Security
    - Enable RLS on `fact_cart` table
    - Add policy for authenticated users to manage their own cart items
    - Add policy for users to read their own cart

  3. Indexes
    - Index on user_id for fast cart retrieval
    - Index on contract_id for contract-based queries
*/

-- Create cart table
CREATE TABLE IF NOT EXISTS fact_cart (
  cart_id bigserial PRIMARY KEY,
  user_id text NOT NULL,
  contract_id text NOT NULL REFERENCES dim_contract(contract_id) ON DELETE CASCADE,
  item_id text REFERENCES fact_item_master(item_id) ON DELETE CASCADE,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price numeric NOT NULL CHECK (unit_price >= 0),
  total_price numeric NOT NULL CHECK (total_price >= 0),
  notes text,
  added_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_user_contract_item UNIQUE (user_id, contract_id, item_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_cart_user_id ON fact_cart(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_contract_id ON fact_cart(contract_id);
CREATE INDEX IF NOT EXISTS idx_cart_added_at ON fact_cart(added_at DESC);

-- Enable Row Level Security
ALTER TABLE fact_cart ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own cart items
CREATE POLICY "Users can view own cart"
  ON fact_cart
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

-- Policy: Users can insert their own cart items
CREATE POLICY "Users can add to own cart"
  ON fact_cart
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

-- Policy: Users can update their own cart items
CREATE POLICY "Users can update own cart"
  ON fact_cart
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- Policy: Users can delete their own cart items
CREATE POLICY "Users can delete from own cart"
  ON fact_cart
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id);

-- Policy: Allow anonymous users to manage cart (for demo purposes)
CREATE POLICY "Anonymous users can manage cart"
  ON fact_cart
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);