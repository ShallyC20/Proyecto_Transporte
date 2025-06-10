// Alternar entre formularios de Login y Registro
const container = document.getElementById("container");
const btnRegister = document.getElementById("register");
const btnLogin = document.getElementById("login");

btnRegister.addEventListener("click", () => container.classList.add("active"));
btnLogin.addEventListener("click", () => container.classList.remove("active"));

window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode");

  if (mode === "register") {
    container.classList.add("active");
  } else {
    container.classList.remove("active");
  }
});

// === REGISTRO ===
document.getElementById("form-register").addEventListener("submit", async (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const contrasena = document.getElementById("contrasena").value;

  try {
    const querySnapshot = await db.collection("usuarios")
      .where("correo", "==", correo)
      .get();

    if (!querySnapshot.empty) {
      alert("El correo ya está registrado.");
      return;
    }

    await db.collection("usuarios").add({
      nombre,
      correo,
      contra: contrasena,
      borrado: false,
      creado: new Date(),
      rol: "usuario",
      imagen: "https://i.ibb.co/M5R0YpCv/perfil-del-usuario.png"
    });

    alert("¡Registro exitoso!");

    const otroSnapshot = await db.collection("usuarios")
      .where("correo", "==", correo)
      .where("contra", "==", contrasena)
      .where("borrado", "==", false)
      .limit(1)
      .get();

    const doc = otroSnapshot.docs[0];
    const usuarioreg = doc.data();
    usuarioreg.uid = doc.id; // ✅ añadimos el UID
    localStorage.setItem("usuario", JSON.stringify(usuarioreg));

    window.location.href = "/inicio.html";

  } catch (error) {
    alert("Error al registrar: " + error.message);
  }
});

// === LOGIN ===
document.getElementById("form-login").addEventListener("submit", async (e) => {
  e.preventDefault();
  const correo = document.getElementById("login-correo").value.trim();
  const contrasena = document.getElementById("login-contrasena").value;

  try {
    const querySnapshot = await db.collection("usuarios")
      .where("correo", "==", correo)
      .where("contra", "==", contrasena)
      .where("borrado", "==", false)
      .limit(1)
      .get();

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const usuario = doc.data();
      usuario.uid = doc.id; // ✅ añadimos el UID

      localStorage.setItem("usuario", JSON.stringify(usuario));

      // Redirección según el rol
      if (usuario.rol === "usuario") {
        window.location.href = "/inicio.html";
      } else if (usuario.rol === "administrador") {
        window.location.href = "/components/admin/adminindex.html";
      } else {
        alert("Rol no reconocido.");
      }

    } else {
      alert("Correo o contraseña incorrectos.");
    }

  } catch (error) {
    alert("Error al iniciar sesión: " + error.message);
  }
});
