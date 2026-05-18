-- ========================================
-- Base de données Kwetu Garage
-- Système de gestion de garage automobile
-- ========================================

-- Création de la base de données
-- CREATE DATABASE kwetu_garage;
-- \c kwetu_garage;

-- Extension pour les UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- TABLES PRINCIPALES
-- ========================================

-- Table des utilisateurs (employés du garage)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'mechanic', 'receptionist')),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des clients
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    company_name VARCHAR(255),
    is_professional BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des véhicules
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM CURRENT_DATE) + 1),
    license_plate VARCHAR(20) UNIQUE NOT NULL,
    vin VARCHAR(17) UNIQUE,
    mileage INTEGER NOT NULL DEFAULT 0,
    fuel_type VARCHAR(50) CHECK (fuel_type IN ('essence', 'diesel', 'hybride', 'electrique', 'gpl')),
    transmission VARCHAR(50) CHECK (transmission IN ('manuelle', 'automatique', 'cvt')),
    color VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des mécaniciens
CREATE TABLE mechanics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    speciality VARCHAR(100),
    hourly_rate DECIMAL(10,2),
    is_available BOOLEAN DEFAULT true,
    hire_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des réparations
CREATE TABLE repairs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    mechanic_id UUID REFERENCES mechanics(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    diagnosis TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    estimated_hours DECIMAL(5,2),
    actual_hours DECIMAL(5,2),
    labor_cost DECIMAL(10,2),
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    total_cost DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des pièces détachées
CREATE TABLE parts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    reference VARCHAR(100) UNIQUE,
    description TEXT,
    category VARCHAR(100),
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    min_stock_level INTEGER NOT NULL DEFAULT 5 CHECK (min_stock_level >= 0),
    supplier VARCHAR(255),
    location VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table de liaison pièces-réparations
CREATE TABLE repair_parts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    repair_id UUID NOT NULL REFERENCES repairs(id) ON DELETE CASCADE,
    part_id UUID NOT NULL REFERENCES parts(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
    total_price DECIMAL(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(repair_id, part_id)
);

-- Table des factures
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
    repair_id UUID REFERENCES repairs(id) ON DELETE SET NULL,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE,
    subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
    tax_rate DECIMAL(5,2) DEFAULT 20.00 CHECK (tax_rate >= 0),
    tax_amount DECIMAL(10,2) GENERATED ALWAYS AS (subtotal * tax_rate / 100) STORED,
    total_amount DECIMAL(10,2) NOT NULL GENERATED ALWAYS AS (subtotal + tax_amount) STORED,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
    payment_method VARCHAR(50),
    payment_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des factures de pièces (ventes directes)
CREATE TABLE invoice_parts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    part_id UUID NOT NULL REFERENCES parts(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
    total_price DECIMAL(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(invoice_id, part_id)
);

-- ========================================
-- TABLES DE SUIVI ET HISTORIQUE
-- ========================================

-- Table des rendez-vous
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    mechanic_id UUID REFERENCES mechanics(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des historiques de véhicules
CREATE TABLE vehicle_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    repair_id UUID REFERENCES repairs(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    mileage_at_time INTEGER,
    cost DECIMAL(10,2),
    performed_by UUID REFERENCES users(id),
    performed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- INDEXES POUR LES PERFORMANCES
-- ========================================

-- Indexes pour les utilisateurs
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);

-- Indexes pour les clients
CREATE INDEX idx_clients_name ON clients(first_name, last_name);
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_phone ON clients(phone);
CREATE INDEX idx_clients_company ON clients(company_name);

-- Indexes pour les véhicules
CREATE INDEX idx_vehicles_client ON vehicles(client_id);
CREATE INDEX idx_vehicles_make_model ON vehicles(make, model);
CREATE INDEX idx_vehicles_license_plate ON vehicles(license_plate);
CREATE INDEX idx_vehicles_vin ON vehicles(vin);
CREATE INDEX idx_vehicles_year ON vehicles(year);

-- Indexes pour les réparations
CREATE INDEX idx_repairs_vehicle ON repairs(vehicle_id);
CREATE INDEX idx_repairs_mechanic ON repairs(mechanic_id);
CREATE INDEX idx_repairs_status ON repairs(status);
CREATE INDEX idx_repairs_date ON repairs(start_date);
CREATE INDEX idx_repairs_priority ON repairs(priority);

-- Indexes pour les pièces
CREATE INDEX idx_parts_name ON parts(name);
CREATE INDEX idx_parts_reference ON parts(reference);
CREATE INDEX idx_parts_category ON parts(category);
CREATE INDEX idx_parts_stock ON parts(stock_quantity);

-- Indexes pour les factures
CREATE INDEX idx_invoices_client ON invoices(client_id);
CREATE INDEX idx_invoices_repair ON invoices(repair_id);
CREATE INDEX idx_invoices_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_date ON invoices(issue_date);

-- Indexes pour les rendez-vous
CREATE INDEX idx_appointments_client ON appointments(client_id);
CREATE INDEX idx_appointments_vehicle ON appointments(vehicle_id);
CREATE INDEX idx_appointments_mechanic ON appointments(mechanic_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);

-- Indexes pour l'historique
CREATE INDEX idx_vehicle_history_vehicle ON vehicle_history(vehicle_id);
CREATE INDEX idx_vehicle_history_date ON vehicle_history(performed_at);

-- ========================================
-- TRIGGERS ET FONCTIONS
-- ========================================

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mechanics_updated_at BEFORE UPDATE ON mechanics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_repairs_updated_at BEFORE UPDATE ON repairs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_parts_updated_at BEFORE UPDATE ON parts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour générer automatiquement les numéros de facture
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
        NEW.invoice_number := 'FAC-' || TO_CHAR(CURRENT_DATE, 'YYYYMM') || '-' || 
                           LPAD((COALESCE(
                               (SELECT MAX(CAST(SUBSTRING(invoice_number FROM '\d+$') AS INTEGER)) 
                                FROM invoices 
                                WHERE invoice_number LIKE 'FAC-' || TO_CHAR(CURRENT_DATE, 'YYYYMM') || '-%'), 0) + 1)::TEXT, 4, '0');
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour générer les numéros de facture
CREATE TRIGGER generate_invoice_number_trigger BEFORE INSERT ON invoices FOR EACH ROW EXECUTE FUNCTION generate_invoice_number();

-- Fonction pour mettre à jour le stock des pièces
CREATE OR REPLACE FUNCTION update_part_stock()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE parts 
        SET stock_quantity = stock_quantity - NEW.quantity 
        WHERE id = NEW.part_id;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        UPDATE parts 
        SET stock_quantity = stock_quantity + OLD.quantity - NEW.quantity 
        WHERE id = NEW.part_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE parts 
        SET stock_quantity = stock_quantity + OLD.quantity 
        WHERE id = OLD.part_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour le stock
CREATE TRIGGER update_part_stock_trigger
    AFTER INSERT OR UPDATE OR DELETE ON repair_parts
    FOR EACH ROW EXECUTE FUNCTION update_part_stock();

-- ========================================
-- VUES UTILES
-- ========================================

-- Vue pour les réparations avec détails
CREATE VIEW repair_details AS
SELECT 
    r.id,
    r.description,
    r.status,
    r.priority,
    r.start_date,
    r.end_date,
    r.total_cost,
    v.make,
    v.model,
    v.year,
    v.license_plate,
    c.first_name AS client_first_name,
    c.last_name AS client_last_name,
    u.first_name AS mechanic_first_name,
    u.last_name AS mechanic_last_name,
    r.created_at
FROM repairs r
LEFT JOIN vehicles v ON r.vehicle_id = v.id
LEFT JOIN clients c ON v.client_id = c.id
LEFT JOIN mechanics m ON r.mechanic_id = m.id
LEFT JOIN users u ON m.user_id = u.id;

-- Vue pour les factures avec détails
CREATE VIEW invoice_details AS
SELECT 
    i.id,
    i.invoice_number,
    i.issue_date,
    i.due_date,
    i.total_amount,
    i.status,
    i.payment_method,
    i.payment_date,
    c.first_name AS client_first_name,
    c.last_name AS client_last_name,
    r.description AS repair_description,
    i.created_at
FROM invoices i
LEFT JOIN clients c ON i.client_id = c.id
LEFT JOIN repairs r ON i.repair_id = r.id;

-- Vue pour le stock faible
CREATE VIEW low_stock_parts AS
SELECT 
    id,
    name,
    reference,
    stock_quantity,
    min_stock_level,
    (min_stock_level - stock_quantity) AS shortage,
    price
FROM parts
WHERE stock_quantity <= min_stock_level
ORDER BY shortage DESC;

-- ========================================
-- COMMENTAIRES
-- ========================================

COMMENT ON DATABASE kwetu_garage IS 'Base de données pour le système de gestion de garage Kwetu Garage';

COMMENT ON TABLE users IS 'Utilisateurs du système (employés du garage)';
COMMENT ON TABLE clients IS 'Clients du garage';
COMMENT ON TABLE vehicles IS 'Véhicules des clients';
COMMENT ON TABLE mechanics IS 'Mécaniciens employés par le garage';
COMMENT ON TABLE repairs IS 'Réparations effectuées sur les véhicules';
COMMENT ON TABLE parts IS 'Pièces détachées en stock';
COMMENT ON TABLE repair_parts IS 'Pièces utilisées dans les réparations';
COMMENT ON TABLE invoices IS 'Factures émises aux clients';
COMMENT ON TABLE invoice_parts IS 'Pièces facturées séparément';
COMMENT ON TABLE appointments IS 'Rendez-vous des clients';
COMMENT ON TABLE vehicle_history IS 'Historique complet des véhicules';

-- ========================================
-- FIN DU SCHÉMA
-- ========================================
