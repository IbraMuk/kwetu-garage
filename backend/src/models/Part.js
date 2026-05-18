const db = require('../config/database');

class Part {
  static async create(partData) {
    const { name, reference, description, price, stock_quantity = 0, min_stock_level = 5 } = partData;
    const query = `
      INSERT INTO parts (name, reference, description, price, stock_quantity, min_stock_level)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [name, reference, description, price, stock_quantity, min_stock_level];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM parts WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async findAll(search = '', lowStock = false) {
    let query = 'SELECT * FROM parts';
    let values = [];
    let whereClauses = [];

    if (search) {
      whereClauses.push(`(name ILIKE $${values.length + 1} OR reference ILIKE $${values.length + 1})`);
      values.push(`%${search}%`);
    }

    if (lowStock) {
      whereClauses.push(`stock_quantity <= min_stock_level`);
    }

    if (whereClauses.length > 0) {
      query += ' WHERE ' + whereClauses.join(' AND ');
    }

    query += ' ORDER BY name ASC';
    const result = await db.query(query, values);
    return result.rows;
  }

  static async update(id, partData) {
    const { name, reference, description, price, stock_quantity, min_stock_level } = partData;
    const query = `
      UPDATE parts 
      SET name = $1, reference = $2, description = $3, price = $4, 
          stock_quantity = $5, min_stock_level = $6
      WHERE id = $7
      RETURNING *
    `;
    const values = [name, reference, description, price, stock_quantity, min_stock_level, id];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM parts WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rowCount > 0;
  }

  static async updateStock(id, quantity) {
    const query = `
      UPDATE parts 
      SET stock_quantity = stock_quantity + $1
      WHERE id = $2
      RETURNING *
    `;
    const values = [quantity, id];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async getLowStockParts() {
    const query = `
      SELECT * FROM parts 
      WHERE stock_quantity <= min_stock_level 
      ORDER BY (stock_quantity - min_stock_level) ASC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  static async getUsageStats(partId) {
    const query = `
      SELECT 
        SUM(rp.quantity) as total_used,
        COUNT(DISTINCT rp.repair_id) as repairs_count,
        AVG(rp.unit_price) as avg_price
      FROM repair_parts rp
      WHERE rp.part_id = $1
      GROUP BY rp.part_id
    `;
    const result = await db.query(query, [partId]);
    return result.rows[0];
  }

  static async checkAvailability(id, neededQuantity) {
    const query = 'SELECT stock_quantity FROM parts WHERE id = $1';
    const result = await db.query(query, [id]);
    if (result.rows.length === 0) return false;
    return result.rows[0].stock_quantity >= neededQuantity;
  }
}

module.exports = Part;
