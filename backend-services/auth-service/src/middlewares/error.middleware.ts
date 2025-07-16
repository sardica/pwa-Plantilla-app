import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger.js';

// Interfaz para definir una estructura básica para los errores HTTP
// Esto permite acceder a `statusCode` y `stack` de forma segura.
interface HttpError extends Error {
  statusCode?: number;
}

// CORRECCIÓN: Se añaden tipos explícitos a todos los parámetros del middleware.
// El comentario eslint-disable-next-line ya no es necesario con el tipado correcto.
const errorHandler = (err: HttpError, req: Request, res: Response, next: NextFunction) => {
  // Aseguramos que err.stack exista, ya que es opcional en el tipo Error.
  logger.error(err.stack || err.toString());

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorHandler;