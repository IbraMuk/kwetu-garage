@echo off
echo Configuration de la base de données E-Garage...

REM Vérifier si PostgreSQL est installé
psql --version >nul 2>&1
if errorlevel 1 (
    echo PostgreSQL n'est pas installé ou n'est pas dans le PATH
    echo Veuillez installer PostgreSQL et ajouter psql.exe à votre PATH
    pause
    exit /b 1
)

echo PostgreSQL détecté

REM Demander les informations de connexion
set /p db_user=Nom d'utilisateur PostgreSQL (defaut: postgres): 
if "%db_user%"=="" set db_user=postgres

set /p db_host=Hôte (defaut: localhost): 
if "%db_host%"=="" set db_host=localhost

set /p db_port=Port (defaut: 5432): 
if "%db_port%"=="" set db_port=5432

set /p db_password=Mot de passe: 

REM Création de la base de données
echo.
echo Création de la base de données e_garage...
set PGPASSWORD=%db_password%
psql -h %db_host% -p %db_port% -U %db_user% -c "CREATE DATABASE e_garage;" 2>nul
if errorlevel 1 (
    echo La base de données existe déjà ou erreur de création
) else (
    echo Base de données créée avec succès
)

REM Exécution du script de création
echo.
echo Création des tables...
psql -h %db_host% -p %db_port% -U %db_user% -d e_garage -f create-database.sql
if errorlevel 1 (
    echo Erreur lors de la création des tables
    pause
    exit /b 1
) else (
    echo Tables créées avec succès
)

REM Exécution du script de données d'exemple
echo.
echo Insertion des données d'exemple...
psql -h %db_host% -p %db_port% -U %db_user% -d e_garage -f insert-sample-data.sql
if errorlevel 1 (
    echo Erreur lors de l'insertion des données
    pause
    exit /b 1
) else (
    echo Données d'exemple insérées avec succès
)

echo.
echo Configuration terminée avec succès!
echo.
echo Utilisateur par défaut:
echo Email: admin@egarage.com
echo Mot de passe: password123
echo.
echo N'oubliez pas de mettre à jour votre fichier .env avec ces informations:
echo DB_HOST=%db_host%
echo DB_PORT=%db_port%
echo DB_NAME=e_garage
echo DB_USER=%db_user%
echo DB_PASSWORD=%db_password%
echo.
pause
