# Base de données Kwetu Garage

Ce dossier contient les scripts SQL pour la création et l'initialisation de la base de données PostgreSQL pour le système de gestion de garage Kwetu Garage.

## 📁 Fichiers

- **`schema.sql`** - Schéma complet de la base de données avec tables, contraintes, indexes, triggers et vues
- **`seed.sql`** - Données de démonstration pour tester l'application
- **`README.md`** - Documentation (ce fichier)

## 🏗️ Architecture de la base de données

### Tables principales

#### Utilisateurs et Personnel
- **`users`** - Utilisateurs du système (employés)
- **`mechanics`** - Informations spécifiques aux mécaniciens

#### Gestion Clientèle
- **`clients`** - Informations sur les clients
- **`vehicles`** - Véhicules des clients

#### Opérations
- **`repairs`** - Réparations effectuées
- **`repair_parts`** - Pièces utilisées dans les réparations
- **`parts`** - Inventaire des pièces détachées
- **`invoices`** - Facturation
- **`invoice_parts`** - Ventes directes de pièces

#### Planification
- **`appointments`** - Rendez-vous

#### Historique
- **`vehicle_history`** - Historique complet des véhicules

### Vues utiles

- **`repair_details`** - Informations détaillées des réparations
- **`invoice_details`** - Informations détaillées des factures
- **`low_stock_parts`** - Pièces avec stock faible

## 🚀 Installation

### Prérequis

- PostgreSQL 12 ou supérieur
- Extension `uuid-ossp` activée

### Étapes

1. **Créer la base de données**
   ```sql
   CREATE DATABASE kwetu_garage;
   \c kwetu_garage;
   ```

2. **Exécuter le schéma**
   ```bash
   psql -d kwetu_garage -f schema.sql
   ```

3. **Insérer les données de démonstration**
   ```bash
   psql -d kwetu_garage -f seed.sql
   ```

## 👤 Utilisateurs de démo

| Email | Rôle | Mot de passe |
|-------|------|-------------|
| admin@kwetugarage.com | admin | password123 |
| mechanic1@kwetugarage.com | mécanicien | password123 |
| mechanic2@kwetugarage.com | mécanicien | password123 |
| receptionist@kwetugarage.com | réceptionniste | password123 |

## 📊 Statistiques des données de démo

- **6 clients** (4 particuliers, 2 professionnels)
- **8 véhicules** de différentes marques
- **15 pièces détachées** en stock
- **8 réparations** avec différents statuts
- **7 factures** (payées, en attente, en retard)
- **4 rendez-vous** planifiés
- **5 entrées d'historique** véhicule

## 🔧 Fonctionnalités avancées

### Triggers automatiques
- **Mise à jour des timestamps** `updated_at`
- **Génération automatique des numéros de facture**
- **Mise à jour automatique du stock** des pièces

### Contraintes de données
- **Clés étrangères** avec actions appropriées
- **CHECK constraints** pour validation des données
- **UNIQUE constraints** pour éviter les doublons

### Indexes optimisés
- Indexes sur les champs de recherche fréquents
- Indexes composites pour les requêtes complexes
- Indexes sur les clés étrangères

## 🔍 Requêtes utiles

### Voir les réparations en cours
```sql
SELECT * FROM repair_details WHERE status = 'in_progress';
```

### Voir les stocks faibles
```sql
SELECT * FROM low_stock_parts;
```

### Statistiques mensuelles
```sql
SELECT 
    DATE_TRUNC('month', created_at) as month,
    COUNT(*) as repair_count,
    SUM(total_cost) as total_revenue
FROM repairs 
WHERE status = 'completed'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;
```

### Historique d'un véhicule
```sql
SELECT * FROM vehicle_history 
WHERE vehicle_id = 'UUID_DU_VEHICULE'
ORDER BY performed_at DESC;
```

## 🛠️ Maintenance

### Sauvegarde
```bash
pg_dump -d kwetu_garage > backup_$(date +%Y%m%d).sql
```

### Restauration
```bash
psql -d kwetu_garage < backup_20240512.sql
```

### Nettoyage des données de test
```sql
-- Pour supprimer toutes les données de démo
TRUNCATE TABLE repair_parts, invoice_parts, appointments, vehicle_history, repairs, invoices, parts, vehicles, mechanics, clients, users RESTART IDENTITY CASCADE;
```

## 📝 Notes importantes

1. **Sécurité** : Les mots de passe sont hashés avec bcrypt
2. **Performance** : Les indexes sont optimisés pour les requêtes fréquentes
3. **Intégrité** : Contraintes d'intégrité référentielle strictes
4. **Audit** : Historique complet des modifications via les timestamps
5. **Scalabilité** : UUIDs pour éviter les conflits en multi-sites

## 🔄 Mises à jour

Pour mettre à jour le schéma :
1. Créer un script de migration
2. Tester sur un environnement de développement
3. Appliquer en production avec `BEGIN; ... COMMIT;`

## 📞 Support

Pour toute question sur la base de données, consulter la documentation ou contacter l'administrateur système.
