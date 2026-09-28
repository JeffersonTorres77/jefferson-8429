# Reglas de Desarrollo del Proyecto

Este documento establece las directrices y normas de trabajo para el desarrollo del monorepo.

---

### 1. 📦 Instalación Progresiva de Dependencias
- Las dependencias (tanto de producción como de desarrollo) se instalarán **única y exclusivamente** a medida que se vayan necesitando para una funcionalidad concreta.
- No instalar paquetes de forma masiva ni anticipada sin justificación inmediata.

---

### 2. 🧱 Aislamiento Estricto entre Backend y Frontend
- Cuando se solicite una tarea o modificación en el **Backend**, los cambios se limitarán exclusivamente al directorio ackend/ sin tocar rontend/.
- Cuando se solicite una tarea o modificación en el **Frontend**, los cambios se limitarán exclusivamente al directorio rontend/ sin tocar ackend/.

---

### 3. 🛑 Control Explícito de Commits y Pushes en Git
- **No** se realizarán commits ni pushes a los repositorios locales o remotos de Git de forma automática.
- Cualquier operación de commit o push solo se ejecutará tras una **instrucción explícita** por parte del usuario.

---

### 4. 🎭 Políticas de Anonimato
- No incluir nombres de empresas evaluadoras, referencias a pruebas técnicas ni datos sensibles en el código, documentación o commits.
