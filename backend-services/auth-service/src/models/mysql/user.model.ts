import { pool } from '../../db.js';
import { v4 as uuidv4 } from 'uuid';
import { RowDataPacket } from 'mysql2';

// Interfaz para definir la estructura de un usuario
// CORRECCIÓN: Nombres de propiedades en snake_case para coincidir con la BD
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  created_at: Date;
  email_verified: boolean;
  email_verification_token?: string | null;
  email_verification_expires?: number | null;
}

// Interfaz para el resultado de la consulta de la base de datos
interface UserRow extends User, RowDataPacket {}

// Tipo para los datos de creación de usuario
type UserCreationData = Omit<User, 'id' | 'created_at' | 'email_verified'>;

export class UserModel {
  // CORRECCIÓN: Parámetros desestructurados con snake_case
  static async create({ name, email, password, email_verification_token, email_verification_expires }: UserCreationData): Promise<string> {
    const id = uuidv4();
    await pool.execute(
      'INSERT INTO users (id, name, email, password, email_verification_token, email_verification_expires) VALUES (?, ?, ?, ?, ?, ?)',
      [id, name, email, password, email_verification_token, email_verification_expires]
    );
    return id;
  }

  static async findByEmail({ email }: { email: string }): Promise<UserRow | undefined> {
    const [rows] = await pool.execute<UserRow[]>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async findById({ id }: { id: string }): Promise<UserRow | undefined> {
    const [rows] = await pool.execute<UserRow[]>(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async findByVerificationToken({ token }: { token: string }): Promise<UserRow | undefined> {
    const [rows] = await pool.execute<UserRow[]>(
      'SELECT * FROM users WHERE email_verification_token = ?',
      [token]
    );
    return rows[0];
  }

  static async verifyEmail({ id }: { id: string }): Promise<void> {
    await pool.execute(
      'UPDATE users SET email_verified = TRUE, email_verification_token = NULL, email_verification_expires = NULL WHERE id = ?',
      [id]
    );
  }
}