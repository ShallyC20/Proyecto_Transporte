// perfil.js

window.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario) {
    alert("No hay usuario autenticado");
    return;
  }

  // Mostrar nombre en saludo y nombre completo
  const nombreUsuario = document.getElementById("nombreUsuario");
  if (nombreUsuario) nombreUsuario.textContent = usuario.nombre || "Usuario";

  const nombreCompleto = document.getElementById("nombreCompleto");
  if (nombreCompleto) nombreCompleto.textContent = usuario.nombre || "";

  // Mostrar descripción
  const descripcion = document.getElementById("descripcion");
  if (descripcion) descripcion.textContent = usuario.descripcion || "Sin descripción";

  // Mostrar dirección, estado, género
  const direccion = document.getElementById("direccion");
  if (direccion) direccion.textContent = usuario.direccion || "No especificado";

  const estado = document.getElementById("estado");
  if (estado) estado.textContent = usuario.estado || "No especificado";

  const genero = document.getElementById("genero");
  if (genero) genero.textContent = usuario.genero || "No especificado";

  // Mostrar contacto
  const correo = document.getElementById("correo");
  if (correo) correo.textContent = usuario.correo || "No especificado";

  const telefono = document.getElementById("telefono");
  if (telefono) telefono.textContent = usuario.telefono || "No especificado";

  const nit = document.getElementById("nit");
  if (nit) nit.textContent = usuario.nit || "No especificado";

  // Datos de servicio
  const rol = document.getElementById("rol");
  if (rol) rol.textContent = usuario.rol || "usuario";

  const kmRecorridos = document.getElementById("kmRecorridos");
  if (kmRecorridos) kmRecorridos.textContent = usuario.km || "0";

  const horasRecorridas = document.getElementById("horasRecorridas");
  if (horasRecorridas) horasRecorridas.textContent = usuario.horas || "0";

  // Vehículos favoritos
  const vehiculosFavoritos = document.getElementById("vehiculosFavoritos");
  if (vehiculosFavoritos) {
    vehiculosFavoritos.innerHTML = "";
    if (Array.isArray(usuario.vehiculos) && usuario.vehiculos.length > 0) {
      usuario.vehiculos.forEach(v => {
        const li = document.createElement("li");
        li.textContent = v;
        vehiculosFavoritos.appendChild(li);
      });
    } else {
      vehiculosFavoritos.innerHTML = "<li>No especificado</li>";
    }
  }

  // Puntos favoritos
  const puntosFavoritos = document.getElementById("puntosFavoritos");
  if (puntosFavoritos) {
    puntosFavoritos.innerHTML = "";
    if (Array.isArray(usuario.puntos) && usuario.puntos.length > 0) {
      usuario.puntos.forEach(p => {
        const li = document.createElement("li");
        li.textContent = p;
        puntosFavoritos.appendChild(li);
      });
    } else {
      puntosFavoritos.innerHTML = "<li>No especificado</li>";
    }
  }

  // Imagen de perfil
  const imagenPerfil = document.getElementById("imagenPerfil");
  if (imagenPerfil) {
    if (usuario.imagen) {
      imagenPerfil.src = usuario.imagen;
    } else {
      imagenPerfil.src = "/imag/monito.png"; // Imagen por defecto
    }
  }
});

// Función para cerrar sesión
function cerrarSesion() {
  localStorage.removeItem("usuario");
  window.location.href = "/components/Rental_Payments/Login%20and%20register/LoginRegister.html";
}
