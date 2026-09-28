# SnailPay Backend (Mock Gateway Service)

Microservicio backend desarrollado en **Node.js + Express + TypeScript** que simula la pasarela de pagos **SnailPay**.

---

## 🚀 Requisitos e Instalación

1. **Requisitos:** Node.js (v18 o superior) y npm (v9 o superior).
2. **Instalación:**
   ```bash
   cd backend
   npm install
   ```

---

## 💻 Scripts Disponibles

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia el servidor en modo desarrollo con recarga automática (`ts-node-dev`) en `http://localhost:3001`. |
| `npm run build` | Compila el código TypeScript a JavaScript en el directorio `dist/`. |
| `npm run start` | Ejecuta el servidor compilado en producción desde `dist/server.js`. |
| `npm run test` | Ejecuta la suite completa de pruebas unitarias y de integración con **Jest** y **Supertest**. |

---

## 📙 Especificación de la API

### 1. Health Check
* **Ruta:** `/api/health`
* **Método:** `GET`
* **Para qué es:** Verifica el estado operativo y la disponibilidad del microservicio.
* **Body:** Ninguno.
* **Retorno Exitoso (`200 OK`):**
  ```json
  {
    "status": "ok",
    "timestamp": "2026-09-28T08:40:00.000Z",
    "service": "snailpay-backend"
  }
  ```

---

### 2. Procesar Recarga de Saldo (SnailPay)
* **Ruta:** `/api/snailpay/charge`
* **Método:** `POST`
* **Para qué es:** Simula el procesamiento de una transacción de recarga con tarjeta en la pasarela SnailPay.
* **Headers Opcionales:**
  * `x-simulate-error`: `system_error` *(fuerza la simulación de un error 500 de pasarela)*.

#### 📥 Body de Solicitud (JSON):
```json
{
  "card_number": "1234123412341234",
  "expiration_date": "12/26",
  "cvv": "543",
  "full_name": "Jefferson Torres",
  "amount": 150.0,
  "payer_id": "usr_9b1deb4d",
  "payer_email": "usuario@example.com"
}
```

| Campo | Tipo | Requerido | Descripción |
| :--- | :--- | :---: | :--- |
| `card_number` | `string` | Sí | Número de tarjeta de 16 dígitos numéricos. |
| `expiration_date` | `string` | Sí | Fecha de expiración en formato `MM/YY` (ej: `12/26`). |
| `cvv` | `string` | Sí | Código de seguridad de 3 o 4 dígitos. |
| `full_name` | `string` | Sí | Nombre completo del titular (mínimo 2 caracteres). |
| `amount` | `number` | Sí | Monto numérico de la recarga (debe ser mayor a 0). |
| `payer_id` | `string` | Sí | Identificador único del usuario registrado. |
| `payer_email` | `string` | Sí | Correo electrónico válido del usuario. |

---

#### 📤 Retorno de la API

##### A. Cobro Exitoso (`200 OK`):
Se produce cuando se envían los datos de prueba oficiales (`card_number: 1234123412341234`, `expiration_date: 12/26`, `cvv: 543`, `amount > 0`).

```json
{
  "id": "txn_1727512800123_A7B9C1",
  "status": "approved",
  "status_detail": "Accredited: Transaction approved successfully",
  "transaction_amount": 150.0,
  "date_created": "2026-09-28T08:40:00.123Z",
  "authorization_code": "AUTH_748291",
  "reference": "REF_1727512800123",
  "payer_id": "usr_9b1deb4d",
  "payer_email": "usuario@example.com",
  "card_number": "1234123412341234",
  "cvv": "543"
}
```

##### B. Error de Validación de Esquema (`400 Bad Request`):
Ocurre cuando faltan campos obligatorios, el correo no es válido, la fecha no cumple el formato `MM/YY` o el monto es menor o igual a 0.

* **Código HTTP:** `400 Bad Request`
* **Body de Error:**
  ```json
  {
    "error": true,
    "msg": "payer_email: El correo del usuario es inválido | amount: El monto debe ser mayor a cero"
  }
  ```

##### C. Error de Transacción de Negocio (`422 Unprocessable Entity`):
Ocurre cuando la tarjeta no es la autorizada, está vencida, el CVV es incorrecto o el monto supera el límite autorizado ($50,000).

* **Código HTTP:** `422 Unprocessable Entity`
* **Escenarios posibles:**
  * **Tarjeta no autorizada:** `{ "error": true, "msg": "cc_rejected_card_disabled: Número de tarjeta rechazado por la entidad emisora" }`
  * **Tarjeta vencida:** `{ "error": true, "msg": "cc_rejected_card_expired: La tarjeta se encuentra vencida" }`
  * **Fecha incorrecta:** `{ "error": true, "msg": "cc_rejected_bad_filled_date: La fecha de vencimiento no coincide con los registros" }`
  * **CVV incorrecto:** `{ "error": true, "msg": "cc_rejected_bad_filled_security_code: Código de seguridad CVV inválido" }`
  * **Monto excedido:** `{ "error": true, "msg": "cc_rejected_insufficient_amount: El monto solicitado supera el límite autorizado por transacción" }`

##### D. Error del Sistema Simulado (`500 Internal Server Error`):
Ocurre cuando se envía la tarjeta de simulación `9999999999999999` o el header `x-simulate-error: system_error`.

* **Código HTTP:** `500 Internal Server Error`
* **Body de Error:**
  ```json
  {
    "error": true,
    "msg": "SnailPay Gateway Error: Falla interna en el procesador de pagos. Intente más tarde."
  }
  ```

---

## 🧪 Datos de Prueba Rápidos para Evaluación

| Escenario | Tarjeta (`card_number`) | Vencimiento (`expiration_date`) | CVV | Monto | Resultado Esperado |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Cobro Exitoso** | `1234123412341234` | `12/26` | `543` | `100` | `200 OK` (`status: "approved"`) |
| **Tarjeta Vencida** | `1234123412341234` | `01/20` | `543` | `100` | `422 Unprocessable Entity` (`cc_rejected_card_expired`) |
| **CVV Incorrecto** | `1234123412341234` | `12/26` | `999` | `100` | `422 Unprocessable Entity` (`cc_rejected_bad_filled_security_code`) |
| **Tarjeta No Autorizada** | `4111111111111111` | `12/26` | `543` | `100` | `422 Unprocessable Entity` (`cc_rejected_card_disabled`) |
| **Error de Sistema** | `9999999999999999` | `12/26` | `543` | `100` | `500 Internal Server Error` |
