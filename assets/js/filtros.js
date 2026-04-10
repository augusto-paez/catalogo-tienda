const Filtros = {

  categoriaActiva: "Todas",
  busqueda: "",

  // Renderiza los botones de filtro leyendo las categorías de config.js.
  // "Todas" se agrega siempre como primera opción.
  renderFiltros() {
    const el = document.getElementById("filtros");
    if (!el) return;

    const categorias = ["Todas", ...STORE_CONFIG.categorias];

    el.innerHTML = categorias.map(cat => `
      <button
        class="btn-filtro ${cat === this.categoriaActiva ? "activo" : ""}"
        data-categoria="${cat}"
      >${cat}</button>
    `).join("");
  },

  // Actualiza la categoría activa y re-renderiza filtros y catálogo
  setCategoria(cat) {
    this.categoriaActiva = cat;
    this.renderFiltros();
    Catalogo.renderCatalogo();
  },

  // Actualiza el texto de búsqueda y re-renderiza el catálogo
  setBusqueda(texto) {
    this.busqueda = texto.toLowerCase().trim();
    Catalogo.renderCatalogo();
  },

  // Devuelve los productos filtrados por categoría y búsqueda.
  // Lo usan Catalogo.js para renderizar las cards.
  productosFiltrados() {
    return STORE_CONFIG.productos.filter(p => {
      const matchCategoria =
        this.categoriaActiva === "Todas" || p.categoria === this.categoriaActiva;

      // Busca coincidencias en nombre, descripción y categoría
      const matchBusqueda =
        !this.busqueda ||
        p.nombre.toLowerCase().includes(this.busqueda) ||
        p.descripcion.toLowerCase().includes(this.busqueda) ||
        p.categoria.toLowerCase().includes(this.busqueda);

      return matchCategoria && matchBusqueda;
    });
  },

  // Registra los eventos del buscador y los botones de filtro.
  // Usa delegación de eventos en el contenedor de filtros para
  // no tener que registrar un listener por cada botón.
  bindEventos() {
    document.getElementById("filtros")?.addEventListener("click", e => {
      const btn = e.target.closest(".btn-filtro");
      if (btn) this.setCategoria(btn.dataset.categoria);
    });

    document.getElementById("search-input")?.addEventListener("input", e => {
      this.setBusqueda(e.target.value);
    });
  },

};