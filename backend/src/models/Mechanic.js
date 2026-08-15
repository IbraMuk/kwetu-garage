const db = require('../config/database');

class Mechanic {
  static async create(data) {
    const {
      user_id,
      first_name,
      last_name,
      email,
      phone,
      speciality,
      hourly_rate,
      is_available = true,
      hire_date,
    } = data;

    const client = await db.connect();
    try {
      await client.query('BEGIN');

      let userId = user_id;

      if (!userId) {
        const bcrypt = require('bcryptjs');
        const defaultPassword = data.password || 'mechanic123';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(defaultPassword, salt);

        const userResult = await client.query(
          `INSERT INTO users (email, password_hash, first_name, last_name, role, phone, is_active)
           VALUES ($1, $2, $3, $4, 'mechanic', $5, true)
           RETURNING id`,
          [email, hashedPassword, first_name, last_name, phone || null]
        );
        userId = userResult.rows[0].id;
      }

      const result = await client.query(
        `INSERT INTO mechanics (user_id, speciality, hourly_rate, is_available, hire_date)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [userId, speciality || null, hourly_rate || null, is_available, hire_date || null]
      );

      await client.query('COMMIT');

      return await this.findById(result.rows[0].id);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  static async findById(id) {
    const query = `
      SELECT m.id, m.user_id, m.speciality, m.hourly_rate, m.is_available, m.hire_date,
             m.created_at, m.updated_at,
             u.first_name, u.last_name, u.email, u.phone, u.is_active, u.role
      FROM mechanics m
      JOIN users u ON m.user_id = u.id
      WHERE m.id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async findAll() {
    const query = `
      SELECT m.id, m.user_id, m.speciality, m.hourly_rate, m.is_available, m.hire_date,
             m.created_at, m.updated_at,
             u.first_name, u.last_name, u.email, u.phone, u.is_active, u.role,
             COUNT(r.id) AS repairs_count
      FROM mechanics m
      JOIN users u ON m.user_id = u.id
      LEFT JOIN repairs r ON r.mechanic_id = u.id
      GROUP BY m.id, u.id
      ORDER BY m.created_at DESC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  static async update(id, data) {
    const { speciality, hourly_rate, is_available, hire_date, phone, is_active } = data;

    const client = await db.connect();
    try {
      await client.query('BEGIN');

      const mechanic = await client.query('SELECT user_id FROM mechanics WHERE id = $1', [id]);
      if (mechanic.rows.length === 0) {
        await client.query('ROLLBACK');
        return null;
      }
      const userId = mechanic.rows[0].user_id;

      if (phone !== undefined || is_active !== undefined) {
        const setClauses = [];
        const values = [];
        let idx = 1;
        if (phone !== undefined) {
          setClauses.push(`phone = $${idx++}`);
          values.push(phone || null);
        }
        if (is_active !== undefined) {
          setClauses.push(`is_active = $${idx++}`);
          values.push(is_active);
        }
        if (setClauses.length > 0) {
          values.push(userId);
          await client.query(
            `UPDATE users SET ${setClauses.join(', ')} WHERE id = $${idx}`,
            values
          );
        }
      }

      const setClauses = [];
      const values = [];
      let idx = 1;
      if (speciality !== undefined) {
        setClauses.push(`speciality = $${idx++}`);
        values.push(speciality || null);
      }
      if (hourly_rate !== undefined) {
        setClauses.push(`hourly_rate = $${idx++}`);
        values.push(hourly_rate || null);
      }
      if (is_available !== undefined) {
        setClauses.push(`is_available = $${idx++}`);
        values.push(is_available);
      }
      if (hire_date !== undefined) {
        setClauses.push(`hire_date = $${idx++}`);
        values.push(hire_date || null);
      }

      if (setClauses.length > 0) {
        values.push(id);
        await client.query(
          `UPDATE mechanics SET ${setClauses.join(', ')} WHERE id = $${idx}`,
          values
        );
      }

      await client.query('COMMIT');
      return await this.findById(id);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  static async delete(id) {
    const client = await db.connect();
    try {
      await client.query('BEGIN');
      const mechanic = await client.query('SELECT user_id FROM mechanics WHERE id = $1', [id]);
      if (mechanic.rows.length === 0) {
        await client.query('ROLLBACK');
        return false;
      }
      await client.query('DELETE FROM mechanics WHERE id = $1', [id]);
      await client.query('DELETE FROM users WHERE id = $1', [mechanic.rows[0].user_id]);
      await client.query('COMMIT');
      return true;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}

module.exports = Mechanic;
