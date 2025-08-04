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

-- =====================================================
-- VIETNAMESE IMPORT/EXPORT DOCUMENT AUTOMATION SCHEMA
-- =====================================================

-- Vietnamese Import/Export Document Types
CREATE TABLE document_types (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name_vi TEXT NOT NULL,
  name_en TEXT NOT NULL,
  purpose TEXT,
  sequence_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert standard Vietnamese import/export document types
INSERT INTO document_types (code, name_vi, name_en, purpose, sequence_order) VALUES
('sales_contract', 'Hợp đồng ngoại thương', 'Sales Contract', 'Thỏa thuận mua bán quốc tế giữa buyer và seller', 1),
('commercial_invoice', 'Hóa đơn thương mại', 'Commercial Invoice', 'Căn cứ khai giá trị hải quan và thanh toán quốc tế', 2),
('packing_list', 'Phiếu đóng gói', 'Packing List', 'Chi tiết đóng gói để kiểm hàng tại cảng và hải quan', 3),
('bill_of_lading', 'Vận đơn', 'Bill of Lading', 'Chứng từ vận tải xác nhận hàng đã lên tàu', 4),
('customs_declaration', 'Tờ khai hải quan', 'Customs Declaration', 'Khai báo thông tin hàng hoá để làm thủ tục thông quan', 5),
('letter_of_credit', 'Thư tín dụng', 'Letter of Credit', 'Thanh toán quốc tế qua ngân hàng đảm bảo', 6),
('certificate_of_origin', 'Chứng nhận xuất xứ', 'Certificate of Origin', 'Chứng minh xuất xứ để hưởng ưu đãi thuế', 7),
('quality_certificate', 'Giấy chứng nhận chất lượng', 'Quality Certificate', 'Xác nhận chất lượng phù hợp theo tiêu chuẩn hợp đồng', 8),
('insurance_certificate', 'Chứng nhận bảo hiểm', 'Insurance Certificate', 'Bảo hiểm hàng hóa trong vận chuyển quốc tế', 9),
('daily_plan', 'Kế hoạch ngày', 'Daily Plan', 'Kế hoạch vận tải và logistics hàng ngày', 10);

-- Required fields per document type
CREATE TABLE document_fields (
  id SERIAL PRIMARY KEY,
  document_type_code TEXT REFERENCES document_types(code),
  field_name TEXT NOT NULL,
  display_label_vi TEXT,
  display_label_en TEXT,
  field_type TEXT CHECK (field_type IN ('text', 'number', 'date', 'select', 'file', 'textarea')),
  required BOOLEAN DEFAULT TRUE,
  validation_rules JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert standard fields for each document type
INSERT INTO document_fields (document_type_code, field_name, display_label_vi, display_label_en, field_type, required) VALUES
-- Sales Contract fields
('sales_contract', 'contract_number', 'Số hợp đồng', 'Contract Number', 'text', true),
('sales_contract', 'buyer_name', 'Tên người mua', 'Buyer Name', 'text', true),
('sales_contract', 'seller_name', 'Tên người bán', 'Seller Name', 'text', true),
('sales_contract', 'goods_description', 'Mô tả hàng hóa', 'Goods Description', 'textarea', true),
('sales_contract', 'price_terms', 'Điều kiện giá', 'Price Terms', 'text', true),

-- Commercial Invoice fields
('commercial_invoice', 'invoice_number', 'Số hóa đơn', 'Invoice Number', 'text', true),
('commercial_invoice', 'issue_date', 'Ngày phát hành', 'Issue Date', 'date', true),
('commercial_invoice', 'exporter', 'Người xuất khẩu', 'Exporter', 'text', true),
('commercial_invoice', 'importer', 'Người nhập khẩu', 'Importer', 'text', true),
('commercial_invoice', 'goods_details', 'Chi tiết hàng hóa', 'Goods Details', 'textarea', true),
('commercial_invoice', 'total_amount', 'Tổng giá trị', 'Total Amount', 'number', true),

-- Packing List fields
('packing_list', 'package_number', 'Số kiện', 'Package Number', 'text', true),
('packing_list', 'description', 'Mô tả', 'Description', 'textarea', true),
('packing_list', 'net_weight', 'Trọng lượng tịnh', 'Net Weight', 'number', true),
('packing_list', 'gross_weight', 'Trọng lượng thô', 'Gross Weight', 'number', true),
('packing_list', 'volume', 'Thể tích', 'Volume', 'number', true),

-- Daily Plan fields
('daily_plan', 'plan_date', 'Ngày kế hoạch', 'Plan Date', 'date', true),
('daily_plan', 'route', 'Tuyến đường', 'Route', 'text', true),
('daily_plan', 'vehicle', 'Phương tiện', 'Vehicle', 'text', true),
('daily_plan', 'driver', 'Tài xế', 'Driver', 'text', true),
('daily_plan', 'cargo', 'Hàng hóa', 'Cargo', 'text', true),
('daily_plan', 'destination', 'Điểm đến', 'Destination', 'text', true),
('daily_plan', 'distance', 'Quãng đường (km)', 'Distance (km)', 'number', false),
('daily_plan', 'fuel_cost', 'Chi phí nhiên liệu (VND)', 'Fuel Cost (VND)', 'number', false);

-- Uploaded documents
CREATE TABLE documents_uploaded (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  document_type_code TEXT REFERENCES document_types(code),
  file_name TEXT NOT NULL,
  file_url TEXT,
  file_size BIGINT,
  extracted_data JSONB,
  processing_status TEXT CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending',
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- Generated documents
CREATE TABLE documents_generated (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  document_type_code TEXT REFERENCES document_types(code),
  template_data JSONB,
  generated_content TEXT,
  file_url TEXT,
  status TEXT CHECK (status IN ('draft', 'generated', 'signed', 'submitted')) DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ROUTE OPTIMIZATION SCHEMA
-- =====================================================

-- Depots for route optimization
CREATE TABLE depots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  location GEOGRAPHY(POINT, 4326),
  depot_type TEXT CHECK (depot_type IN ('main', 'pickup', 'delivery', 'empty_return')),
  capacity_limit INTEGER,
  operating_hours JSONB,
  contact_info JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert sample depots for Vietnam
INSERT INTO depots (name, address, depot_type, capacity_limit, operating_hours) VALUES
('Depot Hồ Chí Minh', 'Quận 7, TP. Hồ Chí Minh', 'main', 1000, '{"open": "06:00", "close": "22:00"}'),
('Depot Hà Nội', 'Quận Long Biên, Hà Nội', 'main', 800, '{"open": "06:00", "close": "22:00"}'),
('Depot Đà Nẵng', 'Quận Hải Châu, Đà Nẵng', 'pickup', 500, '{"open": "07:00", "close": "21:00"}'),
('Depot Cần Thơ', 'Quận Ninh Kiều, Cần Thơ', 'delivery', 400, '{"open": "07:00", "close": "20:00"}'),
('Depot Hải Phòng', 'Quận Lê Chân, Hải Phòng', 'empty_return', 300, '{"open": "08:00", "close": "18:00"}');

-- Enhanced vehicles table for route optimization
CREATE TABLE vehicles_enhanced (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_code TEXT UNIQUE NOT NULL,
  vehicle_type TEXT,
  capacity_weight DECIMAL(10,2),
  capacity_volume DECIMAL(10,2),
  fuel_efficiency DECIMAL(8,2), -- km per liter
  current_location GEOGRAPHY(POINT, 4326),
  status TEXT CHECK (status IN ('available', 'in_transit', 'maintenance', 'unavailable')) DEFAULT 'available',
  driver_id UUID,
  depot_id UUID REFERENCES depots(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert sample vehicles
INSERT INTO vehicles_enhanced (vehicle_code, vehicle_type, capacity_weight, capacity_volume, fuel_efficiency, status) VALUES
('VN-001', 'Truck 5T', 5000.00, 25.00, 8.5, 'available'),
('VN-002', 'Truck 10T', 10000.00, 45.00, 7.2, 'available'),
('VN-003', 'Van 2T', 2000.00, 12.00, 12.0, 'available'),
('VN-004', 'Container 20ft', 25000.00, 33.00, 6.5, 'available'),
('VN-005', 'Truck 3T', 3000.00, 18.00, 10.0, 'available');

-- Daily transportation plans
CREATE TABLE transportation_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  plan_date DATE NOT NULL,
  vehicle_id UUID REFERENCES vehicles_enhanced(id),
  driver_name TEXT,
  route_data JSONB, -- stores route waypoints and optimization data
  total_distance DECIMAL(10,2),
  estimated_fuel_cost DECIMAL(12,2),
  estimated_duration INTEGER, -- minutes
  status TEXT CHECK (status IN ('draft', 'optimized', 'approved', 'in_progress', 'completed')) DEFAULT 'draft',
  optimization_score DECIMAL(5,2), -- efficiency score 0-100
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Route optimization results
CREATE TABLE route_optimizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transportation_plan_id UUID REFERENCES transportation_plans(id),
  original_route JSONB,
  optimized_route JSONB,
  fuel_savings DECIMAL(12,2),
  time_savings INTEGER, -- minutes
  distance_reduction DECIMAL(10,2),
  optimization_algorithm TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Learning data from uploaded files
CREATE TABLE file_learning_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  file_name TEXT NOT NULL,
  file_type TEXT,
  extracted_patterns JSONB,
  insights JSONB,
  automation_suggestions JSONB,
  learning_status TEXT CHECK (learning_status IN ('processing', 'completed', 'failed')) DEFAULT 'processing',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Document-related indexes
CREATE INDEX idx_documents_uploaded_user_id ON documents_uploaded(user_id);
CREATE INDEX idx_documents_uploaded_type ON documents_uploaded(document_type_code);
CREATE INDEX idx_documents_generated_user_id ON documents_generated(user_id);
CREATE INDEX idx_documents_generated_type ON documents_generated(document_type_code);

-- Route optimization indexes
CREATE INDEX idx_transportation_plans_user_id ON transportation_plans(user_id);
CREATE INDEX idx_transportation_plans_date ON transportation_plans(plan_date);
CREATE INDEX idx_transportation_plans_vehicle ON transportation_plans(vehicle_id);
CREATE INDEX idx_route_optimizations_plan_id ON route_optimizations(transportation_plan_id);

-- Learning data indexes
CREATE INDEX idx_file_learning_data_user_id ON file_learning_data(user_id);
CREATE INDEX idx_file_learning_data_status ON file_learning_data(learning_status);

-- Spatial indexes for location-based queries
CREATE INDEX idx_depots_location ON depots USING GIST(location);
CREATE INDEX idx_vehicles_location ON vehicles_enhanced USING GIST(current_location);

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on new tables
ALTER TABLE documents_uploaded ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents_generated ENABLE ROW LEVEL SECURITY;
ALTER TABLE transportation_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_learning_data ENABLE ROW LEVEL SECURITY;

-- RLS Policies for documents_uploaded
CREATE POLICY "Users can view own uploaded documents" ON documents_uploaded
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own uploaded documents" ON documents_uploaded
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own uploaded documents" ON documents_uploaded
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for documents_generated
CREATE POLICY "Users can view own generated documents" ON documents_generated
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own generated documents" ON documents_generated
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own generated documents" ON documents_generated
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for transportation_plans
CREATE POLICY "Users can view own transportation plans" ON transportation_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transportation plans" ON transportation_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transportation plans" ON transportation_plans
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for file_learning_data
CREATE POLICY "Users can view own learning data" ON file_learning_data
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own learning data" ON file_learning_data
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own learning data" ON file_learning_data
  FOR UPDATE USING (auth.uid() = user_id);

-- Public read access for reference tables
ALTER TABLE document_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE depots ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles_enhanced ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access to document types" ON document_types
  FOR SELECT USING (true);

CREATE POLICY "Public read access to document fields" ON document_fields
  FOR SELECT USING (true);

CREATE POLICY "Public read access to depots" ON depots
  FOR SELECT USING (true);

CREATE POLICY "Public read access to vehicles" ON vehicles_enhanced
  FOR SELECT USING (true);
