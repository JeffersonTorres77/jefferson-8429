import os
from playwright.sync_api import sync_playwright
import pypdf

html_content = """<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Documento de Respuesta - Plataforma de Apuestas SnailPay</title>
<style>
  @page {
    size: A4;
    margin: 20mm 20mm 20mm 20mm;
  }
  body {
    font-family: Arial, sans-serif;
    font-size: 10pt;
    line-height: 1.55;
    color: #1e293b;
    margin: 0;
    padding: 0;
  }
  h1 {
    font-size: 15pt;
    font-weight: bold;
    color: #0f172a;
    border-bottom: 2px solid #2563eb;
    padding-bottom: 5px;
    margin-top: 0;
    margin-bottom: 12px;
  }
  h2 {
    font-size: 11.5pt;
    font-weight: bold;
    color: #1e3a8a;
    margin-top: 14px;
    margin-bottom: 6px;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 3px;
  }
  h3 {
    font-size: 10.5pt;
    font-weight: bold;
    color: #334155;
    margin-top: 10px;
    margin-bottom: 4px;
  }
  p {
    margin-top: 0;
    margin-bottom: 8px;
    text-align: justify;
  }
  ul, ol {
    margin-top: 4px;
    margin-bottom: 10px;
    padding-left: 22px;
  }
  li {
    margin-bottom: 5px;
    text-align: justify;
  }
  .meta-box {
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 10px 14px;
    margin-bottom: 14px;
  }
  .meta-box ul {
    margin: 0;
    padding-left: 18px;
  }
  .meta-box li {
    margin-bottom: 3px;
    font-size: 9.5pt;
  }
  .page-break {
    page-break-before: always;
  }
  .footer-note {
    font-size: 8.5pt;
    color: #64748b;
    margin-top: 18px;
    border-top: 1px dotted #cbd5e1;
    padding-top: 6px;
    text-align: center;
  }
</style>
</head>
<body>

  <!-- PÁGINA 1 -->
  <h1>Informe Técnico de Implementación y Entrega</h1>

  <div class="meta-box">
    <ul>
      <li><strong>Proyecto:</strong> Plataforma Web de Apuestas de Carreras y Pasarela SnailPay</li>
      <li><strong>Repositorio Público:</strong> https://github.com/JeffersonTorres77/jefferson-8429</li>
      <li><strong>Despliegue Público:</strong> https://jefferson-8429.vercel.app</li>
      <li><strong>Stack Tecnológico:</strong> React, Express, TypeScript, Vite, Tailwind CSS</li>
      <li><strong>Persistencia:</strong> LocalStorage (Perfil, Sesión, Saldo)</li>
    </ul>
  </div>

  <h2>1. Resumen del Proceso Seguido</h2>
  <p>El proyecto se desarrolló de forma iterativa y modular cumpliendo las siguientes etapas:</p>
  <ol>
    <li><strong>Arquitectura:</strong> Configuración del monorepo con npm workspaces y tipado estricto con TypeScript.</li>
    <li><strong>Backend (SnailPay):</strong> Creación de la API REST en Express con validaciones Zod y manejo de errores.</li>
    <li><strong>Frontend (React):</strong> Interfaz modular con Vite y Tailwind CSS, control de sesión y persistencia local.</li>
    <li><strong>Dashboard:</strong> Gráficos estadísticos (apuestas y carreras) y actualización reactiva de saldo.</li>
    <li><strong>Pruebas Automatizadas:</strong> Pruebas de integración para el backend y unitarias para el frontend.</li>
    <li><strong>Despliegue:</strong> Publicación serverless unificada en Vercel y documentación.</li>
  </ol>

  <h2>2. Decisiones Principales</h2>
  <ul>
    <li><strong>Monorepo Aislado:</strong> Separación estricta entre <code>backend/</code> y <code>frontend/</code> con TypeScript independiente.</li>
    <li><strong>Seguridad de Contraseñas:</strong> Cifrado en cliente mediante <code>SubtleCrypto</code> (SHA-256) antes de guardar en LocalStorage, evitando almacenar texto plano.</li>
    <li><strong>Simulación Realista de Pagos:</strong> Validación exhaustiva de tarjetas (16 dígitos, expiración, CVV, montos > 0) y códigos de estado (200 éxito, 400 datos inválidos, 503 error de sistema).</li>
    <li><strong>Tolerancia a Fallos:</strong> Peticiones HTTP en frontend protegidas con timeout de 10 segundos vía <code>AbortController</code>.</li>
  </ul>

  <!-- PÁGINA 2 -->
  <div class="page-break"></div>

  <h2>3. Herramientas, Librerías y Plantillas Utilizadas</h2>
  <p>No se utilizaron plantillas prediseñadas; la interfaz y componentes fueron creados a medida. Las librerías empleadas son:</p>
  <ul>
    <li><strong>Express & Zod (Backend):</strong> Construcción de endpoints REST y validación rigurosa de datos de entrada.</li>
    <li><strong>React 18 & Vite (Frontend):</strong> Aplicación cliente SPA rápida y reactiva.</li>
    <li><strong>Tailwind CSS & Lucide React:</strong> Estilos visuales modernos, diseño responsivo e iconografía.</li>
    <li><strong>Recharts:</strong> Gráficos interactivos de Donut (apuestas) y Barras (victorias de caracoles).</li>
    <li><strong>Jest, Supertest & Vitest:</strong> Pruebas automatizadas de API y componentes UI.</li>
    <li><strong>Vercel:</strong> Plataforma de despliegue serverless unificada.</li>
  </ul>

  <h2>4. Uso de Inteligencia Artificial y Validación Humana</h2>
  <ul>
    <li><strong>Herramienta:</strong> Antigravity / Gemini 3.7 como asistente en el entorno de desarrollo.</li>
    <li><strong>Aplicación:</strong> Generación de tipos iniciales TypeScript, diseño de casos de prueba y soporte en la configuración de Vercel.</li>
    <li><strong>Validación Humana:</strong> Revisión línea por línea del código, ejecución de pruebas automatizadas y verificación manual contra los requerimientos.</li>
  </ul>

  <h2>5. Pruebas Implementadas y Razón de su Elección</h2>
  <p>Se implementaron pruebas enfocadas en los flujos críticos de la aplicación:</p>
  <ul>
    <li><strong>Backend - Cobro Exitoso:</strong> Valida respuesta 200, código de autorización y número de referencia.</li>
    <li><strong>Backend - Tarjeta Inválida / Expirada:</strong> Comprueba respuesta 400 y mensaje en <code>status_detail</code>.</li>
    <li><strong>Backend - Error de Sistema:</strong> Verifica respuesta 503 ante caídas simuladas del servicio.</li>
    <li><strong>Backend - Validación Zod:</strong> Comprueba el rechazo de montos negativos o datos incompletos.</li>
    <li><strong>Frontend - Formularios:</strong> Valida campos obligatorios y coincidencia de contraseñas.</li>
    <li><strong>Frontend - Modal SnailPay:</strong> Valida la recarga exitosa y la actualización inmediata del saldo.</li>
    <li><strong>Frontend - Manejo de Errores:</strong> Comprueba la notificación clara al usuario ante timeouts o fallos de red.</li>
  </ul>

  <!-- PÁGINA 3 -->
  <div class="page-break"></div>

  <h2>6. Lista de Funcionalidades Terminadas</h2>
  <ul>
    <li><strong>Autenticación y Sesión:</strong> Registro de usuarios, login con contraseñas cifradas (SHA-256), persistencia de sesión y saldo inicial de $0 en LocalStorage, y cierre de sesión.</li>
    <li><strong>Dashboard Interactivo:</strong> Visualización de saldo actual, gráfica Donut de apuestas ganadas/perdidas y gráfica de barras con las victorias de 6 caracoles durante 6 carreras.</li>
    <li><strong>Pasarela SnailPay:</strong> Endpoint <code>POST /api/snailpay/charge</code> con cobro exitoso, errores de transacción, simulación de error de sistema y respuesta estandarizada.</li>
  </ul>

  <h2>7. Lista de Funcionalidades Incompletas o Problemas Conocidos</h2>
  <ul>
    <li><strong>Simulación de Carreras:</strong> Las carreras y apuestas son datos simulados para alimentar el dashboard; no se implementó un motor de apuestas en vivo entre usuarios (fuera de alcance).</li>
    <li><strong>Persistencia Local:</strong> Los datos residen en el navegador (LocalStorage); no hay base de datos compartida (se aborda en la propuesta adicional).</li>
    <li><strong>Problemas Conocidos:</strong> Ninguno; la aplicación ejecuta todos los flujos y pruebas sin errores.</li>
  </ul>

  <h2>8. Tiempo Aproximado Invertido</h2>
  <p>Tiempo total estimado: <strong>6.5 horas de desarrollo</strong>.</p>
  <ul>
    <li>Configuración del Monorepo y TypeScript: 45 min.</li>
    <li>Backend y Pasarela SnailPay: 1.5 horas.</li>
    <li>Frontend, Componentes y Estilos: 2.0 horas.</li>
    <li>Gráficos y Flujo de Pagos: 45 min.</li>
    <li>Pruebas Automatizadas: 1.0 hora.</li>
    <li>Despliegue en Vercel y Documentación: 45 min.</li>
  </ul>

  <h2>9. Enlace al Repositorio Público</h2>
  <p><strong>GitHub:</strong> <a href="https://github.com/JeffersonTorres77/jefferson-8429">https://github.com/JeffersonTorres77/jefferson-8429</a></p>

  <!-- PÁGINA 4 -->
  <div class="page-break"></div>

  <h2>10. Tareas Adicionales Opcionales</h2>

  <h3>Adicional 1: Aplicación Desplegada en la Nube</h3>
  <ul>
    <li><strong>URL Pública:</strong> <a href="https://jefferson-8429.vercel.app">https://jefferson-8429.vercel.app</a></li>
    <li><strong>Plataforma:</strong> Vercel (Frontend Estático + Serverless Function para Backend).</li>
    <li><strong>Implementación:</strong> Se configuró un despliegue monorepo unificado donde Vite entrega el cliente y Vercel enruta <code>/api/*</code> hacia Express sin problemas de CORS ni latencia.</li>
    <li><strong>Consideraciones:</strong> Acceso público sin credenciales, disponibilidad 24/7 y almacenamiento independiente por navegador.</li>
  </ul>

  <h3>Adicional 2: Propuesta de Integración con Base de Datos</h3>
  <ul>
    <li><strong>Tecnología:</strong> <strong>PostgreSQL 16</strong> con Prisma ORM por su soporte transaccional ACID y seguridad de tipos.</li>
    <li><strong>Entidades Principales:</strong>
      <ul>
        <li><code>users</code>: Identificación y credenciales seguras.</li>
        <li><code>wallets</code>: Saldos monetarios con control de concurrencia.</li>
        <li><code>transactions</code>: Historial de recargas y pagos con referencias de pasarela.</li>
        <li><code>snails</code> & <code>races</code>: Registro de competidores y resultados de carreras.</li>
        <li><code>bets</code>: Apuestas asociadas a usuarios, carreras y caracoles.</li>
      </ul>
    </li>
    <li><strong>Relaciones Clave:</strong> Usuario 1:1 Billetera; Billetera 1:N Transacciones; Carrera 1:N Apuestas.</li>
    <li><strong>Adaptaciones Necesarias:</strong>
      <ul>
        <li><strong>Backend:</strong> Autenticación por JWT/Cookies HTTP-Only y transacciones ACID en base de datos para movimientos de saldo.</li>
        <li><strong>Frontend:</strong> Reemplazar LocalStorage por servicios de consulta API con React Query / SWR.</li>
      </ul>
    </li>
  </ul>

  <div class="footer-note">
    Documento elaborado según las especificaciones del proceso: Fuente Arial 10pt, interlineado estándar, sin código fuente ni capturas de pantalla.
  </div>

</body>
</html>
"""

html_path = os.path.abspath("documento_entrega.html")
pdf_path = os.path.abspath("documento_entrega.pdf")

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto(f"file:///{html_path.replace(os.sep, '/')}")
    page.pdf(
        path=pdf_path,
        format="A4",
        margin={"top": "18mm", "bottom": "18mm", "left": "20mm", "right": "20mm"},
        print_background=True
    )
    browser.close()

reader = pypdf.PdfReader(pdf_path)
print(f"PDF generado con éxito. Total de páginas: {len(reader.pages)}")
