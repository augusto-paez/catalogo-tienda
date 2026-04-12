# Catálogo Tienda

Template de catálogo web con consulta por WhatsApp. Diseñado para ser replicado en múltiples tiendas con mínima configuración.

## Características

- Catálogo de productos con filtros por categoría y búsqueda en tiempo real
- Modal de detalle por producto
- Consulta directa por WhatsApp con mensaje prellenado
- Badge de sin stock
- Hash routing — links directos a productos y categorías
- Panel de administración protegido con login
- CRUD completo de productos y categorías desde el panel
- Variantes de producto con label personalizado (talles, medidas, colores, etc.)
- Recuperación de contraseña por email
- Actualización en tiempo real — cambios en el panel se reflejan instantáneamente en el catálogo
- Diseño responsive mobile first
- Sin frameworks — HTML, CSS y JS puro con módulos ES6

## Stack

- HTML + CSS + JavaScript (módulos ES6)
- Firebase Firestore — base de datos en tiempo real
- Firebase Authentication — login y sesiones

## Cómo replicar para un nuevo cliente

### 1 — Crear el proyecto Firebase

1. Entrá a [console.firebase.google.com](https://console.firebase.google.com)
2. Creá un proyecto nuevo con el nombre del cliente
3. Activá **Firestore Database** en modo producción
4. Activá **Authentication** con email y contraseña
5. Registrá la app web y copiá las credenciales
6. Creá el usuario admin del cliente en Authentication → Users

### 2 — Configurar el proyecto

Editá `config.js` con los datos del cliente:

```js
export const STORE_CONFIG = {
  nombre:         "Nombre de la tienda",
  slogan:         "Slogan opcional",
  logo:           "",              // ruta a la imagen o vacío
  whatsapp:       "5493815000000", // código de país + número, sin +
  mensajeBase:    "Hola! Me interesa este producto: ",
  mensajeGeneral: "Hola! Me gustaría ver el catálogo de ",

  redes: {
    instagram: "",
    facebook:  "",
    tiktok:    "",
  },

  firebase: {
    apiKey:            "...",
    authDomain:        "...",
    projectId:         "...",
    storageBucket:     "...",
    messagingSenderId: "...",
    appId:             "...",
  },
};
```

### 3 — Personalizar la identidad visual

Editá las tres variables de acento en `assets/css/theme.css`:

```css
--color-accent:       #C17B4E;
--color-accent-light: #F0E6DA;
--color-accent-dark:  #9A5E35;
```

### 4 — Subir al hosting

El proyecto funciona en cualquier hosting estático:
- [Netlify](https://netlify.com) — recomendado, drag & drop
- [Vercel](https://vercel.com)
- GitHub Pages
- cPanel — subir los archivos por FTP

### 5 — Configurar el dominio

Apuntar el dominio del cliente al hosting elegido.

## URLs del sistema

| URL | Acceso |
|-----|--------|
| `tienda.com/` | Catálogo público |
| `tienda.com/#vestidos` | Catálogo filtrado por categoría |
| `tienda.com/#producto-abc123` | Modal de producto específico |
| `tienda.com/login.html` | Login del administrador |
| `tienda.com/admin.html` | Panel de administración |

## Reglas de Firestore recomendadas para producción

Una vez que el sitio esté en producción, reemplazá las reglas de Firestore en la consola de Firebase por estas:
rules_version = '2';
service cloud.firestore {
match /databases/{database}/documents {

// Productos y categorías: lectura pública, escritura solo autenticados
match /productos/{id} {
  allow read: if true;
  allow write: if request.auth != null;
}
match /categorias/{id} {
  allow read: if true;
  allow write: if request.auth != null;
}
}
}