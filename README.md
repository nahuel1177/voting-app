# Sistema de Carga de Votos Electorales

Aplicación web para cargar y visualizar resultados de mesas de votación con estadísticas en tiempo real.

## Características

- 🗳️ Gestión de partidos políticos
- 📊 Carga de resultados por mesa de votación
- 📈 Visualización de resultados con gráficos
- 📱 Diseño responsivo
- 🔄 Actualización en tiempo real

## Requisitos Previos

- Node.js (v14 o superior)
- npm (v6 o superior) o yarn
- MongoDB (local o Atlas)

## Configuración del Backend

1. Navega al directorio del backend:
   ```bash
   cd backend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Crea un archivo `.env` en la raíz del backend con las siguientes variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/voting-app
   ```

4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Configuración del Frontend

1. Navega al directorio del frontend:
   ```bash
   cd frontend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia la aplicación:
   ```bash
   npm start
   ```

4. La aplicación estará disponible en `http://localhost:3000`

## Estructura del Proyecto

```
voting-app/
├── backend/               # Código del servidor
│   ├── src/
│   │   ├── config/       # Configuraciones
│   │   ├── models/       # Modelos de MongoDB
│   │   ├── routes/       # Rutas de la API
│   │   └── server.ts     # Punto de entrada del servidor
│   └── package.json
│
└── frontend/             # Aplicación React
    ├── public/          # Archivos estáticos
    └── src/
        ├── components/  # Componentes reutilizables
        ├── pages/       # Vistas de la aplicación
        └── App.tsx      # Componente raíz
```

## Uso

1. **Agregar Partidos Políticos**:
   - Navega a la sección "Partidos"
   - Haz clic en "Agregar Partido"
   - Completa el formulario con el nombre y color del partido

2. **Cargar Resultados de Mesa**:
   - Ve a "Mesas de Votación"
   - Haz clic en "Agregar Mesa"
   - Completa el formulario con los datos de la mesa
   - Ingresa los votos para cada partido

3. **Ver Resultados**:
   - El dashboard principal muestra un resumen de los resultados
   - Los gráficos se actualizan automáticamente

## Tecnologías Utilizadas

### Backend
- Node.js
- Express
- TypeScript
- MongoDB con Mongoose
- CORS

### Frontend
- React
- TypeScript
- Material-UI
- Chart.js
- React Router
- Axios

## Licencia

Este proyecto está bajo la Licencia MIT.
"# voting-app" 
