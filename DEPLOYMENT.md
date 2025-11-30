# Guía de Despliegue de COCUMOVE en Vercel

## 📋 Descripción

Esta guía proporciona instrucciones paso a paso para desplegar la aplicación COCUMOVE en Vercel, una plataforma de hosting moderna optimizada para aplicaciones full-stack.

## 🔧 Requisitos Previos

1. Cuenta en [Vercel](https://vercel.com)
2. Repositorio en GitHub con el código de COCUMOVE
3. Variables de entorno configuradas
4. Cloudflare R2 configurado
5. Base de datos PostgreSQL o compatible

## 🚀 Pasos de Despliegue

### Paso 1: Preparar el Repositorio

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/cocumove.git
cd cocumove

# Instalar dependencias
npm install

# Verificar que todo funciona localmente
npm run build
npm run dev
```

### Paso 2: Conectar a Vercel

#### Opción A: Desde la CLI de Vercel

```bash
# Instalar Vercel CLI
npm install -g vercel

# Desplegar
vercel

# Seguir las instrucciones interactivas
```

#### Opción B: Desde el Dashboard de Vercel

1. Ir a [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Hacer clic en "New Project"
3. Seleccionar el repositorio de GitHub
4. Configurar variables de entorno
5. Desplegar

### Paso 3: Configurar Variables de Entorno

En el dashboard de Vercel:

1. Ir a "Settings" → "Environment Variables"
2. Agregar las siguientes variables:

```env
# Base de Datos
DATABASE_URL=postgresql://user:password@host:5432/cocumove

# Autenticación
JWT_SECRET=tu-secreto-jwt-muy-seguro

# API
VITE_API_URL=https://tu-dominio.vercel.app/api

# Tokens COCU
COCU_TOKEN_INITIAL_BALANCE=100
COCU_TOKEN_RIDE_REWARD=5
COCU_TOKEN_REFERRAL_BONUS=10

# Cloudflare R2
CLOUDFLARE_R2_ENDPOINT=https://[account-id].r2.cloudflarestorage.com
CLOUDFLARE_R2_PUBLIC_URL=https://[custom-domain]
CLOUDFLARE_ACCESS_KEY_ID=[tu-access-key]
CLOUDFLARE_SECRET_ACCESS_KEY=[tu-secret-key]
CLOUDFLARE_BUCKET_NAME=cocumove
```

### Paso 4: Configurar Base de Datos

#### Opción A: PostgreSQL en Vercel Postgres

1. En el dashboard de Vercel
2. Ir a "Storage" → "Postgres"
3. Crear nueva base de datos
4. Copiar la `DATABASE_URL` y agregarla a variables de entorno

#### Opción B: PostgreSQL Externo

1. Usar un proveedor como:
   - AWS RDS
   - Heroku Postgres
   - DigitalOcean Managed Databases
   - Supabase

2. Obtener la URL de conexión
3. Agregar a variables de entorno

### Paso 5: Ejecutar Migraciones

```bash
# Localmente, antes de desplegar
npm run db:push

# O después de desplegar
vercel env pull
npm run db:push
```

### Paso 6: Configurar Dominio Personalizado

1. En el dashboard de Vercel
2. Ir a "Settings" → "Domains"
3. Agregar dominio personalizado (ej: `cocumove.com`)
4. Configurar DNS según las instrucciones

## 📊 Estructura de Despliegue

```
Vercel (Frontend + API)
├── Frontend (Vite + React)
│   ├── Admin App
│   ├── Passenger App
│   └── Driver App
└── Backend (Express.js)
    ├── Rutas de Autenticación
    ├── Rutas de Administrador
    ├── Rutas de Pasajero
    ├── Rutas de Conductor
    ├── Rutas de Tokens
    └── Rutas de Carga

Base de Datos (PostgreSQL)
└── Vercel Postgres o Externo

Almacenamiento (Cloudflare R2)
└── Documentos y Fotos
```

## 🔒 Seguridad en Producción

### Headers de Seguridad

Vercel automáticamente configura:
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

### Variables de Entorno Seguras

- Nunca guardar secretos en el código
- Usar variables de entorno para todos los secretos
- Regenerar JWT_SECRET en producción
- Usar credenciales separadas para desarrollo y producción

### HTTPS

- Vercel proporciona HTTPS automáticamente
- Todos los datos se transmiten cifrados
- Certificados SSL/TLS automáticos

## 🔄 Despliegues Continuos

### Configuración Automática

1. Cada push a `main` se despliega automáticamente
2. Cada PR genera un despliegue de vista previa
3. Rollback automático si hay errores

### Despliegue Manual

```bash
# Forzar nuevo despliegue
vercel --prod

# Desplegar rama específica
vercel --prod --branch [rama]
```

## 📈 Monitoreo

### Vercel Analytics

1. En el dashboard de Vercel
2. Ir a "Analytics"
3. Ver métricas de rendimiento:
   - Tiempo de respuesta
   - Errores
   - Uso de recursos

### Logs

```bash
# Ver logs en tiempo real
vercel logs

# Ver logs de función específica
vercel logs [function-name]
```

## 🚨 Troubleshooting

### Error: "Build failed"

1. Verificar que `npm run build` funciona localmente
2. Revisar logs de compilación en Vercel
3. Comprobar que todas las dependencias están en `package.json`

### Error: "Database connection failed"

1. Verificar que `DATABASE_URL` es correcta
2. Comprobar que la base de datos está accesible desde Vercel
3. Revisar firewall/security groups

### Error: "Cloudflare R2 credentials invalid"

1. Verificar que las credenciales son correctas
2. Regenerar tokens si es necesario
3. Comprobar que el bucket existe

### Aplicación lenta

1. Revisar métricas de rendimiento
2. Optimizar consultas a base de datos
3. Implementar caché
4. Aumentar memoria de función si es necesario

## 📋 Checklist de Despliegue

- [ ] Código en GitHub
- [ ] Proyecto creado en Vercel
- [ ] Variables de entorno configuradas
- [ ] Base de datos creada y conectada
- [ ] Migraciones ejecutadas
- [ ] Cloudflare R2 configurado
- [ ] Dominio personalizado configurado
- [ ] HTTPS verificado
- [ ] Pruebas en producción
- [ ] Monitoreo configurado
- [ ] Backups configurados
- [ ] Plan de recuperación ante desastres

## 🔄 Actualizar Aplicación

### Desplegar Cambios

```bash
# Hacer cambios localmente
git add .
git commit -m "Descripción de cambios"
git push origin main

# Vercel despliega automáticamente
```

### Rollback a Versión Anterior

1. En el dashboard de Vercel
2. Ir a "Deployments"
3. Seleccionar despliegue anterior
4. Hacer clic en "Promote to Production"

## 📚 Recursos Adicionales

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Express.js on Vercel](https://vercel.com/docs/concepts/functions/serverless-functions)

## 💬 Soporte

Para problemas con Vercel:
- [Vercel Support](https://vercel.com/support)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

Para problemas con COCUMOVE:
- Email: cocupoly@gmail.com
- GitHub Issues: [Crear issue](https://github.com/tu-usuario/cocumove/issues)

## 📝 Notas Importantes

1. **Costo**: Vercel tiene plan gratuito con límites. Revisar precios para producción.
2. **Escalabilidad**: Vercel escala automáticamente según demanda.
3. **Uptime**: Vercel garantiza 99.99% de uptime.
4. **Backups**: Configurar backups automáticos de base de datos.
5. **Monitoreo**: Implementar alertas para errores críticos.

## 🎯 Próximos Pasos

1. Configurar dominio personalizado
2. Implementar monitoreo y alertas
3. Configurar backups automáticos
4. Optimizar rendimiento
5. Implementar CI/CD avanzado

