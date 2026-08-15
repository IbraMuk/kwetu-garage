const { query } = require('../../src/config/database');

async function migrate() {
  try {
    console.log('Migration 003: Ajout de client_id à la table repairs...');

    const colExists = await query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'repairs' AND column_name = 'client_id'
    `);

    if (colExists.rows.length === 0) {
      await query(`ALTER TABLE repairs ADD COLUMN client_id UUID REFERENCES clients(id) ON DELETE SET NULL;`);
      await query(`CREATE INDEX IF NOT EXISTS idx_repairs_client_id ON repairs(client_id);`);

      // Rétro-fill: assigner client_id depuis le véhicule associé
      await query(`
        UPDATE repairs r
        SET client_id = v.client_id
        FROM vehicles v
        WHERE r.vehicle_id = v.id AND r.client_id IS NULL
      `);
      console.log('  Colonne client_id ajoutée et rétro-remplie depuis les véhicules.');
    } else {
      console.log('  Colonne client_id déjà présente.');
    }

    console.log('✅ Migration 003 terminée.');
  } catch (error) {
    console.error('❌ Erreur migration 003:', error.message);
    process.exit(1);
  }
}

module.exports = migrate;

if (require.main === module) {
  migrate().then(() => process.exit(0));
}
