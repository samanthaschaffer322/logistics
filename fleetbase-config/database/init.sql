-- Fleetbase Logistics Database Initialization Script
-- This script sets up the enhanced database schema for the logistics system

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS fleetbase_logistics CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE fleetbase_logistics;

-- Create user if not exists
CREATE USER IF NOT EXISTS 'fleetbase_user'@'%' IDENTIFIED BY 'fleetbase_password';
GRANT ALL PRIVILEGES ON fleetbase_logistics.* TO 'fleetbase_user'@'%';
FLUSH PRIVILEGES;

-- Enhanced Organizations table
CREATE TABLE IF NOT EXISTS organizations (
    id CHAR(36) PRIMARY KEY,
    public_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(255),
    logo_url VARCHAR(500),
    timezone VARCHAR(100) DEFAULT 'Asia/Ho_Chi_Minh',
    currency VARCHAR(10) DEFAULT 'VND',
    country VARCHAR(100) DEFAULT 'Vietnam',
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    subscription_plan VARCHAR(50) DEFAULT 'basic',
    ai_features_enabled BOOLEAN DEFAULT TRUE,
    real_time_tracking_enabled BOOLEAN DEFAULT TRUE,
    advanced_analytics_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    INDEX idx_public_id (public_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Enhanced Users table
CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY,
    public_id VARCHAR(255) UNIQUE NOT NULL,
    organization_id CHAR(36),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    password VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    role ENUM('admin', 'manager', 'dispatcher', 'driver', 'customer') DEFAULT 'dispatcher',
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    last_login_at TIMESTAMP NULL,
    email_verified_at TIMESTAMP NULL,
    phone_verified_at TIMESTAMP NULL,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    preferences JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    INDEX idx_public_id (public_id),
    INDEX idx_organization_id (organization_id),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status)
);

-- Enhanced Vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
    id CHAR(36) PRIMARY KEY,
    public_id VARCHAR(255) UNIQUE NOT NULL,
    organization_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    plate_number VARCHAR(50) NOT NULL,
    vin VARCHAR(100),
    make VARCHAR(100),
    model VARCHAR(100),
    year INT,
    type ENUM('car', 'van', 'truck', 'motorcycle', 'bicycle', 'drone') DEFAULT 'van',
    capacity_weight DECIMAL(10,2),
    capacity_volume DECIMAL(10,2),
    fuel_type ENUM('gasoline', 'diesel', 'electric', 'hybrid', 'cng', 'lpg') DEFAULT 'gasoline',
    fuel_capacity DECIMAL(8,2),
    fuel_efficiency DECIMAL(8,2),
    status ENUM('active', 'inactive', 'maintenance', 'repair') DEFAULT 'active',
    current_driver_id CHAR(36),
    current_location JSON,
    last_location_update TIMESTAMP NULL,
    odometer DECIMAL(12,2) DEFAULT 0,
    insurance_expiry DATE,
    registration_expiry DATE,
    maintenance_due_date DATE,
    ai_optimization_enabled BOOLEAN DEFAULT TRUE,
    real_time_tracking_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    FOREIGN KEY (current_driver_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_public_id (public_id),
    INDEX idx_organization_id (organization_id),
    INDEX idx_plate_number (plate_number),
    INDEX idx_type (type),
    INDEX idx_status (status),
    INDEX idx_current_driver_id (current_driver_id)
);

-- Enhanced Orders table
CREATE TABLE IF NOT EXISTS orders (
    id CHAR(36) PRIMARY KEY,
    public_id VARCHAR(255) UNIQUE NOT NULL,
    organization_id CHAR(36) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    customer_email VARCHAR(255),
    pickup_name VARCHAR(255),
    pickup_address TEXT NOT NULL,
    pickup_latitude DECIMAL(10, 8),
    pickup_longitude DECIMAL(11, 8),
    pickup_phone VARCHAR(50),
    pickup_instructions TEXT,
    delivery_name VARCHAR(255),
    delivery_address TEXT NOT NULL,
    delivery_latitude DECIMAL(10, 8),
    delivery_longitude DECIMAL(11, 8),
    delivery_phone VARCHAR(50),
    delivery_instructions TEXT,
    type ENUM('delivery', 'pickup', 'return', 'exchange') DEFAULT 'delivery',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    status ENUM('pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'failed', 'cancelled') DEFAULT 'pending',
    scheduled_at TIMESTAMP NULL,
    pickup_time_window_start TIME,
    pickup_time_window_end TIME,
    delivery_time_window_start TIME,
    delivery_time_window_end TIME,
    estimated_pickup_time TIMESTAMP NULL,
    estimated_delivery_time TIMESTAMP NULL,
    actual_pickup_time TIMESTAMP NULL,
    actual_delivery_time TIMESTAMP NULL,
    distance DECIMAL(8,2),
    duration INT,
    weight DECIMAL(8,2),
    volume DECIMAL(8,2),
    value DECIMAL(12,2),
    cod_amount DECIMAL(12,2) DEFAULT 0,
    delivery_fee DECIMAL(10,2),
    total_amount DECIMAL(12,2),
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    payment_method VARCHAR(50),
    notes TEXT,
    special_requirements JSON,
    tracking_number VARCHAR(100) UNIQUE,
    proof_of_delivery JSON,
    customer_rating INT CHECK (customer_rating >= 1 AND customer_rating <= 5),
    customer_feedback TEXT,
    ai_optimized BOOLEAN DEFAULT FALSE,
    optimization_score DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    INDEX idx_public_id (public_id),
    INDEX idx_organization_id (organization_id),
    INDEX idx_tracking_number (tracking_number),
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_scheduled_at (scheduled_at),
    INDEX idx_pickup_location (pickup_latitude, pickup_longitude),
    INDEX idx_delivery_location (delivery_latitude, delivery_longitude),
    INDEX idx_created_at (created_at)
);

-- Enhanced Routes table
CREATE TABLE IF NOT EXISTS routes (
    id CHAR(36) PRIMARY KEY,
    public_id VARCHAR(255) UNIQUE NOT NULL,
    organization_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    driver_id CHAR(36),
    vehicle_id CHAR(36),
    status ENUM('pending', 'active', 'completed', 'cancelled', 'paused') DEFAULT 'pending',
    optimization_algorithm VARCHAR(50),
    optimization_score DECIMAL(5,2),
    total_distance DECIMAL(10,2),
    total_duration INT,
    total_cost DECIMAL(12,2),
    estimated_fuel_consumption DECIMAL(8,2),
    estimated_carbon_footprint DECIMAL(8,2),
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    route_geometry JSON,
    waypoints JSON,
    traffic_conditions JSON,
    weather_conditions JSON,
    ai_insights JSON,
    performance_metrics JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE SET NULL,
    INDEX idx_public_id (public_id),
    INDEX idx_organization_id (organization_id),
    INDEX idx_driver_id (driver_id),
    INDEX idx_vehicle_id (vehicle_id),
    INDEX idx_status (status),
    INDEX idx_started_at (started_at),
    INDEX idx_optimization_score (optimization_score)
);

-- Route Orders junction table
CREATE TABLE IF NOT EXISTS route_orders (
    id CHAR(36) PRIMARY KEY,
    route_id CHAR(36) NOT NULL,
    order_id CHAR(36) NOT NULL,
    sequence_number INT NOT NULL,
    estimated_arrival_time TIMESTAMP NULL,
    actual_arrival_time TIMESTAMP NULL,
    estimated_departure_time TIMESTAMP NULL,
    actual_departure_time TIMESTAMP NULL,
    distance_from_previous DECIMAL(8,2),
    duration_from_previous INT,
    status ENUM('pending', 'arrived', 'completed', 'failed', 'skipped') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    UNIQUE KEY unique_route_order (route_id, order_id),
    INDEX idx_route_id (route_id),
    INDEX idx_order_id (order_id),
    INDEX idx_sequence_number (sequence_number)
);

-- Enhanced Tracking Events table
CREATE TABLE IF NOT EXISTS tracking_events (
    id CHAR(36) PRIMARY KEY,
    organization_id CHAR(36) NOT NULL,
    order_id CHAR(36),
    route_id CHAR(36),
    driver_id CHAR(36),
    vehicle_id CHAR(36),
    event_type ENUM('created', 'assigned', 'picked_up', 'in_transit', 'delivered', 'failed', 'cancelled', 'location_update', 'exception') NOT NULL,
    event_status VARCHAR(100),
    event_message TEXT,
    location_latitude DECIMAL(10, 8),
    location_longitude DECIMAL(11, 8),
    location_address TEXT,
    metadata JSON,
    occurred_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE SET NULL,
    INDEX idx_organization_id (organization_id),
    INDEX idx_order_id (order_id),
    INDEX idx_route_id (route_id),
    INDEX idx_event_type (event_type),
    INDEX idx_occurred_at (occurred_at),
    INDEX idx_location (location_latitude, location_longitude)
);

-- AI Optimization History table
CREATE TABLE IF NOT EXISTS optimization_history (
    id CHAR(36) PRIMARY KEY,
    organization_id CHAR(36) NOT NULL,
    route_id CHAR(36),
    algorithm_used VARCHAR(100) NOT NULL,
    input_parameters JSON,
    optimization_results JSON,
    performance_metrics JSON,
    ai_insights JSON,
    execution_time_ms INT,
    optimization_score DECIMAL(5,2),
    improvement_percentage DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE,
    INDEX idx_organization_id (organization_id),
    INDEX idx_route_id (route_id),
    INDEX idx_algorithm_used (algorithm_used),
    INDEX idx_optimization_score (optimization_score),
    INDEX idx_created_at (created_at)
);

-- Webhooks table
CREATE TABLE IF NOT EXISTS webhooks (
    id CHAR(36) PRIMARY KEY,
    organization_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    events JSON NOT NULL,
    secret VARCHAR(255),
    status ENUM('active', 'inactive', 'failed') DEFAULT 'active',
    retry_attempts INT DEFAULT 3,
    timeout_seconds INT DEFAULT 30,
    last_triggered_at TIMESTAMP NULL,
    last_response_status INT,
    last_error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    INDEX idx_organization_id (organization_id),
    INDEX idx_status (status)
);

-- Analytics and Reporting tables
CREATE TABLE IF NOT EXISTS analytics_reports (
    id CHAR(36) PRIMARY KEY,
    organization_id CHAR(36) NOT NULL,
    report_type VARCHAR(100) NOT NULL,
    report_name VARCHAR(255) NOT NULL,
    parameters JSON,
    data JSON,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    INDEX idx_organization_id (organization_id),
    INDEX idx_report_type (report_type),
    INDEX idx_generated_at (generated_at)
);

-- Performance Metrics table
CREATE TABLE IF NOT EXISTS performance_metrics (
    id CHAR(36) PRIMARY KEY,
    organization_id CHAR(36) NOT NULL,
    entity_type ENUM('driver', 'vehicle', 'route', 'organization') NOT NULL,
    entity_id CHAR(36),
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,4),
    metric_unit VARCHAR(50),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    INDEX idx_organization_id (organization_id),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_metric_name (metric_name),
    INDEX idx_period (period_start, period_end)
);

-- Insert default organization
INSERT INTO organizations (id, public_id, name, description, timezone, currency, country) 
VALUES (
    UUID(), 
    'default-org', 
    'Default Logistics Organization', 
    'Default organization for logistics operations',
    'Asia/Ho_Chi_Minh',
    'VND',
    'Vietnam'
) ON DUPLICATE KEY UPDATE name = name;

-- Insert default admin user
SET @org_id = (SELECT id FROM organizations WHERE public_id = 'default-org' LIMIT 1);
INSERT INTO users (id, public_id, organization_id, name, email, password, role, status) 
VALUES (
    UUID(), 
    'admin-user', 
    @org_id,
    'System Administrator', 
    'admin@logistics.app', 
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: password
    'admin',
    'active'
) ON DUPLICATE KEY UPDATE name = name;

-- Create indexes for better performance
CREATE INDEX idx_orders_location_status ON orders(pickup_latitude, pickup_longitude, delivery_latitude, delivery_longitude, status);
CREATE INDEX idx_tracking_events_composite ON tracking_events(order_id, event_type, occurred_at);
CREATE INDEX idx_routes_performance ON routes(organization_id, status, optimization_score, created_at);
CREATE INDEX idx_vehicles_location ON vehicles(organization_id, status, current_location(1));

-- Create views for common queries
CREATE OR REPLACE VIEW active_orders AS
SELECT 
    o.*,
    u.name as driver_name,
    v.name as vehicle_name,
    v.plate_number
FROM orders o
LEFT JOIN route_orders ro ON o.id = ro.order_id
LEFT JOIN routes r ON ro.route_id = r.id
LEFT JOIN users u ON r.driver_id = u.id
LEFT JOIN vehicles v ON r.vehicle_id = v.id
WHERE o.status IN ('pending', 'assigned', 'picked_up', 'in_transit')
AND o.deleted_at IS NULL;

CREATE OR REPLACE VIEW route_performance AS
SELECT 
    r.*,
    COUNT(ro.order_id) as total_orders,
    AVG(o.customer_rating) as avg_customer_rating,
    SUM(o.delivery_fee) as total_revenue,
    u.name as driver_name,
    v.name as vehicle_name
FROM routes r
LEFT JOIN route_orders ro ON r.id = ro.route_id
LEFT JOIN orders o ON ro.order_id = o.id
LEFT JOIN users u ON r.driver_id = u.id
LEFT JOIN vehicles v ON r.vehicle_id = v.id
WHERE r.deleted_at IS NULL
GROUP BY r.id;

-- Set up triggers for automatic updates
DELIMITER //

CREATE TRIGGER update_order_tracking AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
    IF OLD.status != NEW.status THEN
        INSERT INTO tracking_events (
            id, organization_id, order_id, event_type, event_status, 
            event_message, occurred_at
        ) VALUES (
            UUID(), NEW.organization_id, NEW.id, NEW.status, NEW.status,
            CONCAT('Order status changed from ', OLD.status, ' to ', NEW.status),
            NOW()
        );
    END IF;
END//

CREATE TRIGGER update_vehicle_location AFTER UPDATE ON vehicles
FOR EACH ROW
BEGIN
    IF OLD.current_location != NEW.current_location THEN
        SET NEW.last_location_update = NOW();
    END IF;
END//

DELIMITER ;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON fleetbase_logistics.* TO 'fleetbase_user'@'%';
GRANT CREATE, DROP, INDEX, ALTER ON fleetbase_logistics.* TO 'fleetbase_user'@'%';
FLUSH PRIVILEGES;
