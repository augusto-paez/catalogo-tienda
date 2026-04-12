import { STORE_CONFIG }                              from "../../config.js";
import { initializeApp }                             from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, onSnapshot,
         getDocs, addDoc, updateDoc,
         deleteDoc, doc }                            from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const app = initializeApp(STORE_CONFIG.firebase);
const db  = getFirestore(app);

export const Firebase = {

  // ── Catálogo público — lectura única ────────────────────────────
  // getDocs() lee una sola vez y cierra la conexión.
  // Reduce drásticamente las lecturas comparado con onSnapshot().

  async obtenerProductos() {
    const snapshot = await getDocs(collection(db, "productos"));
    return snapshot.docs.map(doc => ({
      firestoreId: doc.id,
      ...doc.data(),
    }));
  },

  async obtenerCategorias() {
    const snapshot = await getDocs(collection(db, "categorias"));
    return snapshot.docs.map(doc => ({
      firestoreId: doc.id,
      ...doc.data(),
    }));
  },

  // ── Panel de admin — escucha en tiempo real ──────────────────────
  // onSnapshot() mantiene la conexión abierta para que el emprendedor
  // vea sus cambios al instante sin recargar la página.

  escucharProductos(callback) {
    const ref = collection(db, "productos");
    return onSnapshot(ref, snapshot => {
      const productos = snapshot.docs.map(doc => ({
        firestoreId: doc.id,
        ...doc.data(),
      }));
      callback(productos);
    });
  },

  escucharCategorias(callback) {
    const ref = collection(db, "categorias");
    return onSnapshot(ref, snapshot => {
      const categorias = snapshot.docs.map(doc => ({
        firestoreId: doc.id,
        ...doc.data(),
      }));
      callback(categorias);
    });
  },

  // ── CRUD de productos ────────────────────────────────────────────

  async agregarProducto(producto) {
    return await addDoc(collection(db, "productos"), producto);
  },

  async actualizarProducto(firestoreId, datos) {
    return await updateDoc(doc(db, "productos", firestoreId), datos);
  },

  async eliminarProducto(firestoreId) {
    return await deleteDoc(doc(db, "productos", firestoreId));
  },

  // ── CRUD de categorías ───────────────────────────────────────────

  async agregarCategoria(categoria) {
    return await addDoc(collection(db, "categorias"), categoria);
  },

  async eliminarCategoria(firestoreId) {
    return await deleteDoc(doc(db, "categorias", firestoreId));
  },

};