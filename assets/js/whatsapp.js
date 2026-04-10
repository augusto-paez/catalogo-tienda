const WhatsApp = {

  // Abre WhatsApp con un mensaje referenciando un producto específico.
  // El nombre del producto se envía en negrita usando el formato de WA.
  consultarProducto(producto) {
    const precio = producto.precio.toLocaleString("es-AR");
    const msg = `${STORE_CONFIG.mensajeBase}*${producto.nombre}* ($${precio})`;
    this._abrir(msg);
  },

  // Abre WhatsApp con un mensaje general de consulta sobre la tienda
  consultaGeneral() {
    const msg = `${STORE_CONFIG.mensajeGeneral}${STORE_CONFIG.nombre}`;
    this._abrir(msg);
  },

  // Construye la URL de WhatsApp y la abre en una nueva pestaña.
  // replace(/\D/g, "") elimina cualquier caracter no numérico del teléfono.
  // encodeURIComponent convierte el texto en un formato válido para URLs.
  _abrir(mensaje) {
    const numero = STORE_CONFIG.whatsapp.replace(/\D/g, "");
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
  },

};