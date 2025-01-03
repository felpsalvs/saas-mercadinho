/*
  # Initial Schema Setup

  1. New Tables
    - products
      - id (uuid, primary key)
      - name (text)
      - price (numeric)
      - stock (numeric)
      - min_stock (numeric)
      - unit (text)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - stock_movements
      - id (uuid, primary key)
      - product_id (uuid, foreign key)
      - type (text)
      - quantity (numeric)
      - reason (text)
      - notes (text)
      - created_at (timestamp)
    
    - sales
      - id (uuid, primary key)
      - total (numeric)
      - created_at (timestamp)
    
    - sale_items
      - id (uuid, primary key)
      - sale_id (uuid, foreign key)
      - product_id (uuid, foreign key)
      - quantity (numeric)
      - price (numeric)
      - total (numeric)
    
    - payments
      - id (uuid, primary key)
      - sale_id (uuid, foreign key)
      - method (text)
      - amount (numeric)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Products Table
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  stock numeric NOT NULL DEFAULT 0 CHECK (stock >= 0),
  min_stock numeric NOT NULL DEFAULT 0 CHECK (min_stock >= 0),
  unit text NOT NULL CHECK (unit IN ('kg', 'unit')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_products_name ON products(name);

-- Stock Movements Table
CREATE TABLE stock_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) NOT NULL,
  type text NOT NULL CHECK (type IN ('in', 'out')),
  quantity numeric NOT NULL CHECK (quantity > 0),
  reason text NOT NULL CHECK (reason IN ('purchase', 'sale', 'loss', 'adjustment', 'return')),
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_stock_movements_product ON stock_movements(product_id);

-- Sales Table
CREATE TABLE sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  total numeric NOT NULL CHECK (total >= 0),
  created_at timestamptz DEFAULT now()
);

-- Sale Items Table
CREATE TABLE sale_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id uuid REFERENCES sales(id) NOT NULL,
  product_id uuid REFERENCES products(id) NOT NULL,
  quantity numeric NOT NULL CHECK (quantity > 0),
  price numeric NOT NULL CHECK (price >= 0),
  total numeric NOT NULL CHECK (total >= 0)
);

CREATE INDEX idx_sale_items_sale ON sale_items(sale_id);
CREATE INDEX idx_sale_items_product ON sale_items(product_id);

-- Payments Table
CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id uuid REFERENCES sales(id) NOT NULL,
  method text NOT NULL CHECK (method IN ('pix', 'cash', 'card')),
  amount numeric NOT NULL CHECK (amount > 0),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_payments_sale ON payments(sale_id);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow all operations for authenticated users" ON products
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations for authenticated users" ON stock_movements
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations for authenticated users" ON sales
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations for authenticated users" ON sale_items
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations for authenticated users" ON payments
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);