import express from 'express';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import authRoutes from './routes/auth.routes.js';
import errorHandler from './middlewares/error.middleware.js';

const app = express();

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, 
	standardHeaders: true,
	legacyHeaders: false, 
});

app.use(limiter);
app.use(express.json());
app.use(cookieParser());
app.set('trust proxy', 1);

// CORRECCIÓN: Se elimina el prefijo '/api/auth'. 
// Nginx ya se encarga del enrutamiento basado en ese prefijo.
app.use(authRoutes);

app.use(errorHandler);
 
export default app;
