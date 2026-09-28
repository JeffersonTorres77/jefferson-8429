# Snail Racing Frontend

Aplicación web desarrollada en **React 18 + TypeScript + Vite + Tailwind CSS** para la plataforma de carreras de caracoles, gestión de apuestas simuladas y pasarela de pagos SnailPay.

---

## 🚀 Requisitos e Instalación

1. **Requisitos:** Node.js (v18 o superior) y npm (v9 o superior).
2. **Instalación:**
   ```bash
   cd frontend
   npm install
   ```

---

## 💻 Scripts Disponibles

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia la aplicación en modo desarrollo en [http://localhost:5173](http://localhost:5173). |
| `npm run build` | Compila la aplicación para producción con TypeScript (`tsc && vite build`). |
| `npm run preview` | Previsualiza localmente la compilación de producción generada en `dist/`. |
| `npm run test` | Ejecuta la suite de pruebas unitarias y de integración con **Vitest**. |

---

## 🛣️ Sistema de Rutas y Navegación

La aplicación cuenta con enrutamiento declarativo mediante `react-router-dom`:

| Ruta | Tipo | Descripción |
| :--- | :---: | :--- |
| `/login` | Pública | Formulario de autenticación con validación de credenciales. |
| `/register` | Pública | Formulario de registro (nombre, correo, contraseñas) y saldo inicial `$0.00`. |
| `/dashboard` | Protegida | Panel de control (Métricas, Gráfica Donut, Gráfica de Barras y botón de recarga). |
| `/history` | Protegida | Vista completa de auditoría e historial de recargas guardadas en `localStorage`. |

---

## 🌟 Características y Componentes Principales

- **Autenticación Local Segura:** Registro e inicio de sesión simulados con hashing **SHA-256** mediante la Web Crypto API (`crypto.subtle`) antes de guardar en `localStorage`.
- **Rutas Protegidas:** Bloqueo automático de acceso al dashboard sin sesión activa y redirección inteligente al iniciar sesión.
- **Persistencia de Sesión y Saldo:** Restauración de datos al recargar la página (`F5`) sin perder estado ni historial.
- **Dashboard Interactivo:**
  - Visualización del nombre de usuario y saldo disponible en tiempo real.
  - **Gráfica Donut:** Proporción de apuestas ganadas (14) vs. perdidas (6) con `Chart.js`.
  - **Gráfica de Barras:** Victorias de los 6 caracoles (*Turbo, Speedy, Gary, Flash, Sheldon, Zoomer*) en las 6 carreras del día.
- **Modal de Recarga SnailPay:**
  - Integración directa con el microservicio backend (`POST /api/snailpay/charge`).
  - Actualización inmediata del saldo al aprobarse la transacción.
  - Almacenamiento en `localStorage` de transacciones y datos de tarjeta ficticia.
  - **Barra de Atajos de Prueba Rápida:** Botones de 1-clic para reproducir Cobro Exitoso, Tarjeta Vencida, CVV Incorrecto, Tarjeta No Autorizada y Error de Sistema 500.

---

## 🧪 Pruebas Automatizadas

Para ejecutar las 14 pruebas automatizadas del frontend:
```bash
npm run test
```
