import { initializeApp }                        from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, onSnapshot,
         addDoc, updateDoc, deleteDoc, doc }    from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const app = initializeApp(STORE_CONFIG.firebase);
const db  = getFirestore(app);

export const Firebase = {

  // Escucha cambios en tiempo real en la colección "productos".
  // Retorna una función para cancelar la escucha cuando sea necesario.
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

  // Escucha cambios en tiempo real en la colección "categorias".
  // El catálogo y los filtros se actualizan automáticamente cuando
  // el emprendedor agrega o elimina una categoría desde el panel.
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

  // Agrega un producto nuevo a Firestore
  async agregarProducto(producto) {
    return await addDoc(collection(db, "productos"), producto);
  },

  // Actualiza los campos de un producto existente
  async actualizarProducto(firestoreId, datos) {
    return await updateDoc(doc(db, "productos", firestoreId), datos);
  },

  // Elimina un producto de Firestore
  async eliminarProducto(firestoreId) {
    return await deleteDoc(doc(db, "productos", firestoreId));
  },

  // Agrega una categoría nueva a Firestore
  async agregarCategoria(categoria) {
    return await addDoc(collection(db, "categorias"), categoria);
  },

  // Elimina una categoría de Firestore
  async eliminarCategoria(firestoreId) {
    return await deleteDoc(doc(db, "categorias", firestoreId));
  },

};