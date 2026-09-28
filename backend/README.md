# SnailPay Backend (Mock Gateway Service)

Servicio backend desarrollado en **Node.js + Express + TypeScript** que simula la pasarela de pagos **SnailPay**.

## 🚀 Requisitos e Instalación

Desde la carpeta ackend/:

`ash
cd backend
npm install
`

## 💻 Scripts Disponibles

- 
pm run dev: Inicia el servidor de desarrollo con recarga automática (http://localhost:3001).
- 
pm run build: Compila el código TypeScript a JavaScript en dist/.
- 
pm run start: Ejecuta el código compilado en producción.
- 
pm run test: Ejecuta la suite de pruebas unitarias y de integración con Jest y Supertest.

## 📡 Especificación de la API

### Endpoint: Procesar Recarga
- **Método:** POST
- **Ruta:** /api/snailpay/charge

#### Payload de Solicitud (JSON):
`json
{
  card_number: 1234123412341234,
  expiration_date: 12/26,
  cvv: 543,
  full_name: Juan Perez,
  amount: 100,
  payer_id: usr_123456,
  payer_email: juan@example.com
}
`

### Escenarios de Simulación:
1. **Cobro Exitoso (200 OK):**
   - Tarjeta: 1234123412341234
   - Vencimiento: 12/26
   - CVV: 543
   - Nombre: no vacío
   - Monto: > 0
2. **Error de Transacción (400 Bad Request / 422 Unprocessable Entity):**
   - Tarjeta rechazada, fecha expirada o datos inconsistentes. Retorna código explicativo en status_detail.
3. **Error del Sistema (500 Internal Server Error):**
   - Simulación de falla interna de la pasarela mediante header X-Simulate-Error: system_error o tarjeta específica (9999999999999999).

#### Estructura de Respuesta Estándar:
`json
{
  id: txn_987654321,
  status: approved, // approved | rejected | error
  status_detail: Accredited: Transaction approved successfully,
  transaction_amount: 100,
  date_created: 2026-09-28T07:30:00.000Z,
  authorization_code: AUTH_654321,
  reference: REF_1727508600000,
  payer_id: usr_123456,
  payer_email: juan@example.com,
  card_number: 1234123412341234,
  cvv: 543
}
`
