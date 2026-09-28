/**
 * ============================================================================
 * SERVICIO: SnailPay Payment Gateway Service
 * ============================================================================
 * Este servicio contiene la lógica de negocio pura para simular la pasarela de pagos.
 * Evalúa los datos recibidos y resuelve los 3 escenarios obligatorios:
 *
 * 1. Cobro Exitoso (200 OK):
 *    - Tarjeta: 1234123412341234, Vencimiento: 12/26, CVV: 543
 *    - Genera ID de transacción, código de autorización y marca de tiempo.
 *
 * 2. Error de Transacción (422 Unprocessable Entity):
 *    - Tarjeta deshabilitada, fecha vencida, CVV incorrecto o fondos insuficientes.
 *
 * 3. Error del Sistema (500 Internal Server Error):
 *    - Activado mediante tarjeta 9999999999999999 o simulación forzada.
 */

import { AppError } from '../middlewares/errorHandler';
import { ChargePaymentDTO, SnailPayResponse } from '../models/payment.model';

export class SnailPayService {
  /**
   * Datos requeridos por la especificación para el cobro exitoso
   */
  private static readonly SUCCESS_CARD = '1234123412341234';
  private static readonly SUCCESS_EXP = '12/26';
  private static readonly SUCCESS_CVV = '543';

  /**
   * Tarjeta especial para simular fallo interno del sistema SnailPay
   */
  private static readonly SYSTEM_ERROR_CARD = '9999999999999999';

  /**
   * Procesa la solicitud de recarga simulada en la pasarela
   * @param dto Datos validados de la tarjeta y la transacción
   * @param simulateSystemError Flag opcional para forzar simulación de error 500
   * @returns SnailPayResponse con el detalle completo de la operación aprobada
   */
  public async processCharge(
    dto: ChargePaymentDTO,
    simulateSystemError = false
  ): Promise<SnailPayResponse> {
    // ------------------------------------------------------------------------
    // ESCENARIO 3: Error del Sistema (Simulación de caída o indisponibilidad)
    // ------------------------------------------------------------------------
    if (simulateSystemError || dto.card_number === SnailPayService.SYSTEM_ERROR_CARD) {
      throw new AppError('SnailPay Gateway Error: Falla interna en el procesador de pagos. Intente más tarde.', 500);
    }

    // ------------------------------------------------------------------------
    // ESCENARIO 2: Errores de Transacción (Validación de reglas de negocio)
    // ------------------------------------------------------------------------

    // A. Validación de fecha de expiración
    if (this.isCardExpired(dto.expiration_date)) {
      throw new AppError('cc_rejected_card_expired: La tarjeta se encuentra vencida', 422);
    }

    // B. Validación de tarjeta de prueba autorizada
    if (dto.card_number !== SnailPayService.SUCCESS_CARD) {
      throw new AppError('cc_rejected_card_disabled: Número de tarjeta rechazado por la entidad emisora', 422);
    }

    // C. Validación de fecha exacta requerida para la tarjeta de prueba
    if (dto.expiration_date !== SnailPayService.SUCCESS_EXP) {
      throw new AppError('cc_rejected_bad_filled_date: La fecha de vencimiento no coincide con los registros', 422);
    }

    // D. Validación de código de seguridad CVV
    if (dto.cvv !== SnailPayService.SUCCESS_CVV) {
      throw new AppError('cc_rejected_bad_filled_security_code: Código de seguridad CVV inválido', 422);
    }

    // E. Simulación de límite de monto (ej: montos mayores a ,000)
    if (dto.amount > 50000) {
      throw new AppError('cc_rejected_insufficient_amount: El monto solicitado supera el límite autorizado por transacción', 422);
    }

    // ------------------------------------------------------------------------
    // ESCENARIO 1: Cobro Exitoso (Todos los datos coinciden con la prueba)
    // ------------------------------------------------------------------------
    const now = new Date();
    const timestamp = now.getTime();
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();

    const response: SnailPayResponse = {
      id: `txn_${timestamp}_${randomSuffix}`,
      status: 'approved',
      status_detail: 'Accredited: Transaction approved successfully',
      transaction_amount: dto.amount,
      date_created: now.toISOString(),
      authorization_code: `AUTH_${Math.floor(100000 + Math.random() * 900000)}`,
      reference: `REF_${timestamp}`,
      payer_id: dto.payer_id,
      payer_email: dto.payer_email,
      card_number: dto.card_number,
      cvv: dto.cvv
    };

    return response;
  }

  /**
   * Helper para comprobar si una fecha MM/YY ya expiró respecto a la fecha actual
   */
  private isCardExpired(expirationDate: string): boolean {
    const [monthStr, yearStr] = expirationDate.split('/');
    const expMonth = parseInt(monthStr, 10);
    const expYear = 2000 + parseInt(yearStr, 10);

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 1-12

    if (expYear < currentYear) {
      return true;
    }
    if (expYear === currentYear && expMonth < currentMonth) {
      return true;
    }

    return false;
  }
}

export const snailPayService = new SnailPayService();
