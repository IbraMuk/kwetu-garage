const { query } = require('../../src/config/database');

async function migrate() {
  try {
    console.log('Migration 002: Ajout de la table assistance_requests...');

    await query(`
      CREATE TABLE IF NOT EXISTS assistance_requests (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES users(id) ON DELETE SET NULL,
          client_name VARCHAR(200) NOT NULL,
          phone VARCHAR(20) NOT NULL,
          location TEXT NOT NULL,
          issue_type VARCHAR(50) NOT NULL,
          description TEXT,
          status VARCHAR(50) DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await query(`CREATE INDEX IF NOT EXISTS idx_assistance_user_id ON assistance_requests(user_id);`);
    await query(`CREATE INDEX IF NOT EXISTS idx_assistance_status ON assistance_requests(status);`);

    const triggerExists = await query(`
      SELECT 1 FROM pg_trigger WHERE tgname = 'update_assistance_requests_updated_at'
    `);
    if (triggerExists.rows.length === 0) {
      await query(`
        CREATE TRIGGER update_assistance_requests_updated_at
        BEFORE UPDATE ON assistance_requests
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column()
      `);
    }

    console.log('✅ Migration 002 terminée.');
  } catch (error) {
    console.error('❌ Erreur migration 002:', error.message);
    process.exit(1);
  }
}

migrate();
