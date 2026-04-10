const Modal = {

  productoActual: null,

  // Abre el modal con el detalle del producto recibido.
  // Genera el HTML interno y agrega la clase "abierto" al overlay.
  abrir(producto) {
    this.productoActual = producto;

    const precio = producto.precio.toLocaleString("es-AR");

    const imagen = producto.imagen
      ? `<img class="modal-img" src="${producto.imagen}" alt="${producto.nombre}">`
      : `<div class="modal-img-placeholder">${Catalogo.emojiCategoria(producto.categoria)}</div>`;

    const talles = producto.talles?.length
      ? `
        <p class="modal-talles-label">Talles disponibles</p>
        <div class="modal-talles">
          ${producto.talles.map(t => `<span class="modal-talle-chip">${t}</span>`).join("")}
        </div>
      `
      : "";

    // JSON.stringify serializa el producto para pasarlo al botón de WhatsApp
    const productoStr = JSON.stringify(producto).replace(/"/g, "&quot;");

    document.getElementById("modal-contenido").innerHTML = `
      <div class="modal-img-wrap">
        ${imagen}
        <button class="modal-cerrar" onclick="Modal.cerrar()" aria-label="Cerrar">✕</button>
      </div>
      <div class="modal-body">
        <span class="modal-categoria">${producto.categoria}</span>
        <h2 class="modal-nombre">${producto.nombre}</h2>
        <p class="modal-descripcion">${producto.descripcion}</p>
        ${talles}
        <div class="modal-footer">
          <span class="modal-precio">$${precio}</span>
          <button
            class="btn-wa-modal"
            onclick="WhatsApp.consultarProducto(${productoStr})"
            ${!producto.disponible ? "disabled" : ""}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            ${producto.disponible ? "Consultar por WhatsApp" : "Sin stock"}
          </button>
        </div>
      </div>
    `;

    document.getElementById("modal-overlay").classList.add("abierto");
    document.body.style.overflow = "hidden"; // evita scroll del fondo mientras el modal está abierto
    window.location.hash = `producto-${producto.id}`;
  },

  // Cierra el modal quitando la clase "abierto" y limpiando el estado
  cerrar() {
    document.getElementById("modal-overlay").classList.remove("abierto");
    document.body.style.overflow = "";
    this.productoActual = null;
    history.replaceState(null, "", window.location.pathname); // limpia el hash de la URL
  },

  // Registra los eventos de cierre del modal:
  // click en el overlay y tecla Escape
  bindEventos() {
    document.getElementById("modal-overlay")?.addEventListener("click", e => {
      if (e.target === e.currentTarget) this.cerrar();
    });

    document.addEventListener("keydown", e => {
      if (e.key === "Escape") this.cerrar();
    });
  },

};