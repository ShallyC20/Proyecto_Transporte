// script.js
document.addEventListener("DOMContentLoaded", () => {
  fetch("./components/mainHeader.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("mainHeaderContainer").innerHTML = html;

      // Cargar eventos del header dinámico
      const script = document.createElement("script");
      script.src = "./js/headerEvents.js";
      document.body.appendChild(script);
    });

  // Componente por parámetro ?cargar=
  const params = new URLSearchParams(window.location.search);
  const fileToLoad = params.get("cargar");

  if (fileToLoad) {
    cargarComponente(fileToLoad);
  }

  // Carrusel de index
  const track = document.getElementById('carouselTrack');
  if (track) {
    fetch('./json/productos.json')
      .then(res => res.json())
      .then(productos => {
        const grid = document.getElementById('gridTransportes');
        const tipo = document.getElementById('filterTipo');
        const estado = document.getElementById('filterEstado');
        const tarifa = document.getElementById('filterTarifa');
      
        function renderProductos(data) {
          const grid = document.getElementById('gridTransportes');
          if (!grid) {
            console.warn("⚠️ No se encontró #gridTransportes en el DOM.");
            return;
          }
        
          grid.innerHTML = '';
          data.forEach(producto => {
            const card = document.createElement('div');
            card.classList.add('card');
        
            const badgeClass = {
              "Disponible": "badge-disponible",
              "En uso": "badge-en-uso",
              "En mantenimiento": "badge-mante"
            }[producto.estado] || "badge-default";
        
            card.innerHTML = `
              <div class="badge ${badgeClass}">${producto.estado}</div>
              <img src="${producto.imagen}" alt="${producto.alt}">
              <div class="card-info">
                <h4>${producto.nombre}</h4>
                <p>Estación: ${producto.estacion}</p>
                <p><strong>Bs${producto.tarifa.toFixed(2)}/hora</strong></p>
              </div>
            `;
        
            card.addEventListener("click", () => {
              localStorage.setItem("productoSeleccionado", JSON.stringify(producto));
              window.location.href = "./components/detalle.html";
            });
        
            grid.appendChild(card);
          });
        }        
      
        function aplicarFiltros() {
          let filtrados = [...productos];
          if (tipo.value !== "Todo") filtrados = filtrados.filter(p => p.id.startsWith(tipo.value.toLowerCase()));
          if (estado.value !== "Todo") filtrados = filtrados.filter(p => p.estado === estado.value);
          if (tarifa.value === "asc") filtrados.sort((a, b) => a.tarifa - b.tarifa);
          else if (tarifa.value === "desc") filtrados.sort((a, b) => b.tarifa - a.tarifa);
      
          renderProductos(filtrados);
        }
      
        [tipo, estado, tarifa].forEach(f => f?.addEventListener('change', aplicarFiltros));
        renderProductos(productos);
      });
      
  }

  // Asignar eventos al carrusel
  const btnLeft = document.querySelector('.carousel-btn.left');
  const btnRight = document.querySelector('.carousel-btn.right');

  if (btnLeft) btnLeft.addEventListener('click', () => scrollCarouselLoop(-1));
  if (btnRight) btnRight.addEventListener('click', () => scrollCarouselLoop(1));
});

function cargarComponente(file) {
  const main = document.getElementById('contenido');
  const inicio = document.getElementById('inicio');

  if (inicio) inicio.style.display = 'none';
  if (main) main.style.display = 'block';

  const url = `./components/${file}`;

  fetch(url)
    .then(res => res.text())
    .then(html => {
      main.innerHTML = html;

      if (file === 'r1.html') {
        fetch('./json/productos.json')
          .then(res => res.json())
          .then(productos => {
            const grid = document.getElementById('gridTransportes');
            const tipo = document.getElementById('filterTipo');
            const estado = document.getElementById('filterEstado');
            const tarifa = document.getElementById('filterTarifa');
      
            function renderProductos(data) {
              if (!grid) return;
              grid.innerHTML = '';
              data.forEach(producto => {
                const card = document.createElement('div');
                card.classList.add('card');
      
                const badgeClass = {
                  "Disponible": "badge-disponible",
                  "En uso": "badge-en-uso",
                  "En mantenimiento": "badge-mante"
                }[producto.estado] || "badge-default";
      
                card.innerHTML = `
                  <div class="badge ${badgeClass}">${producto.estado}</div>
                  <img src="${producto.imagen}" alt="${producto.alt}">
                  <div class="card-info">
                    <h4>${producto.nombre}</h4>
                    <p>Estación: ${producto.estacion}</p>
                    <p><strong>Bs${producto.tarifa.toFixed(2)}/hora</strong></p>
                  </div>
                `;
      
                card.addEventListener("click", () => {
                  localStorage.setItem("productoSeleccionado", JSON.stringify(producto));
                  window.location.href = "./components/detalle.html";
                });
      
                grid.appendChild(card);
              });
            }
      
            function aplicarFiltros() {
              // Validación de seguridad
              if (!tipo || !estado || !tarifa) return;
      
              let filtrados = [...productos];
      
              if (tipo.value !== "Todo") {
                filtrados = filtrados.filter(p => p.id.startsWith(tipo.value.toLowerCase()));
              }
      
              if (estado.value !== "Todo") {
                filtrados = filtrados.filter(p => p.estado === estado.value);
              }
      
              if (tarifa.value === "asc") {
                filtrados.sort((a, b) => a.tarifa - b.tarifa);
              } else if (tarifa.value === "desc") {
                filtrados.sort((a, b) => b.tarifa - a.tarifa);
              }
      
              renderProductos(filtrados);
            }
      
            // Asignar eventos solo si los filtros existen
            if (tipo && estado && tarifa) {
              [tipo, estado, tarifa].forEach(f => f.addEventListener('change', aplicarFiltros));
              renderProductos(productos);
            }
          });
      }

      if (file === 'r6.html') {
        fetch('./json/productos.json')
          .then(res => res.json())
          .then(productos => {
            const grid = document.getElementById('gridTransportes');
            const tipo = document.getElementById('filterTipo');
            const estacion = document.getElementById('filterEstacion');
            const estado = document.getElementById('filterEstado');
      
            function renderProductos(data) {
              if (!grid) return;
              grid.innerHTML = '';
      
              data.forEach(producto => {
                const card = document.createElement('div');
                card.classList.add('card');
      
                const badgeClass = {
                  "Disponible": "badge-disponible",
                  "En uso": "badge-en-uso",
                  "Mantenimiento": "badge-mante"
                }[producto.estado] || "badge-default";
      
                card.innerHTML = `
                  <div class="badge ${badgeClass}">${producto.estado}</div>
                  <img src="${producto.imagen}" alt="${producto.alt}">
                  <div class="card-info">
                    <h4>${producto.nombre}</h4>
                    <p>Estación: ${producto.estacion}</p>
                    <p><strong>Bs${producto.tarifa.toFixed(2)}/hora</strong></p>
                  </div>
                `;
      
                card.addEventListener("click", () => {
                  localStorage.setItem("productoSeleccionado", JSON.stringify(producto));
                  window.location.href = "./components/detalle.html";
                });
      
                grid.appendChild(card);
              });
            }
      
            function aplicarFiltros() {
              if (!tipo || !estacion || !estado) return;
      
              let filtrados = [...productos];
      
              // Filtrado por tipo (usa el ID: "bicicleta1", "patineta2", etc.)
              if (tipo.value !== "Todo") {
                filtrados = filtrados.filter(p => p.id.startsWith(tipo.value.toLowerCase()));
              }
      
              if (estacion.value !== "Todo") {
                filtrados = filtrados.filter(p => p.estacion === estacion.value);
              }
      
              if (estado.value !== "Todo") {
                filtrados = filtrados.filter(p => p.estado === estado.value);
              }
      
              renderProductos(filtrados);
            }
      
            [tipo, estacion, estado].forEach(f => f?.addEventListener('change', aplicarFiltros));
            renderProductos(productos);
          });
      }
      
      
    })
    .catch(err => {
      main.innerHTML = `<p>Error al cargar ${file}</p>`;
      console.error(err);
    });
}

function scrollCarouselLoop(direction) {
  const track = document.getElementById('carouselTrack');
  if (!track) return;

  const cardWidth = track.querySelector('.card')?.offsetWidth + 24 || 300;
  const totalScroll = track.scrollWidth - track.clientWidth;
  const currentScroll = track.scrollLeft;

  let targetScroll = currentScroll + direction * cardWidth;

  if (direction === 1 && currentScroll >= totalScroll - cardWidth) {
    track.scrollTo({ left: 0, behavior: 'smooth' });
    return;
  }

  if (direction === -1 && currentScroll <= 0) {
    track.scrollTo({ left: totalScroll, behavior: 'smooth' });
    return;
  }

  track.scrollBy({
    left: direction * cardWidth,
    behavior: 'smooth'
  });
}