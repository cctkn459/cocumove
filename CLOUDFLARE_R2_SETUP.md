# Configuración de Cloudflare R2 para COCUMOVE

## 📋 Descripción

Cloudflare R2 es un servicio de almacenamiento de objetos compatible con S3 que proporciona almacenamiento ilimitado sin cargos de egreso de datos. COCUMOVE utiliza R2 para almacenar de forma segura todos los documentos de usuarios, incluyendo:

- Fotos de cédula (frente y dorso)
- Certificados de antecedentes policiales
- Licencias de conducir
- Documentos de registro de vehículos
- Pólizas de seguro
- Fotos de perfil
- Fotos de vehículos

## 🔧 Configuración Inicial

### Paso 1: Crear Cuenta en Cloudflare

1. Ir a [https://www.cloudflare.com/](https://www.cloudflare.com/)
2. Crear una cuenta o iniciar sesión
3. Ir a la sección "R2" en el panel de control

### Paso 2: Crear un Bucket

1. En el panel de R2, hacer clic en "Create bucket"
2. Nombre del bucket: `cocumove`
3. Seleccionar la región más cercana a los usuarios
4. Crear el bucket

### Paso 3: Crear Tokens de API

1. En el panel de R2, ir a "Settings"
2. Buscar "API Tokens"
3. Crear un nuevo token con los siguientes permisos:
   - `s3:GetObject`
   - `s3:PutObject`
   - `s3:DeleteObject`
   - `s3:ListBucket`

4. Copiar:
   - Access Key ID
   - Secret Access Key

### Paso 4: Configurar Variables de Entorno

Agregar las siguientes variables al archivo `.env`:

```env
# Cloudflare R2 Configuration
CLOUDFLARE_R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
CLOUDFLARE_R2_PUBLIC_URL=https://<custom-domain-or-public-url>
CLOUDFLARE_ACCESS_KEY_ID=<your-access-key-id>
CLOUDFLARE_SECRET_ACCESS_KEY=<your-secret-access-key>
CLOUDFLARE_BUCKET_NAME=cocumove
```

### Paso 5: Configurar Dominio Público (Opcional pero Recomendado)

Para acceder a los archivos sin URLs firmadas:

1. En R2, ir a "Settings"
2. Buscar "Custom Domains"
3. Agregar un dominio personalizado (ej: `files.cocumove.com`)
4. Configurar DNS en tu proveedor de dominio

## 📁 Estructura de Carpetas

Los archivos se organizan de la siguiente manera en R2:

```
cocumove/
├── documents/
│   ├── {userId}/
│   │   ├── cedula/
│   │   │   ├── cedula_front_{userId}.jpg
│   │   │   └── cedula_back_{userId}.jpg
│   │   └── driver/
│   │       ├── license_{userId}.pdf
│   │       ├── background_check_{userId}.pdf
│   │       ├── insurance_{userId}.pdf
│   │       └── registration_{userId}.pdf
│   └── vehicles/
│       └── vehicle_{vehicleId}.jpg
├── profiles/
│   └── profile_{userId}.jpg
└── uploads/
    └── {random-files}
```

## 🔐 Seguridad

### Validación de Archivos

- Tipos permitidos: JPEG, PNG, WebP, PDF
- Tamaño máximo: 10MB por archivo
- Validación en servidor y cliente

### Acceso a Archivos

- URLs públicas para documentos verificados
- URLs firmadas para documentos privados (expiración: 1 hora)
- Control de acceso basado en roles

### Políticas de Bucket

Se recomienda configurar políticas de bucket para:

1. Permitir lectura pública de documentos verificados
2. Restringir escritura solo a la aplicación
3. Registrar acceso en CloudTrail

## 🚀 API de Carga

### Endpoints Disponibles

#### Carga de Foto de Cédula
```
POST /api/upload/cedula
Content-Type: multipart/form-data

Files:
- files[0]: cedula_front.jpg
- files[1]: cedula_back.jpg

Response:
{
  "message": "Cédula photos uploaded successfully",
  "urls": {
    "frontUrl": "https://...",
    "backUrl": "https://..."
  }
}
```

#### Carga de Documentos de Conductor
```
POST /api/upload/driver-documents
Content-Type: multipart/form-data

Files:
- files[0]: license.pdf
- files[1]: background_check.pdf
- files[2]: insurance.pdf
- files[3]: registration.pdf

Response:
{
  "message": "Driver documents uploaded successfully",
  "urls": {
    "licenseUrl": "https://...",
    "backgroundCheckUrl": "https://...",
    "insuranceUrl": "https://...",
    "registrationUrl": "https://..."
  }
}
```

#### Carga de Foto de Vehículo
```
POST /api/upload/vehicle-photo
Content-Type: multipart/form-data

Body:
- file: vehicle.jpg
- vehicleId: "vehicle-123"

Response:
{
  "message": "Vehicle photo uploaded successfully",
  "url": "https://..."
}
```

#### Carga de Foto de Perfil
```
POST /api/upload/profile-photo
Content-Type: multipart/form-data

Body:
- file: profile.jpg

Response:
{
  "message": "Profile photo uploaded successfully",
  "url": "https://..."
}
```

## 💻 Uso en Frontend

### Componente de Carga

```tsx
import { useState } from 'react'

export function DocumentUpload() {
  const [loading, setLoading] = useState(false)
  const [urls, setUrls] = useState<any>(null)

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const token = localStorage.getItem('token')

    try {
      const response = await fetch('/api/upload/cedula', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      const data = await response.json()
      setUrls(data.urls)
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleUpload}>
      <input type="file" name="files" accept="image/jpeg" required />
      <input type="file" name="files" accept="image/jpeg" required />
      <button type="submit" disabled={loading}>
        {loading ? 'Uploading...' : 'Upload'}
      </button>
      {urls && (
        <div>
          <img src={urls.frontUrl} alt="Front" />
          <img src={urls.backUrl} alt="Back" />
        </div>
      )}
    </form>
  )
}
```

## 📊 Monitoreo

### Métricas Importantes

- Almacenamiento total utilizado
- Número de archivos
- Solicitudes por día
- Errores de carga

### Acceso a Métricas

1. En el panel de Cloudflare R2
2. Ir a "Analytics"
3. Ver métricas en tiempo real

## 🔄 Mantenimiento

### Limpieza de Archivos

Para eliminar archivos no utilizados:

```typescript
import { deleteFile } from '@/server/services/storageService'

// Eliminar archivo específico
await deleteFile('documents/user-123/cedula/cedula_front_user-123.jpg')
```

### Backup

Cloudflare R2 proporciona:
- Replicación automática
- Redundancia geográfica
- Versionado de objetos (opcional)

## 🚨 Troubleshooting

### Error: "Invalid credentials"
- Verificar que las credenciales en `.env` son correctas
- Regenerar tokens si es necesario

### Error: "Access Denied"
- Verificar permisos del token
- Asegurar que el bucket existe
- Revisar políticas de bucket

### Archivos no se cargan
- Verificar tamaño máximo (10MB)
- Validar tipo de archivo
- Revisar logs del servidor

### URLs no funcionan
- Verificar que el dominio público está configurado
- Comprobar que los archivos existen en R2
- Revisar permisos de lectura pública

## 📚 Referencias

- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [AWS S3 API Reference](https://docs.aws.amazon.com/AmazonS3/latest/API/Welcome.html)
- [Multer Documentation](https://github.com/expressjs/multer)

## 💡 Mejores Prácticas

1. **Validación**: Siempre validar archivos en servidor
2. **Encriptación**: Considerar encriptar archivos sensibles
3. **Expiración**: Usar URLs firmadas para documentos privados
4. **Logging**: Registrar todas las cargas y descargas
5. **Backup**: Hacer backup regular de documentos importantes
6. **Cumplimiento**: Asegurar cumplimiento con GDPR/CCPA

## 📝 Checklist de Configuración

- [ ] Crear cuenta en Cloudflare
- [ ] Crear bucket R2
- [ ] Generar tokens de API
- [ ] Configurar variables de entorno
- [ ] Configurar dominio público (opcional)
- [ ] Probar carga de archivos
- [ ] Configurar políticas de seguridad
- [ ] Configurar monitoreo
- [ ] Documentar credenciales de forma segura
- [ ] Realizar prueba de carga/descarga

