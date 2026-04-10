const Catalogo = {

  // Renderiza las cards de productos en el DOM.
  // Lee los productos filtrados desde Filtros.js y genera el HTML.
  renderCatalogo() {
    const el = document.getElementById("catalogo");
    const elInfo = document.getElementById("resultados-info");
    if (!el) return;

    const productos = Filtros.productosFiltrados();

    // Actualiza el contador de resultados
    if (elInfo) {
      elInfo.textContent = productos.length === 0
        ? ""
        : `${productos.length} producto${productos.length !== 1 ? "s" : ""}`;
    }

    // Muestra mensaje cuando no hay productos que coincidan
    if (productos.length === 0) {
      el.innerHTML = `
        <div class="estado-vacio">
          <div class="estado-vacio-icono">🔍</div>
          <p>No encontramos productos que coincidan con tu búsqueda.</p>
        </div>
      `;
      return;
    }

    // Genera las cards con animation-delay escalonado para el efecto en cascada
    el.innerHTML = productos
      .map((p, i) => this.templateCard(p, i))
      .join("");
  },

  // Genera el HTML de una card individual.
  // animation-delay escalonado crea el efecto de aparición en cascada.
  templateCard(producto, indice) {
    const precio = producto.precio.toLocaleString("es-AR");

    const imagen = producto.imagen
      ? `<img class="card-img" src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">`
      : `<div class="card-img-placeholder">${this.emojiCategoria(producto.categoria)}</div>`;

    const talles = producto.talles?.length
      ? producto.talles.map(t => `<span class="talle-chip">${t}</span>`).join("")
      : "";

    // JSON.stringify serializa el objeto para pasarlo como atributo HTML.
    // replace evita que las comillas dobles rompan el atributo onclick.
    const productoStr = JSON.stringify(producto).replace(/"/g, "&quot;");

    return `
      <article
        class="card"
        style="animation-delay: ${indice * 0.05}s"
        onclick="Modal.abrir(${productoStr})"
        role="button"
        tabindex="0"
        aria-label="Ver detalle de ${producto.nombre}"
      >
        <div class="card-img-wrap">
          ${imagen}
          ${!producto.disponible ? '<span class="badge-agotado">Sin stock</span>' : ""}
        </div>
        <div class="card-body">
          <span class="card-categoria">${producto.categoria}</span>
          <h3 class="card-nombre">${producto.nombre}</h3>
          <p class="card-desc">${producto.descripcion}</p>
          ${talles ? `<div class="card-talles">${talles}</div>` : ""}
          <div class="card-footer">
            <span class="card-precio">$${precio}</span>
            <button
              class="btn-wa-card"
              onclick="event.stopPropagation(); WhatsApp.consultarProducto(${productoStr})"
              ${!producto.disponible ? "disabled" : ""}
              aria-label="Consultar ${producto.nombre} por WhatsApp"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              ${producto.disponible ? "Consultar" : "Sin stock"}
            </button>
          </div>
        </div>
      </article>
    `;
  },

  // Devuelve un emoji representativo según la categoría del producto.
  // Si la categoría no está en el mapa devuelve un emoji genérico.
  emojiCategoria(categoria) {
    const mapa = {
      "Remeras":    "👕",
      "Vestidos":   "👗",
      "Pantalones": "👖",
      "Accesorios": "👜",
      "Calzado":    "👟",
      "Camperas":   "🧥",
      "Buzos":      "🧶",
    };
    return mapa[categoria] || "🛍️";
  },

};