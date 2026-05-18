# Configuration de la Base de Données PostgreSQL

Ce guide vous aide à configurer la base de données PostgreSQL pour l'application E-Garage.

## Prérequis

- PostgreSQL installé sur votre machine
- Accès à un utilisateur avec droits de création de base de données

## Méthode 1: Script Automatisé (Recommandé)

### Windows
1. Ouvrez une invite de commande dans le dossier `backend/scripts/`
2. Exécutez le script :
   ```cmd
   setup-database.bat
   ```
3. Suivez les instructions pour entrer vos informations de connexion

### Linux/Mac
1. Ouvrez un terminal dans le dossier `backend/scripts/`
2. Rendez le script exécutable :
   ```bash
   chmod +x setup-database.sh
   ```
3. Exécutez le script :
   ```bash
   ./setup-database.sh
   ```
4. Suivez les instructions pour entrer vos informations de connexion

## Méthode 2: Manuel

### 1. Créer la base de données
```sql
CREATE DATABASE e_garage;
```

### 2. Exécuter le script de création des tables
```bash
psql -h localhost -U postgres -d e_garage -f scripts/create-database.sql
```

### 3. Insérer les données d'exemple (optionnel)
```bash
psql -h localhost -U postgres -d e_garage -f scripts/insert-sample-data.sql
```

## Configuration de l'Application

1. Copiez le fichier `.env.example` vers `.env` :
   ```bash
   cp .env.example .env
   ```

2. Mettez à jour le fichier `.env` avec vos informations de base de données :
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=e_garage
   DB_USER=votre_utilisateur
   DB_PASSWORD=votre_mot_de_passe
   JWT_SECRET=votre_secret_jwt
   ```

## Compte par Défaut

Après l'insertion des données d'exemple, vous pouvez utiliser :

- **Email**: admin@egarage.com
- **Mot de passe**: password123

## Structure de la Base de Données

### Tables principales

- **users**: Utilisateurs de l'application (admin, mécaniciens, gestionnaires)
- **clients**: Informations sur les clients du garage
- **vehicles**: Véhicules des clients
- **repairs**: Réparations effectuées sur les véhicules
- **parts**: Pièces détachées en stock
- **repair_parts**: Liaison entre réparations et pièces utilisées
- **invoices**: Factures émises aux clients

### Fonctionnalités

- Génération automatique des numéros de facture
- Mise à jour automatique des timestamps (created_at, updated_at)
- Index pour optimiser les performances
- Contraintes d'intégrité référentielle

## Dépannage

### Erreur "La base de données existe déjà"
C'est normal si vous avez déjà exécuté le script. Le script continuera avec les tables existantes.

### Erreur de connexion
Vérifiez que :
- PostgreSQL est en cours d'exécution
- Les identifiants dans `.env` sont corrects
- L'utilisateur a les droits nécessaires sur la base de données

### Erreur "Extension uuid-ossp n'existe pas"
Exécutez cette commande en tant que superutilisateur PostgreSQL :
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

## Sauvegarde

Pour sauvegarder votre base de données :
```bash
pg_dump -h localhost -U postgres e_garage > backup.sql
```

Pour restaurer :
```bash
psql -h localhost -U postgres e_garage < backup.sql
```
