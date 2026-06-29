#!/usr/bin/env bash
# Crée la base kwetu_garage et applique schema.sql + seed.sql (Linux / macOS / Git Bash)
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PGUSER="${PGUSER:-postgres}"
PGHOST="${PGHOST:-localhost}"
PGPORT="${PGPORT:-5432}"
DBNAME="${DBNAME:-kwetu_garage}"

if ! command -v psql >/dev/null 2>&1; then
  echo "psql introuvable. Installez PostgreSQL client." >&2
  exit 1
fi

export PGPASSWORD="${PGPASSWORD:-}"
if [[ -z "${PGPASSWORD}" ]]; then
  echo "Astuce: export PGPASSWORD='votre_mot_de_passe' avant de lancer ce script." >&2
fi

exists="$(psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='${DBNAME}'" || true)"
if [[ -z "${exists// /}" ]]; then
  echo "Création de la base ${DBNAME}..."
  psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d postgres -v ON_ERROR_STOP=1 -c "CREATE DATABASE \"${DBNAME}\" ENCODING 'UTF8' TEMPLATE template0;"
else
  echo "La base ${DBNAME} existe déjà."
fi

if [[ "${1:-}" == "--recreate" ]]; then
  echo "Recreate: DROP SCHEMA public CASCADE..."
  psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$DBNAME" -v ON_ERROR_STOP=1 -c \
    "DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO public;"
fi

echo "Application de schema.sql..."
psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$DBNAME" -v ON_ERROR_STOP=1 -f "$ROOT/schema.sql"
echo "Application de seed.sql..."
psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$DBNAME" -v ON_ERROR_STOP=1 -f "$ROOT/seed.sql"

echo "Terminé. DB_NAME=${DBNAME} dans backend/.env"
