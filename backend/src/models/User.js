const db = require('../config/database');

class User {
  static async create(userData) {
    const { email, password, first_name, last_name, role = 'mechanic' } = userData;
    const query = `
      INSERT INTO users (email, password_hash, first_name, last_name, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, email, first_name, last_name, role, created_at
    `;
    const values = [email, password, first_name, last_name, role];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await db.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT id, email, first_name, last_name, role, created_at FROM users WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async update(id, userData) {
    const { first_name, last_name, email, role } = userData;
    const query = `
      UPDATE users 
      SET first_name = $1, last_name = $2, email = $3, role = $4
      WHERE id = $5
      RETURNING id, email, first_name, last_name, role, updated_at
    `;
    const values = [first_name, last_name, email, role, id];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rowCount > 0;
  }

  static async findAll() {
    const query = 'SELECT id, email, first_name, last_name, role, created_at FROM users ORDER BY created_at DESC';
    const result = await db.query(query);
    return result.rows;
  }
}

module.exports = User;
