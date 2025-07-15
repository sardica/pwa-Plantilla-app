import { createPool } from 'mysql2/promise'

export const pool = createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'secret',
  database: process.env.DB_DATABASE || 'mydatabase',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})
