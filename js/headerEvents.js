// headerEvents.js
function initHeaderEvents() {
  const menuItems = document.querySelectorAll('.menu-item');

  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      const file = item.getAttribute('data-component');
      // Siempre redirige al index con el componente como parámetro
      window.location.href = `/index.html?cargar=${file}`;
    });
  });

  const btnRecargar = document.getElementById('btn-recargar-inicio');
  if (btnRecargar) {
    btnRecargar.addEventListener('click', () => {
      window.location.href = '/index.html';
    });
  }

  const menuInicio = document.querySelector('.menu-inicio');
  if (menuInicio) {
    menuInicio.addEventListener('click', () => {
      window.location.href = '/index.html';
    });
  }
}
