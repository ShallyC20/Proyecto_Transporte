// Alternar entre formularios de Login y Registro
const container = document.getElementById("container");
const btnRegister = document.getElementById("register");
const btnLogin = document.getElementById("login");

btnRegister.addEventListener("click", () => container.classList.add("active"));
btnLogin.addEventListener("click", () => container.classList.remove("active"));

// Registro de usuario
document.getElementById("form-register").addEventListener("submit", async (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value;
  const correo = document.getElementById("correo").value;
  const contrasena = document.getElementById("contrasena").value;

  try {
    const userCredential = await auth.createUserWithEmailAndPassword(correo, contrasena);
    const uid = userCredential.user.uid;

    await db.collection("usuarios").doc(uid).set({
      nombre,
      correo,
      creado: firebase.firestore.FieldValue.serverTimestamp(),
      borrado: false
    });

    alert("¡Registro exitoso!");
    window.location.href = "/inicio.html";
  } catch (error) {
    alert("Error al registrar: " + error.message);
  }
});

// Inicio de sesión
document.getElementById("form-login").addEventListener("submit", async (e) => {
  e.preventDefault();
  const correo = document.getElementById("login-correo").value;
  const contrasena = document.getElementById("login-contrasena").value;

  try {
    const userCredential = await auth.signInWithEmailAndPassword(correo, contrasena);
    const uid = userCredential.user.uid;

    const doc = await db.collection("usuarios").doc(uid).get();
    if (doc.exists) {
      localStorage.setItem("usuario", JSON.stringify(doc.data()));
      window.location.href = "/inicio.html";
    } else {
      alert("Usuario no encontrado en Firestore.");
    }
  } catch (error) {
    alert("Error al iniciar sesión: " + error.message);
  }
});
