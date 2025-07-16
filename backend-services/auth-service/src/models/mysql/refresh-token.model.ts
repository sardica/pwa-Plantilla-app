import { pool } from '../../db.js';
import { RowDataPacket } from 'mysql2';

// Interfaz para definir la estructura de un Refresh Token
export interface RefreshToken {
  id: number;
  user_id: string;
  token: string;
  expires_at: Date;
  created_at: Date;
}

// Interfaz para el resultado de la consulta, extendiendo la principal y RowDataPacket
interface RefreshTokenRow extends RefreshToken, RowDataPacket {}

// Tipo para los datos necesarios al crear un token. Omitimos los campos autogenerados.
type RefreshTokenCreationData = Omit<RefreshToken, 'id' | 'created_at'>;


export class RefreshTokenModel {
  // CORRECCIÓN: Se añaden tipos explícitos a los parámetros desestructurados.
  static async create({ userId, token, expiresAt }: { userId: string, token: string, expiresAt: Date }): Promise<void> {
    await pool.execute(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
      [userId, token, expiresAt]
    );
  }

  // CORRECCIÓN: Se especifica el tipo de retorno de la consulta.
  static async findByToken({ token }: { token: string }): Promise<RefreshTokenRow | undefined> {
    const [rows] = await pool.execute<RefreshTokenRow[]>(
      'SELECT * FROM refresh_tokens WHERE token = ?',
      [token]
    );
    return rows[0];
  }

  static async delete({ token }: { token: string }): Promise<void> {
    await pool.execute(
      'DELETE FROM refresh_tokens WHERE token = ?',
      [token]
    );
  }
}
