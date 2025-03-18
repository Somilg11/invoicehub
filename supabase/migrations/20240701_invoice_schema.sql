-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  company TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  invoice_number TEXT NOT NULL,
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'unpaid',
  notes TEXT,
  subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
  tax_rate DECIMAL(5, 2) DEFAULT 0,
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create invoice_items table
CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

-- Create policies for clients
DROP POLICY IF EXISTS "Clients are viewable by owner only" ON clients;
CREATE POLICY "Clients are viewable by owner only"
ON clients FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Clients are insertable by owner only" ON clients;
CREATE POLICY "Clients are insertable by owner only"
ON clients FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Clients are updatable by owner only" ON clients;
CREATE POLICY "Clients are updatable by owner only"
ON clients FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Clients are deletable by owner only" ON clients;
CREATE POLICY "Clients are deletable by owner only"
ON clients FOR DELETE
USING (auth.uid() = user_id);

-- Create policies for invoices
DROP POLICY IF EXISTS "Invoices are viewable by owner only" ON invoices;
CREATE POLICY "Invoices are viewable by owner only"
ON invoices FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Invoices are insertable by owner only" ON invoices;
CREATE POLICY "Invoices are insertable by owner only"
ON invoices FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Invoices are updatable by owner only" ON invoices;
CREATE POLICY "Invoices are updatable by owner only"
ON invoices FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Invoices are deletable by owner only" ON invoices;
CREATE POLICY "Invoices are deletable by owner only"
ON invoices FOR DELETE
USING (auth.uid() = user_id);

-- Create policies for invoice_items
DROP POLICY IF EXISTS "Invoice items are viewable by invoice owner" ON invoice_items;
CREATE POLICY "Invoice items are viewable by invoice owner"
ON invoice_items FOR SELECT
USING (EXISTS (
  SELECT 1 FROM invoices
  WHERE invoices.id = invoice_items.invoice_id
  AND invoices.user_id = auth.uid()
));

DROP POLICY IF EXISTS "Invoice items are insertable by invoice owner" ON invoice_items;
CREATE POLICY "Invoice items are insertable by invoice owner"
ON invoice_items FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM invoices
  WHERE invoices.id = invoice_items.invoice_id
  AND invoices.user_id = auth.uid()
));

DROP POLICY IF EXISTS "Invoice items are updatable by invoice owner" ON invoice_items;
CREATE POLICY "Invoice items are updatable by invoice owner"
ON invoice_items FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM invoices
  WHERE invoices.id = invoice_items.invoice_id
  AND invoices.user_id = auth.uid()
));

DROP POLICY IF EXISTS "Invoice items are deletable by invoice owner" ON invoice_items;
CREATE POLICY "Invoice items are deletable by invoice owner"
ON invoice_items FOR DELETE
USING (EXISTS (
  SELECT 1 FROM invoices
  WHERE invoices.id = invoice_items.invoice_id
  AND invoices.user_id = auth.uid()
));

-- Enable realtime for all tables
alter publication supabase_realtime add table clients;
alter publication supabase_realtime add table invoices;
alter publication supabase_realtime add table invoice_items;