const db = require('../config/database');

class Invoice {
  static async create(invoiceData) {
    const { client_id, repair_id, invoice_number, due_date, total_amount, status = 'pending' } = invoiceData;
    const query = `
      INSERT INTO invoices (client_id, repair_id, invoice_number, due_date, total_amount, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [client_id, repair_id, invoice_number, due_date, total_amount, status];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT i.*, c.first_name, c.last_name, c.email, c.phone,
             r.description as repair_description, v.make, v.model, v.license_plate
      FROM invoices i
      JOIN clients c ON i.client_id = c.id
      LEFT JOIN repairs r ON i.repair_id = r.id
      LEFT JOIN vehicles v ON r.vehicle_id = v.id
      WHERE i.id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async findAll(filters = {}) {
    let query = `
      SELECT i.*, c.first_name, c.last_name,
             r.description as repair_description
      FROM invoices i
      JOIN clients c ON i.client_id = c.id
      LEFT JOIN repairs r ON i.repair_id = r.id
    `;
    let values = [];
    let whereClauses = [];

    if (filters.status) {
      whereClauses.push(`i.status = $${values.length + 1}`);
      values.push(filters.status);
    }

    if (filters.client_id) {
      whereClauses.push(`i.client_id = $${values.length + 1}`);
      values.push(filters.client_id);
    }

    if (filters.date_from) {
      whereClauses.push(`i.issue_date >= $${values.length + 1}`);
      values.push(filters.date_from);
    }

    if (filters.date_to) {
      whereClauses.push(`i.issue_date <= $${values.length + 1}`);
      values.push(filters.date_to);
    }

    if (whereClauses.length > 0) {
      query += ' WHERE ' + whereClauses.join(' AND ');
    }

    query += ' ORDER BY i.created_at DESC';
    const result = await db.query(query, values);
    return result.rows;
  }

  static async update(id, invoiceData) {
    const { client_id, repair_id, due_date, total_amount, status } = invoiceData;
    const query = `
      UPDATE invoices 
      SET client_id = $1, repair_id = $2, due_date = $3, total_amount = $4, status = $5
      WHERE id = $6
      RETURNING *
    `;
    const values = [client_id, repair_id, due_date, total_amount, status, id];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM invoices WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rowCount > 0;
  }

  static async updateStatus(id, status) {
    const query = `
      UPDATE invoices 
      SET status = $1
      WHERE id = $2
      RETURNING *
    `;
    const values = [status, id];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async generateInvoiceNumber() {
    const query = `
      SELECT COUNT(*) as count 
      FROM invoices 
      WHERE DATE_TRUNC('year', created_at) = DATE_TRUNC('year', CURRENT_DATE)
    `;
    const result = await db.query(query);
    const count = parseInt(result.rows[0].count) + 1;
    const year = new Date().getFullYear();
    return `INV-${year}-${count.toString().padStart(4, '0')}`;
  }

  static async getUnpaidInvoices() {
    const query = `
      SELECT i.*, c.first_name, c.last_name, c.email,
             DATEDIFF('day', CURRENT_DATE, due_date) as days_overdue
      FROM invoices i
      JOIN clients c ON i.client_id = c.id
      WHERE i.status = 'pending' AND due_date < CURRENT_DATE
      ORDER BY due_date ASC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  static async getRevenueStats(period = 'month') {
    let dateFormat;
    switch (period) {
      case 'day':
        dateFormat = 'YYYY-MM-DD';
        break;
      case 'week':
        dateFormat = 'YYYY-"W"WW';
        break;
      case 'month':
        dateFormat = 'YYYY-MM';
        break;
      case 'year':
        dateFormat = 'YYYY';
        break;
      default:
        dateFormat = 'YYYY-MM';
    }

    const query = `
      SELECT 
        TO_CHAR(created_at, '${dateFormat}') as period,
        SUM(total_amount) as revenue,
        COUNT(*) as invoice_count
      FROM invoices
      WHERE status = 'paid'
      GROUP BY TO_CHAR(created_at, '${dateFormat}')
      ORDER BY period DESC
      LIMIT 12
    `;
    const result = await db.query(query);
    return result.rows;
  }

  static async getClientDebt(clientId) {
    const query = `
      SELECT COALESCE(SUM(total_amount), 0) as total_debt
      FROM invoices
      WHERE client_id = $1 AND status != 'paid'
    `;
    const result = await db.query(query, [clientId]);
    return parseFloat(result.rows[0].total_debt);
  }
}

module.exports = Invoice;
