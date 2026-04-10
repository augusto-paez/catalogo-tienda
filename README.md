# Catálogo Tienda

Template de catálogo web con consulta por WhatsApp. Diseñado para ser replicado en múltiples tiendas con mínima configuración.

## Características

- Catálogo de productos con filtros por categoría y búsqueda en tiempo real
- Modal de detalle por producto
- Consulta directa por WhatsApp con mensaje prellenado
- Badge de sin stock
- Hash routing — links directos a productos y categorías
- Diseño responsive mobile first
- Sin frameworks ni dependencias — HTML, CSS y JS puro

## Estructura

## Cómo replicar para un nuevo cliente

1. Clonar o copiar el repositorio
2. Editar `config.js` con los datos del cliente
3. Reemplazar `assets/img/logo.png` con el logo de la tienda
4. Agregar fotos en `assets/img/productos/`
5. Ajustar los colores en `assets/css/theme.css`
6. Subir al hosting

## Personalización

### Colores
Editar las tres variables de acento en `theme.css`:

```css
--color-accent:       #C17B4E;
--color-accent-light: #F0E6DA;
--color-accent-dark:  #9A5E35;
```

### Productos
Agregar o editar entradas en el array `productos` de `config.js`:

```js
{
  id:          1,          // número único, no repetir
  nombre:      "Nombre",
  categoria:   "Cat1",     // debe coincidir con categorias[]
  precio:      10000,      // número sin puntos ni $
  imagen:      "assets/img/productos/foto.jpg", 
  descripcion: "Descripción corta",
  talles:      ["S", "M", "L"],  // vacío [] si no aplica
  disponible:  true,             // false = muestra "Sin stock"
}
```

## URLs disponibles

| URL | Resultado |
|-----|-----------|
| `tienda.com/` | Catálogo completo |
| `tienda.com/#vestidos` | Filtrado por categoría |
| `tienda.com/#producto-3` | Abre el modal del producto con id 3 |
