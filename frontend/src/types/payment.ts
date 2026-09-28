/**
 * Tipos e interfaces relacionados con la pasarela SnailPay y recargas.
 */

export type PaymentStatus = 'approved' | 'rejected' | 'error';

export interface ChargePaymentRequest {
  card_number: string;
  expiration_date: string;
  cvv: string;
  full_name: string;
  amount: number;
  payer_id: string;
  payer_email: string;
}

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

export interface TransactionRecord {
  id: string;
  amount: number;
  dateCreated: string;
  status: PaymentStatus;
  statusDetail: string;
  authorizationCode: string | null;
  reference: string;
  cardNumberMasked: string;
  rawCardNumber: string;
  rawCvv: string;
  payerEmail: string;
}

export interface TestScenarioPreset {
  name: string;
  description: string;
  expectedStatus: 'success' | 'warning' | 'danger';
  cardNumber: string;
  expirationDate: string;
  cvv: string;
  amount: number;
}
