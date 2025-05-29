import { db, auth } from "./firebase-config.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const form = document.getElementById("formPerfil");
const mensaje = document.getElementById("mensaje");
const inputFoto = document.getElementById("foto");
const previewImg = document.getElementById("previewImg");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const ref = doc(db, "usuarios", user.uid);
    const docSnap = await getDoc(ref);
    if (docSnap.exists()) {
      const datos = docSnap.data();
      document.getElementById("nombre").value = datos.nombre || "";
      document.getElementById("genero").value = datos.genero || "";
      document.getElementById("correo").value = user.email;
      document.getElementById("fecha").value = datos.fecha || "";
      document.getElementById("celular").value = datos.celular || "";
      inputFoto.value = datos.foto || "";
      document.getElementById("vehiculos").value = (datos.vehiculos || []).join(", ");
      document.getElementById("puntos").value = (datos.puntos || []).join(", ");
      // Mostrar vista previa
      previewImg.src = datos.foto || "img/default.jpg";
    }
  } else {
    window.location.href = "login.html";
  }
});

inputFoto.addEventListener("input", () => {
  const url = inputFoto.value.trim();
  const esImagen = url.match(/\.(jpeg|jpg|gif|png)$/i) && url.startsWith("http");
  previewImg.src = esImagen ? url : "img/default.jpg";
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const user = auth.currentUser;
  if (!user) return;

  const ref = doc(db, "usuarios", user.uid);

  const nuevosDatos = {
    nombre: document.getElementById("nombre").value,
    genero: document.getElementById("genero").value,
    fecha: document.getElementById("fecha").value,
    celular: document.getElementById("celular").value,
    foto: inputFoto.value.trim(),
    vehiculos: document.getElementById("vehiculos").value.split(",").map(v => v.trim()),
    puntos: document.getElementById("puntos").value.split(",").map(p => p.trim())
  };

  try {
    await updateDoc(ref, nuevosDatos);
    mensaje.textContent = "✅ Perfil actualizado correctamente.";
    setTimeout(() => window.location.href = "index.html", 1500);
  } catch (error) {
    console.error("Error al actualizar:", error);
    mensaje.textContent = "❌ Ocurrió un error al guardar.";
  }
});
