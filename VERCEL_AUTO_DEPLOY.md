# Despliegue Automático de COCUMOVE en Vercel

## 🚀 Despliegue en 3 Pasos (SIN CUENTA PREVIA)

### PASO 1: Crear Cuenta en Vercel (1 minuto)

1. Ve a: **https://vercel.com/signup**
2. Haz clic en **"Continue with GitHub"**
3. Autoriza Vercel
4. ¡Listo! Tu cuenta está creada

---

### PASO 2: Desplegar COCUMOVE (2 minutos)

1. Ve a: **https://vercel.com/new**
2. En **"Import Git Repository"**, pega:
   ```
   https://github.com/cctkn459/cocumove
   ```
3. Haz clic en el repositorio cuando aparezca
4. Haz clic en **"Import"**

---

### PASO 3: Configurar y Desplegar (2 minutos)

En la página de configuración:

**1. Verificar Framework:**
- Framework Preset: **Vite** ✓
- Root Directory: **./** ✓
- Build Command: **npm run build** ✓
- Output Directory: **dist** ✓

Haz clic en **"Continue"**

**2. Agregar Variables de Entorno:**

En la sección **"Environment Variables"**, agrega:

```
DATABASE_URL = postgresql://user:password@host:5432/cocumove
JWT_SECRET = cocumove-secret-key-production-2024
VITE_API_URL = https://cocumove.vercel.app/api
COCU_TOKEN_INITIAL_BALANCE = 100
COCU_TOKEN_RIDE_REWARD = 5
COCU_TOKEN_REFERRAL_BONUS = 10
```

**3. Desplegar:**

Haz clic en **"Deploy"**

✅ **¡Listo! Tu aplicación estará en vivo en 5-10 minutos**

---

## 🔗 Tu URL Permanente

Después del despliegue, tu aplicación estará disponible en:

```
https://cocumove.vercel.app
```

---

## 📊 Configurar Base de Datos PostgreSQL

### Opción A: Vercel Postgres (RECOMENDADO - Gratuito)

1. En Vercel, ve a tu proyecto
2. Haz clic en **"Storage"** → **"Create New"** → **"Postgres"**
3. Crea nueva base de datos
4. Copia la `DATABASE_URL`
5. Ve a **"Settings"** → **"Environment Variables"**
6. Actualiza `DATABASE_URL` con la URL copiada
7. Haz clic en **"Redeploy"**

### Opción B: Supabase (Alternativa Gratuita)

1. Ve a https://supabase.com
2. Crea nuevo proyecto
3. Copia la URL de conexión PostgreSQL
4. Ve a Vercel → **"Settings"** → **"Environment Variables"**
5. Actualiza `DATABASE_URL`
6. Redeploy

---

## 👤 Cuentas de Prueba

Una vez desplegado, accede con:

### Administrador
```
Email: admin@cocumove.com
Contraseña: Admin123!
```

### Pasajero
```
Email: passenger@cocumove.com
Contraseña: Pass123!
```

### Conductor
```
Email: driver@cocumove.com
Contraseña: Driver123!
```

---

## 🔄 Despliegues Automáticos

Después del primer despliegue, cada push a GitHub desplegará automáticamente:

```bash
git add .
git commit -m "Cambios"
git push origin master
```

Vercel desplegará en segundos.

---

## 📈 Monitoreo

### Ver Logs

1. En Vercel, ve a tu proyecto
2. Haz clic en la última **"Deployment"**
3. Ve a **"Logs"** para ver detalles

### Ver Métricas

1. En Vercel, ve a tu proyecto
2. Haz clic en **"Analytics"**
3. Ver métricas de rendimiento

---

## 🆘 Troubleshooting

### Error: "Build failed"

1. Verifica que `npm run build` funciona localmente
2. Revisa los logs en Vercel
3. Asegúrate de que todas las dependencias están en `package.json`

### Error: "Database connection failed"

1. Verifica que `DATABASE_URL` es correcta
2. Comprueba que la base de datos está accesible
3. Revisa firewall/security groups

### Error: "Module not found"

1. Verifica que todas las dependencias están instaladas
2. Ejecuta `npm install` localmente
3. Haz commit de `package-lock.json`

---

## ✅ Checklist

- [ ] Crear cuenta en Vercel (https://vercel.com/signup)
- [ ] Importar repositorio (https://vercel.com/new)
- [ ] Configurar variables de entorno
- [ ] Desplegar
- [ ] Esperar 5-10 minutos
- [ ] Acceder a https://cocumove.vercel.app
- [ ] Probar cuentas de prueba
- [ ] Configurar base de datos PostgreSQL
- [ ] Redeploy con DATABASE_URL real

---

## 🎯 URLs Importantes

| Recurso | URL |
|---------|-----|
| Vercel Signup | https://vercel.com/signup |
| Vercel New Project | https://vercel.com/new |
| Vercel Dashboard | https://vercel.com/dashboard |
| GitHub Repo | https://github.com/cctkn459/cocumove |
| Tu App (después del deploy) | https://cocumove.vercel.app |

---

## 💬 Soporte

- Email: cocupoly@gmail.com
- GitHub Issues: https://github.com/cctkn459/cocumove/issues

---

**¡Felicidades! COCUMOVE está listo para desplegar.** 🚀

Sigue estos 3 pasos y tu plataforma de transporte estará en vivo en minutos.

