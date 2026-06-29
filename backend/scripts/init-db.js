const fs = require('fs');
const path = require('path');
const { query } = require('../src/config/database');

async function initDb() {
  try {
    console.log('🔧 Vérification de la base de données...');

    const result = await query(
      "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users')"
    );
    const tablesExist = result.rows[0].exists;

    if (tablesExist) {
      console.log('✅ Les tables existent déjà, aucune initialisation nécessaire.');
      return;
    }

    console.log('⚙️ Initialisation des tables...');
    const initSql = fs.readFileSync(
      path.join(__dirname, '..', 'src', 'models', 'init.sql'),
      'utf8'
    );

    await query(initSql);
    console.log('✅ Base de données initialisée avec succès.');
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de la base de données:', error.message);
    throw error;
  }
}

module.exports = { initDb };

if (require.main === module) {
  initDb().catch(() => process.exit(1));
}
