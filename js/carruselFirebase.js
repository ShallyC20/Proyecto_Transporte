// js/carruselFirebase.js
document.addEventListener("DOMContentLoaded", () => {
  // Cargar destinos desde Firestore (colección "ubicaciones")
  const destinoTrack = document.getElementById("carouselDestinos");
  if (destinoTrack) {
    db.collection("ubicaciones").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const card = document.createElement("div");
        card.className = "destino-card";
        card.innerHTML = `
          <img src="https://via.placeholder.com/150" alt="${data.nombre}">
          <div class="destino-nombre">${data.nombre}</div>
        `;
        destinoTrack.appendChild(card);
      });
    });
  }

  // Cargar productos desde Firestore (colección "transporte")
  const track = document.getElementById('carouselTrack');
  if (track) {
    db.collection("transporte").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const producto = doc.data();

        const badgeClass = {
          "Disponible": "badge-disponible",
          "En uso": "badge-en-uso",
          "Mantenimiento": "badge-mantenimiento"
        }[producto.estado] || "badge-default";

        const imagenPath = producto.imagen || "https://via.placeholder.com/150";

        const card = document.createElement('div');
        card.classList.add('card');

        card.innerHTML = `
          <div class="badge ${badgeClass}">${producto.estado}</div>
          <img src="${imagenPath}" alt="${producto.nombre}">
          <div class="card-info">
            <h4>${producto.nombre}</h4>
            <p>Estación: ${producto.estacion}</p>
            <p><strong>Bs${(producto.tarifa || 0).toFixed(2)}/hora</strong></p>
          </div>
        `;

        card.addEventListener("click", () => {
          localStorage.setItem("productoSeleccionado", JSON.stringify(producto));
          window.location.href = "../components/detalle.html";
        });

        track.appendChild(card);
      });
    });
  }

  // Botones carrusel destinos
  const btnLeftD = document.getElementById("btn-destinos-left");
  const btnRightD = document.getElementById("btn-destinos-right");
  if (btnLeftD) btnLeftD.addEventListener("click", () => destinoTrack.scrollBy({ left: -300, behavior: 'smooth' }));
  if (btnRightD) btnRightD.addEventListener("click", () => destinoTrack.scrollBy({ left: 300, behavior: 'smooth' }));

  // Botones carrusel productos
  const btnLeft = document.querySelector('.carousel-btn.left');
  const btnRight = document.querySelector('.carousel-btn.right');
  if (btnLeft) btnLeft.addEventListener('click', () => track.scrollBy({ left: -300, behavior: 'smooth' }));
  if (btnRight) btnRight.addEventListener('click', () => track.scrollBy({ left: 300, behavior: 'smooth' }));
});
