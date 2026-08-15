const { Pool } = require('pg');
require('dotenv').config();

const PLACEHOLDER_PASSWORD = 'votre_mot_de_passe';

function shouldUseSsl(url) {
  if (process.env.DATABASE_SSL === 'true') return true;
  if (process.env.DATABASE_SSL === 'false') return false;
  if (!url) return false;
  const lower = url.toLowerCase();
  if (lower.includes('?sslmode=require') || lower.includes('?sslmode=prefer')) return true;
  if (lower.includes('ssl=true')) return true;
  if (lower.includes('.supabase.co') || lower.includes('.supabase.in')) return true;
  if (lower.includes('.amazonaws.com') || lower.includes('.ondigitalocean.com')) return true;
  return false;
}

function validateDatabaseUrl(url) {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    if (!parsed.hostname || !parsed.username) return false;
    return true;
  } catch {
    return false;
  }
}

function buildPoolOptions() {
  const url = process.env.DATABASE_URL?.trim();
  if (url) {
    if (!validateDatabaseUrl(url)) {
      console.error('[database] DATABASE_URL est défini mais invalide. Valeur reçue (tronquée) :', url.substring(0, 30) + '...');
      console.error('[database] Format attendu : postgresql://user:password@host:5432/postgres');
      throw new Error(
        'DATABASE_URL invalide. Format attendu : postgresql://postgres.<ref>:<mdp>@aws-0-<region>.pooler.supabase.com:5432/postgres'
      );
    }
    const opts = {
      connectionString: url,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    };
    if (shouldUseSsl(url)) {
      opts.ssl = { rejectUnauthorized: false };
      console.log('[database] SSL activé pour DATABASE_URL (Supabase/Cloud).');
    } else {
      console.log('[database] SSL désactivé pour DATABASE_URL.');
    }
    return opts;
  }

  if (
    process.env.DB_PASSWORD === PLACEHOLDER_PASSWORD ||
    process.env.DB_PASSWORD === ''
  ) {
    console.warn(
      '[backend] DB_PASSWORD est vide ou encore le texte du .env.example — PostgreSQL refusera la connexion (28P01). ' +
        'Mettez le vrai mot de passe du rôle dans backend/.env, ou utilisez DATABASE_URL.',
    );
  }

  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10) || 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  };
}

const pool = new Pool(buildPoolOptions());

/**
 * @param {string} text
 * @param {unknown[]} [params]
 */
function isTimeoutOrTerminated(err) {
  const msg = (err && (err.message || err.toString())) || '';
  return (
    msg.includes('timeout') ||
    msg.includes('terminated') ||
    msg.includes('ECONNRESET') ||
    err && err.code === 'ETIMEDOUT'
  );
}

async function query(text, params) {
  try {
    return await pool.query(text, params);
  } catch (err) {
    if (err && err.code === '28P01') {
      const hint = new Error(
        'PostgreSQL : authentification refusée (code 28P01). ' +
          'Corrigez backend/.env : soit DATABASE_URL (chaîne complète postgres://...), ' +
          'soit DB_USER + DB_PASSWORD identiques à ceux qui fonctionnent dans pgAdmin. ' +
          'Redémarrez le serveur Node après modification.',
      );
      hint.code = '28P01';
      hint.cause = err;
      throw hint;
    }
    if (err && err.code === 'ECONNREFUSED') {
      const hint = new Error(
        'PostgreSQL : connexion refusée. Vérifiez que le service PostgreSQL est démarré et que DB_HOST / DB_PORT sont corrects.',
      );
      hint.code = 'ECONNREFUSED';
      hint.cause = err;
      throw hint;
    }
    if (err && err.code === '3D000') {
      const hint = new Error(
        `PostgreSQL : la base « ${process.env.DB_NAME} » n'existe pas. Créez-la (CREATE DATABASE ...) ou corrigez DB_NAME dans backend/.env.`,
      );
      hint.code = '3D000';
      hint.cause = err;
      throw hint;
    }
    if (isTimeoutOrTerminated(err)) {
      const hint = new Error(
        'PostgreSQL : connexion interrompue / timeout. ' +
          'Vérifiez : 1) DATABASE_URL est la chaîne Supabase Session pooler (port 5432), ' +
          '2) DATABASE_SSL=true est défini, ' +
          '3) le projet Supabase accepte les connexions depuis Render (Network > IPv4 autorisé), ' +
          '4) le mot de passe est correct.',
      );
      hint.cause = err;
      throw hint;
    }
    throw err;
  }
}

async function getClient() {
  return await pool.connect();
}

module.exports = {
  query,
  pool,
  getClient,
};
