// backend-services/auth-service/src/config/env.ts

import 'dotenv/config';
import { z } from 'zod';

// Esquema de validación para las variables de entorno
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  PORT: z.coerce.number().default(8001),
  CORS_ORIGIN: z.string(),

  // Variables de la Base de Datos
  DB_HOST: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string(),
  DB_PORT: z.coerce.number().default(3306),

  // Variables de JWT
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRES_IN: z.string().default('15m'),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),

  // Variables de Email
  EMAIL_HOST: z.string(),
  EMAIL_PORT: z.coerce.number(),
  // CORRECCIÓN: Se transforma la variable de entorno a booleano de forma explícita.
  // Esto asegura que la cadena "false" se convierta en el booleano false.
  EMAIL_SECURE: z.preprocess((val) => val === 'true', z.boolean()),
  EMAIL_USER: z.string().optional(),
  EMAIL_PASS: z.string().optional(),
  EMAIL_FROM: z.string(),
});

// Se parsean las variables y se exportan
export const env = envSchema.parse(process.env);
