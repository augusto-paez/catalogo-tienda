import { ConfigLoader } from "./config-loader.js";
import { Filtros }      from "./filtros.js";
import { Catalogo }     from "./catalogo.js";
import { Modal }        from "./modal.js";
import { Firebase }     from "./firebase.js";

const App = {

  // Punto de entrada de la aplicación.
  // Inicializa todos los módulos en el orden correcto.
  init() {
    ConfigLoader.init();      // aplica datos de la tienda al DOM
    Filtros.bindEventos();    // registra eventos del buscador y filtros
    Catalogo.bindEventos();   // registra eventos de las cards
    Modal.bindEventos();      // registra eventos de cierre del modal
    this.escucharFirestore(); // inicia la escucha en tiempo real
  },

  // Inicia la escucha en tiempo real de productos y categorías en Firestore.
  // Cada vez que el emprendedor modifica datos desde el panel de admin
  // el catálogo se actualiza automáticamente sin recargar la página.
  // hashResuelto evita que manejarHash se ejecute más de una vez
  // ya que onSnapshot puede dispararse múltiples veces.
  escucharFirestore() {
    document.getElementById("catalogo").innerHTML = `
      <div class="estado-vacio">
        <div class="estado-vacio-icono">⏳</div>
        <p>Cargando productos...</p>
      </div>
    `;

    Firebase.escucharCategorias(categorias => {
      Catalogo.setCategorias(categorias);
    });

    let hashResuelto = false;
    Firebase.escucharProductos(productos => {
      Catalogo.setProductos(productos);
      if (!hashResuelto) {
        hashResuelto = true;
        this.manejarHash();
      }
    });
  },

  // Maneja el hash de la URL al cargar la página.
  // Permite compartir links directos a productos o categorías:
  // tienda.com/#producto-abc123  → abre el modal de ese producto
  // tienda.com/#vestidos         → filtra por la categoría "Vestidos"
  manejarHash() {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;

    if (hash.startsWith("producto-")) {
      const firestoreId = hash.replace("producto-", "");
      const producto = Catalogo.productos.find(p => p.firestoreId === firestoreId);
      if (producto) Modal.abrir(producto);
      return;
    }

    // Intenta interpretar el hash como una categoría
    const cat = Catalogo.categorias.find(
      c => c.nombre.toLowerCase() === hash.toLowerCase()
    );
    if (cat) Filtros.setCategoria(cat.nombre);
  },

};

// Arranca la aplicación cuando el DOM está completamente cargado
document.addEventListener("DOMContentLoaded", () => App.init());