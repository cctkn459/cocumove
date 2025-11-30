# COCUMOVE - Move The Future

Plataforma de transporte tipo BOLT con sistema de recompensas en COCU TOKENS, soporte multiidioma para el continente americano, y tres aplicaciones separadas para administrador, pasajero y conductor.

## 🚀 Características Principales

- **Tres Aplicaciones Separadas**: Interfaces dedicadas para Administrador, Pasajero y Conductor
- **Sistema de Tokens COCU**: Recompensas y ganancias basadas en tokens criptográficos
- **Multiidioma**: Soporte para Español, Inglés, Portugués y Francés
- **Verificación Completa de Documentos**: 
  - Pasajeros: Cédula + Fotos
  - Conductores: Cédula + Licencia + Certificado de Antecedentes + Seguro
- **Gestión de Viajes**: Sistema completo de solicitud, aceptación y finalización de viajes
- **Calificaciones y Reseñas**: Sistema de reputación transparente
- **Billetera de Tokens**: Gestión de saldo y transacciones de COCU TOKENS

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o pnpm
- PostgreSQL 12+
- Git

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd cocumove
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

4. **Configurar la base de datos**
```bash
npm run db:push
```

## 🚀 Desarrollo

### Iniciar servidor de desarrollo
```bash
npm run dev
```

Esto iniciará simultáneamente:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

### Scripts disponibles

- `npm run dev` - Inicia el servidor de desarrollo (frontend + backend)
- `npm run server:dev` - Solo servidor backend
- `npm run client:dev` - Solo cliente frontend
- `npm run build` - Construir para producción
- `npm run preview` - Vista previa de la compilación
- `npm run db:generate` - Generar migraciones de base de datos
- `npm run db:migrate` - Ejecutar migraciones
- `npm run db:push` - Sincronizar esquema con base de datos
- `npm run db:studio` - Abrir Drizzle Studio para gestionar BD
- `npm run lint` - Ejecutar linter
- `npm run type-check` - Verificar tipos TypeScript
- `npm run test` - Ejecutar pruebas

## 📁 Estructura del Proyecto

```
cocumove/
├── src/
│   ├── admin/              # Aplicación de Administrador
│   ├── passenger/          # Aplicación de Pasajero
│   ├── driver/             # Aplicación de Conductor
│   ├── shared/             # Componentes y utilidades compartidas
│   │   └── i18n/          # Configuración de internacionalización
│   ├── components/         # Componentes reutilizables
│   ├── hooks/             # Hooks personalizados
│   ├── utils/             # Funciones utilitarias
│   ├── App.tsx            # Componente principal
│   ├── main.tsx           # Punto de entrada
│   └── index.css          # Estilos globales
├── server/
│   ├── db/                # Configuración de base de datos
│   │   └── schema.ts      # Esquema de Drizzle ORM
│   ├── routes/            # Rutas API
│   ├── controllers/       # Controladores
│   ├── services/          # Servicios de negocio
│   ├── middleware/        # Middleware Express
│   ├── utils/             # Utilidades del servidor
│   └── index.ts           # Punto de entrada del servidor
├── public/                # Archivos estáticos
├── drizzle.config.ts      # Configuración de Drizzle
├── vite.config.ts         # Configuración de Vite
├── tsconfig.json          # Configuración de TypeScript
├── package.json           # Dependencias del proyecto
└── README.md              # Este archivo
```

## 🗄️ Esquema de Base de Datos

### Tablas Principales

- **users**: Información de usuarios (admin, pasajero, conductor)
- **passengers**: Datos específicos de pasajeros
- **drivers**: Datos específicos de conductores
- **vehicles**: Información de vehículos
- **rides**: Registro de viajes
- **token_wallets**: Billeteras de tokens COCU
- **token_transactions**: Historial de transacciones de tokens
- **reviews**: Reseñas y calificaciones
- **support_tickets**: Tickets de soporte

## 🔐 Autenticación

La aplicación utiliza JWT (JSON Web Tokens) para autenticación:

1. El usuario se registra con email, teléfono y contraseña
2. Se genera un token JWT que se almacena en localStorage
3. El token se incluye en el header `Authorization: Bearer <token>` para solicitudes autenticadas

## 🌍 Internacionalización (i18n)

La aplicación soporta 4 idiomas:

- **es** - Español
- **en** - English
- **pt** - Português
- **fr** - Français

Los archivos de traducción están en `src/shared/i18n/locales/`

## 💰 Sistema de Tokens COCU

- **Recompensas**: Los usuarios ganan tokens al completar viajes
- **Saldo Inicial**: Nuevo usuario recibe tokens iniciales
- **Transacciones**: Registro completo de ganancias y gastos
- **Billetera**: Gestión centralizada de saldo

## 📧 Contacto

Para preguntas o soporte, contacta a: **cocupoly@gmail.com**

## 📄 Licencia

MIT License - Todos los derechos reservados © 2024 COCUMOVE

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request.

## 📝 Notas de Desarrollo

- La aplicación utiliza React 19 con TypeScript
- Backend construido con Express.js
- Base de datos PostgreSQL con Drizzle ORM
- Estilos CSS3 con diseño responsivo
- Autenticación JWT
- Validación de entrada en servidor y cliente

## 🔄 Próximas Fases

- [ ] Integración con Cloudflare R2 para almacenamiento de documentos
- [ ] Sistema de pagos integrado
- [ ] Notificaciones en tiempo real con WebSockets
- [ ] Mapas y geolocalización
- [ ] Aplicaciones móviles (iOS/Android)
- [ ] Dashboard analítico avanzado

