#!/bin/bash

echo "Configuration de la base de données E-Garage..."

# Vérifier si PostgreSQL est installé
if ! command -v psql &> /dev/null; then
    echo "PostgreSQL n'est pas installé"
    echo "Veuillez installer PostgreSQL avant de continuer"
    exit 1
fi

echo "PostgreSQL détecté"

# Demander les informations de connexion
read -p "Nom d'utilisateur PostgreSQL (defaut: postgres): " db_user
db_user=${db_user:-postgres}

read -p "Hôte (defaut: localhost): " db_host
db_host=${db_host:-localhost}

read -p "Port (defaut: 5432): " db_port
db_port=${db_port:-5432}

read -s -p "Mot de passe: " db_password
echo

# Exporter le mot de passe pour psql
export PGPASSWORD=$db_password

# Création de la base de données
echo ""
echo "Création de la base de données e_garage..."
createdb -h $db_host -p $db_port -U $db_user e_garage 2>/dev/null
if [ $? -ne 0 ]; then
    echo "La base de données existe déjà ou erreur de création"
else
    echo "Base de données créée avec succès"
fi

# Exécution du script de création
echo ""
echo "Création des tables..."
psql -h $db_host -p $db_port -U $db_user -d e_garage -f create-database.sql
if [ $? -ne 0 ]; then
    echo "Erreur lors de la création des tables"
    exit 1
else
    echo "Tables créées avec succès"
fi

# Exécution du script de données d'exemple
echo ""
echo "Insertion des données d'exemple..."
psql -h $db_host -p $db_port -U $db_user -d e_garage -f insert-sample-data.sql
if [ $? -ne 0 ]; then
    echo "Erreur lors de l'insertion des données"
    exit 1
else
    echo "Données d'exemple insérées avec succès"
fi

echo ""
echo "Configuration terminée avec succès!"
echo ""
echo "Utilisateur par défaut:"
echo "Email: admin@egarage.com"
echo "Mot de passe: password123"
echo ""
echo "N'oubliez pas de mettre à jour votre fichier .env avec ces informations:"
echo "DB_HOST=$db_host"
echo "DB_PORT=$db_port"
echo "DB_NAME=e_garage"
echo "DB_USER=$db_user"
echo "DB_PASSWORD=$db_password"
echo ""

# Nettoyer le mot de passe
unset PGPASSWORD
