const db = require('../config/database');

class Order {
  static async create(orderData) {
    const { user_id, client_name, phone, address, items, total_amount, notes } = orderData;
    const client = await db.getClient();

    try {
      await client.query('BEGIN');

      const orderQuery = `
        INSERT INTO orders (user_id, client_name, phone, address, total_amount, notes)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;
      const orderResult = await client.query(orderQuery, [
        user_id,
        client_name,
        phone,
        address,
        total_amount,
        notes || null,
      ]);
      const order = orderResult.rows[0];

      const itemQuery = `
        INSERT INTO order_items (order_id, part_id, part_name, quantity, unit_price)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      for (const item of items) {
        await client.query(itemQuery, [
          order.id,
          item.part_id,
          item.part_name,
          item.quantity,
          item.unit_price,
        ]);
      }

      await client.query('COMMIT');
      return order;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async findAll(status = '') {
    let query = `
      SELECT o.*, 
        COALESCE(
          json_agg(
            json_build_object(
              'id', oi.id,
              'part_id', oi.part_id,
              'part_name', oi.part_name,
              'quantity', oi.quantity,
              'unit_price', oi.unit_price
            )
          ) FILTER (WHERE oi.id IS NOT NULL),
          '[]'
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
    `;
    let values = [];

    if (status) {
      query += ' WHERE o.status = $1';
      values.push(status);
    }

    query += ' GROUP BY o.id ORDER BY o.created_at DESC';
    const result = await db.query(query, values);
    return result.rows;
  }

  static async findByUserId(userId) {
    const query = `
      SELECT o.*, 
        COALESCE(
          json_agg(
            json_build_object(
              'id', oi.id,
              'part_id', oi.part_id,
              'part_name', oi.part_name,
              'quantity', oi.quantity,
              'unit_price', oi.unit_price
            )
          ) FILTER (WHERE oi.id IS NOT NULL),
          '[]'
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT o.*, 
        COALESCE(
          json_agg(
            json_build_object(
              'id', oi.id,
              'part_id', oi.part_id,
              'part_name', oi.part_name,
              'quantity', oi.quantity,
              'unit_price', oi.unit_price
            )
          ) FILTER (WHERE oi.id IS NOT NULL),
          '[]'
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.id = $1
      GROUP BY o.id
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async updateStatus(id, status) {
    const query = `
      UPDATE orders 
      SET status = $1
      WHERE id = $2
      RETURNING *
    `;
    const result = await db.query(query, [status, id]);
    return result.rows[0];
  }
}

module.exports = Order;
