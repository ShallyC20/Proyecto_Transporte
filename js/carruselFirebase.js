// js/carruselFirebase.js
document.addEventListener("DOMContentLoaded", () => {
  cargarDestinos();
  cargarTransportes();
  configurarBotonesCarrusel();
});

async function cargarDestinos() {
  const destinoTrack = document.getElementById("carouselDestinos");
  if (!destinoTrack) return;

  try {
    const querySnapshot = await db.collection("ubicaciones").get();
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (!data || !data.nombre) return;

      const imagenDestino = data.imagen || "https://via.placeholder.com/150";
      const card = document.createElement("div");
      card.className = "destino-card";
      card.innerHTML = `
        <img src="${imagenDestino}" alt="${data.nombre}">
        <div class="destino-nombre">${data.nombre}</div>
      `;
      card.addEventListener("click", () => {
        const nombreEstacion = encodeURIComponent(data.nombre);
        window.location.href = `/components/detalle_ubicacion.html?estacion=${nombreEstacion}`;
      });
      destinoTrack.appendChild(card);
    });
  } catch (error) {
    console.error("Error al cargar destinos:", error);
  }
}

async function cargarTransportes() {
  const track = document.getElementById("carouselTrack");
  if (!track) return;

  try {
    const querySnapshot = await db.collection("transporte").get();
    querySnapshot.forEach((doc) => {
      const producto = doc.data();
      if (!producto || !producto.nombre) return;

      const badgeClass = {
        "Disponible": "badge-disponible",
        "En uso": "badge-en-uso",
        "Mantenimiento": "badge-mantenimiento"
      }[producto.estado] || "badge-default";

      const imagenPath = producto.imagen || "https://via.placeholder.com/150";
      const card = document.createElement("div");
      card.classList.add("card");

      card.innerHTML = `
        <div class="badge ${badgeClass}">${producto.estado}</div>
        <img src="${imagenPath}" alt="${producto.nombre}">
        <div class="card-info">
          <h4>${producto.nombre}</h4>
          <p>Estación: ${producto.estacion || "Sin especificar"}</p>
          <p><strong>Bs${(producto.tarifa || 0).toFixed(2)}/hora</strong></p>
        </div>
      `;

      card.addEventListener("click", () => {
        localStorage.setItem("productoSeleccionado", JSON.stringify(producto));
        window.location.href = "../components/detalle.html";
      });

      track.appendChild(card);
    });
  } catch (error) {
    console.error("Error al cargar productos:", error);
  }
}

function configurarBotonesCarrusel() {
  const destinoTrack = document.getElementById("carouselDestinos");
  const btnLeftD = document.getElementById("btn-destinos-left");
  const btnRightD = document.getElementById("btn-destinos-right");

  if (btnLeftD && destinoTrack) {
    btnLeftD.addEventListener("click", () =>
      destinoTrack.scrollBy({ left: -300, behavior: "smooth" })
    );
  }
  if (btnRightD && destinoTrack) {
    btnRightD.addEventListener("click", () =>
      destinoTrack.scrollBy({ left: 300, behavior: "smooth" })
    );
  }

  const track = document.getElementById("carouselTrack");
  const btnLeft = document.querySelector(".carousel-btn.left");
  const btnRight = document.querySelector(".carousel-btn.right");

  if (btnLeft && track) {
    btnLeft.addEventListener("click", () =>
      track.scrollBy({ left: -300, behavior: "smooth" })
    );
  }
  if (btnRight && track) {
    btnRight.addEventListener("click", () =>
      track.scrollBy({ left: 300, behavior: "smooth" })
    );
  }
}
