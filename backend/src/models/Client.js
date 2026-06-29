const db = require('../config/database');

class Client {
  static async create(clientData) {
    const {
      first_name,
      last_name,
      email,
      phone,
      address,
      company_name,
      is_professional,
      notes,
    } = clientData;
    const query = `
      INSERT INTO clients (
        first_name, last_name, email, phone, address,
        company_name, is_professional, notes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const values = [
      first_name,
      last_name,
      email || null,
      phone || null,
      address || null,
      company_name || null,
      Boolean(is_professional),
      notes || null,
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM clients WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async findAll(search = '') {
    let query = 'SELECT * FROM clients';
    let values = [];
    
    if (search) {
      query +=
        ' WHERE first_name ILIKE $1 OR last_name ILIKE $1 OR email ILIKE $1 OR phone ILIKE $1 OR COALESCE(company_name, \'\') ILIKE $1';
      values = [`%${search}%`];
    }
    
    query += ' ORDER BY created_at DESC';
    const result = await db.query(query, values);
    return result.rows;
  }

  static async update(id, clientData) {
    const {
      first_name,
      last_name,
      email,
      phone,
      address,
      company_name,
      is_professional,
      notes,
    } = clientData;
    const query = `
      UPDATE clients 
      SET first_name = $1, last_name = $2, email = $3, phone = $4, address = $5,
          company_name = $6, is_professional = $7, notes = $8,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING *
    `;
    const values = [
      first_name,
      last_name,
      email || null,
      phone || null,
      address || null,
      company_name || null,
      Boolean(is_professional),
      notes || null,
      id,
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM clients WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rowCount > 0;
  }

  static async getVehicles(clientId) {
    const query = 'SELECT * FROM vehicles WHERE client_id = $1 ORDER BY created_at DESC';
    const result = await db.query(query, [clientId]);
    return result.rows;
  }

  static async getInvoices(clientId) {
    const query = `
      SELECT i.*, r.description as repair_description
      FROM invoices i
      LEFT JOIN repairs r ON i.repair_id = r.id
      WHERE i.client_id = $1
      ORDER BY i.created_at DESC
    `;
    const result = await db.query(query, [clientId]);
    return result.rows;
  }
}

module.exports = Client;
