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

// Clave secreta para XOR
const secretKey = "mi_clave_secreta";  // Asegúrate de mantener esta clave en secreto

// Función para encriptar la contraseña usando XOR
function xorEncryptDecrypt(input, key) {
  let output = '';
  for (let i = 0; i < input.length; i++) {
    output += String.fromCharCode(input.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return output;
}

// === REGISTRO ===
document.getElementById("form-register").addEventListener("submit", async (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const contrasena = document.getElementById("contrasena").value;

  try {
    // Verificar si el correo ya está registrado
    const querySnapshot = await db.collection("usuarios")
      .where("correo", "==", correo)
      .get();

    if (!querySnapshot.empty) {
      alert("El correo ya está registrado.");
      return;
    }

    // Encriptar la contraseña antes de guardarla
    const encryptedPassword = xorEncryptDecrypt(contrasena, secretKey);

    // Guardar el usuario con la contraseña encriptada
    await db.collection("usuarios").add({
      nombre,
      correo,
      contra: encryptedPassword, // Guardamos la contraseña encriptada
      borrado: false,
      creado: new Date(),
      rol: "usuario",
      imagen: "https://i.ibb.co/M5R0YpCv/perfil-del-usuario.png"
    });

    alert("¡Registro exitoso!");

    // Verificar el usuario recién registrado
    const otroSnapshot = await db.collection("usuarios")
      .where("correo", "==", correo)
      .where("borrado", "==", false)
      .limit(1)
      .get();

    const doc = otroSnapshot.docs[0];
    const usuarioreg = doc.data();
    usuarioreg.uid = doc.id; // Añadimos el UID
    localStorage.setItem("usuario", JSON.stringify(usuarioreg));

    window.location.href = "/inicio.html"; // Redirigir al inicio

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
    // Buscar el usuario por correo
    const querySnapshot = await db.collection("usuarios")
      .where("correo", "==", correo)
      .where("borrado", "==", false)
      .limit(1)
      .get();

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const usuario = doc.data();

      // Desencriptar la contraseña almacenada en Firestore
      const decryptedPassword = xorEncryptDecrypt(usuario.contra, secretKey);

      // Verificar que la contraseña proporcionada coincida con la desencriptada
      if (contrasena !== decryptedPassword) {
        alert("Correo o contraseña incorrectos.");
        return;
      }

      usuario.uid = doc.id; // Añadimos el UID
      localStorage.setItem("usuario", JSON.stringify(usuario));

      // Redirección según el rol del usuario
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
