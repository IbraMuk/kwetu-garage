const db = require('../config/database');

class Assistance {
  static async create(assistanceData) {
    const { user_id, client_name, phone, location, issue_type, description } = assistanceData;
    const query = `
      INSERT INTO assistance_requests (user_id, client_name, phone, location, issue_type, description)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [user_id, client_name, phone, location, issue_type, description || null];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findAll(status = '') {
    let query = 'SELECT * FROM assistance_requests';
    let values = [];

    if (status) {
      query += ' WHERE status = $1';
      values.push(status);
    }

    query += ' ORDER BY created_at DESC';
    const result = await db.query(query, values);
    return result.rows;
  }

  static async findByUserId(userId) {
    const query = `
      SELECT * FROM assistance_requests
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM assistance_requests WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async updateStatus(id, status) {
    const query = `
      UPDATE assistance_requests 
      SET status = $1
      WHERE id = $2
      RETURNING *
    `;
    const result = await db.query(query, [status, id]);
    return result.rows[0];
  }
}

module.exports = Assistance;
