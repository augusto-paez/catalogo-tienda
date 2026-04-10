const STORE_CONFIG = {

  // ── Información general de la tienda ──────────────────────────
  nombre:         "Alma Tienda",
  slogan:         "Moda con identidad propia",
  logo:           "",              // ruta a la imagen, ej: "assets/img/logo.png". vacío = muestra el nombre
  whatsapp:       "5493815000000", // código de país + número, sin + ni espacios
  mensajeBase:    "Hola! Me interesa este producto: ",
  mensajeGeneral: "Hola! Me gustaría ver el catálogo de ",

  // ── Redes sociales (dejar vacío "" para ocultar el ícono) ─────
  redes: {
    instagram: "https://instagram.com/almatienda",
    facebook:  "",
    tiktok:    "",
  },

  // ── Categorías del catálogo ────────────────────────────────────
  categorias: ["Remeras", "Vestidos", "Pantalones", "Accesorios"],

  // ── Productos ─────────────────────────────────────────────────
  // imagen: ruta relativa a assets/img/productos/ o URL externa
  // disponible: false muestra badge "Sin stock" y deshabilita el botón de WA
  productos: [
    {
      id:          1,
      nombre:      "Remera esencial",
      categoria:   "Remeras",
      precio:      8500,
      imagen:      "",
      descripcion: "100% algodón peinado. Corte recto. Talles S al XL.",
      talles:      ["S", "M", "L", "XL"],
      disponible:  true,
    },
    {
      id:          2,
      nombre:      "Vestido lino natural",
      categoria:   "Vestidos",
      precio:      18500,
      imagen:      "",
      descripcion: "Lino 100%, largo midi. Ideal para el calor. Talles S al L.",
      talles:      ["S", "M", "L"],
      disponible:  true,
    },
    {
      id:          3,
      nombre:      "Jean slouchy",
      categoria:   "Pantalones",
      precio:      25000,
      imagen:      "",
      descripcion: "Corte holgado y caído. Denim medio. Talles 36 al 42.",
      talles:      ["36", "38", "40", "42"],
      disponible:  false,
    },
    {
      id:          4,
      nombre:      "Collar dorado",
      categoria:   "Accesorios",
      precio:      5500,
      imagen:      "",
      descripcion: "Baño en oro 18k. Largo regulable.",
      talles:      [],
      disponible:  true,
    },
  ],

};