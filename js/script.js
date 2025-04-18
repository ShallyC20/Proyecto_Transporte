// script.js
document.addEventListener("DOMContentLoaded", () => {
  fetch("./components/mainHeader.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("mainHeaderContainer").innerHTML = html;

      const script = document.createElement("script");
      script.src = "./js/headerEvents.js";
      document.body.appendChild(script);
    });

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
        productos.forEach(producto => {
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

          track.appendChild(card);
        });
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
      
              // Filtrado por tipo
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
      
      if (file === 'r2.html') {
        fetch('./json/productos.json')
          .then(response => response.json())
          .then(data => {
            const ubicaciones = {};
      
            data.forEach(item => {
              const dir = item.estacion;
              if (!ubicaciones[dir]) {
                ubicaciones[dir] = {
                  total: [],
                  disponibles: []
                };
              }
              ubicaciones[dir].total.push(item.nombre);
              if (item.estado.toLowerCase() === "disponible") {
                ubicaciones[dir].disponibles.push(item); 
              }
            });
      
            const tbody = document.getElementById('tabla-ubicacion');
      
            Object.keys(ubicaciones).forEach(dir => {
              const fila = document.createElement('tr');
      
              const celdaDireccion = document.createElement('td');
              celdaDireccion.setAttribute('data-label', 'Dirección');
              celdaDireccion.innerHTML = `<strong>${dir}</strong>`;
      
              const celdaTransportes = document.createElement('td');
              celdaTransportes.setAttribute('data-label', 'Transportes en el punto');
              celdaTransportes.textContent = ubicaciones[dir].total.join(', ');
      
              const celdaDisponibles = document.createElement('td');
              celdaDisponibles.setAttribute('data-label', 'Transportes disponibles');
              celdaDisponibles.style.color = '#27ae60';
              celdaDisponibles.style.fontWeight = 'bold';
      
              if (ubicaciones[dir].disponibles.length === 0) {
                celdaDisponibles.textContent = 'Ninguno';
              } else {
                ubicaciones[dir].disponibles.forEach((producto, idx, array) => {
                  const enlace = document.createElement('a');
                  enlace.href = './components/detalle.html';
                  enlace.textContent = producto.nombre;
                  enlace.style.marginRight = '8px';
                  enlace.style.cursor = 'pointer';
      
                  enlace.addEventListener('click', (e) => {
                    localStorage.setItem('productoSeleccionado', JSON.stringify(producto));
                  });
      
                  celdaDisponibles.appendChild(enlace);
                  if (idx < array.length - 1) {
                    celdaDisponibles.appendChild(document.createTextNode(', '));
                  }
                });
              }
      
              fila.appendChild(celdaDireccion);
              fila.appendChild(celdaTransportes);
              fila.appendChild(celdaDisponibles);
              tbody.appendChild(fila);
            });
          })
          .catch(err => {
            console.error('Error al cargar productos para r2.html:', err);
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

// Resulatdo al buscar
function buscarTransporte(valor) {
  const contenedor = document.getElementById('resultadosBusqueda');
  const lista = document.getElementById('listaResultados');
  const main = document.getElementById('contenido');
  const inicio = document.getElementById('inicio');

  if (!valor || valor.trim().length < 2) {
    contenedor.style.display = 'none';
    lista.innerHTML = '';
    if (main) main.style.display = 'block';
    if (inicio) inicio.style.display = 'block';
    return;
  }

  fetch('./json/productos.json')
    .then(res => res.json())
    .then(productos => {
      const resultado = productos.filter(p =>
        p.nombre.toLowerCase().includes(valor.toLowerCase()) ||
        p.estacion.toLowerCase().includes(valor.toLowerCase())
      );

      if (main) main.style.display = 'none';
      if (inicio) inicio.style.display = 'none';
      lista.innerHTML = '';

      if (resultado.length === 0) {
        lista.innerHTML = '<p>No se encontraron resultados.</p>';
        contenedor.style.display = 'block';
        return;
      }

      lista.innerHTML = '';
      resultado.forEach(prod => {
        const div = document.createElement('div');
        div.classList.add('card');

        div.innerHTML = `
          <div class="badge ${prod.badgeClass}">${prod.estado}</div>
          <img src="${prod.imagen}" alt="${prod.alt}" style="width:100%;border-radius:8px;" />
          <h4>${prod.nombre}</h4>
          <p><strong>Estación:</strong> ${prod.estacion}</p>
          <p><strong>Bs ${prod.tarifa.toFixed(2)}/hora</strong></p>
        `;

        div.addEventListener('click', () => {
          localStorage.setItem('productoSeleccionado', JSON.stringify(prod));
          window.location.href = './components/detalle.html';
        });

        lista.appendChild(div);
      });

      contenedor.style.display = 'block';
    });

    setTimeout(() => {
      const btnCerrar = document.getElementById('btnCerrarBusqueda');
      if (btnCerrar) {
        btnCerrar.onclick = () => {
          contenedor.style.display = 'none';
          if (main) main.style.display = 'block';
          if (inicio) inicio.style.display = 'block';
        };
      }
    }, 100);
  }
