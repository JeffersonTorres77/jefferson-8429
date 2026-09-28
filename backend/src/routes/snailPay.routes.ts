/**
 * ============================================================================
 * RUTAS: SnailPay Routes
 * ============================================================================
 * Define los endpoints para la pasarela de pagos simulada SnailPay.
 * Aplica el middleware de validación Zod (validate) antes de llamar al controlador.
 */

import { Router } from 'express';
import { snailPayController } from '../controllers/snailPay.controller';
import { validate } from '../middlewares/errorHandler';
import { chargePaymentSchema } from '../models/payment.model';

const snailPayRouter = Router();

/**
 * POST /api/snailpay/charge
 * Procesa una transacción de recarga con tarjeta
 */
snailPayRouter.post('/charge', validate(chargePaymentSchema), snailPayController.processCharge);

export default snailPayRouter;
