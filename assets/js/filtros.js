import { Catalogo } from "./catalogo.js";

export const Filtros = {

  categoriaActiva: "Todas",
  busqueda: "",

  // Renderiza los botones de filtro con las categorías recibidas desde Firestore.
  // "Todas" se agrega siempre como primera opción.
  renderFiltros(categorias) {
    const el = document.getElementById("filtros");
    if (!el) return;

    const nombres = ["Todas", ...categorias.map(c => c.nombre)];

    el.innerHTML = nombres.map(cat => `
      <button
        class="btn-filtro ${cat === this.categoriaActiva ? "activo" : ""}"
        data-categoria="${cat}"
      >${cat}</button>
    `).join("");
  },

  // Actualiza la categoría activa y re-renderiza filtros y catálogo.
  // Actualiza el hash de la URL para permitir links directos a categorías.
  setCategoria(cat) {
    this.categoriaActiva = cat;
    window.location.hash = cat === "Todas" ? "" : cat.toLowerCase();
    this.renderFiltros(Catalogo.categorias);
    Catalogo.renderCatalogo();
  },

  // Actualiza el texto de búsqueda y re-renderiza el catálogo
  setBusqueda(texto) {
    this.busqueda = texto.toLowerCase().trim();
    Catalogo.renderCatalogo();
  },

  // Devuelve los productos filtrados por categoría activa y texto de búsqueda.
  // Recibe el array de productos desde Catalogo.js.
  productosFiltrados(productos) {
    return productos.filter(p => {
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
  // Usa delegación de eventos en el contenedor para no registrar
  // un listener por cada botón.
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