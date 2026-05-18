const db = require('../config/database');

class Vehicle {
  static async create(vehicleData) {
    const { client_id, make, model, year, license_plate, vin, mileage = 0 } = vehicleData;
    const query = `
      INSERT INTO vehicles (client_id, make, model, year, license_plate, vin, mileage)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [client_id, make, model, year, license_plate, vin, mileage];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT v.*, c.first_name, c.last_name, c.email, c.phone
      FROM vehicles v
      JOIN clients c ON v.client_id = c.id
      WHERE v.id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async findByClientId(clientId) {
    const query = 'SELECT * FROM vehicles WHERE client_id = $1 ORDER BY created_at DESC';
    const result = await db.query(query, [clientId]);
    return result.rows;
  }

  static async findAll(search = '') {
    let query = `
      SELECT v.*, c.first_name, c.last_name
      FROM vehicles v
      JOIN clients c ON v.client_id = c.id
    `;
    let values = [];
    
    if (search) {
      query += ' WHERE v.make ILIKE $1 OR v.model ILIKE $1 OR v.license_plate ILIKE $1 OR c.first_name ILIKE $1 OR c.last_name ILIKE $1';
      values = [`%${search}%`];
    }
    
    query += ' ORDER BY v.created_at DESC';
    const result = await db.query(query, values);
    return result.rows;
  }

  static async update(id, vehicleData) {
    const { client_id, make, model, year, license_plate, vin, mileage } = vehicleData;
    const query = `
      UPDATE vehicles 
      SET client_id = $1, make = $2, model = $3, year = $4, license_plate = $5, vin = $6, mileage = $7
      WHERE id = $8
      RETURNING *
    `;
    const values = [client_id, make, model, year, license_plate, vin, mileage, id];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM vehicles WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rowCount > 0;
  }

  static async getRepairs(vehicleId) {
    const query = `
      SELECT r.*, u.first_name, u.last_name
      FROM repairs r
      LEFT JOIN users u ON r.mechanic_id = u.id
      WHERE r.vehicle_id = $1
      ORDER BY r.created_at DESC
    `;
    const result = await db.query(query, [vehicleId]);
    return result.rows;
  }

  static async updateMileage(id, mileage) {
    const query = 'UPDATE vehicles SET mileage = $1 WHERE id = $2 RETURNING *';
    const values = [mileage, id];
    const result = await db.query(query, values);
    return result.rows[0];
  }
}

module.exports = Vehicle;
