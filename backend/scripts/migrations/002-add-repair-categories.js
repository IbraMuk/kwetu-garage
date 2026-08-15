const { query } = require('../../src/config/database');

async function migrate() {
  try {
    console.log('Migration 002: Ajout des catégories de réparations...');

    await query(`
      CREATE TABLE IF NOT EXISTS repair_categories (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name VARCHAR(100) NOT NULL,
          icon VARCHAR(50),
          display_order INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS repair_subcategories (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          category_id UUID NOT NULL REFERENCES repair_categories(id) ON DELETE CASCADE,
          name VARCHAR(200) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await query(`CREATE INDEX IF NOT EXISTS idx_repair_subcategories_category_id ON repair_subcategories(category_id);`);

    const categoryColExists = await query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'repairs' AND column_name = 'category_id'
    `);

    if (categoryColExists.rows.length === 0) {
      await query(`ALTER TABLE repairs ADD COLUMN category_id UUID REFERENCES repair_categories(id) ON DELETE SET NULL;`);
      await query(`ALTER TABLE repairs ADD COLUMN subcategory_id UUID REFERENCES repair_subcategories(id) ON DELETE SET NULL;`);
      await query(`CREATE INDEX IF NOT EXISTS idx_repairs_category_id ON repairs(category_id);`);
    }

    const triggerExists = await query(`
      SELECT 1 FROM pg_trigger WHERE tgname = 'update_repair_categories_updated_at'
    `);
    if (triggerExists.rows.length === 0) {
      await query(`CREATE TRIGGER update_repair_categories_updated_at BEFORE UPDATE ON repair_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();`);
      await query(`CREATE TRIGGER update_repair_subcategories_updated_at BEFORE UPDATE ON repair_subcategories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();`);
    }

    const seedCount = await query(`SELECT COUNT(*) as count FROM repair_categories`);
    if (parseInt(seedCount.rows[0].count) === 0) {
      console.log('  Insertion des catégories de référence...');

      const categories = [
        { name: 'Mécanique générale', icon: 'build', order: 1, subcategories: [
          'Vidange moteur et remplacement filtres',
          'Remplacement courroie de distribution',
          'Réparation du système de freinage (plaquettes, disques, tambours)',
          'Suspension et amortisseurs',
          'Transmission et embrayage',
          'Réparation du système d\'échappement',
        ]},
        { name: 'Électricité et électronique', icon: 'flash', order: 2, subcategories: [
          'Diagnostic électronique (valise OBD)',
          'Batterie et alternateur',
          'Démarreur',
          'Système d\'éclairage (phares, clignotants, feux arrière)',
          'Capteurs et calculateurs (ABS, airbag, injection)',
          'Système multimédia et GPS',
        ]},
        { name: 'Carrosserie et peinture', icon: 'color-palette', order: 3, subcategories: [
          'Débosselage sans peinture',
          'Réparation de chocs et tôlerie',
          'Peinture complète ou partielle',
          'Polissage et lustrage',
          'Remplacement pare-chocs, portières, capot',
        ]},
        { name: 'Entretien courant', icon: 'construct', order: 4, subcategories: [
          'Contrôle technique et inspection périodique',
          'Remplacement pneus et équilibrage',
          'Géométrie et parallélisme',
          'Recharge climatisation',
          'Nettoyage moteur et habitacle',
        ]},
        { name: 'Réparations spécialisées', icon: 'settings', order: 5, subcategories: [
          'Système de refroidissement (radiateur, pompe à eau)',
          'Injection et carburateurs',
          'Turbo et systèmes de suralimentation',
          'Boîte de vitesses (manuelle/automatique)',
          'Réparation du système de direction assistée',
        ]},
        { name: 'Sécurité et confort', icon: 'shield-checkmark', order: 6, subcategories: [
          'Airbags et ceintures de sécurité',
          'Vitres électriques et serrures',
          'Climatisation et chauffage',
          'Sièges et garnitures intérieures',
        ]},
      ];

      for (const cat of categories) {
        const catResult = await query(
          `INSERT INTO repair_categories (name, icon, display_order) VALUES ($1, $2, $3) RETURNING id`,
          [cat.name, cat.icon, cat.order]
        );
        const catId = catResult.rows[0].id;
        for (const subName of cat.subcategories) {
          await query(
            `INSERT INTO repair_subcategories (category_id, name) VALUES ($1, $2)`,
            [catId, subName]
          );
        }
      }
      console.log('  Catégories de référence insérées.');
    }

    console.log('✅ Migration 002 terminée.');
  } catch (error) {
    console.error('❌ Erreur migration 002:', error.message);
    process.exit(1);
  }
}

module.exports = migrate;

if (require.main === module) {
  migrate().then(() => process.exit(0));
}
