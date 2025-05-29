import { auth, db } from "./firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const nombre = document.getElementById("nombre");
const genero = document.getElementById("genero");
const correo = document.getElementById("correo");
const nacimiento = document.getElementById("nacimiento");
const celular = document.getElementById("celular");
const kms = document.getElementById("kms");
const horas = document.getElementById("horas");
const vehiculosFav = document.getElementById("vehiculosFav");
const puntosFav = document.getElementById("puntosFav");
const fotoPerfil = document.getElementById("fotoPerfil");
const fotoHeader = document.getElementById("fotoHeader");
const nombreHeader = document.getElementById("nombreHeader");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const ref = doc(db, "usuarios", user.uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data();
      nombre.textContent = data.nombre || "";
      genero.textContent = data.genero || "";
      correo.textContent = user.email;
      nacimiento.textContent = data.fecha || "";
      celular.textContent = data.celular || "";
      kms.textContent = data.kilometros || "0";
      horas.textContent = data.horas || "0";
      nombreHeader.textContent = data.nombre || "Usuario";

      
      if (data.foto && (data.foto.startsWith("http") || data.foto.startsWith("data:image"))) {
        fotoPerfil.src = data.foto;
        fotoHeader.src = data.foto;
      } else {
        fotoPerfil.src = "img/default.jpeg";
        fotoHeader.src = "img/default.jpeg";
      }

      
      if (Array.isArray(data.vehiculos)) {
        vehiculosFav.innerHTML = data.vehiculos.map(v => `<li>${v}</li>`).join("");
      }

     
      if (Array.isArray(data.puntos)) {
        puntosFav.innerHTML = data.puntos.map(p => `<li>${p}</li>`).join("");
      }
    }
  } else {
    window.location.href = "login.html";
  }
});

document.getElementById("cerrarSesion").addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
});
