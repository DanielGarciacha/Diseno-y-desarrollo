# Portal de Bienestar Universitario

Un sistema integral para la gestión del bienestar institucional que permite administrar citas médicas y psicológicas, registrarse en actividades deportivas y culturales, y asistir a los usuarios a través de inteligencia artificial.

## 🚀 Tecnologías Utilizadas

- **Backend:** Flask (Python), Flask-CORS, Flask-JWT-Extended
- **Base de Datos:** MySQL
- **Frontend:** HTML5, CSS3, Vanilla JavaScript, Axios, Chart.js, SweetAlert2
- **Inteligencia Artificial:** Asistente Chatbot entrenado con Knowledge Base local (NLP heurístico/Regex)

## 👥 Roles del Sistema

El sistema utiliza Control de Acceso Basado en Roles (RBAC) con JWT:

1. **Estudiante:** Puede reservar citas (psicología o enfermería), inscribirse a actividades extracurriculares, interactuar con el chatbot y modificar su perfil.
2. **Psicología / Enfermería:** Pueden gestionar (aprobar/cancelar) sus citas agendadas y hacer seguimiento de los estudiantes.
3. **Encargado de Actividades:** Tiene acceso al "Portal de Actividades" donde puede crear nuevas actividades, fijar/modificar cupos (totales y disponibles), y ver la lista de estudiantes inscritos.
4. **Administrador:** Posee un panel de control con estadísticas en tiempo real (Chart.js) y permisos absolutos para gestionar usuarios (Crear, Editar cualquier campo, Eliminar).

## 🌟 Funcionalidades Principales

- **Agendamiento de Citas:** Sistema unificado para solicitar atención en múltiples áreas de la salud.
- **Portal de Actividades:** Sistema dinámico con validación de cupos y listado de participantes.
- **Mi Perfil:** Auto-gestión de datos personales para cada usuario en cualquier rol.
- **Panel Administrativo:** Control total del sistema y usuarios con KPIs gráficos y exportación de reportes en PDF/Excel.
- **Seguridad:** Autenticación mediante tokens JWT y validaciones de sesión (localStorage/headers).

## ⚙️ Instalación y Ejecución

### Prerrequisitos
- Python 3.8+
- Servidor MySQL (XAMPP, WAMP, o nativo)

### Pasos

1. **Configurar la Base de Datos**
   - Importa o ejecuta el script de base de datos para construir las tablas (e.g., usando `backend/database/reset_db.py` u otra herramienta SQL).
   - Verifica que las credenciales en `backend/database/db.py` correspondan a tu servidor MySQL local (por defecto usuario `root` y contraseña en blanco).

2. **Instalar Dependencias Backend**
   ```bash
   pip install Flask Flask-MySQLdb Flask-CORS Flask-JWT-Extended
   ```

3. **Ejecutar el Servidor**
   - Asegúrate de estar en el directorio raíz del proyecto (`Diseno-y-desarrollo-main`).
   - Ejecuta Flask:
   ```bash
   flask --app app.py run --port 3000
   ```

4. **Acceso al Sistema**
   - Abre tu navegador en `http://127.0.0.1:3000`
   - Ingresa con tus credenciales.

## 🔒 Endpoints Clave (API REST)

- `POST /login`: Autenticación y generación de JWT.
- `GET /my_profile` | `PUT /update_my_profile`: Gestión del perfil del usuario actual.
- `POST /crear_actividad` | `POST /actualizar_cupos/<id>`: Gestión de actividades.
- `GET /getAll`: Obtención del listado de usuarios (Solo Admin).

---
*Desarrollado para promover la calidad de vida y el bienestar institucional.*