-- Données d'exemple pour la base de données E-Garage

-- Insertion d'utilisateurs (mot de passe: password123 pour tous)
INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES
('admin@egarage.com', '$2b$10$rQZ8ZKqKqKqKqKqKqKqKqO', 'Admin', 'User', 'admin'),
('mechanic1@egarage.com', '$2b$10$rQZ8ZKqKqKqKqKqKqKqKqO', 'Jean', 'Dupont', 'mechanic'),
('mechanic2@egarage.com', '$2b$10$rQZ8ZKqKqKqKqKqKqKqKqO', 'Marie', 'Martin', 'mechanic'),
('manager@egarage.com', '$2b$10$rQZ8ZKqKqKqKqKqKqKqKqO', 'Pierre', 'Durand', 'manager');

-- Insertion de clients
INSERT INTO clients (first_name, last_name, email, phone, address) VALUES
('Sophie', 'Petit', 'sophie.petit@email.com', '06 12 34 56 78', '15 Rue de la Paix, 75001 Paris'),
('Thomas', 'Bernard', 'thomas.bernard@email.com', '06 23 45 67 89', '22 Avenue des Champs-Élysées, 75008 Paris'),
('Claire', 'Dubois', 'claire.dubois@email.com', '06 34 56 78 90', '123 Boulevard Haussmann, 75009 Paris'),
('Nicolas', 'Leroy', 'nicolas.leroy@email.com', '06 45 67 89 01', '5 Place de la Concorde, 75008 Paris'),
('Isabelle', 'Moreau', 'isabelle.moreau@email.com', '06 56 78 90 12', '33 Rue Montorgueil, 75002 Paris'),
('David', 'Laurent', 'david.laurent@email.com', '06 67 89 01 23', '17 Rue de Rivoli, 75004 Paris'),
('Camille', 'Simon', 'camille.simon@email.com', '06 78 90 12 34', '89 Avenue Kléber, 75116 Paris'),
('François', 'Michel', 'francois.michel@email.com', '06 89 01 23 45', '45 Rue de la Tour, 75116 Paris');

-- Insertion de véhicules
INSERT INTO vehicles (client_id, make, model, year, license_plate, vin, mileage) VALUES
(1, 'Peugeot', '208', 2020, 'AB-123-CD', 'VF7ABC12345678901', 45000),
(1, 'Renault', 'Clio', 2019, 'EF-456-GH', 'VF1DEF12345678901', 62000),
(2, 'Citroën', 'C3', 2021, 'IJ-789-KL', 'VF7GHI12345678901', 28000),
(3, 'Volkswagen', 'Golf', 2018, 'MN-012-OP', 'WVWZZZ12345678901', 78000),
(4, 'BMW', 'Série 3', 2022, 'QR-345-ST', 'WBAJK12345678901', 15000),
(5, 'Mercedes', 'Classe A', 2020, 'UV-678-WX', 'WDDJK12345678901', 38000),
(6, 'Audi', 'A4', 2019, 'YZ-901-AB', 'WAUZZZ12345678901', 55000),
(7, 'Toyota', 'Yaris', 2021, 'CD-234-EF', 'JTDKB12345678901', 22000),
(8, 'Ford', 'Focus', 2018, 'GH-567-IJ', 'WF0JK12345678901', 68000);

-- Insertion de pièces
INSERT INTO parts (name, reference, description, price, stock_quantity, min_stock_level) VALUES
('Plaquettes de frein avant', 'PF-208-2020', 'Plaquettes de frein pour Peugeot 208', 45.99, 20, 5),
('Filtre à huile', 'FO-UNIV-01', 'Filtre à huile universel', 12.50, 50, 10),
('Batterie 12V', 'BT-12V-60', 'Batterie 12V 60Ah', 89.99, 15, 3),
('Pneu 205/55R16', 'PN-205-55-16', 'Pneu été 205/55R16', 75.00, 40, 8),
('Amortisseur avant', 'AM-GOLF-18', 'Amortisseur avant VW Golf', 65.50, 12, 4),
('Disque de frein', 'DF-CLIO-19', 'Disque de frein Renault Clio', 35.99, 25, 5),
('Bougie de préchauffage', 'BP-DW10', 'Bougie de préchauffage moteur DW10', 18.99, 30, 6),
('Courroie de distribution', 'CD-UNIV-01', 'Courroie de distribution universelle', 55.00, 10, 2),
('Liquide de frein', 'LF-DOT4', 'Liquide de frein DOT4 1L', 15.99, 60, 15),
('Filtre à air', 'FA-208-20', 'Filtre à air Peugeot 208', 8.99, 40, 10),
('Essuie-glace avant', 'EG-UNIV-01', 'Balai d''essuie-glace avant universel', 22.50, 30, 5),
('Kit d''embrayage', 'KE-CLIO-19', 'Kit d''embrayage Renault Clio', 125.00, 8, 2);

-- Insertion de réparations
INSERT INTO repairs (vehicle_id, mechanic_id, description, status, start_date, end_date, total_cost) VALUES
(1, 2, 'Changement des plaquettes de frein avant', 'completed', '2024-01-15 09:00:00', '2024-01-15 11:30:00', 150.00),
(2, 2, 'Vidange et filtre', 'completed', '2024-01-16 14:00:00', '2024-01-16 15:30:00', 80.00),
(3, 3, 'Changement batterie', 'completed', '2024-01-17 10:00:00', '2024-01-17 10:45:00', 120.00),
(4, 2, 'Changement pneus avant', 'in_progress', '2024-01-18 09:00:00', NULL, 200.00),
(5, 3, 'Révision annuelle', 'pending', NULL, NULL, 250.00),
(6, 2, 'Changement amortisseurs avant', 'completed', '2024-01-10 08:30:00', '2024-01-10 12:00:00', 180.00),
(7, 3, 'Diagnostic moteur', 'completed', '2024-01-12 14:00:00', '2024-01-12 15:00:00', 60.00),
(8, 2, 'Changement courroie distribution', 'completed', '2024-01-08 09:00:00', '2024-01-08 16:00:00', 350.00),
(9, 3, 'Changement disques frein', 'in_progress', '2024-01-19 08:00:00', NULL, 140.00),
(1, 2, 'Contrôle technique', 'pending', NULL, NULL, 90.00);

-- Insertion des pièces utilisées dans les réparations
INSERT INTO repair_parts (repair_id, part_id, quantity, unit_price) VALUES
(1, 1, 2, 45.99),
(2, 2, 1, 12.50),
(3, 3, 1, 89.99),
(4, 4, 2, 75.00),
(6, 5, 2, 65.50),
(7, 10, 1, 8.99),
(8, 7, 4, 18.99),
(8, 8, 1, 55.00),
(9, 6, 2, 35.99);

-- Insertion de factures
INSERT INTO invoices (client_id, repair_id, due_date, total_amount, status) VALUES
(1, 1, '2024-02-15', 150.00, 'paid'),
(1, 2, '2024-02-16', 80.00, 'paid'),
(2, 3, '2024-02-17', 120.00, 'paid'),
(3, 4, '2024-02-18', 200.00, 'pending'),
(4, 5, '2024-02-19', 250.00, 'pending'),
(2, 6, '2024-01-25', 180.00, 'paid'),
(3, 7, '2024-01-27', 60.00, 'paid'),
(4, 8, '2024-01-30', 350.00, 'overdue'),
(5, 9, '2024-02-20', 140.00, 'pending');
