-- ========================================
-- Script d'installation automatique
-- Base de données Kwetu Garage
-- ========================================

-- Création de la base de données si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'kwetu_garage') THEN
        CREATE DATABASE kwetu_garage;
        RAISE NOTICE 'Base de données kwetu_garage créée';
    ELSE
        RAISE NOTICE 'Base de données kwetu_garage existe déjà';
    END IF;
END
$$;

-- Connexion à la base de données (à exécuter manuellement ou via psql)
-- \c kwetu_garage;

-- Vérification de l'extension uuid-ossp
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'uuid-ossp') THEN
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        RAISE NOTICE 'Extension uuid-ossp créée';
    ELSE
        RAISE NOTICE 'Extension uuid-ossp existe déjà';
    END IF;
END
$$;

-- Message de préparation
RAISE NOTICE 'Préparation terminée. Exécutez maintenant:';
RAISE NOTICE '1. psql -d kwetu_garage -f schema.sql';
RAISE NOTICE '2. psql -d kwetu_garage -f seed.sql';
