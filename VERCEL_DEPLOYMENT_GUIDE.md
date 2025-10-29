# Guía de Despliegue de COCUMOVE en Vercel

## 🚀 Despliegue en 5 Pasos

### Paso 1: Acceder a Vercel

1. Ve a **https://vercel.com**
2. Haz clic en **"Sign Up"** (o **"Log In"** si ya tienes cuenta)
3. Selecciona **"Continue with GitHub"**
4. Autoriza Vercel para acceder a tu cuenta de GitHub

### Paso 2: Crear Nuevo Proyecto

1. En el dashboard de Vercel, haz clic en **"Add New..."** → **"Project"**
2. Selecciona el repositorio **"cctkn459/cocumove"**
3. Haz clic en **"Import"**

### Paso 3: Configurar Proyecto

En la página de configuración:

**Framework Preset:** Vite
**Root Directory:** ./ (raíz)
**Build Command:** npm run build
**Output Directory:** dist

Haz clic en **"Continue"**

### Paso 4: Configurar Variables de Entorno

En la sección **"Environment Variables"**, agrega las siguientes variables:

#### Variables Obligatorias:

```
DATABASE_URL = postgresql://user:password@host:5432/cocumove
JWT_SECRET = tu-secreto-jwt-muy-seguro-cambiar-esto
VITE_API_URL = https://cocumove.vercel.app/api
```

#### Variables de Tokens COCU:

```
COCU_TOKEN_INITIAL_BALANCE = 100
COCU_TOKEN_RIDE_REWARD = 5
COCU_TOKEN_REFERRAL_BONUS = 10
```

#### Variables de Cloudflare R2 (Opcional):

```
CLOUDFLARE_R2_ENDPOINT = https://[account-id].r2.cloudflarestorage.com
CLOUDFLARE_R2_PUBLIC_URL = https://files.cocumove.com
CLOUDFLARE_ACCESS_KEY_ID = [tu-access-key]
CLOUDFLARE_SECRET_ACCESS_KEY = [tu-secret-key]
CLOUDFLARE_BUCKET_NAME = cocumove
```

### Paso 5: Desplegar

1. Haz clic en **"Deploy"**
2. Espera a que se complete el despliegue (5-10 minutos)
3. ¡Listo! Tu aplicación estará disponible en una URL de Vercel

---

## 📊 Configuración de Base de Datos

### Opción A: Vercel Postgres (Recomendado)

1. En el dashboard de Vercel, ve a **"Storage"** → **"Create New"** → **"Postgres"**
2. Crea una nueva base de datos
3. Copia la `DATABASE_URL`
4. Agrega la URL a las variables de entorno

### Opción B: PostgreSQL Externo

Usa un proveedor como:
- **Supabase**: https://supabase.com
- **Railway**: https://railway.app
- **AWS RDS**: https://aws.amazon.com/rds/
- **DigitalOcean**: https://www.digitalocean.com/products/managed-databases/

---

## 🔐 Configuración de Cloudflare R2

### 1. Crear Bucket en Cloudflare

1. Ve a **https://dash.cloudflare.com**
2. Selecciona tu cuenta
3. Ve a **"R2"** → **"Create bucket"**
4. Nombre: `cocumove`
5. Crear bucket

### 2. Crear Tokens de API

1. En R2, ve a **"Settings"** → **"API Tokens"**
2. Crea nuevo token con permisos:
   - `s3:GetObject`
   - `s3:PutObject`
   - `s3:DeleteObject`
   - `s3:ListBucket`
3. Copia las credenciales

### 3. Configurar en Vercel

Agrega las variables de entorno con tus credenciales de Cloudflare R2

---

## 🌐 Dominio Personalizado

### Usar Dominio de Vercel (Gratuito)

Tu aplicación estará disponible en: `cocumove.vercel.app`

### Usar Dominio Personalizado

1. En Vercel, ve a tu proyecto → **"Settings"** → **"Domains"**
2. Agrega tu dominio personalizado
3. Sigue las instrucciones para configurar DNS
4. Vercel proporciona HTTPS automáticamente

---

## 📝 Notas Importantes

### Base de Datos

- **Desarrollo**: SQLite (local)
- **Producción**: PostgreSQL (Vercel Postgres o externo)
- Necesitas migrar la base de datos después del despliegue

### Migraciones

Después del despliegue, ejecuta:

```bash
npm run db:push
```

Esto creará las tablas en la base de datos de producción.

### Datos de Prueba

Para agregar datos de prueba en producción:

```bash
node seed-db.js
```

### Variables de Entorno

- Cambiar `JWT_SECRET` en producción
- Usar credenciales separadas para dev/prod
- No compartir `.env` en GitHub

---

## 🔄 Despliegues Automáticos

Una vez configurado, cada push a `master` desplegará automáticamente:

```bash
git add .
git commit -m "Cambios"
git push origin master
```

Vercel desplegará automáticamente en segundos.

---

## 📊 Monitoreo

### Ver Logs

1. En Vercel, ve a tu proyecto
2. Haz clic en la última **"Deployment"**
3. Ve a **"Logs"** para ver detalles

### Ver Métricas

1. En Vercel, ve a tu proyecto
2. Haz clic en **"Analytics"**
3. Ver métricas de rendimiento

---

## 🚨 Troubleshooting

### Error: "Build failed"

1. Verifica que `npm run build` funciona localmente
2. Revisa los logs de compilación en Vercel
3. Asegúrate de que todas las dependencias están en `package.json`

### Error: "Database connection failed"

1. Verifica que `DATABASE_URL` es correcta
2. Comprueba que la base de datos está accesible desde Vercel
3. Revisa firewall/security groups

### Error: "Module not found"

1. Verifica que todas las dependencias están instaladas
2. Ejecuta `npm install` localmente
3. Haz commit de `package-lock.json`

---

## 📋 Checklist de Despliegue

- [ ] Repositorio en GitHub: https://github.com/cctkn459/cocumove
- [ ] Cuenta en Vercel creada
- [ ] Proyecto importado en Vercel
- [ ] Variables de entorno configuradas
- [ ] Base de datos PostgreSQL creada
- [ ] DATABASE_URL agregada
- [ ] Despliegue completado
- [ ] URL de Vercel funcional
- [ ] Datos de prueba agregados
- [ ] Dominio personalizado (opcional)

---

## 🎯 URLs Importantes

- **GitHub**: https://github.com/cctkn459/cocumove
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Documentación Vercel**: https://vercel.com/docs
- **Documentación Vite**: https://vitejs.dev
- **Documentación Express**: https://expressjs.com

---

## 💬 Soporte

- Email: cocupoly@gmail.com
- GitHub Issues: https://github.com/cctkn459/cocumove/issues
- Vercel Support: https://vercel.com/support

---

**¡Listo para desplegar! 🚀**

Sigue estos pasos y tu COCUMOVE estará en vivo en minutos.

