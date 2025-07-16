import { pool } from '../../db.js'; 
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Interfaz para definir la estructura de un Cuaderno
export interface Cuaderno {
  id: number;
  user_id: string;
  title: string;
  content: string;
  created_at: Date;
}

// Interfaz para el resultado de la consulta
interface CuadernoRow extends Cuaderno, RowDataPacket {}

export class CuadernoModel {
  static async getAll({ userId }: { userId: string }): Promise<CuadernoRow[]> {
    const [rows] = await pool.execute<CuadernoRow[]>(
      'SELECT * FROM cuadernos WHERE user_id = ?',
      [userId]
    );
    return rows;
  }

  static async getById({ id, userId }: { id: number, userId: string }): Promise<CuadernoRow | undefined> {
    const [rows] = await pool.execute<CuadernoRow[]>(
      'SELECT * FROM cuadernos WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return rows[0];
  }

  static async create({ userId, title, content }: { userId: string, title: string, content: string }): Promise<Cuaderno> {
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO cuadernos (user_id, title, content) VALUES (?, ?, ?)',
      [userId, title, content]
    );
    return { id: result.insertId, user_id: userId, title, content, created_at: new Date() };
  }

  static async update({ id, userId, title, content }: { id: number, userId: string, title: string, content: string }): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      'UPDATE cuadernos SET title = ?, content = ? WHERE id = ? AND user_id = ?',
      [title, content, id, userId]
    );
    return result.affectedRows > 0;
  }

  static async delete({ id, userId }: { id: number, userId: string }): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM cuadernos WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return result.affectedRows > 0;
  }
}