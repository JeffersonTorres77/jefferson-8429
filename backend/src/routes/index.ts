/**
 * ============================================================================
 * ENRUTADOR PRINCIPAL: API Routes
 * ============================================================================
 * Agrupa y expone todos los módulos de la API bajo el prefijo /api.
 */

import { Router } from 'express';
import snailPayRouter from './snailPay.routes';

const apiRouter = Router();

// Endpoint de verificación de estado del microservicio
apiRouter.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'snailpay-backend'
  });
});

// Rutas del servicio SnailPay: /api/snailpay/*
apiRouter.use('/snailpay', snailPayRouter);

export default apiRouter;
