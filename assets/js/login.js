import { Auth } from "./auth.js";
import { STORE_CONFIG } from "../../config.js";

const Login = {

  // Inicializa el formulario de login
  init() {
    this.aplicarNombreTienda();
    this.bindEventos();
  },

  // Aplica el nombre de la tienda en la card de login
  aplicarNombreTienda() {
    const el = document.getElementById("store-nombre");
    if (el) el.textContent = STORE_CONFIG.nombre;
  },

  // Registra todos los eventos del formulario
  bindEventos() {
    // Botón de login
    document.getElementById("btn-login")?.addEventListener("click", () => {
      this.handleLogin();
    });

    // Permite enviar el formulario con la tecla Enter
    document.getElementById("password")?.addEventListener("keydown", e => {
      if (e.key === "Enter") this.handleLogin();
    });

    // Muestra el formulario de recuperación de contraseña
    document.getElementById("btn-recuperar")?.addEventListener("click", () => {
      this.mostrarFormularioRecuperar();
    });

    // Vuelve al formulario de login
    document.getElementById("btn-volver")?.addEventListener("click", () => {
      this.mostrarFormularioLogin();
    });

    // Botón de enviar recuperación
    document.getElementById("btn-enviar-recuperar")?.addEventListener("click", () => {
      this.handleRecuperar();
    });
  },

  // Maneja el intento de login
  async handleLogin() {
    const email    = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const btnLogin = document.getElementById("btn-login");

    if (!email || !password) {
      this.mostrarError("login-error", "Completá todos los campos.");
      return;
    }

    // Deshabilita el botón mientras procesa para evitar clicks múltiples
    btnLogin.disabled = true;
    btnLogin.textContent = "Ingresando...";
    this.ocultarError("login-error");

    try {
      await Auth.login(email, password);
      // Login exitoso — redirige al panel de administración
      window.location.href = "admin.html";
    } catch (error) {
      this.mostrarError("login-error", this.mensajeError(error.code));
      btnLogin.disabled = false;
      btnLogin.textContent = "Ingresar";
    }
  },

  // Maneja el envío del email de recuperación de contraseña
  async handleRecuperar() {
    const email   = document.getElementById("email-recuperar").value.trim();
    const btnEnviar = document.getElementById("btn-enviar-recuperar");

    if (!email) {
      this.mostrarError("recuperar-error", "Ingresá tu email.");
      return;
    }

    btnEnviar.disabled = true;
    btnEnviar.textContent = "Enviando...";
    this.ocultarError("recuperar-error");
    this.ocultarError("recuperar-success");

    try {
      await Auth.recuperarContrasena(email);
      this.mostrarSuccess("recuperar-success", "Te enviamos un link a tu email.");
      btnEnviar.disabled = false;
      btnEnviar.textContent = "Enviar link";
    } catch (error) {
      this.mostrarError("recuperar-error", this.mensajeError(error.code));
      btnEnviar.disabled = false;
      btnEnviar.textContent = "Enviar link";
    }
  },

  // Muestra el formulario de recuperación y oculta el de login
  mostrarFormularioRecuperar() {
    document.getElementById("form-login").style.display     = "none";
    document.getElementById("form-recuperar").style.display = "flex";
    this.ocultarError("recuperar-error");
    this.ocultarError("recuperar-success");
  },

  // Muestra el formulario de login y oculta el de recuperación
  mostrarFormularioLogin() {
    document.getElementById("form-recuperar").style.display = "none";
    document.getElementById("form-login").style.display     = "flex";
    this.ocultarError("login-error");
  },

  // Muestra un mensaje de error en el elemento indicado
  mostrarError(id, mensaje) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = mensaje;
    el.style.display = "block";
  },

  // Muestra un mensaje de éxito en el elemento indicado
  mostrarSuccess(id, mensaje) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = mensaje;
    el.style.display = "block";
  },

  // Oculta el mensaje de error o éxito del elemento indicado
  ocultarError(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  },

  // Traduce los códigos de error de Firebase a mensajes legibles
  mensajeError(code) {
    const errores = {
      "auth/invalid-email":       "El email no es válido.",
      "auth/user-not-found":      "No existe una cuenta con ese email.",
      "auth/wrong-password":      "La contraseña es incorrecta.",
      "auth/invalid-credential":  "Email o contraseña incorrectos.",
      "auth/too-many-requests":   "Demasiados intentos. Intentá más tarde.",
      "auth/network-request-failed": "Error de conexión. Revisá tu internet.",
    };
    return errores[code] || "Ocurrió un error. Intentá de nuevo.";
  },

};

document.addEventListener("DOMContentLoaded", () => Login.init());