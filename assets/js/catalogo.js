import { Filtros }  from "./filtros.js";
import { Modal }    from "./modal.js";
import { WhatsApp } from "./whatsapp.js";

// ── Configuración de paginación ──────────────────────────────────
const PRODUCTOS_POR_PAGINA = 12;

export const Catalogo = {

  productos:     [],
  categorias:    [],
  paginaActual:  1,

  // Actualiza el array de productos, resetea la paginación y re-renderiza
  setProductos(productos) {
    this.productos    = productos;
    this.paginaActual = 1;
    this.renderCatalogo();
  },

  // Actualiza el array de categorías y re-renderiza los filtros
  setCategorias(categorias) {
    this.categorias = categorias;
    Filtros.renderFiltros(categorias);
  },

  // Renderiza las cards de la página actual
  renderCatalogo() {
    const el = document.getElementById("catalogo");
    const elInfo = document.getElementById("resultados-info");
    if (!el) return;

    const productosFiltrados = Filtros.productosFiltrados(this.productos);
    const total              = productosFiltrados.length;

    // Slice de productos para la página actual
    const productosPagina = productosFiltrados.slice(0, this.paginaActual * PRODUCTOS_POR_PAGINA);

    // Actualiza el contador de resultados
    if (elInfo) {
      elInfo.textContent = total === 0
        ? ""
        : `${total} producto${total !== 1 ? "s" : ""}`;
    }

    if (total === 0) {
      el.innerHTML = `
        <div class="estado-vacio">
          <div class="estado-vacio-icono">🔍</div>
          <p>No encontramos productos que coincidan con tu búsqueda.</p>
        </div>
      `;
      return;
    }

    // Genera las cards con animation-delay escalonado
    el.innerHTML = productosPagina
      .map((p, i) => this.templateCard(p, i))
      .join("");

    // Agrega el botón "Ver más" si hay más productos por mostrar
    if (productosPagina.length < total) {
      el.insertAdjacentHTML("beforeend", `
        <div class="ver-mas-wrap">
          <button class="btn-ver-mas" id="btn-ver-mas">
            Ver más productos
            <span class="ver-mas-contador">
              ${productosPagina.length} de ${total}
            </span>
          </button>
        </div>
      `);

      document.getElementById("btn-ver-mas")?.addEventListener("click", () => {
        this.cargarMas();
      });
    }

    // Registra el evento de teclado en cada card para accesibilidad
    el.querySelectorAll(".card").forEach(card => {
      card.addEventListener("keydown", e => {
        if (e.key === "Enter") card.click();
      });
    });
  },

  // Incrementa la página actual y re-renderiza manteniendo el scroll
  cargarMas() {
    this.paginaActual++;
    const scrollAntes = window.scrollY;
    this.renderCatalogo();
    window.scrollTo(0, scrollAntes); // mantiene la posición del scroll
  },

  // Genera el HTML de una card individual
  templateCard(producto, indice) {
    const precio = producto.precio.toLocaleString("es-AR");

    const imagen = producto.imagen
      ? `<img class="card-img" src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">`
      : `<div class="card-img-placeholder">${this.emojiPlaceholder()}</div>`;

    const variantes = producto.variantes?.length
      ? producto.variantes.map(v => `<span class="talle-chip">${v}</span>`).join("")
      : "";

    return `
      <article
        class="card"
        style="animation-delay: ${indice * 0.05}s"
        data-id="${producto.firestoreId}"
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
          ${variantes ? `<div class="card-talles">${variantes}</div>` : ""}
          <div class="card-footer">
            <span class="card-precio">$${precio}</span>
            <button
              class="btn-wa-card"
              data-id="${producto.firestoreId}"
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

  // Registra los eventos de click en las cards y botones de WhatsApp
  bindEventos() {
    const el = document.getElementById("catalogo");
    if (!el) return;

    el.addEventListener("click", e => {
      const btnWa = e.target.closest(".btn-wa-card");
      if (btnWa && !btnWa.disabled) {
        e.stopPropagation();
        const producto = this.productos.find(p => p.firestoreId === btnWa.dataset.id);
        if (producto) WhatsApp.consultarProducto(producto);
        return;
      }

      const card = e.target.closest(".card");
      if (card) {
        const producto = this.productos.find(p => p.firestoreId === card.dataset.id);
        if (producto) Modal.abrir(producto);
      }
    });
  },

  // Resetea la paginación al cambiar de categoría o buscar
  resetPaginacion() {
    this.paginaActual = 1;
  },

  // Devuelve un emoji genérico cuando el producto no tiene imagen cargada
  emojiPlaceholder() {
    return "🛍️";
  },

};