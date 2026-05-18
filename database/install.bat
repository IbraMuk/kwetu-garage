@echo off
echo ========================================
echo Installation Base de donnees Kwetu Garage
echo ========================================
echo.

REM Vérifier si PostgreSQL est installé
psql --version >nul 2>&1
if errorlevel 1 (
    echo ERREUR: PostgreSQL n'est pas installe ou n'est pas dans le PATH
    echo Veuillez installer PostgreSQL et ajouter psql au PATH
    pause
    exit /b 1
)

echo PostgreSQL detecte. Installation en cours...
echo.

REM Créer la base de données
echo 1. Creation de la base de donnees...
psql -U postgres -c "CREATE DATABASE kwetu_garage;" 2>nul
if errorlevel 1 (
    echo La base de donnees existe deja ou erreur de creation
) else (
    echo Base de donnees kwetu_garage creee avec succes
)

REM Exécuter le schéma
echo.
echo 2. Creation du schema...
psql -U postgres -d kwetu_garage -f schema.sql
if errorlevel 1 (
    echo ERREUR lors de la creation du schema
    pause
    exit /b 1
) else (
    echo Schema cree avec succes
)

REM Insérer les données de démo
echo.
echo 3. Insertion des donnees de demonstration...
psql -U postgres -d kwetu_garage -f seed.sql
if errorlevel 1 (
    echo ERREUR lors de l'insertion des donnees
    pause
    exit /b 1
) else (
    echo Donnees inserees avec succes
)

echo.
echo ========================================
echo Installation terminee avec succes!
echo ========================================
echo.
echo Utilisateurs de demo:
echo   - admin@kwetugarage.com (mot de passe: password123)
echo   - mechanic1@kwetugarage.com (mot de passe: password123)
echo   - receptionist@kwetugarage.com (mot de passe: password123)
echo.
echo Base de donnees "kwetu_garage" prete a utiliser!
echo.
pause
