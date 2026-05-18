-- ========================================
-- Données de démonstration pour Kwetu Garage
-- ========================================

-- NOTE: Les mots de passe sont hashés avec bcrypt
-- admin@kwetugarage.com -> password123 (hash: $2b$10$rOzJqQjQjQjQjQjQjQjQu)
-- mechanic@kwetugarage.com -> password123 (hash: $2b$10$rOzJqQjQjQjQjQjQjQjQu)

-- ========================================
-- UTILISATEURS
-- ========================================

-- Administrateur
INSERT INTO users (id, email, password_hash, first_name, last_name, role, phone) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'admin@kwetugarage.com', '$2b$10$rOzJqQjQjQjQjQjQjQjQu', 'Admin', 'Kwetu', 'admin', '+221 77 123 45 67');

-- Mécaniciens
INSERT INTO users (id, email, password_hash, first_name, last_name, role, phone) VALUES 
('550e8400-e29b-41d4-a716-446655440002', 'mechanic1@kwetugarage.com', '$2b$10$rOzJqQjQjQjQjQjQjQjQu', 'Pierre', 'Ndiaye', 'mechanic', '+221 77 234 56 78'),
('550e8400-e29b-41d4-a716-446655440003', 'mechanic2@kwetugarage.com', '$2b$10$rOzJqQjQjQjQjQjQjQjQu', 'Marie', 'Fall', 'mechanic', '+221 77 345 67 89'),
('550e8400-e29b-41d4-a716-446655440004', 'receptionist@kwetugarage.com', '$2b$10$rOzJqQjQjQjQjQjQjQjQu', 'Aïssatou', 'Ba', 'receptionist', '+221 77 456 78 90');

-- ========================================
-- MÉCANICIENS (DÉTAILS)
-- ========================================

INSERT INTO mechanics (id, user_id, speciality, hourly_rate, is_available, hire_date) VALUES 
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'Moteur et transmission', 45.00, true, '2023-01-15'),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 'Carrosserie et peinture', 40.00, true, '2023-03-20');

-- ========================================
-- CLIENTS
-- ========================================

INSERT INTO clients (id, first_name, last_name, email, phone, address, is_professional, company_name) VALUES 
('770e8400-e29b-41d4-a716-446655440001', 'Mamadou', 'Diallo', 'mamadou.diallo@email.com', '+221 77 123 45 67', 'Rue 123, Dakar', false, NULL),
('770e8400-e29b-41d4-a716-446655440002', 'Fatou', 'Sarr', 'fatou.sarr@email.com', '+221 76 234 56 78', 'Avenue 456, Thiès', false, NULL),
('770e8400-e29b-41d4-a716-446655440003', 'Cheikh', 'Lo', 'cheikh.lo@email.com', '+221 78 345 67 89', 'Boulevard 789, Saint-Louis', false, NULL),
('770e8400-e29b-41d4-a716-446655440004', 'Aminata', 'Cissé', 'contact@transport-senegal.sn', '+221 33 456 78 90', 'Zone Industrielle, Diamniadio', true, 'Transport Sénégal SARL'),
('770e8400-e29b-41d4-a716-446655440005', 'Baba', 'Diop', 'baba.diop@email.com', '+221 77 567 89 01', 'Impasse 321, Kaolack', false, NULL),
('770e8400-e29b-41d4-a716-446655440006', 'Mariam', 'Sow', 'mariam.sow@email.com', '+221 76 678 90 12', 'Route 654, Mbour', false, NULL);

-- ========================================
-- VÉHICULES
-- ========================================

INSERT INTO vehicles (id, client_id, make, model, year, license_plate, vin, mileage, fuel_type, transmission, color) VALUES 
('880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'Toyota', 'Corolla', 2020, 'DK-1234-AB', '1HGBH41JXMN109186', 45000, 'essence', 'manuelle', 'Noir'),
('880e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', 'Peugeot', '208', 2022, 'DK-5678-CD', 'VF7CURHZC12345678', 25000, 'diesel', 'manuelle', 'Blanc'),
('880e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440003', 'Renault', 'Duster', 2021, 'DK-9012-EF', 'VF1HG2B58AH123456', 35000, 'diesel', 'automatique', 'Gris'),
('880e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440004', 'Mercedes', 'Sprinter', 2019, 'DK-3456-GH', 'WDB9061551P123456', 120000, 'diesel', 'automatique', 'Blanc'),
('880e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440005', 'Hyundai', 'Tucson', 2023, 'DK-7890-IJ', 'KM8J3CA4APU123456', 15000, 'hybride', 'automatique', 'Bleu'),
('880e8400-e29b-41d4-a716-446655440006', '770e8400-e29b-41d4-a716-446655440006', 'Nissan', 'Almera', 2020, 'DK-2345-KL', 'JN1BA17E3AM123456', 40000, 'essence', 'automatique', 'Rouge'),
('880e8400-e29b-41d4-a716-446655440007', '770e8400-e29b-41d4-a716-446655440001', 'Toyota', 'Hilux', 2021, 'DK-6789-MN', 'MR0BE9CDAP123456', 60000, 'diesel', 'manuelle', 'Noir'),
('880e8400-e29b-41d4-a716-446655440008', '770e8400-e29b-41d4-a716-446655440002', 'Volkswagen', 'Golf', 2022, 'DK-0123-OP', 'WVWZZZAUZNP123456', 20000, 'diesel', 'automatique', 'Gris');

-- ========================================
-- PIÈCES DÉTACHÉES
-- ========================================

INSERT INTO parts (id, name, reference, description, category, price, stock_quantity, min_stock_level, supplier, location) VALUES 
('990e8400-e29b-41d4-a716-446655440001', 'Filtre à huile', 'FO-001', 'Filtre à huile moteur standard', 'Filtres', 12.50, 50, 10, 'AutoParts SA', 'A1'),
('990e8400-e29b-41d4-a716-446655440002', 'Filtre à air', 'FA-002', 'Filtre à air moteur', 'Filtres', 8.75, 30, 15, 'AutoParts SA', 'A1'),
('990e8400-e29b-41d4-a716-446655440003', 'Bougie de préchauffage', 'BP-003', 'Bougie de préchauffage diesel', 'Allumage', 15.20, 25, 10, 'Diesel Expert', 'B2'),
('990e8400-e29b-41d4-a716-446655440004', 'Plaquette de frein avant', 'PF-004', 'Plaquettes de frein avant standard', 'Freinage', 35.00, 20, 8, 'Brembo Sénégal', 'C3'),
('990e8400-e29b-41d4-a716-446655440005', 'Disque de frein avant', 'DF-005', 'Disque de frein avant ventilé', 'Freinage', 45.50, 15, 5, 'Brembo Sénégal', 'C3'),
('990e8400-e29b-41d4-a716-446655440006', 'Huile moteur 5W30', 'HM-006', 'Huile moteur synthétique 5W30 5L', 'Lubrifiants', 28.90, 40, 20, 'Shell Sénégal', 'D1'),
('990e8400-e29b-41d4-a716-4466554407', 'Ampoule phare H4', 'AP-007', 'Ampoule phare H4 60/55W', 'Éclairage', 12.30, 60, 25, 'Philips Sénégal', 'E1'),
('990e8400-e29b-41d4-a716-446655440008', 'Batterie 12V 60Ah', 'BT-008', 'Batterie voiture 12V 60Ah', 'Électricité', 85.00, 10, 5, 'Bosch Sénégal', 'E2'),
('990e8400-e29b-41d4-a716-446655440009', 'Courroie de distribution', 'CD-009', 'Courroie de distribution standard', 'Distribution', 42.75, 8, 3, 'Gates Sénégal', 'F1'),
('990e8400-e29b-41d4-a716-446655440010', 'Kit d embrayage', 'KE-010', 'Kit d embrayage complet', 'Transmission', 125.00, 5, 2, 'Valeo Sénégal', 'F2'),
('990e8400-e29b-41d4-a716-446655440011', 'Amortisseur avant', 'AA-011', 'Amortisseur de suspension avant', 'Suspension', 65.50, 12, 6, 'Monroe Sénégal', 'G1'),
('990e8400-e29b-41d4-a716-446655440012', 'Joint de culasse', 'JC-012', 'Joint de culasse en multi-couches', 'Moteur', 95.00, 3, 2, 'Victor Reinz', 'F1'),
('990e8400-e29b-41d4-a716-446655440013', 'Capteur de pression', 'CP-013', 'Capteur de pression d huile', 'Capteurs', 35.75, 18, 8, 'Bosch Sénégal', 'H1'),
('990e8400-e29b-41d4-a716-446655440014', 'Essuie-glace avant', 'EG-014', 'Balai d essuie-glace avant 50cm', 'Accessoires', 18.50, 25, 10, 'Bosch Sénégal', 'I1'),
('990e8400-e29b-41d4-a716-446655440015', 'Radiateur aluminium', 'RA-015', 'Radiateur aluminium universel', 'Refroidissement', 145.00, 6, 3, 'Nissens Sénégal', 'J1');

-- ========================================
-- RÉPARATIONS
-- ========================================

INSERT INTO repairs (id, vehicle_id, mechanic_id, description, diagnosis, status, priority, estimated_hours, actual_hours, labor_cost, start_date, end_date, total_cost, notes) VALUES 
('A10e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Vidange et filtre', 'Vidange régulière nécessaire', 'completed', 'normal', 0.5, 0.5, 22.50, '2024-05-01 09:00:00', '2024-05-01 09:30:00', 51.40, 'Client satisfait'),
('A10e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 'Changement plaquettes frein avant', 'Usure normale des plaquettes', 'completed', 'normal', 1.0, 1.2, 48.00, '2024-05-03 14:00:00', '2024-05-03 15:12:00', 118.00, 'Freinage parfait après intervention'),
('A10e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001', 'Diagnostic moteur', 'Bruit suspect au démarrage', 'in_progress', 'high', 1.5, NULL, 67.50, '2024-05-10 08:30:00', NULL, 67.50, 'En attente de validation client'),
('A10e8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440002', 'Réparation climatisation', 'Climatisation ne fonctionne pas', 'completed', 'normal', 2.0, 2.5, 100.00, '2024-05-05 10:00:00', '2024-05-05 12:30:00', 145.00, 'Recharge gaz et contrôle fuites'),
('A10e8400-e29b-41d4-a716-446655440005', '880e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440001', 'Changement batterie', 'Batterie faible', 'completed', 'normal', 0.5, 0.75, 22.50, '2024-05-08 11:00:00', '2024-05-08 11:45:00', 107.50, 'Batterie garantie 2 ans'),
('A10e8400-e29b-41d4-a716-446655440006', '880e8400-e29b-41d4-a716-446655440006', NULL, 'Changement pneus', 'Usure pneus', 'pending', 'normal', 1.0, NULL, 40.00, NULL, NULL, 40.00, 'En attente de disponibilité pneus'),
('A10e8400-e29b-41d4-a716-446655440007', '880e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440002', 'Réparation suspension', 'Bruit suspension avant', 'completed', 'high', 2.5, 3.0, 125.00, '2024-05-06 09:00:00', '2024-05-06 12:00:00', 256.00, 'Changement amortisseurs avant'),
('A10e8400-e29b-41d4-a716-446655440008', '880e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440001', 'Contrôle technique', 'Contrôle technique annuel', 'pending', 'normal', 0.5, NULL, 22.50, '2024-05-15 14:00:00', NULL, 22.50, 'Rendez-vous pris');

-- ========================================
-- PIÈCES UTILISÉES DANS LES RÉPARATIONS
-- ========================================

INSERT INTO repair_parts (repair_id, part_id, quantity, unit_price) VALUES 
('A10e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440001', 1, 12.50), -- Filtre à huile
('A10e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440006', 1, 28.90), -- Huile moteur
('A10e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440004', 2, 35.00), -- Plaquettes frein avant
('A10e8400-e29b-41d4-a716-446655440005', '990e8400-e29b-41d4-a716-446655440008', 1, 85.00), -- Batterie
('A10e8400-e29b-41d4-a716-446655440007', '990e8400-e29b-41d4-a716-446655440011', 2, 65.50); -- Amortisseur avant

-- ========================================
-- FACTURES
-- ========================================

INSERT INTO invoices (id, client_id, repair_id, invoice_number, issue_date, due_date, subtotal, tax_rate, status, payment_method, payment_date, notes) VALUES 
('B20e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'A10e8400-e29b-41d4-a716-446655440001', 'FAC-202405-0001', '2024-05-01', '2024-05-15', 51.40, 20.00, 'paid', 'Carte bancaire', '2024-05-01', 'Paiement immédiat'),
('B20e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', 'A10e8400-e29b-41d4-a716-446655440002', 'FAC-202405-0002', '2024-05-03', '2024-05-17', 118.00, 20.00, 'paid', 'Espèces', '2024-05-03', 'Client régulier'),
('B20e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440003', 'A10e8400-e29b-41d4-a716-446655440003', 'FAC-202405-0003', '2024-05-10', '2024-05-24', 67.50, 20.00, 'pending', NULL, NULL, 'En attente de validation'),
('B20e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440004', 'A10e8400-e29b-41d4-a716-446655440004', 'FAC-202405-0004', '2024-05-05', '2024-05-19', 145.00, 20.00, 'paid', 'Virement bancaire', '2024-05-06', 'Entreprise'),
('B20e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440005', 'A10e8400-e29b-41d4-a716-446655440005', 'FAC-202405-0005', '2024-05-08', '2024-05-22', 107.50, 20.00, 'paid', 'Carte bancaire', '2024-05-08', 'Garantie batterie 2 ans'),
('B20e8400-e29b-41d4-a716-446655440006', '770e8400-e29b-41d4-a716-446655440007', 'A10e8400-e29b-41d4-a716-446655440007', 'FAC-202405-0006', '2024-05-06', '2024-05-20', 256.00, 20.00, 'overdue', NULL, NULL, 'Facture en retard'),
('B20e8400-e29b-41d4-a716-446655440007', '770e8400-e29b-41d4-a716-446655440006', 'A10e8400-e29b-41d4-a716-446655440006', 'FAC-202405-0007', '2024-05-15', '2024-05-29', 40.00, 20.00, 'pending', NULL, NULL, 'En attente pneus');

-- ========================================
-- RENDEZ-VOUS
-- ========================================

INSERT INTO appointments (id, client_id, vehicle_id, mechanic_id, title, description, appointment_date, duration_minutes, status, notes) VALUES 
('C30e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Vidange régulière', 'Vidange moteur et filtre', '2024-05-20 09:00:00', 30, 'scheduled', 'Client fidèle'),
('C30e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 'Contrôle climatisation', 'Climatisation faible', '2024-05-21 14:00:00', 60, 'scheduled', 'Diagnostic nécessaire'),
('C30e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440004', NULL, 'Entretien flotte', 'Entretien véhicules entreprise', '2024-05-22 08:00:00', 240, 'scheduled', '3 véhicules'),
('C30e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440005', '880e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440001', 'Changement pneus', 'Montage pneus neufs', '2024-05-23 10:00:00', 60, 'confirmed', 'Pneus en stock');

-- ========================================
-- HISTORIQUE DES VÉHICULES
-- ========================================

INSERT INTO vehicle_history (id, vehicle_id, repair_id, description, mileage_at_time, cost, performed_by, performed_at) VALUES 
('D40e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 'A10e8400-e29b-41d4-a716-446655440001', 'Vidange et filtre', 45000, 51.40, '550e8400-e29b-41d4-a716-446655440002', '2024-05-01 09:30:00'),
('D40e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440002', 'A10e8400-e29b-41d4-a716-446655440002', 'Changement plaquettes frein avant', 25000, 118.00, '550e8400-e29b-41d4-a716-446655440003', '2024-05-03 15:12:00'),
('D40e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440004', 'A10e8400-e29b-41d4-a716-446655440004', 'Réparation climatisation', 120000, 145.00, '550e8400-e29b-41d4-a716-446655440003', '2024-05-05 12:30:00'),
('D40e8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440005', 'A10e8400-e29b-41d4-a716-446655440005', 'Changement batterie', 15000, 107.50, '550e8400-e29b-41d4-a716-446655440002', '2024-05-08 11:45:00'),
('D40e8400-e29b-41d4-a716-446655440005', '880e8400-e29b-41d4-a716-446655440007', 'A10e8400-e29b-41d4-a716-446655440007', 'Réparation suspension avant', 60000, 256.00, '550e8400-e29b-41d4-a716-446655440003', '2024-05-06 12:00:00');

-- ========================================
-- MISE À JOUR DES STATISTIQUES
-- ========================================

-- Mettre à jour les totaux des réparations
UPDATE repairs SET total_cost = labor_cost + COALESCE((
    SELECT SUM(rp.quantity * rp.unit_price)
    FROM repair_parts rp
    WHERE rp.repair_id = repairs.id
), 0) WHERE total_cost IS NULL OR total_cost = 0;

-- Afficher les statistiques de chargement
DO $$
BEGIN
    RAISE NOTICE '=== Données de démonstration chargées avec succès ===';
    RAISE NOTICE 'Utilisateurs: %', (SELECT COUNT(*) FROM users);
    RAISE NOTICE 'Clients: %', (SELECT COUNT(*) FROM clients);
    RAISE NOTICE 'Véhicules: %', (SELECT COUNT(*) FROM vehicles);
    RAISE NOTICE 'Réparations: %', (SELECT COUNT(*) FROM repairs);
    RAISE NOTICE 'Pièces: %', (SELECT COUNT(*) FROM parts);
    RAISE NOTICE 'Factures: %', (SELECT COUNT(*) FROM invoices);
    RAISE NOTICE 'Rendez-vous: %', (SELECT COUNT(*) FROM appointments);
    RAISE NOTICE '================================================';
END $$;
