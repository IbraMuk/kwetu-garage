const { query } = require('../../src/config/database');

async function migrate() {
  try {
    console.log('Migration 001: Ajout des tables orders et order_items...');

    await query(`
      CREATE TABLE IF NOT EXISTS orders (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES users(id) ON DELETE SET NULL,
          client_name VARCHAR(200) NOT NULL,
          phone VARCHAR(20) NOT NULL,
          address TEXT NOT NULL,
          status VARCHAR(50) DEFAULT 'pending',
          total_amount DECIMAL(10,2) NOT NULL,
          notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS order_items (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
          part_id UUID REFERENCES parts(id) ON DELETE SET NULL,
          part_name VARCHAR(255) NOT NULL,
          quantity INTEGER NOT NULL,
          unit_price DECIMAL(10,2) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await query(`CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);`);
    await query(`CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);`);
    await query(`CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);`);

    const triggerExists = await query(`
      SELECT 1 FROM pg_trigger WHERE tgname = 'update_orders_updated_at'
    `);
    if (triggerExists.rows.length === 0) {
      await query(`
        CREATE TRIGGER update_orders_updated_at
        BEFORE UPDATE ON orders
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column()
      `);
    }

    console.log('✅ Migration 001 terminée.');
  } catch (error) {
    console.error('❌ Erreur migration 001:', error.message);
    process.exit(1);
  }
}

migrate();
