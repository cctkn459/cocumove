# COCUMOVE - Guía de Inicio Rápido

## 🚀 Inicio en 5 Minutos

### Requisitos Previos
- Node.js 18+ instalado
- npm o pnpm
- PostgreSQL (local o remoto)

### Paso 1: Clonar y Instalar

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/cocumove.git
cd cocumove

# Instalar dependencias
npm install
```

### Paso 2: Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus valores
nano .env
```

Valores mínimos requeridos:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/cocumove
JWT_SECRET=tu-secreto-muy-seguro
VITE_API_URL=http://localhost:3000/api
```

### Paso 3: Preparar Base de Datos

```bash
# Ejecutar migraciones
npm run db:push

# (Opcional) Generar datos de prueba
npm run db:seed
```

### Paso 4: Iniciar Aplicación

```bash
# En desarrollo
npm run dev

# La aplicación estará disponible en:
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
# API: http://localhost:3000/api
```

## 🧪 Probar la Aplicación

### 1. Crear Cuenta de Administrador

```bash
# Acceder a http://localhost:5173
# Seleccionar "Administrador" en el registro
# Crear cuenta con:
# - Email: admin@cocumove.com
# - Contraseña: Admin123!
# - Teléfono: +1234567890
```

### 2. Crear Cuenta de Pasajero

```bash
# Seleccionar "Pasajero" en el registro
# Crear cuenta con:
# - Email: passenger@cocumove.com
# - Contraseña: Pass123!
# - Teléfono: +0987654321
# - Cédula: 123456789
# - Subir fotos de cédula
```

### 3. Crear Cuenta de Conductor

```bash
# Seleccionar "Conductor" en el registro
# Crear cuenta con:
# - Email: driver@cocumove.com
# - Contraseña: Driver123!
# - Teléfono: +1122334455
# - Cédula: 987654321
# - Licencia: DL123456
# - Subir documentos
```

## 📱 Acceder a las Aplicaciones

### Admin Dashboard
```
URL: http://localhost:5173/admin
Usuario: admin@cocumove.com
Contraseña: Admin123!
```

### Passenger App
```
URL: http://localhost:5173/passenger
Usuario: passenger@cocumove.com
Contraseña: Pass123!
```

### Driver App
```
URL: http://localhost:5173/driver
Usuario: driver@cocumove.com
Contraseña: Driver123!
```

## 🌍 Cambiar Idioma

La aplicación soporta 4 idiomas:
- 🇪🇸 Español
- 🇺🇸 English
- 🇧🇷 Português
- 🇫🇷 Français

Usar el selector de idioma en la esquina superior derecha.

## 💰 Probar Sistema de Tokens

1. Iniciar sesión como pasajero
2. Ir a "Billetera" para ver tokens iniciales (100 COCU)
3. Solicitar un viaje
4. Iniciar sesión como conductor
5. Aceptar el viaje
6. Completar el viaje
7. Ambos usuarios reciben 5 COCU de recompensa

## 📊 Acceder a Base de Datos

### Con psql
```bash
psql postgresql://user:password@localhost:5432/cocumove
```

### Comandos útiles
```sql
-- Ver usuarios
SELECT * FROM users;

-- Ver pasajeros
SELECT * FROM passengers;

-- Ver conductores
SELECT * FROM drivers;

-- Ver viajes
SELECT * FROM rides;

-- Ver billeteras de tokens
SELECT * FROM token_wallets;

-- Ver transacciones de tokens
SELECT * FROM token_transactions;
```

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run dev          # Iniciar en desarrollo
npm run build        # Compilar para producción
npm run preview      # Vista previa de producción

# Base de Datos
npm run db:push      # Ejecutar migraciones
npm run db:studio    # Abrir Drizzle Studio
npm run db:seed      # Generar datos de prueba

# Linting y Formato
npm run lint         # Ejecutar linter
npm run format       # Formatear código

# Testing
npm test             # Ejecutar tests
npm run test:watch   # Tests en modo watch
```

## 🐛 Troubleshooting

### Error: "Cannot connect to database"
```bash
# Verificar que PostgreSQL está corriendo
# Verificar DATABASE_URL en .env
# Crear base de datos si no existe
createdb cocumove
```

### Error: "Port 3000 already in use"
```bash
# Cambiar puerto en .env
PORT=3001

# O matar proceso en puerto 3000
lsof -i :3000
kill -9 <PID>
```

### Error: "Module not found"
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error: "JWT token expired"
```bash
# Limpiar localStorage
# Volver a iniciar sesión
```

## 📚 Documentación Completa

- [MULTIIDIOMA.md](./MULTIIDIOMA.md) - Sistema multiidioma
- [CLOUDFLARE_R2_SETUP.md](./CLOUDFLARE_R2_SETUP.md) - Almacenamiento de archivos
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Despliegue en Vercel
- [README.md](./README.md) - Documentación general

## 💡 Próximos Pasos

1. **Explorar Admin Dashboard**: Revisar usuarios, conductores y viajes
2. **Probar Flujo de Viaje**: Solicitar viaje como pasajero, aceptar como conductor
3. **Verificar Tokens**: Ver cómo se ganan y gastan tokens
4. **Cambiar Idioma**: Probar los 4 idiomas soportados
5. **Configurar Cloudflare R2**: Para almacenamiento de documentos
6. **Desplegar en Vercel**: Seguir guía de DEPLOYMENT.md

## 🆘 Soporte

- Email: cocupoly@gmail.com
- GitHub Issues: [Crear issue](https://github.com/tu-usuario/cocumove/issues)
- Documentación: Ver archivos .md en el directorio raíz

## 📝 Notas Importantes

1. **Desarrollo**: Usar datos de prueba, no datos reales
2. **Seguridad**: Cambiar JWT_SECRET en producción
3. **Documentos**: Configurar Cloudflare R2 para producción
4. **Base de Datos**: Usar PostgreSQL en producción
5. **Email**: Configurar SMTP para notificaciones

¡Felicidades! 🎉 COCUMOVE está listo para usar.

