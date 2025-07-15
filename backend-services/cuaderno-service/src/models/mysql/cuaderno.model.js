import { pool } from '../../db.js'

export class CuadernoModel {
  static async getAll ({ userId }) {
    const [rows] = await pool.execute(
      'SELECT * FROM cuadernos WHERE user_id = ?',
      [userId]
    )
    return rows
  }

  static async getById ({ id, userId }) {
    const [rows] = await pool.execute(
      'SELECT * FROM cuadernos WHERE id = ? AND user_id = ?',
      [id, userId]
    )
    return rows[0]
  }

  static async create ({ userId, title, content }) {
    const [result] = await pool.execute(
      'INSERT INTO cuadernos (user_id, title, content) VALUES (?, ?, ?)',
      [userId, title, content]
    )
    return { id: result.insertId, title, content }
  }

  static async update ({ id, userId, title, content }) {
    const [result] = await pool.execute(
      'UPDATE cuadernos SET title = ?, content = ? WHERE id = ? AND user_id = ?',
      [title, content, id, userId]
    )
    return result.affectedRows > 0
  }

  static async delete ({ id, userId }) {
    const [result] = await pool.execute(
      'DELETE FROM cuadernos WHERE id = ? AND user_id = ?',
      [id, userId]
    )
    return result.affectedRows > 0
  }
}
