
let imagenPersonalBase64 = null;
let selectedAvatar = null;

document.getElementById("imagenInput").addEventListener("change", (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    imagenPersonalBase64 = reader.result;
    selectedAvatar = null;
  };
  if (file) reader.readAsDataURL(file);
});



window.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario) return;

  document.getElementById("nombre").value = usuario.nombre || "";
  document.getElementById("genero").value = usuario.genero || "";
  document.getElementById("descripcion").value = usuario.descripcion || "";
  document.getElementById("telefono").value = usuario.telefono || "";
  document.getElementById("fecha").value = usuario.fecha || "";
  document.getElementById("km").value = usuario.km || "0";
  document.getElementById("horas").value = usuario.horas || "0";

  const setMultiple = (id, values = []) => {
    const select = document.getElementById(id);
    [...select.options].forEach(opt => opt.selected = values.includes(opt.value));
  };
  setMultiple("vehiculos", usuario.vehiculos || []);
  setMultiple("puntos", usuario.puntos || []);
});

const form = document.getElementById("formEditar");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario || !usuario.correo) {
    Swal.fire("Error", "Usuario no autenticado", "error");
    return;
  }

  const nuevosDatos = {
    nombre: document.getElementById("nombre").value.trim(),
    genero: document.getElementById("genero").value,
    descripcion: document.getElementById("descripcion").value.trim(),
    telefono: document.getElementById("telefono").value.trim(),
    fecha: document.getElementById("fecha").value,
    imagen: imagenPersonalBase64 || selectedAvatar || usuario.imagen,
    km: document.getElementById("km").value,
    horas: document.getElementById("horas").value,
    vehiculos: Array.from(document.getElementById("vehiculos").selectedOptions).map(opt => opt.value),
    puntos: Array.from(document.getElementById("puntos").selectedOptions).map(opt => opt.value),
  };

  try {
    const querySnapshot = await db.collection("usuarios").where("correo", "==", usuario.correo).get();
    if (querySnapshot.empty) {
      Swal.fire("Error", "Usuario no encontrado en la base de datos", "error");
      return;
    }

    const docId = querySnapshot.docs[0].id;
    await db.collection("usuarios").doc(docId).update(nuevosDatos);
    localStorage.setItem("usuario", JSON.stringify({ ...usuario, ...nuevosDatos }));

    Swal.fire({
      icon: "success",
      title: "Datos guardados",
      text: "Tu perfil fue actualizado correctamente.",
    }).then(() => {
      window.location.href = "/components/Rental_Payments/Login%20and%20register/Perfil/perfil.html";
    });
  } catch (err) {
    Swal.fire("Error al guardar", err.message, "error");
  }
});
