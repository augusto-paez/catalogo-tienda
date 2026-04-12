import { ConfigLoader } from "./config-loader.js";
import { Filtros }      from "./filtros.js";
import { Catalogo }     from "./catalogo.js";
import { Modal }        from "./modal.js";
import { Firebase }     from "./firebase.js";

// ── Configuración de caché ───────────────────────────────────────
// Los datos se guardan en sessionStorage — duran mientras la pestaña
// esté abierta. Si el visitante abre una pestaña nueva vuelve a leer
// Firestore una sola vez.
const CACHE_KEY_PRODUCTOS  = "cache_productos";
const CACHE_KEY_CATEGORIAS = "cache_categorias";
const CACHE_DURACION_MS    = 5 * 60 * 1000; // 5 minutos en milisegundos

const App = {

  // Punto de entrada de la aplicación
  init() {
    ConfigLoader.init();
    Filtros.bindEventos();
    Catalogo.bindEventos();
    Modal.bindEventos();
    this.cargarDatos();
  },

  // Carga productos y categorías desde caché o desde Firestore
  async cargarDatos() {
    document.getElementById("catalogo").innerHTML = `
      <div class="estado-carga">
        <div class="estado-carga-spinner"></div>
        <p>Cargando productos...</p>
      </div>
    `;

    try {
      const [productos, categorias] = await Promise.all([
        this.obtenerConCache(CACHE_KEY_PRODUCTOS,  () => Firebase.obtenerProductos()),
        this.obtenerConCache(CACHE_KEY_CATEGORIAS, () => Firebase.obtenerCategorias()),
      ]);

      Catalogo.setCategorias(categorias);
      Catalogo.setProductos(productos);
      this.manejarHash();

    } catch (error) {
      document.getElementById("catalogo").innerHTML = `
        <div class="estado-vacio">
          <div class="estado-vacio-icono">⚠️</div>
          <p>No pudimos cargar los productos. Revisá tu conexión e intentá de nuevo.</p>
        </div>
      `;
    }
  },

  // Devuelve datos desde la caché si son válidos, o los obtiene desde
  // Firestore y los guarda en caché para las próximas consultas.
  async obtenerConCache(key, fetchFn) {
    try {
      const cached = sessionStorage.getItem(key);
      if (cached) {
        const { datos, timestamp } = JSON.parse(cached);
        const esValida = Date.now() - timestamp < CACHE_DURACION_MS;
        if (esValida) return datos;
      }
    } catch {
      // Si hay un error leyendo la caché simplemente la ignoramos
    }

    // Caché inválida o inexistente — lee desde Firestore
    const datos = await fetchFn();

    try {
      sessionStorage.setItem(key, JSON.stringify({
        datos,
        timestamp: Date.now(),
      }));
    } catch {
      // Si sessionStorage no está disponible continuamos sin caché
    }

    return datos;
  },

  // Maneja el hash de la URL al cargar la página.
  // Se ejecuta después de cargar los datos para poder encontrar productos.
  manejarHash() {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;

    if (hash.startsWith("producto-")) {
      const firestoreId = hash.replace("producto-", "");
      const producto = Catalogo.productos.find(p => p.firestoreId === firestoreId);
      if (producto) Modal.abrir(producto);
      return;
    }

    const cat = Catalogo.categorias.find(
      c => c.nombre.toLowerCase() === hash.toLowerCase()
    );
    if (cat) Filtros.setCategoria(cat.nombre);
  },

};

document.addEventListener("DOMContentLoaded", () => App.init());