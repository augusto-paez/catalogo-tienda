import { STORE_CONFIG }                                from "../../config.js";
import { initializeApp }                              from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword,
         signOut, onAuthStateChanged,
         sendPasswordResetEmail }                     from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Inicializa Firebase con las mismas credenciales que firebase.js.
// Firebase detecta que ya existe una instancia y la reutiliza.
const app  = initializeApp(STORE_CONFIG.firebase);
const auth = getAuth(app);

export const Auth = {

  // Inicia sesión con email y contraseña.
  // Retorna una promesa — el llamador maneja el éxito y el error.
  async login(email, password) {
    return await signInWithEmailAndPassword(auth, email, password);
  },

  // Cierra la sesión del usuario actual
  async logout() {
    return await signOut(auth);
  },

  // Envía un email de recuperación de contraseña.
  // Firebase maneja el envío y el link de reseteo automáticamente.
  // El emprendedor puede resetear su contraseña sin intervención tuya.
  async recuperarContrasena(email) {
    return await sendPasswordResetEmail(auth, email);
  },

  // Verifica si hay una sesión activa al cargar la página.
  // Llama a onAutenticado si hay sesión, a onNoAutenticado si no hay.
  // Firebase mantiene la sesión entre recargas automáticamente.
  verificarSesion(onAutenticado, onNoAutenticado) {
    onAuthStateChanged(auth, usuario => {
      if (usuario) {
        onAutenticado(usuario);
      } else {
        onNoAutenticado();
      }
    });
  },

};