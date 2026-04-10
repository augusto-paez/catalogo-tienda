const App = {

  // Punto de entrada de la aplicación.
  // Inicializa todos los módulos en el orden correcto.
  init() {
    ConfigLoader.init();  // aplica datos de la tienda al DOM
    Filtros.renderFiltros(); // renderiza los botones de categoría
    Filtros.bindEventos();   // registra eventos del buscador y filtros
    Catalogo.renderCatalogo(); // renderiza las cards de productos
    Modal.bindEventos();     // registra eventos de cierre del modal
    this.manejarHash();      // maneja la URL inicial si tiene hash
  },

  // Maneja el hash de la URL al cargar la página.
  // Permite compartir links directos a productos o categorías:
  // tienda.com/#producto-3  → abre el modal del producto con id 3
  // tienda.com/#vestidos    → filtra por la categoría "Vestidos"
  manejarHash() {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;

    if (hash.startsWith("producto-")) {
      const id = parseInt(hash.replace("producto-", ""));
      const producto = STORE_CONFIG.productos.find(p => p.id === id);
      if (producto) Modal.abrir(producto);
      return;
    }

    // Intenta interpretar el hash como una categoría
    const cat = STORE_CONFIG.categorias.find(
      c => c.toLowerCase() === hash.toLowerCase()
    );
    if (cat) Filtros.setCategoria(cat);
  },

};

// Arranca la aplicación cuando el DOM está completamente cargado
document.addEventListener("DOMContentLoaded", () => App.init());