document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const estacion = urlParams.get("estacion");

  if (estacion) {
    fetch('../json/productos.json')
      .then(response => response.json())
      .then(data => {
        const punto = data.find(item => item.estacion.toLowerCase() === estacion.toLowerCase());

        if (punto) {
          document.getElementById('direccion').textContent = `Estación: ${punto.estacion}`;
          document.getElementById('descripcion').textContent = `Descripción: ${punto.descripcion}`;
          document.getElementById('coordenadas').textContent = `Coordenadas: ${punto.coordenadas}`;

          const [lat, lng] = punto.coordenadas.split(',').map(Number);

          initMap(lat, lng);
        } else {
          document.getElementById('ubicacion-info').innerHTML = '<p>No se encontró información para esta estación.</p>';
        }
      });
  }
});

function initMap(lat = -16.522, lng = -68.126) {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: { lat, lng },
  });

  new google.maps.Marker({
    position: { lat, lng },
    map,
    title: "Ubicación del Punto de Control",
  });
}
