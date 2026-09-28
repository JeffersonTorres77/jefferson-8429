/**
 * ============================================================================
 * CONTROLADOR: SnailPay Payment Gateway Controller
 * ============================================================================
 * Este controlador procesa las peticiones HTTP para recargas de saldo:
 * 1. Recibe los datos validados del cuerpo de la petición (req.body).
 * 2. Detecta si se solicita simular un error del sistema vía headers.
 * 3. Invoca a snailPayService.processCharge para evaluar la transacción.
 * 4. Responde con el objeto SnailPayResponse y status 200 OK.
 * 5. Cualquier excepción es capturada y enviada al errorHandler centralizado.
 */

import { Request, Response, NextFunction } from 'express';
import { snailPayService } from '../services/snailPay.service';
import { ChargePaymentDTO } from '../models/payment.model';

export class SnailPayController {
  /**
   * Endpoint para procesar una recarga de saldo con SnailPay
   * POST /api/snailpay/charge
   */
  public async processCharge(req: Request<{}, {}, ChargePaymentDTO>, res: Response, next: NextFunction): Promise<void> {
    try {
      // Detecta simulación de error de sistema mediante el header personalizado
      const simulateSystemError = req.headers['x-simulate-error'] === 'system_error';

      const result = await snailPayService.processCharge(req.body, simulateSystemError);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const snailPayController = new SnailPayController();
