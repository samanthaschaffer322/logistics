-- LogiAI Database Schema
-- This schema supports user management, warehouse, transport, distribution, procurement, and AI learning.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 🔐 Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('admin', 'warehouse', 'transport', 'distribution', 'procurement')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 🏠 Warehouse table
CREATE TABLE warehouse (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  manager_id UUID REFERENCES users(id)
);

-- 📦 Inventory table
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_name TEXT NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  reorder_level INT NOT NULL DEFAULT 10,
  warehouse_id UUID REFERENCES warehouse(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 🚚 Fleet table
CREATE TABLE fleet (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id TEXT UNIQUE NOT NULL,
  driver_id UUID REFERENCES users(id),
  capacity INT NOT NULL,
  status TEXT CHECK (status IN ('available', 'in_transit', 'maintenance')) DEFAULT 'available',
  current_location TEXT
);

-- 🧑‍✈️ Driver schedule table
CREATE TABLE driver_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES users(id),
  vehicle_id UUID REFERENCES fleet(id),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  route TEXT
);

-- 📤 Distribution orders table
CREATE TABLE distribution_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  destination TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'dispatched', 'delivered')) DEFAULT 'pending',
  delivery_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 📥 Procurement table
CREATE TABLE procurement (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES inventory(id),
  vendor_name TEXT NOT NULL,
  incoterm TEXT,
  quantity INT NOT NULL,
  status TEXT CHECK (status IN ('requested', 'ordered', 'received')) DEFAULT 'requested',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 🧠 Uploaded plans table (for AI learning)
CREATE TABLE uploaded_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  uploaded_by UUID REFERENCES users(id),
  parsed_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_inventory_warehouse ON inventory(warehouse_id);
CREATE INDEX idx_inventory_sku ON inventory(sku);
CREATE INDEX idx_fleet_driver ON fleet(driver_id);
CREATE INDEX idx_fleet_status ON fleet(status);
CREATE INDEX idx_distribution_status ON distribution_orders(status);
CREATE INDEX idx_procurement_status ON procurement(status);
CREATE INDEX idx_uploaded_plans_user ON uploaded_plans(uploaded_by);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouse ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE fleet ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE distribution_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE procurement ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploaded_plans ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (can be customized based on requirements)
CREATE POLICY "Users can view their own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all data" ON users FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Similar policies can be created for other tables based on role-based access requirements
