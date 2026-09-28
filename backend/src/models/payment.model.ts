/**
 * ============================================================================
 * MODELOS Y ESQUEMAS: SnailPay Payment Gateway
 * ============================================================================
 * Este archivo define:
 * 1. chargePaymentSchema: Esquema Zod para validar la carga de saldo desde el frontend.
 * 2. ChargePaymentDTO: Tipo TypeScript inferido automáticamente de la solicitud.
 * 3. SnailPayResponse: Interfaz con la estructura oficial de respuesta requerida por la prueba.
 * 4. PaymentStatus: Enum / Union con los posibles estados de la transacción.
 */

import { z } from 'zod';

/**
 * Estados posibles de una operación en SnailPay
 */
export type PaymentStatus = 'approved' | 'rejected' | 'error';

/**
 * Esquema de validación Zod para procesar una recarga en SnailPay
 */
export const chargePaymentSchema = z.object({
  card_number: z.string().trim().regex(/^\d{16}$/, 'El número de tarjeta debe contener exactamente 16 dígitos numéricos'),
  expiration_date: z.string().trim().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'La fecha de vencimiento debe tener el formato MM/YY (ej: 12/26)'),
  cvv: z.string().trim().regex(/^\d{3,4}$/, 'El código de seguridad CVV debe tener 3 o 4 dígitos'),
  full_name: z.string().trim().min(2, 'El nombre del titular es requerido y debe tener al menos 2 caracteres'),
  amount: z.number({ invalid_type_error: 'El monto debe ser un valor numérico' }).positive('El monto de la recarga debe ser una cantidad válida mayor a cero'),
  payer_id: z.string().trim().min(1, 'El identificador del usuario (payer_id) es obligatorio'),
  payer_email: z.string().trim().email('El correo del usuario (payer_email) debe tener un formato válido')
});

/**
 * DTO (Data Transfer Object) inferido para la petición de recarga
 */
export type ChargePaymentDTO = z.infer<typeof chargePaymentSchema>;

/**
 * Estructura estándar de respuesta de SnailPay según especificación técnica del PDF
 */
export interface SnailPayResponse {
  id: string;
  status: PaymentStatus;
  status_detail: string;
  transaction_amount: number;
  date_created: string;
  authorization_code: string | null;
  reference: string;
  payer_id: string;
  payer_email: string;
  card_number: string;
  cvv: string;
}
