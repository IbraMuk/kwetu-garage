/**
 * Migration 004 — Crée la table mechanics et ajoute phone / is_active à users.
 */
async function up(db) {
  // Ajouter phone et is_active à la table users si absents
  const userCols = await db.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'users' AND column_name IN ('phone', 'is_active')
  `);

  const existingCols = userCols.rows.map((r) => r.column_name);

  if (!existingCols.includes('phone')) {
    await db.query(`ALTER TABLE users ADD COLUMN phone VARCHAR(20)`);
  }

  if (!existingCols.includes('is_active')) {
    await db.query(`ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT true`);
  }

  // Ajouter le CHECK constraint sur role si absent
  const constraints = await db.query(`
    SELECT con.conname FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    WHERE rel.relname = 'users' AND con.contype = 'c'
  `);
  const hasRoleCheck = constraints.rows.some(
    (r) => r.conname === 'users_role_check'
  );
  if (!hasRoleCheck) {
    await db.query(`
      ALTER TABLE users ADD CONSTRAINT users_role_check
      CHECK (role IN ('admin', 'manager', 'mechanic', 'receptionist'))
    `);
  }

  // Créer la table mechanics si absente
  await db.query(`
    CREATE TABLE IF NOT EXISTS mechanics (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      speciality VARCHAR(100),
      hourly_rate DECIMAL(10,2),
      is_available BOOLEAN DEFAULT true,
      hire_date DATE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Trigger pour updated_at
  await db.query(`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $$ language 'plpgsql'
  `);

  const triggerExists = await db.query(`
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_mechanics_updated_at'
  `);
  if (triggerExists.rows.length === 0) {
    await db.query(`
      CREATE TRIGGER update_mechanics_updated_at
      BEFORE UPDATE ON mechanics
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `);
  }

  console.log('Migration 004: table mechanics créée, colonnes phone/is_active ajoutées à users.');
}

async function down(db) {
  await db.query('DROP TABLE IF EXISTS mechanics CASCADE');
}

module.exports = { up, down };
