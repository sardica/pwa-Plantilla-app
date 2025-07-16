import { createPool } from 'mysql2/promise';

export const pool = createPool({
  // CORRECCIÓN: Se cambia 'localhost' por 'db', que es el nombre del
  // servicio de la base de datos en docker-compose.yml.
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'secret',
  database: process.env.DB_DATABASE || 'DidaktosDB',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});