-- ========================================
-- Requêtes SQL utiles pour Kwetu Garage
-- ========================================

-- ========================================
-- STATISTIQUES GLOBALES
-- ========================================

-- Chiffre d'affaires mensuel
SELECT 
    DATE_TRUNC('month', i.issue_date) as mois,
    COUNT(*) as nombre_factures,
    SUM(i.total_amount) as chiffre_affaires,
    AVG(i.total_amount) as panier_moyen
FROM invoices i
WHERE i.status = 'paid'
GROUP BY DATE_TRUNC('month', i.issue_date)
ORDER BY mois DESC
LIMIT 12;

-- Réparations par statut
SELECT 
    r.status,
    COUNT(*) as nombre,
    SUM(r.total_cost) as cout_total,
    AVG(r.total_cost) as cout_moyen
FROM repairs r
GROUP BY r.status
ORDER BY nombre DESC;

-- Pièces les plus vendues
SELECT 
    p.name,
    SUM(rp.quantity) as quantite_vendue,
    SUM(rp.total_price) as total_ventes
FROM parts p
JOIN repair_parts rp ON p.id = rp.part_id
GROUP BY p.id, p.name
ORDER BY quantite_vendue DESC
LIMIT 10;

-- ========================================
-- GESTION DES CLIENTS
-- ========================================

-- Top 10 des clients par chiffre d'affaires
SELECT 
    c.first_name || ' ' || c.last_name as client_nom,
    c.email,
    COUNT(i.id) as nombre_factures,
    SUM(i.total_amount) as total_depense,
    MAX(i.issue_date) as derniere_facture
FROM clients c
LEFT JOIN invoices i ON c.id = i.client_id
GROUP BY c.id, c.first_name, c.last_name, c.email
ORDER BY total_depense DESC NULLS LAST
LIMIT 10;

-- Clients avec véhicules multiples
SELECT 
    c.first_name || ' ' || c.last_name as client_nom,
    COUNT(v.id) as nombre_vehicules,
    STRING_AGG(v.make || ' ' || v.model, ', ') as vehicules
FROM clients c
LEFT JOIN vehicles v ON c.id = v.client_id
GROUP BY c.id, c.first_name, c.last_name
HAVING COUNT(v.id) > 1
ORDER BY nombre_vehicules DESC;

-- ========================================
-- GESTION DES VÉHICULES
-- ========================================

-- Véhicules les plus réparés
SELECT 
    v.make || ' ' || v.model as modele,
    v.license_plate,
    c.first_name || ' ' || c.last_name as proprietaire,
    COUNT(r.id) as nombre_reparations,
    SUM(r.total_cost) as total_reparations
FROM vehicles v
JOIN clients c ON v.client_id = c.id
LEFT JOIN repairs r ON v.id = r.vehicle_id
GROUP BY v.id, v.make, v.model, v.license_plate, c.first_name, c.last_name
ORDER BY nombre_reparations DESC
LIMIT 10;

-- Véhicules par marque
SELECT 
    v.make,
    COUNT(*) as nombre_vehicules,
    AVG(v.year) as annee_moyenne,
    AVG(v.mileage) as kilometrage_moyen
FROM vehicles v
GROUP BY v.make
ORDER BY nombre_vehicules DESC;

-- ========================================
-- GESTION DES RÉPARATIONS
-- ========================================

-- Réparations en cours
SELECT 
    r.id,
    r.description,
    r.priority,
    v.make || ' ' || v.model as vehicule,
    v.license_plate,
    c.first_name || ' ' || c.last_name as client,
    u.first_name || ' ' || u.last_name as mecanicien,
    r.start_date,
    r.estimated_hours,
    r.actual_hours
FROM repairs r
JOIN vehicles v ON r.vehicle_id = v.id
JOIN clients c ON v.client_id = c.id
LEFT JOIN mechanics m ON r.mechanic_id = m.id
LEFT JOIN users u ON m.user_id = u.id
WHERE r.status IN ('pending', 'in_progress')
ORDER BY r.priority DESC, r.start_date ASC;

-- Performance des mécaniciens
SELECT 
    u.first_name || ' ' || u.last_name as mecanicien,
    COUNT(r.id) as nombre_reparations,
    SUM(r.total_cost) as chiffre_affaires,
    AVG(r.actual_hours) as heures_moyennes,
    COUNT(CASE WHEN r.status = 'completed' THEN 1 END) as reparations_terminees
FROM mechanics m
JOIN users u ON m.user_id = u.id
LEFT JOIN repairs r ON m.id = r.mechanic_id
GROUP BY m.id, u.first_name, u.last_name
ORDER BY nombre_reparations DESC;

-- ========================================
-- GESTION DES STOCKS
-- ========================================

-- Pièces avec stock faible
SELECT 
    p.name,
    p.reference,
    p.stock_quantity,
    p.min_stock_level,
    (p.min_stock_level - p.stock_quantity) as shortage,
    p.price,
    (p.min_stock_level - p.stock_quantity) * p.price as valeur_manquante
FROM parts p
WHERE p.stock_quantity <= p.min_stock_level
ORDER BY shortage DESC;

-- Valeur du stock
SELECT 
    SUM(p.stock_quantity * p.price) as valeur_totale_stock,
    COUNT(*) as nombre_pieces_differentes,
    SUM(p.stock_quantity) as quantite_totale_pieces
FROM parts p;

-- Mouvements de stock (pièces utilisées)
SELECT 
    p.name,
    SUM(rp.quantity) as quantite_utilisee,
    SUM(rp.total_price) as valeur_utilisee,
    COUNT(DISTINCT rp.repair_id) as nombre_reparations
FROM parts p
JOIN repair_parts rp ON p.id = rp.part_id
WHERE rp.created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY p.id, p.name
ORDER BY quantite_utilisee DESC;

-- ========================================
-- GESTION FINANCIÈRE
-- ========================================

-- Factures en retard
SELECT 
    i.invoice_number,
    i.issue_date,
    i.due_date,
    i.total_amount,
    CURRENT_DATE - i.due_date as jours_retard,
    c.first_name || ' ' || c.last_name as client,
    c.phone
FROM invoices i
JOIN clients c ON i.client_id = c.id
WHERE i.status = 'overdue'
ORDER BY jours_retard DESC;

-- Situation encaissements
SELECT 
    i.status,
    COUNT(*) as nombre_factures,
    SUM(i.total_amount) as montant_total,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM invoices), 2) as pourcentage
FROM invoices i
GROUP BY i.status
ORDER BY montant_total DESC;

-- Revenus par type de service
SELECT 
    CASE 
        WHEN r.id IS NOT NULL THEN 'Réparations'
        ELSE 'Ventes de pièces'
    END as type_service,
    COUNT(*) as nombre_operations,
    SUM(COALESCE(i.total_amount, 0)) as revenus
FROM invoices i
LEFT JOIN repairs r ON i.repair_id = r.id
WHERE i.status = 'paid'
GROUP BY CASE WHEN r.id IS NOT NULL THEN 'Réparations' ELSE 'Ventes de pièces' END;

-- ========================================
-- RAPPORTS PÉRIODIQUES
-- ========================================

-- Rapport journalier
SELECT 
    DATE(i.created_at) as date,
    COUNT(*) as factures_emises,
    SUM(i.total_amount) as chiffre_affaires,
    COUNT(CASE WHEN i.status = 'paid' THEN 1 END) as factures_payees,
    SUM(CASE WHEN i.status = 'paid' THEN i.total_amount ELSE 0 END) as encaissements
FROM invoices i
WHERE i.created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY DATE(i.created_at)
ORDER BY date DESC;

-- Rapport mensuel détaillé
WITH mois_courant AS (
    SELECT DATE_TRUNC('month', CURRENT_DATE) as debut_mois,
        DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day' as fin_mois
)
SELECT 
    'Nouveau clients' as indicateur,
    COUNT(*) as valeur,
    COUNT(*) * 100.0 / LAG(COUNT(*)) OVER (ORDER BY DATE_TRUNC('month', created_at)) as croissance_pct
FROM clients 
WHERE created_at BETWEEN (SELECT debut_mois FROM mois_courant) AND (SELECT fin_mois FROM mois_courant)
UNION ALL
SELECT 
    'Réparations terminées',
    COUNT(*),
    COUNT(*) * 100.0 / LAG(COUNT(*)) OVER (ORDER BY DATE_TRUNC('month', end_date))
FROM repairs 
WHERE status = 'completed' 
    AND end_date BETWEEN (SELECT debut_mois FROM mois_courant) AND (SELECT fin_mois FROM mois_courant)
UNION ALL
SELECT 
    'Chiffre affaires',
    COALESCE(SUM(total_amount), 0),
    COALESCE(SUM(total_amount), 0) * 100.0 / LAG(SUM(total_amount)) OVER (ORDER BY DATE_TRUNC('month', issue_date))
FROM invoices 
WHERE status = 'paid' 
    AND issue_date BETWEEN (SELECT debut_mois FROM mois_courant) AND (SELECT fin_mois FROM mois_courant);

-- ========================================
-- RECHERCHES AVANCÉES
-- ========================================

-- Rechercher un véhicule par plaque ou VIN
SELECT 
    v.*,
    c.first_name || ' ' || c.last_name as proprietaire,
    c.phone,
    c.email
FROM vehicles v
JOIN clients c ON v.client_id = c.id
WHERE v.license_plate ILIKE '%PLAQUE%' 
   OR v.vin ILIKE '%VIN%';

-- Historique complet d'un véhicule
SELECT 
    vh.description,
    vh.performed_at,
    vh.cost,
    u.first_name || ' ' || u.last_name as effectue_par,
    CASE 
        WHEN vh.repair_id IS NOT NULL THEN 'Réparation'
        ELSE 'Autre'
    END as type_intervention
FROM vehicle_history vh
LEFT JOIN users u ON vh.performed_by = u.id
WHERE vh.vehicle_id = 'UUID_DU_VEHICULE'
ORDER BY vh.performed_at DESC;

-- Recherche de pièces par nom ou référence
SELECT 
    p.*,
    CASE 
        WHEN p.stock_quantity <= p.min_stock_level THEN 'Stock faible'
        ELSE 'En stock'
    END as statut_stock,
    p.stock_quantity * p.price as valeur_stock
FROM parts p
WHERE p.name ILIKE '%TERME_RECHERCHE%' 
   OR p.reference ILIKE '%TERME_RECHERCHE%'
ORDER BY p.name;
