#Requires -Version 5.1
<#
.SYNOPSIS
    Crée la base PostgreSQL kwetu_garage et applique schema.sql + seed.sql.

.DESCRIPTION
    Prérequis : PostgreSQL installé, `psql` dans le PATH.
    Définissez PGPASSWORD avant d'exécuter (mot de passe du rôle PostgreSQL) :
      $env:PGPASSWORD = "votre_mot_de_passe"
      .\install-kwetu-garage.ps1

    Option -Recreate : supprime tout le schéma public (DONNÉES PERDUES) puis recrée les tables.

.EXAMPLE
    $env:PGPASSWORD = "secret"
    .\install-kwetu-garage.ps1 -PgUser postgres
#>
param(
    [string]$PgUser = "postgres",
    [string]$PgHost = "localhost",
    [int]$PgPort = 5432,
    [string]$DbName = "kwetu_garage",
    [switch]$Recreate
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path

if (-not (Get-Command psql -ErrorAction SilentlyContinue)) {
    Write-Error "psql introuvable. Ajoutez le dossier bin de PostgreSQL au PATH (ex. C:\Program Files\PostgreSQL\16\bin)."
}

if (-not $env:PGPASSWORD) {
    Write-Host "Astuce : définissez PGPASSWORD pour éviter plusieurs invites :" -ForegroundColor Yellow
    Write-Host '  $env:PGPASSWORD = "mot_de_passe_du_role_' + $PgUser + '"' -ForegroundColor Cyan
}

$psqlBase = @("-h", $PgHost, "-p", "$PgPort", "-U", $PgUser, "-v", "ON_ERROR_STOP=1")

function Invoke-Psql {
    param([string[]]$ExtraArgs)
    & psql @psqlBase @ExtraArgs
    if ($LASTEXITCODE -ne 0) { throw "psql a échoué (code $LASTEXITCODE)." }
}

$exists = & psql @psqlBase -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname = '$DbName'" 2>$null
if (-not $exists) {
    Write-Host "Création de la base $DbName ..."
    Invoke-Psql @("-d", "postgres", "-c", "CREATE DATABASE `"$DbName`" ENCODING 'UTF8' TEMPLATE template0;")
}
else {
    Write-Host "La base $DbName existe déjà."
}

if ($Recreate) {
    Write-Host "Recreate : DROP SCHEMA public CASCADE + CREATE SCHEMA public ..." -ForegroundColor Magenta
    Invoke-Psql @(
        "-d", $DbName,
        "-c",
        "DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO public;"
    )
}

Write-Host "Application de schema.sql ..."
Invoke-Psql @("-d", $DbName, "-f", (Join-Path $Root "schema.sql"))

Write-Host "Application de seed.sql ..."
Invoke-Psql @("-d", $DbName, "-f", (Join-Path $Root "seed.sql"))

Write-Host ""
Write-Host "Installation terminée." -ForegroundColor Green
Write-Host "  - Base : $DbName"
Write-Host "  - Dans backend/.env : DB_NAME=$DbName (et DB_USER / DB_PASSWORD ou DATABASE_URL)"
Write-Host "  - Comptes démo : admin@kwetugarage.com / mechanic1@kwetugarage.com / manager@kwetugarage.com - mot de passe : password123"
Write-Host ""
