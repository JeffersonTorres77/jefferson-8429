/**
 * ============================================================================
 * APLICACIÓN PRINCIPAL: Express App Configuration
 * ============================================================================
 * Configura la instancia de Express, middlewares globales (CORS, JSON Parser)
 * y monta las rutas de la API junto con el manejador centralizado de errores.
 */

import express, { Application } from 'express';
import cors from 'cors';
import { config } from './config';
import apiRouter from './routes';
import { errorHandler } from './middlewares/errorHandler';

const app: Application = express();

// Middlewares globales
app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir peticiones locales, mismo dominio, Postman o dominios de despliegue
      if (!origin || origin === config.clientOrigin || origin.endsWith('.vercel.app') || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);
app.use(express.json());

// Rutas de la API
app.use('/api', apiRouter);

// Middleware centralizado de errores (siempre al final de las rutas)
app.use(errorHandler);

export default app;
