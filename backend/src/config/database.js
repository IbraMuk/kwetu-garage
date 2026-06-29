const { Pool } = require('pg');
require('dotenv').config();

const PLACEHOLDER_PASSWORD = 'votre_mot_de_passe';

function buildPoolOptions() {
  const url = process.env.DATABASE_URL?.trim();
  if (url) {
    const opts = {
      connectionString: url,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    };
    if (process.env.DATABASE_SSL === 'true') {
      opts.ssl = { rejectUnauthorized: false };
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
    connectionTimeoutMillis: 5000,
  };
}

const pool = new Pool(buildPoolOptions());

/**
 * @param {string} text
 * @param {unknown[]} [params]
 */
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
    throw err;
  }
}

module.exports = {
  query,
  pool,
};
