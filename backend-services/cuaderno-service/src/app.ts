import express from 'express';
import cookieParser from 'cookie-parser';
import cuadernosRoutes from './routes/cuadernos.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

// CORRECCIÓN: Se asegura que no haya prefijos de ruta aquí.
app.use(cuadernosRoutes); 

export default app;
