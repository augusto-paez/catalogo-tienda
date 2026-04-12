import { Auth }        from "./auth.js";
import { Firebase }    from "./firebase.js";
import { STORE_CONFIG } from "../../config.js";

const Admin = {

  productos:          [],
  categorias:         [],
  productoEditandoId: null, // firestoreId del producto en edición, null si es nuevo

  // Punto de entrada — verifica sesión antes de mostrar el panel
  init() {
    Auth.verificarSesion(
      usuario  => this.onAutenticado(usuario),
      ()       => window.location.href = "login.html"
    );
  },

  // Se ejecuta cuando hay sesión activa
  onAutenticado(usuario) {
    document.getElementById("store-nombre").textContent = STORE_CONFIG.nombre;
    document.getElementById("admin-main").style.display = "block";
    this.bindEventos();
    this.escucharFirestore();
  },

  // Inicia la escucha en tiempo real de productos y categorías
  escucharFirestore() {
    Firebase.escucharCategorias(categorias => {
      this.categorias = categorias;
      this.renderCategorias();
      this.renderSelectCategorias();
    });

    Firebase.escucharProductos(productos => {
      this.productos = productos;
      this.renderProductos();
    });
  },

  // ── TABS ────────────────────────────────────────────────────────

  // Cambia entre las secciones de productos y categorías
  cambiarTab(tab) {
    document.querySelectorAll(".admin-tab").forEach(btn => {
      btn.classList.toggle("activo", btn.dataset.tab === tab);
    });
    document.getElementById("tab-productos").style.display  = tab === "productos"  ? "block" : "none";
    document.getElementById("tab-categorias").style.display = tab === "categorias" ? "block" : "none";
  },

  // ── PRODUCTOS ───────────────────────────────────────────────────

  // Renderiza la lista de productos en el panel
  renderProductos() {
    const el = document.getElementById("lista-productos");
    if (!el) return;

    if (this.productos.length === 0) {
      el.innerHTML = `<p class="admin-vacio">No hay productos cargados todavía.</p>`;
      return;
    }

    el.innerHTML = this.productos.map(p => `
      <div class="admin-item" data-id="${p.firestoreId}">
        <div class="admin-item-info">
          <span class="admin-item-nombre">${p.nombre}</span>
          <span class="admin-item-detalle">${p.categoria} — $${p.precio.toLocaleString("es-AR")}</span>
        </div>
        <span class="admin-item-badge ${p.disponible ? "disponible" : "agotado"}">
          ${p.disponible ? "Disponible" : "Sin stock"}
        </span>
        <div class="admin-item-acciones">
          <button class="btn-editar"   data-id="${p.firestoreId}">Editar</button>
          <button class="btn-eliminar" data-id="${p.firestoreId}">Eliminar</button>
        </div>
      </div>
    `).join("");
  },

  // Rellena el select de categorías en el formulario de producto
  renderSelectCategorias() {
    const el = document.getElementById("prod-categoria");
    if (!el) return;
    el.innerHTML = this.categorias.map(c => `
      <option value="${c.nombre}">${c.nombre}</option>
    `).join("");
  },

  // Muestra el formulario vacío para agregar un producto nuevo
  mostrarFormularioProducto() {
    this.productoEditandoId = null;
    document.getElementById("form-producto-titulo").textContent = "Nuevo producto";
    this.limpiarFormularioProducto();
    document.getElementById("form-producto-wrap").style.display = "block";
    document.getElementById("prod-nombre").focus();
  },

  // Rellena el formulario con los datos del producto a editar
  editarProducto(firestoreId) {
    const producto = this.productos.find(p => p.firestoreId === firestoreId);
    if (!producto) return;

    this.productoEditandoId = firestoreId;
    document.getElementById("form-producto-titulo").textContent = "Editar producto";
    document.getElementById("prod-nombre").value          = producto.nombre        || "";
    document.getElementById("prod-categoria").value       = producto.categoria     || "";
    document.getElementById("prod-precio").value          = producto.precio        || "";
    document.getElementById("prod-imagen").value          = producto.imagen        || "";
    document.getElementById("prod-descripcion").value     = producto.descripcion   || "";
    document.getElementById("prod-label-variantes").value = producto.labelVariantes || "";
    document.getElementById("prod-variantes").value       = (producto.variantes || []).join("\n");
    document.getElementById("prod-disponible").checked    = producto.disponible    ?? true;
    document.getElementById("form-producto-wrap").style.display = "block";
    document.getElementById("prod-nombre").focus();
  },

  // Guarda el producto — crea uno nuevo o actualiza el existente
  async guardarProducto() {
    const nombre         = document.getElementById("prod-nombre").value.trim();
    const categoria      = document.getElementById("prod-categoria").value;
    const precio         = parseFloat(document.getElementById("prod-precio").value);
    const imagen         = document.getElementById("prod-imagen").value.trim();
    const descripcion    = document.getElementById("prod-descripcion").value.trim();
    const labelVariantes = document.getElementById("prod-label-variantes").value.trim();
    const variantesRaw   = document.getElementById("prod-variantes").value.trim();
    const disponible     = document.getElementById("prod-disponible").checked;

    if (!nombre || !categoria || isNaN(precio)) {
      alert("Completá al menos nombre, categoría y precio.");
      return;
    }

    // Convierte el texto de variantes en array, filtrando líneas vacías
    const variantes = variantesRaw
      ? variantesRaw.split("\n").map(v => v.trim()).filter(v => v)
      : [];

    const datos = { nombre, categoria, precio, imagen, descripcion,
                    labelVariantes, variantes, disponible };

    const btnGuardar = document.getElementById("btn-guardar-producto");
    btnGuardar.disabled     = true;
    btnGuardar.textContent  = "Guardando...";

    try {
      if (this.productoEditandoId) {
        await Firebase.actualizarProducto(this.productoEditandoId, datos);
      } else {
        await Firebase.agregarProducto(datos);
      }
      this.ocultarFormularioProducto();
    } catch (error) {
      alert("Error al guardar el producto. Intentá de nuevo.");
    } finally {
      btnGuardar.disabled    = false;
      btnGuardar.textContent = "Guardar producto";
    }
  },

  // Elimina un producto previa confirmación
  async eliminarProducto(firestoreId) {
    const producto = this.productos.find(p => p.firestoreId === firestoreId);
    if (!producto) return;

    if (!confirm(`¿Eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`)) return;

    try {
      await Firebase.eliminarProducto(firestoreId);
    } catch (error) {
      alert("Error al eliminar el producto. Intentá de nuevo.");
    }
  },

  // Limpia todos los campos del formulario de producto
  limpiarFormularioProducto() {
    ["prod-nombre", "prod-precio", "prod-imagen",
     "prod-descripcion", "prod-label-variantes", "prod-variantes"].forEach(id => {
      document.getElementById(id).value = "";
    });
    document.getElementById("prod-disponible").checked = true;
  },

  ocultarFormularioProducto() {
    document.getElementById("form-producto-wrap").style.display = "none";
    this.productoEditandoId = null;
    this.limpiarFormularioProducto();
  },

  // ── CATEGORÍAS ──────────────────────────────────────────────────

  // Renderiza la lista de categorías en el panel
  renderCategorias() {
    const el = document.getElementById("lista-categorias");
    if (!el) return;

    if (this.categorias.length === 0) {
      el.innerHTML = `<p class="admin-vacio">No hay categorías cargadas todavía.</p>`;
      return;
    }

    el.innerHTML = this.categorias.map(c => `
      <div class="admin-item" data-id="${c.firestoreId}">
        <div class="admin-item-info">
          <span class="admin-item-nombre">${c.nombre}</span>
        </div>
        <div class="admin-item-acciones">
          <button class="btn-eliminar" data-id="${c.firestoreId}">Eliminar</button>
        </div>
      </div>
    `).join("");
  },

  // Guarda una categoría nueva en Firestore
  async guardarCategoria() {
    const nombre = document.getElementById("cat-nombre").value.trim();
    if (!nombre) {
      alert("Ingresá un nombre para la categoría.");
      return;
    }

    // Verifica que no exista una categoría con el mismo nombre
    if (this.categorias.some(c => c.nombre.toLowerCase() === nombre.toLowerCase())) {
      alert("Ya existe una categoría con ese nombre.");
      return;
    }

    const btnGuardar = document.getElementById("btn-guardar-categoria");
    btnGuardar.disabled    = true;
    btnGuardar.textContent = "Guardando...";

    try {
      await Firebase.agregarCategoria({ nombre });
      document.getElementById("cat-nombre").value = "";
      document.getElementById("form-categoria-wrap").style.display = "none";
    } catch (error) {
      alert("Error al guardar la categoría. Intentá de nuevo.");
    } finally {
      btnGuardar.disabled    = false;
      btnGuardar.textContent = "Guardar categoría";
    }
  },

  // Elimina una categoría previa confirmación
  async eliminarCategoria(firestoreId) {
    const categoria = this.categorias.find(c => c.firestoreId === firestoreId);
    if (!categoria) return;

    if (!confirm(`¿Eliminar la categoría "${categoria.nombre}"?`)) return;

    try {
      await Firebase.eliminarCategoria(firestoreId);
    } catch (error) {
      alert("Error al eliminar la categoría. Intentá de nuevo.");
    }
  },

  // ── EVENTOS ─────────────────────────────────────────────────────

  bindEventos() {
    // Tabs
    document.querySelectorAll(".admin-tab").forEach(btn => {
      btn.addEventListener("click", () => this.cambiarTab(btn.dataset.tab));
    });

    // Logout
    document.getElementById("btn-logout")?.addEventListener("click", async () => {
      await Auth.logout();
      window.location.href = "login.html";
    });

    // Productos
    document.getElementById("btn-agregar-producto")?.addEventListener("click", () => {
      this.mostrarFormularioProducto();
    });
    document.getElementById("btn-cancelar-producto")?.addEventListener("click", () => {
      this.ocultarFormularioProducto();
    });
    document.getElementById("btn-guardar-producto")?.addEventListener("click", () => {
      this.guardarProducto();
    });

    // Delegación de eventos en la lista de productos
    document.getElementById("lista-productos")?.addEventListener("click", e => {
      const btnEditar   = e.target.closest(".btn-editar");
      const btnEliminar = e.target.closest(".btn-eliminar");
      if (btnEditar)   this.editarProducto(btnEditar.dataset.id);
      if (btnEliminar) this.eliminarProducto(btnEliminar.dataset.id);
    });

    // Categorías
    document.getElementById("btn-agregar-categoria")?.addEventListener("click", () => {
      document.getElementById("form-categoria-wrap").style.display = "block";
      document.getElementById("cat-nombre").focus();
    });
    document.getElementById("btn-cancelar-categoria")?.addEventListener("click", () => {
      document.getElementById("form-categoria-wrap").style.display = "none";
      document.getElementById("cat-nombre").value = "";
    });
    document.getElementById("btn-guardar-categoria")?.addEventListener("click", () => {
      this.guardarCategoria();
    });

    // Delegación de eventos en la lista de categorías
    document.getElementById("lista-categorias")?.addEventListener("click", e => {
      const btnEliminar = e.target.closest(".btn-eliminar");
      if (btnEliminar) this.eliminarCategoria(btnEliminar.dataset.id);
    });
  },

};

document.addEventListener("DOMContentLoaded", () => Admin.init());