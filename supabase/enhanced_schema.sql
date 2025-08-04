-- Enhanced LogiAI Database Schema
-- Additional tables inspired by the reference repository but adapted for modern architecture

-- Shipments table (comprehensive shipment tracking)
CREATE TABLE shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  docket_no VARCHAR(50) UNIQUE NOT NULL,
  sender_id UUID REFERENCES users(id),
  receiver_id UUID REFERENCES users(id),
  
  -- Package details
  package_contact_person VARCHAR(255),
  package_contact_phone VARCHAR(20),
  package_type VARCHAR(100),
  package_weight DECIMAL(10,2),
  package_dimensions VARCHAR(100),
  package_description TEXT,
  pickup_address TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  
  -- Transport details
  transport_company VARCHAR(255),
  transport_driver VARCHAR(255),
  transport_driver_phone VARCHAR(20),
  transport_vehicle VARCHAR(100),
  vehicle_id UUID REFERENCES fleet(id),
  
  -- Financial details
  charge_transportation DECIMAL(10,2) DEFAULT 0,
  charge_handling DECIMAL(10,2) DEFAULT 0,
  charge_insurance DECIMAL(10,2) DEFAULT 0,
  charge_fuel DECIMAL(10,2) DEFAULT 0,
  charge_tax_percent DECIMAL(5,2) DEFAULT 0,
  charge_tax_amount DECIMAL(10,2) DEFAULT 0,
  charge_total DECIMAL(10,2) DEFAULT 0,
  charge_advance_paid DECIMAL(10,2) DEFAULT 0,
  charge_balance DECIMAL(10,2) DEFAULT 0,
  
  -- Status and tracking
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled')),
  priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  pickup_date DATE,
  delivery_date DATE,
  estimated_delivery DATE,
  actual_delivery TIMESTAMPTZ,
  
  -- Payment and billing
  payment_type VARCHAR(50) DEFAULT 'cash' CHECK (payment_type IN ('cash', 'credit', 'online', 'cheque')),
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid', 'overdue')),
  bill_to VARCHAR(100),
  
  -- Additional information
  special_instructions TEXT,
  notes TEXT,
  documents JSONB, -- Store document URLs/paths
  
  -- Tracking
  current_location TEXT,
  tracking_updates JSONB, -- Store tracking history
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shipment status history for detailed tracking
CREATE TABLE shipment_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID REFERENCES shipments(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  location TEXT,
  notes TEXT,
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads table for customer relationship management
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'Vietnam',
  
  -- Lead details
  status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost')),
  source VARCHAR(100), -- website, referral, cold_call, etc.
  industry VARCHAR(100),
  company_size VARCHAR(50),
  annual_revenue DECIMAL(15,2),
  
  -- Requirements
  service_type VARCHAR(100), -- domestic, international, express, etc.
  estimated_volume VARCHAR(100),
  budget_range VARCHAR(100),
  timeline VARCHAR(100),
  
  -- Assignment and tracking
  assigned_to UUID REFERENCES users(id),
  lead_score INTEGER DEFAULT 0 CHECK (lead_score >= 0 AND lead_score <= 100),
  last_contact_date DATE,
  next_follow_up DATE,
  
  -- Additional info
  notes TEXT,
  tags TEXT[], -- Array of tags for categorization
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quotes table for pricing and proposals
CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_number VARCHAR(50) UNIQUE NOT NULL,
  lead_id UUID REFERENCES leads(id),
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255),
  customer_phone VARCHAR(20),
  
  -- Route details
  from_location TEXT NOT NULL,
  to_location TEXT NOT NULL,
  distance_km DECIMAL(10,2),
  estimated_duration VARCHAR(50),
  
  -- Package details
  package_type VARCHAR(100),
  package_weight DECIMAL(10,2),
  package_dimensions VARCHAR(100),
  package_value DECIMAL(10,2),
  special_requirements TEXT,
  
  -- Pricing
  base_cost DECIMAL(10,2) NOT NULL,
  fuel_surcharge DECIMAL(10,2) DEFAULT 0,
  insurance_cost DECIMAL(10,2) DEFAULT 0,
  handling_charges DECIMAL(10,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total_cost DECIMAL(10,2) NOT NULL,
  
  -- Quote details
  valid_until DATE NOT NULL,
  terms_conditions TEXT,
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired')),
  
  -- Tracking
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  responded_at TIMESTAMPTZ,
  created_by UUID REFERENCES users(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enhanced expenses table
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_number VARCHAR(50) UNIQUE NOT NULL,
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  
  -- Date and vendor info
  expense_date DATE NOT NULL,
  vendor_name VARCHAR(255),
  vendor_contact VARCHAR(100),
  receipt_number VARCHAR(100),
  
  -- Associations
  shipment_id UUID REFERENCES shipments(id),
  vehicle_id UUID REFERENCES fleet(id),
  driver_id UUID REFERENCES users(id),
  
  -- Payment details
  payment_method VARCHAR(50) DEFAULT 'cash' CHECK (payment_method IN ('cash', 'credit_card', 'bank_transfer', 'cheque')),
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'reimbursed')),
  
  -- Approval workflow
  approval_status VARCHAR(50) DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  
  -- Documents and notes
  receipt_url TEXT,
  notes TEXT,
  tags TEXT[],
  
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Expense categories for better organization
CREATE TABLE expense_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  parent_category_id UUID REFERENCES expense_categories(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customer/Client management (separate from users for external customers)
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  alternate_phone VARCHAR(20),
  
  -- Address details
  billing_address TEXT,
  shipping_address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'Vietnam',
  
  -- Business details
  tax_id VARCHAR(50),
  business_type VARCHAR(100),
  industry VARCHAR(100),
  credit_limit DECIMAL(15,2) DEFAULT 0,
  payment_terms INTEGER DEFAULT 30, -- days
  
  -- Status and preferences
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked')),
  preferred_payment_method VARCHAR(50),
  special_instructions TEXT,
  
  -- Relationship info
  account_manager_id UUID REFERENCES users(id),
  customer_since DATE DEFAULT CURRENT_DATE,
  last_order_date DATE,
  total_orders INTEGER DEFAULT 0,
  total_revenue DECIMAL(15,2) DEFAULT 0,
  
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Call logs for customer communication tracking
CREATE TABLE call_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  lead_id UUID REFERENCES leads(id),
  
  -- Call details
  call_type VARCHAR(50) NOT NULL CHECK (call_type IN ('inbound', 'outbound')),
  call_purpose VARCHAR(100), -- inquiry, follow_up, complaint, etc.
  duration_minutes INTEGER,
  
  -- Contact info
  caller_name VARCHAR(255),
  caller_phone VARCHAR(20),
  
  -- Call summary
  summary TEXT NOT NULL,
  outcome VARCHAR(100), -- interested, not_interested, callback_requested, etc.
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_date DATE,
  
  -- Assignment
  handled_by UUID REFERENCES users(id),
  call_date TIMESTAMPTZ DEFAULT NOW(),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications system
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  type VARCHAR(50) NOT NULL, -- shipment_update, payment_due, etc.
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  
  -- Related entities
  shipment_id UUID REFERENCES shipments(id),
  lead_id UUID REFERENCES leads(id),
  expense_id UUID REFERENCES expenses(id),
  
  -- Status
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_shipments_docket_no ON shipments(docket_no);
CREATE INDEX idx_shipments_status ON shipments(status);
CREATE INDEX idx_shipments_sender ON shipments(sender_id);
CREATE INDEX idx_shipments_receiver ON shipments(receiver_id);
CREATE INDEX idx_shipments_delivery_date ON shipments(delivery_date);

CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX idx_leads_company ON leads(company_name);

CREATE INDEX idx_quotes_number ON quotes(quote_number);
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_quotes_lead ON quotes(lead_id);

CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_expenses_date ON expenses(expense_date);
CREATE INDEX idx_expenses_shipment ON expenses(shipment_id);

CREATE INDEX idx_customers_company ON customers(company_name);
CREATE INDEX idx_customers_status ON customers(status);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);

-- Insert default expense categories
INSERT INTO expense_categories (name, description) VALUES 
('Fuel', 'Vehicle fuel and gas expenses'),
('Maintenance', 'Vehicle maintenance and repairs'),
('Insurance', 'Vehicle and cargo insurance'),
('Tolls', 'Highway and bridge tolls'),
('Parking', 'Parking fees and charges'),
('Driver Expenses', 'Driver meals, accommodation, etc.'),
('Office Supplies', 'Stationery and office materials'),
('Communication', 'Phone, internet, and communication costs'),
('Marketing', 'Advertising and promotional expenses'),
('Legal & Professional', 'Legal fees and professional services');

-- Enable Row Level Security
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipment_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (basic examples - customize based on your needs)
CREATE POLICY "Users can view shipments they're involved in" ON shipments FOR SELECT USING (
  sender_id = auth.uid() OR receiver_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'transport', 'distribution'))
);

CREATE POLICY "Users can view their notifications" ON notifications FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all data" ON shipments FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Functions for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_shipments_updated_at BEFORE UPDATE ON shipments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON quotes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
