// backend-services/auth-service/src/routes/auth.routes.ts

import { Router } from 'express';
import {
  register,
  login,
  profile,
  logout,
  verifyToken,
  verifyEmail,
  refreshToken
} from '../controllers/auth.controller.js';
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import { authRequired } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', validateSchema(registerSchema), register);
router.post('/login', validateSchema(loginSchema), login);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);

// CORRECCIÓN: Se añade el middleware 'authRequired' a las rutas protegidas.
router.get('/profile', authRequired, profile);
router.get('/verify', authRequired, verifyToken);

router.get('/verify-email', verifyEmail);

export default router;
