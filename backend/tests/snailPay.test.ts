/**
 * ============================================================================
 * PRUEBAS AUTOMATIZADAS: SnailPay API Integration Tests
 * ============================================================================
 * Suite de pruebas con Jest y Supertest para validar todos los escenarios:
 * 1. Health check del servidor.
 * 2. Cobro exitoso (200 OK) según especificaciones del PDF.
 * 3. Errores de validación de esquema Zod (400 Bad Request con formato { error: true, msg }).
 * 4. Errores de transacción de negocio (422 Unprocessable Entity con formato { error: true, msg }).
 * 5. Error del sistema simulado (500 Internal Server Error).
 */

import request from 'supertest';
import app from '../src/app';

describe('SnailPay API - Integration Tests', () => {
  // Payload base válido para pruebas
  const validPaymentPayload = {
    card_number: '1234123412341234',
    expiration_date: '12/26',
    cvv: '543',
    full_name: 'Jefferson Torres',
    amount: 150.5,
    payer_id: 'usr_test_123',
    payer_email: 'jefferson@example.com'
  };

  // --------------------------------------------------------------------------
  // 1. Health Check
  // --------------------------------------------------------------------------
  describe('GET /api/health', () => {
    it('debe responder 200 OK con el estado del servicio', async () => {
      const response = await request(app).get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('service', 'snailpay-backend');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  // --------------------------------------------------------------------------
  // 2. Escenario 1: Cobro Exitoso (200 OK)
  // --------------------------------------------------------------------------
  describe('POST /api/snailpay/charge - Cobro Exitoso', () => {
    it('debe procesar exitosamente la recarga con los datos de prueba requeridos', async () => {
      const response = await request(app)
        .post('/api/snailpay/charge')
        .send(validPaymentPayload);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.id).toMatch(/^txn_/);
      expect(response.body).toHaveProperty('status', 'approved');
      expect(response.body).toHaveProperty('status_detail', 'Accredited: Transaction approved successfully');
      expect(response.body).toHaveProperty('transaction_amount', 150.5);
      expect(response.body).toHaveProperty('date_created');
      expect(response.body).toHaveProperty('authorization_code');
      expect(response.body.authorization_code).toMatch(/^AUTH_/);
      expect(response.body).toHaveProperty('reference');
      expect(response.body).toHaveProperty('payer_id', validPaymentPayload.payer_id);
      expect(response.body).toHaveProperty('payer_email', validPaymentPayload.payer_email);
      expect(response.body).toHaveProperty('card_number', validPaymentPayload.card_number);
      expect(response.body).toHaveProperty('cvv', validPaymentPayload.cvv);
    });
  });

  // --------------------------------------------------------------------------
  // 3. Validación Zod (400 Bad Request)
  // --------------------------------------------------------------------------
  describe('POST /api/snailpay/charge - Validaciones de Esquema (Zod)', () => {
    it('debe responder 400 y estructura { error: true, msg } si faltan campos obligatorios', async () => {
      const response = await request(app)
        .post('/api/snailpay/charge')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', true);
      expect(response.body).toHaveProperty('msg');
      expect(typeof response.body.msg).toBe('string');
      expect(response.body.msg.length).toBeGreaterThan(0);
    });

    it('debe responder 400 si el monto es negativo o cero', async () => {
      const response = await request(app)
        .post('/api/snailpay/charge')
        .send({
          ...validPaymentPayload,
          amount: -50
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: true,
        msg: expect.stringContaining('monto')
      });
    });

    it('debe responder 400 si el correo tiene un formato inválido', async () => {
      const response = await request(app)
        .post('/api/snailpay/charge')
        .send({
          ...validPaymentPayload,
          payer_email: 'correo-invalido'
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: true,
        msg: expect.stringContaining('payer_email')
      });
    });

    it('debe responder 400 si la fecha no cumple el formato MM/YY', async () => {
      const response = await request(app)
        .post('/api/snailpay/charge')
        .send({
          ...validPaymentPayload,
          expiration_date: '2026-12'
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: true,
        msg: expect.stringContaining('expiration_date')
      });
    });

    it('debe responder 400 si el CVV no tiene 3 o 4 dígitos numéricos', async () => {
      const response = await request(app)
        .post('/api/snailpay/charge')
        .send({
          ...validPaymentPayload,
          cvv: '12'
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: true,
        msg: expect.stringContaining('cvv')
      });
    });
  });

  // --------------------------------------------------------------------------
  // 4. Escenario 2: Errores de Transacción (422 Unprocessable Entity)
  // --------------------------------------------------------------------------
  describe('POST /api/snailpay/charge - Errores de Transacción', () => {
    it('debe responder 422 si la tarjeta no es la autorizada para la prueba', async () => {
      const response = await request(app)
        .post('/api/snailpay/charge')
        .send({
          ...validPaymentPayload,
          card_number: '4111111111111111'
        });

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        error: true,
        msg: expect.stringContaining('cc_rejected_card_disabled')
      });
    });

    it('debe responder 422 si la fecha de la tarjeta ya expiró', async () => {
      const response = await request(app)
        .post('/api/snailpay/charge')
        .send({
          ...validPaymentPayload,
          expiration_date: '01/20'
        });

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        error: true,
        msg: expect.stringContaining('cc_rejected_card_expired')
      });
    });

    it('debe responder 422 si el CVV no coincide con el registrado para la tarjeta', async () => {
      const response = await request(app)
        .post('/api/snailpay/charge')
        .send({
          ...validPaymentPayload,
          cvv: '999'
        });

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        error: true,
        msg: expect.stringContaining('cc_rejected_bad_filled_security_code')
      });
    });

    it('debe responder 422 si el monto supera el límite por transacción', async () => {
      const response = await request(app)
        .post('/api/snailpay/charge')
        .send({
          ...validPaymentPayload,
          amount: 999999
        });

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        error: true,
        msg: expect.stringContaining('cc_rejected_insufficient_amount')
      });
    });
  });

  // --------------------------------------------------------------------------
  // 5. Escenario 3: Error del Sistema (500 Internal Server Error)
  // --------------------------------------------------------------------------
  describe('POST /api/snailpay/charge - Error del Sistema Simulado', () => {
    it('debe responder 500 al enviar el header de simulación x-simulate-error: system_error', async () => {
      const response = await request(app)
        .post('/api/snailpay/charge')
        .set('x-simulate-error', 'system_error')
        .send(validPaymentPayload);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        error: true,
        msg: expect.stringContaining('SnailPay Gateway Error')
      });
    });

    it('debe responder 500 al enviar la tarjeta especial de simulación 9999999999999999', async () => {
      const response = await request(app)
        .post('/api/snailpay/charge')
        .send({
          ...validPaymentPayload,
          card_number: '9999999999999999'
        });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        error: true,
        msg: expect.stringContaining('SnailPay Gateway Error')
      });
    });
  });
});
