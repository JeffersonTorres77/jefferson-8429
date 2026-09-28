import { ChargePaymentRequest, SnailPayResponse, TestScenarioPreset } from '../types/payment';
import { apiClient } from './api';

export const TEST_SCENARIOS: TestScenarioPreset[] = [
  {
    name: 'Cobro Exitoso',
    description: 'Tarjeta oficial de pruebas autorizada con datos válidos.',
    expectedStatus: 'success',
    cardNumber: '1234123412341234',
    expirationDate: '12/26',
    cvv: '543',
    amount: 100
  },
  {
    name: 'Tarjeta Vencida',
    description: 'Simula una tarjeta con fecha de expiración caducada.',
    expectedStatus: 'warning',
    cardNumber: '1234123412341234',
    expirationDate: '01/20',
    cvv: '543',
    amount: 100
  },
  {
    name: 'CVV Incorrecto',
    description: 'Simula un código de seguridad erróneo (ej: 999).',
    expectedStatus: 'warning',
    cardNumber: '1234123412341234',
    expirationDate: '12/26',
    cvv: '999',
    amount: 100
  },
  {
    name: 'Tarjeta No Autorizada',
    description: 'Simula una tarjeta rechazada por la entidad emisora.',
    expectedStatus: 'warning',
    cardNumber: '4111111111111111',
    expirationDate: '12/26',
    cvv: '543',
    amount: 100
  },
  {
    name: 'Error de Sistema',
    description: 'Fuerza una caída simulada (500) en el procesador SnailPay.',
    expectedStatus: 'danger',
    cardNumber: '9999999999999999',
    expirationDate: '12/26',
    cvv: '543',
    amount: 100
  }
];

export const snailPayService = {
  /**
   * Envía una solicitud de recarga de saldo a la pasarela simulada SnailPay.
   * @param payload Datos de la tarjeta, titular y usuario
   * @param simulateSystemError Flag opcional para forzar simulación de error 500 vía header
   */
  async processCharge(
    payload: ChargePaymentRequest,
    simulateSystemError = false
  ): Promise<SnailPayResponse> {
    const headers: Record<string, string> = {};

    if (simulateSystemError) {
      headers['x-simulate-error'] = 'system_error';
    }

    return await apiClient<SnailPayResponse>('/api/snailpay/charge', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
  },

  /**
   * Retorna la lista de escenarios de prueba para evaluación rápida
   */
  getTestScenarios(): TestScenarioPreset[] {
    return TEST_SCENARIOS;
  },

  /**
   * Helper para formatear mensajes de error técnicos a mensajes legibles
   */
  formatErrorMessage(rawError: string): string {
    if (rawError.includes('cc_rejected_card_expired')) {
      return 'La tarjeta se encuentra vencida. Por favor verifique la fecha de expiración.';
    }
    if (rawError.includes('cc_rejected_card_disabled')) {
      return 'La tarjeta ha sido rechazada por el banco emisor (tarjeta no autorizada).';
    }
    if (rawError.includes('cc_rejected_bad_filled_date')) {
      return 'La fecha de vencimiento ingresada no coincide con los registros.';
    }
    if (rawError.includes('cc_rejected_bad_filled_security_code')) {
      return 'El código de seguridad CVV ingresado es incorrecto.';
    }
    if (rawError.includes('cc_rejected_insufficient_amount')) {
      return 'El monto solicitado excede el límite permitido por transacción ($50,000).';
    }
    if (rawError.includes('SnailPay Gateway Error')) {
      return 'Falla interna simulada en la pasarela SnailPay (Error 500). Intente más tarde.';
    }
    return rawError;
  }
};
