import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

// CORRECCIÓN: Se añade el tipo 'AnyZodObject' al parámetro 'schema'.
export const validateSchema = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    // CORRECCIÓN: Se comprueba si el error es una instancia de ZodError
    // antes de acceder a sus propiedades para manejar el tipo 'unknown'.
    if (error instanceof ZodError) {
      return res.status(400).json(error.errors.map(err => err.message));
    }
    
    // Se manejan otros posibles errores inesperados.
    return res.status(500).json({ message: 'Internal server error' });
  }
};
