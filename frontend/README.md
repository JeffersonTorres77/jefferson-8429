# Snail Racing Frontend

Aplicación web desarrollada en **React + TypeScript + Vite + Tailwind CSS** para la plataforma de carreras de caracoles y gestión de saldo.

## 🚀 Requisitos e Instalación

Desde la carpeta rontend/:

`ash
cd frontend
npm install
`

## 💻 Scripts Disponibles

- 
pm run dev: Inicia la aplicación en modo desarrollo (http://localhost:5173).
- 
pm run build: Compila la aplicación optimizada para producción en dist/.
- 
pm run preview: Previsualiza la compilación de producción localmente.
- 
pm run test: Ejecuta las pruebas automatizadas de componentes y utilidades con Vitest.

## 🌟 Características y Componentes Principales

- **Autenticación Local Persistente:** Registro e inicio de sesión simulados con almacenamiento seguro en localStorage.
- **Rutas Protegidas:** Acceso al Dashboard restringido únicamente a usuarios autenticados.
- **Dashboard Interactivo:**
  - Visualización del nombre de usuario y saldo actual.
  - Gráfica Donut: Apuestas ganadas vs. perdidas.
  - Gráfica de Barras: Victorias de 6 caracoles a lo largo de 6 carreras del día.
- **Modal de Recarga SnailPay:**
  - Integración directa con el backend de Express.
  - Actualización reactiva del saldo en tiempo real.
  - Almacenamiento en localStorage de las transacciones y tarjetas ficticias.
  - Atajos rápidos de prueba para reproducir éxito, error de transacción y error de sistema.
