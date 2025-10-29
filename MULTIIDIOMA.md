# Sistema Multiidioma COCUMOVE

## 📚 Idiomas Soportados

COCUMOVE soporta 4 idiomas principales del continente americano:

1. **Español (es)** - Español de América Latina
2. **English (en)** - Inglés de América del Norte
3. **Português (pt)** - Portugués de Brasil
4. **Français (fr)** - Francés de Canadá y otros países

## 🏗️ Arquitectura de i18n

### Configuración Principal
- **Archivo**: `src/shared/i18n/config.ts`
- **Librería**: `i18next` + `react-i18next`
- **Detección**: Automática basada en el navegador
- **Fallback**: Español (es)

### Estructura de Archivos
```
src/shared/i18n/
├── config.ts                    # Configuración principal
└── locales/
    ├── es/
    │   └── common.json         # Traducciones español
    ├── en/
    │   └── common.json         # Traducciones inglés
    ├── pt/
    │   └── common.json         # Traducciones portugués
    └── fr/
        └── common.json         # Traducciones francés
```

## 🔧 Uso en Componentes

### Hook useTranslation
```tsx
import { useTranslation } from 'react-i18next'

export default function MiComponente() {
  const { t, i18n } = useTranslation()

  return (
    <div>
      <h1>{t('app.title')}</h1>
      <button onClick={() => i18n.changeLanguage('es')}>
        Cambiar a Español
      </button>
    </div>
  )
}
```

### Acceso a Traducciones
```tsx
// Acceso simple
t('common.save')  // "Guardar"

// Acceso anidado
t('navigation.home')  // "Inicio"

// Con interpolación
t('errors.required', { field: 'Email' })
```

## 📝 Estructura de Traducciones

Cada archivo de traducción sigue esta estructura:

```json
{
  "app": {
    "title": "COCUMOVE - Mueve el Futuro",
    "subtitle": "Plataforma de transporte inteligente"
  },
  "navigation": {
    "home": "Inicio",
    "rides": "Viajes",
    ...
  },
  ...
}
```

### Categorías Principales

1. **app** - Información de la aplicación
2. **navigation** - Elementos de navegación
3. **auth** - Autenticación y registro
4. **passenger** - Términos de pasajero
5. **driver** - Términos de conductor
6. **admin** - Términos de administrador
7. **tokens** - Sistema de tokens COCU
8. **documents** - Documentos y verificación
9. **common** - Términos comunes
10. **errors** - Mensajes de error

## 🎯 Componentes Multiidioma

### LanguageSwitcher
Componente para cambiar idioma:

```tsx
import LanguageSwitcher from '@/shared/components/LanguageSwitcher'

// Versión completa
<LanguageSwitcher />

// Versión compacta
<LanguageSwitcher compact={true} />
```

### TokenWallet
Billetera con soporte multiidioma integrado:

```tsx
import TokenWallet from '@/shared/components/TokenWallet'

<TokenWallet />
```

## 🌍 Idiomas del Continente Americano

### Español (es)
- Países: México, Colombia, Argentina, Chile, Perú, Venezuela, etc.
- Variante: Español de América Latina
- Código ISO: es-MX, es-CO, es-AR, etc.

### English (en)
- Países: USA, Canadá
- Variante: Inglés de América del Norte
- Código ISO: en-US, en-CA

### Português (pt)
- Países: Brasil
- Variante: Portugués Brasileño
- Código ISO: pt-BR

### Français (fr)
- Países: Canadá, Haití
- Variante: Francés Canadiense
- Código ISO: fr-CA

## 🔄 Cambio de Idioma

### Automático
El idioma se detecta automáticamente basado en las preferencias del navegador.

### Manual
```tsx
const { i18n } = useTranslation()

// Cambiar idioma
i18n.changeLanguage('es')
i18n.changeLanguage('en')
i18n.changeLanguage('pt')
i18n.changeLanguage('fr')
```

### Persistencia
El idioma seleccionado se guarda en localStorage automáticamente.

## 📱 Soporte Móvil

El sistema multiidioma es completamente responsivo:
- Selector de idioma se adapta a pantallas pequeñas
- Textos se ajustan automáticamente
- Direccionalidad de texto (RTL/LTR) soportada

## 🚀 Agregar Nuevo Idioma

Para agregar un nuevo idioma:

1. Crear archivo `src/shared/i18n/locales/[codigo]/common.json`
2. Copiar estructura de `es/common.json`
3. Traducir todos los términos
4. Actualizar `src/shared/i18n/config.ts`:

```tsx
import nuevoCommon from './locales/[codigo]/common.json'

const resources = {
  // ... idiomas existentes
  [codigo]: { common: nuevoCommon },
}
```

5. Actualizar `LanguageSwitcher.tsx`:

```tsx
const languages = [
  // ... idiomas existentes
  { code: '[codigo]', name: 'Nombre', flag: '🏳️' },
]
```

## ✅ Checklist de Traducción

Al agregar nuevas funcionalidades:

- [ ] Agregar claves de traducción a todos los archivos JSON
- [ ] Mantener la misma estructura en todos los idiomas
- [ ] Usar términos consistentes
- [ ] Probar en todos los idiomas
- [ ] Verificar longitud de textos (algunos idiomas son más largos)
- [ ] Revisar contexto cultural

## 📊 Estadísticas de Cobertura

Actualmente se han traducido:

- **Español**: 100% (Completo)
- **English**: 100% (Completo)
- **Português**: 100% (Completo)
- **Français**: 100% (Completo)

Total de términos traducidos: 150+

## 🐛 Troubleshooting

### Texto no se traduce
- Verificar que la clave existe en el archivo JSON
- Revisar que el idioma está correctamente configurado
- Limpiar caché del navegador

### Idioma no cambia
- Verificar que `i18n.changeLanguage()` se ejecuta
- Revisar localStorage
- Comprobar que el componente usa `useTranslation()`

### Caracteres especiales
- Asegurar que archivos JSON están en UTF-8
- Verificar que no hay caracteres de escape incorrectos

## 📚 Referencias

- [i18next Documentation](https://www.i18next.com/)
- [react-i18next Documentation](https://react.i18next.com/)
- [ISO 639-1 Language Codes](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)

