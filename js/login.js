import { auth, db } from './firebase-config.js';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const form = document.getElementById("loginForm");
const mensajeError = document.getElementById("mensajeError");
const alternarModo = document.getElementById("alternarModo");
const nombreInput = document.getElementById("nombre");
const titulo = document.getElementById("titulo");
const btnPrincipal = document.getElementById("btnPrincipal");

let modoRegistro = false;

alternarModo.addEventListener("click", () => {
  modoRegistro = !modoRegistro;

  if (modoRegistro) {
    nombreInput.style.display = "block";
    titulo.textContent = "Registrarse";
    btnPrincipal.textContent = "Crear cuenta";
    alternarModo.textContent = "¿Ya tienes cuenta? Inicia sesión";
  } else {
    nombreInput.style.display = "none";
    titulo.textContent = "Iniciar Sesión";
    btnPrincipal.textContent = "Ingresar";
    alternarModo.textContent = "¿No tienes cuenta? Regístrate";
  }

  mensajeError.textContent = "";
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const nombre = document.getElementById("nombre").value.trim();

  // Validaciones visuales
  if (!email || !password || (modoRegistro && !nombre)) {
    mensajeError.style.color = "red";
    mensajeError.textContent = "❌ Por favor completa todos los campos.";
    return;
  }

  // Validación de formato de correo
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(email)) {
    mensajeError.style.color = "red";
    mensajeError.textContent = "❌ Ingresa un correo válido.";
    return;
  }

  if (password.length < 6) {
    mensajeError.style.color = "red";
    mensajeError.textContent = "❌ La contraseña debe tener al menos 6 caracteres.";
    return;
  }

  try {
    if (modoRegistro) {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "usuarios", cred.user.uid), {
        nombre,
        correo: email,
        genero: "",
        celular: "",
        fecha: "",
        foto: "",
        rol: "usuario",
        vehiculos: [],
        puntos: [],
        borrado: false
      });
      mensajeError.style.color = "green";
      mensajeError.textContent = "✅ Registro exitoso. Redirigiendo...";
    } else {
      await signInWithEmailAndPassword(auth, email, password);
      mensajeError.style.color = "green";
      mensajeError.textContent = "✅ Sesión iniciada. Redirigiendo...";
    }

    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);
  } catch (error) {
    console.error(error);
    mensajeError.style.color = "red";
    mensajeError.textContent = "❌ " + error.message;
  }
});
