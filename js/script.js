// script.js
document.addEventListener("DOMContentLoaded", () => {
  fetch("../components/mainHeader.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("mainHeaderContainer").innerHTML = html;

      const menuItems = document.querySelectorAll('.menu-item');
      const main = document.getElementById('contenido');
      const inicio = document.getElementById('inicio');

      menuItems.forEach(item => {
        item.addEventListener('click', () => {
          const file = item.getAttribute('data-component');
          const url = `./components/${file}`;

          if (inicio) inicio.style.display = 'none';
          if (main) main.style.display = 'block';

          fetch(url)
            .then(res => {
              if (!res.ok) throw new Error(`Error al cargar ${url}: ${res.statusText}`);
              return res.text();
            })
            .then(html => {
              main.innerHTML = html;

              // Renderizar r1.html dinámicamente
              if (file === 'r1.html') {
                fetch('../json/productos.json')
                  .then(response => response.json())
                  .then(productos => {
                    const grid = document.getElementById('gridTransportes');
                    const tipo = document.getElementById('filterTipo');
                    const estacion = document.getElementById('filterEstacion');
                    const estado = document.getElementById('filterEstado');
                    const tarifa = document.getElementById('filterTarifa');

                    function renderProductos(data) {
                      grid.innerHTML = '';
                      data.forEach(producto => {
                        const card = document.createElement('div');
                        card.classList.add('card');

                        // Asignar color según estado
                        let badgeClass = '';
                        switch (producto.estado) {
                          case 'Disponible':
                            badgeClass = 'badge-disponible'; break;
                          case 'En uso':
                            badgeClass = 'badge-en-uso'; break;
                          case 'En mantenimiento':
                            badgeClass = 'badge-mante'; break;
                          default:
                            badgeClass = 'badge-default'; break;
                        }

                        const badge = document.createElement('div');
                        badge.className = `badge ${badgeClass}`;
                        badge.textContent = producto.estado;

                        const img = document.createElement('img');
                        img.src = producto.imagen;
                        img.alt = producto.alt;

                        const info = document.createElement('div');
                        info.classList.add('card-info');
                        info.innerHTML = `
                          <h4>${producto.nombre}</h4>
                          <p>Estación: ${producto.estacion}</p>
                          <p><strong>Bs${producto.tarifa.toFixed(2)}/hora</strong></p>
                        `;

                        card.appendChild(badge);
                        card.appendChild(img);
                        card.appendChild(info);

                        // Evento clic para ver detalles
                        card.addEventListener('click', () => {
                          localStorage.setItem('productoSeleccionado', JSON.stringify(producto));
                          window.location.href = '../components/detalle.html';
                        });

                        grid.appendChild(card);
                      });
                    }

                    function aplicarFiltros() {
                      let filtrados = [...productos];

                      if (tipo.value !== "Todo") {
                        filtrados = filtrados.filter(p => p.id.startsWith(tipo.value.toLowerCase()));
                      }

                      if (estacion.value !== "Todo") {
                        filtrados = filtrados.filter(p => p.estacion === estacion.value);
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

                    // Eventos de filtros
                    [tipo, estacion, estado, tarifa].forEach(filtro => {
                      filtro.addEventListener('change', aplicarFiltros);
                    });

                    renderProductos(productos);
                  });
              }
            })
            .catch(error => {
              main.innerHTML = `<p>Error al cargar ${file}</p>`;
              console.error(error);
            });
        });
      });

      const btnRecargar = document.getElementById('btn-recargar-inicio');
      if (btnRecargar) {
        btnRecargar.addEventListener('click', () => {
          if (inicio) inicio.style.display = 'block';
          if (main) {
            main.innerHTML = '';
            main.style.display = 'none';
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }

      const menuInicio = document.querySelector('.menu-inicio');
      if (menuInicio) {
        menuInicio.addEventListener('click', () => {
          if (inicio) inicio.style.display = 'block';
          if (main) {
            main.innerHTML = '';
            main.style.display = 'none';
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }

      // Cargar productos en el carrusel de index.html
      if (document.getElementById('carouselTrack')) {
        fetch('../json/productos.json')
          .then(response => response.json())
          .then(productos => {
            const track = document.getElementById('carouselTrack');
            track.innerHTML = '';

            productos.forEach(producto => {
              const card = document.createElement('div');
              card.classList.add('card');

              let badgeClass = '';
              switch (producto.estado) {
                case 'Disponible':
                  badgeClass = 'badge-disponible'; break;
                case 'En uso':
                  badgeClass = 'badge-en-uso'; break;
                case 'En mantenimiento':
                  badgeClass = 'badge-mante'; break;
                default:
                  badgeClass = 'badge-default'; break;
              }

              const badge = document.createElement('div');
              badge.className = `badge ${badgeClass}`;
              badge.textContent = producto.estado;

              const img = document.createElement('img');
              img.src = producto.imagen;
              img.alt = producto.alt;

              const info = document.createElement('div');
              info.classList.add('card-info');
              info.innerHTML = `
                <h4>${producto.nombre}</h4>
                <p>Estación: ${producto.estacion}</p>
                <p><strong>Bs${producto.tarifa.toFixed(2)}/hora</strong></p>
              `;

              card.appendChild(badge);
              card.appendChild(img);
              card.appendChild(info);

              card.addEventListener('click', () => {
                console.log("Click en", producto);
                localStorage.setItem('productoSeleccionado', JSON.stringify(producto));
                window.location.href = '../components/detalle.html';
              });

              track.appendChild(card);
            });
          });
      }
    });
});

// Función para mover el carrusel
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

if (window.location.pathname.includes('detalle.html')) {
  document.addEventListener('DOMContentLoaded', () => {
    // Cargar el header
    fetch('../components/mainHeader.html')
      .then(res => res.text())
      .then(html => {
        document.getElementById("mainHeaderContainer").innerHTML = html;
      });

    // Renderizar detalle desde localStorage
    const data = JSON.parse(localStorage.getItem('productoSeleccionado'));
    if (data) {
      document.getElementById('detalleImagen').src = data.imagen;
      document.getElementById('detalleImagen').alt = data.alt;
      document.getElementById('detalleNombre').textContent = data.nombre;
      document.getElementById('detalleTarifa').textContent = data.tarifa.toFixed(2);
      document.getElementById('detalleEstacion').textContent = data.estacion;
      document.getElementById('detalleDescripcion').textContent = data.descripcion;

      const badge = document.getElementById('detalleBadge');
      badge.textContent = data.estado;

      if (data.estado === "Disponible") {
        badge.classList.add('badge-disponible');
      } else if (data.estado === "En uso") {
        badge.classList.add('badge-en-uso');
      } else if (data.estado === "En mantenimiento") {
        badge.classList.add('badge-mante');
      } else {
        badge.classList.add('badge-default');
      }

      const ul = document.getElementById('detalleTecnologia');
      data.tecnologia.forEach(tec => {
        const li = document.createElement('li');
        li.textContent = tec;
        ul.appendChild(li);
      });
    } else {
      const contenido = document.getElementById('contenido');
      if (contenido) {
        contenido.innerHTML = '<h2 style="text-align:center;margin-top:4rem;">Producto no encontrado</h2>';
      }
    }
  });
}