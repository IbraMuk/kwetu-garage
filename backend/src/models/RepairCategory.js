const db = require('../config/database');

class RepairCategory {
  static async findAll() {
    const query = `
      SELECT c.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', s.id,
              'category_id', s.category_id,
              'name', s.name
            )
          ) FILTER (WHERE s.id IS NOT NULL),
          '[]'
        ) as subcategories
      FROM repair_categories c
      LEFT JOIN repair_subcategories s ON c.id = s.category_id
      GROUP BY c.id
      ORDER BY c.display_order ASC, c.name ASC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT c.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', s.id,
              'category_id', s.category_id,
              'name', s.name
            )
          ) FILTER (WHERE s.id IS NOT NULL),
          '[]'
        ) as subcategories
      FROM repair_categories c
      LEFT JOIN repair_subcategories s ON c.id = s.category_id
      WHERE c.id = $1
      GROUP BY c.id
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async create(data) {
    const { name, icon, display_order = 0 } = data;
    const query = `
      INSERT INTO repair_categories (name, icon, display_order)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await db.query(query, [name, icon || null, display_order]);
    return result.rows[0];
  }

  static async createSubcategory(categoryId, name) {
    const query = `
      INSERT INTO repair_subcategories (category_id, name)
      VALUES ($1, $2)
      RETURNING *
    `;
    const result = await db.query(query, [categoryId, name]);
    return result.rows[0];
  }

  static async update(id, data) {
    const { name, icon, display_order } = data;
    const query = `
      UPDATE repair_categories
      SET name = COALESCE($1, name), icon = COALESCE($2, icon), display_order = COALESCE($3, display_order)
      WHERE id = $4
      RETURNING *
    `;
    const result = await db.query(query, [name, icon, display_order, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM repair_categories WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rowCount > 0;
  }

  static async deleteSubcategory(id) {
    const query = 'DELETE FROM repair_subcategories WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rowCount > 0;
  }
}

module.exports = RepairCategory;
