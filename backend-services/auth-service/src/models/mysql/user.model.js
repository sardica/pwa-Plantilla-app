import { pool } from '../../db.js'
import { v4 as uuidv4 } from 'uuid';

export class UserModel {
  static async create ({ name, email, password }) {
    const id = uuidv4();
    await pool.execute(
      'INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)',
      [id, name, email, password]
    )
    return id;
  }

  static async findByEmail ({ email }) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    )
    return rows[0]
  }

  static async findById ({ id }) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [id]
    )
    return rows[0]
  }
}