# Snail Racing & SnailPay Platform

Plataforma web monorepo con temática de apuestas en carreras de caracoles y pasarela simulada de pagos (SnailPay).

## 📁 Estructura del Monorepo

`	ext
├── backend/                # Microservicio Express + TypeScript (Mock de SnailPay Gateway)
│   ├── src/
│   ├── tests/
│   ├── package.json
│   └── README.md
├── frontend/               # Aplicación React + TypeScript (Vite + Tailwind CSS)
│   ├── src/
│   ├── tests/
│   ├── package.json
│   └── README.md
├── package.json            # Orquestador de scripts monorepo
├── .gitignore              # Configuración de exclusiones Git
└── README.md               # Documentación general
`

## 🚀 Requisitos Previos

- [Node.js](https://nodejs.org/) (versión 18 o superior)
- [npm](https://www.npmjs.com/) (versión 9 o superior)

## 🛠️ Instalación General

Para instalar las dependencias de todos los proyectos (raíz, backend y frontend):

`ash
npm install
`

## 💻 Ejecución del Entorno de Desarrollo

Para ejecutar frontend y backend en simultáneo desde la raíz:

`ash
npm run dev
`

O para ejecutarlos de forma independiente:

- **Backend:** 
pm run dev:backend (por defecto en http://localhost:3001)
- **Frontend:** 
pm run dev:frontend (por defecto en http://localhost:5173)

## 🧪 Pruebas Automatizadas

Para ejecutar todas las pruebas automatizadas del proyecto:

`ash
npm run test
`

O individualmente:

- **Pruebas del Backend:** 
pm run test:backend
- **Pruebas del Frontend:** 
pm run test:frontend

## 📚 Documentación Específica

Para detalles de implementación, endpoints, escenarios y diseño:
- [Documentación del Backend](./backend/README.md)
- [Documentación del Frontend](./frontend/README.md)
