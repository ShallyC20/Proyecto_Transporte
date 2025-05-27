// Navegación SPA controlada por el navbar del header para PagePagos.html

function cargarComponentePay(ruta, push = true) {
  fetch(ruta)
    .then(response => response.text())
    .then(data => {
      document.getElementById('Pay').innerHTML = data;
      window.scrollTo(0, 0);
      if (push) {
        history.pushState({ruta}, '', ruta);
      }
    });
}

function inicializarNavegacionHeader() {
  const header = document.getElementById('Header');
  const nav = header.querySelector('.navbar-pagos, .pay-navbar, nav');
  if (!nav) return;

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      // Solo manejar rutas de archivos, ignora anchors internos (#)
      if (
        href &&
        !href.startsWith('#') &&
        (
          href === 'AlquileresPagos.html' ||
          href === 'Pagos.html' ||
          href === 'HistorialViajes.html' ||
          href === 'HistorialPagos.html' ||
          href === 'MensajesMantenimiento.html'
        )
      ) {
        e.preventDefault();
        cargarComponentePay(href);
      }
    });
  });
}

// Maneja navegación con el historial del navegador
window.addEventListener('popstate', function(event) {
  const ruta = (event.state && event.state.ruta) ? event.state.ruta : 'AlquileresPagos.html';
  cargarComponentePay(ruta, false);
});

document.addEventListener('DOMContentLoaded', function() {
  fetch('Header.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('Header').innerHTML = data;
      inicializarNavegacionHeader();
    });
  fetch('Footer.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('Footer').innerHTML = data;
    });
  // Carga inicial según la URL o por defecto
  const ruta = location.pathname.split('/').pop();
  const rutasValidas = [
    'AlquileresPagos.html',
    'Pagos.html',
    'HistorialViajes.html',
    'HistorialPagos.html',
    'MensajesMantenimiento.html'
  ];
  cargarComponentePay(rutasValidas.includes(ruta) ? ruta : 'AlquileresPagos.html', false);
});
