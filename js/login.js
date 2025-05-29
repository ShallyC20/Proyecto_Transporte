import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const form = document.getElementById("loginForm");
const mensajeError = document.getElementById("mensajeError");


onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "index.html";
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "index.html";
  } catch (error) {
    mensajeError.textContent = "❌ Correo o contraseña incorrectos.";
    console.error("Error:", error);
  }
});
