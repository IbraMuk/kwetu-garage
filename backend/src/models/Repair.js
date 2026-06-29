const db = require('../config/database');

class Repair {
  static async create(repairData) {
    const {
      vehicle_id,
      mechanic_id,
      description,
      status = 'pending',
      start_date,
      total_cost = 0,
    } = repairData;
    const query = `
      INSERT INTO repairs (vehicle_id, mechanic_id, description, status, start_date, total_cost)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [vehicle_id, mechanic_id, description, status, start_date, total_cost];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT r.*, v.make, v.model, v.license_plate, 
             c.first_name as client_first_name, c.last_name as client_last_name,
             u.first_name as mechanic_first_name, u.last_name as mechanic_last_name
      FROM repairs r
      JOIN vehicles v ON r.vehicle_id = v.id
      JOIN clients c ON v.client_id = c.id
      LEFT JOIN users u ON r.mechanic_id = u.id
      WHERE r.id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async findAll(filters = {}) {
    let query = `
      SELECT r.*, v.make, v.model, v.license_plate, 
             c.first_name as client_first_name, c.last_name as client_last_name,
             u.first_name as mechanic_first_name, u.last_name as mechanic_last_name
      FROM repairs r
      JOIN vehicles v ON r.vehicle_id = v.id
      JOIN clients c ON v.client_id = c.id
      LEFT JOIN users u ON r.mechanic_id = u.id
    `;
    let values = [];
    let whereClauses = [];

    if (filters.status) {
      whereClauses.push(`r.status = $${values.length + 1}`);
      values.push(filters.status);
    }

    if (filters.mechanic_id) {
      whereClauses.push(`r.mechanic_id = $${values.length + 1}`);
      values.push(filters.mechanic_id);
    }

    if (filters.vehicle_id) {
      whereClauses.push(`r.vehicle_id = $${values.length + 1}`);
      values.push(filters.vehicle_id);
    }

    if (filters.client_id) {
      whereClauses.push(`v.client_id = $${values.length + 1}`);
      values.push(filters.client_id);
    }

    if (whereClauses.length > 0) {
      query += ' WHERE ' + whereClauses.join(' AND ');
    }

    query += ' ORDER BY r.created_at DESC';
    const result = await db.query(query, values);
    return result.rows;
  }

  static async update(id, repairData) {
    const { vehicle_id, mechanic_id, description, status, start_date, end_date, total_cost } = repairData;
    const query = `
      UPDATE repairs 
      SET vehicle_id = $1, mechanic_id = $2, description = $3, status = $4, 
          start_date = $5, end_date = $6, total_cost = $7
      WHERE id = $8
      RETURNING *
    `;
    const values = [vehicle_id, mechanic_id, description, status, start_date, end_date, total_cost, id];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM repairs WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rowCount > 0;
  }

  static async addPart(repairId, partId, quantity, unitPrice) {
    const query = `
      INSERT INTO repair_parts (repair_id, part_id, quantity, unit_price)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [repairId, partId, quantity, unitPrice];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async getParts(repairId) {
    const query = `
      SELECT rp.*, p.name, p.reference
      FROM repair_parts rp
      JOIN parts p ON rp.part_id = p.id
      WHERE rp.repair_id = $1
    `;
    const result = await db.query(query, [repairId]);
    return result.rows;
  }

  static async updateStatus(id, status) {
    const query = `
      UPDATE repairs 
      SET status = $1, 
          end_date = CASE WHEN $1 = 'completed' THEN CURRENT_TIMESTAMP ELSE end_date END
      WHERE id = $2
      RETURNING *
    `;
    const values = [status, id];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async getStats() {
    const query = `
      SELECT 
        COUNT(*) as total_repairs,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_repairs,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_repairs,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_repairs,
        AVG(CASE WHEN status = 'completed' AND end_date IS NOT NULL 
            THEN EXTRACT(EPOCH FROM (end_date - start_date))/3600 END) as avg_duration_hours
      FROM repairs
    `;
    const result = await db.query(query);
    return result.rows[0];
  }
}

module.exports = Repair;
