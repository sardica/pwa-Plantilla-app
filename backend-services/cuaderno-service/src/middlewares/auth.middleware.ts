// backend-services/cuaderno-service/src/middlewares/auth.middleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';

// Extiende la interfaz global de Request para añadir la propiedad 'user'
declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

export const authRequired = (req: Request, res: Response, next: NextFunction) => {
  // CORRECCIÓN: Se busca el token en la cabecera 'Authorization' en lugar de las cookies.
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token format, authorization denied' });
  }

  // Se usa el JWT_SECRET del entorno, ¡asegúrate de que esté definido!
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error("JWT_SECRET no está definido en las variables de entorno.");
    return res.status(500).json({ message: 'Internal server error' });
  }

  jwt.verify(token, jwtSecret, (err: VerifyErrors | null, user: string | JwtPayload | undefined) => {
    if (err || typeof user !== 'object') {
      return res.status(403).json({ message: 'Invalid token' });
    }
    
    req.user = { id: (user as JwtPayload).id };
    next();
  });
};
