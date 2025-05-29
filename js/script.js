// script.js
document.addEventListener("DOMContentLoaded", () => {
  // Cargar header
  fetch("../components/mainHeader.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("mainHeaderContainer").innerHTML = html;

      const script = document.createElement("script");
      script.src = "../js/headerEvents.js";
      document.body.appendChild(script);
    });

  // Obtener componente por URL
  const params = new URLSearchParams(window.location.search);
  const fileToLoad = params.get("cargar");
  if (fileToLoad) cargarComponente(fileToLoad);
});

// Cargar componente dinámico
function cargarComponente(file) {
  const main = document.getElementById('contenido');
  const inicio = document.getElementById('inicio');

  if (inicio) inicio.style.display = 'none';
  if (main) main.style.display = 'block';

  const url = `../components${file}`;

  fetch(url)
    .then(res => res.text())
    .then(html => {
      main.innerHTML = html;

      if (file === '/Consultas_Ubicación.html') {
        cargarUbicacionesDesdeFirebase();
      }
    })
    .catch(err => {
      main.innerHTML = `<p>Error al cargar ${file}</p>`;
      console.error(err);
    });
}

// Cargar tabla de ubicaciones desde Firestore
function cargarUbicacionesDesdeFirebase() {
  const tbody = document.getElementById('tabla-ubicacion');
  if (!tbody) return;

  db.collection("transporte").get().then((querySnapshot) => {
    const ubicaciones = {};

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const dir = data.estacion;

      if (!ubicaciones[dir]) {
        ubicaciones[dir] = { total: [], disponibles: [] };
      }

      ubicaciones[dir].total.push(data.nombre);
      if (data.estado.toLowerCase() === 'disponible') {
        ubicaciones[dir].disponibles.push(data);
      }
    });

    Object.entries(ubicaciones).forEach(([dir, datos]) => {
      const tr = document.createElement('tr');

      // Dirección clickeable
      const tdDireccion = document.createElement('td');
      const aDireccion = document.createElement('a');
      aDireccion.href = `../components/ubicacion.html?estacion=${encodeURIComponent(dir)}`;
      aDireccion.textContent = dir;
      tdDireccion.appendChild(aDireccion);

      // Transportes en el punto
      const tdTransportes = document.createElement('td');
      tdTransportes.textContent = datos.total.join(', ');

      // Transportes disponibles
      const tdDisponibles = document.createElement('td');
      if (datos.disponibles.length === 0) {
        tdDisponibles.textContent = 'Ninguno';
      } else {
        datos.disponibles.forEach((prod, i) => {
          const enlace = document.createElement('a');
          enlace.href = '../components/detalle.html';
          enlace.textContent = prod.nombre;
          enlace.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.setItem('productoSeleccionado', JSON.stringify(prod));
            window.location.href = '../components/detalle.html';
          });
          tdDisponibles.appendChild(enlace);
          if (i < datos.disponibles.length - 1) {
            tdDisponibles.appendChild(document.createTextNode(', '));
          }
        });
      }

      tr.appendChild(tdDireccion);
      tr.appendChild(tdTransportes);
      tr.appendChild(tdDisponibles);
      tbody.appendChild(tr);
    });
  });
}

// 🔍 Buscar transporte en Firestore
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

  db.collection("transporte").get().then((querySnapshot) => {
    const productos = [];

    querySnapshot.forEach((doc) => {
      productos.push(doc.data());
    });

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

    resultado.forEach(prod => {
      const div = document.createElement('div');
      div.classList.add('card');

      const badgeClass = {
        "Disponible": "badge-disponible",
        "En uso": "badge-en-uso",
        "Mantenimiento": "badge-mantenimiento"
      }[prod.estado] || "badge-default";

      div.innerHTML = `
        <div class="badge ${badgeClass}">${prod.estado}</div>
        <img src="${prod.imagen || 'https://via.placeholder.com/150'}" alt="${prod.alt || prod.nombre}" style="width:100%;border-radius:8px;" />
        <h4>${prod.nombre}</h4>
        <p><strong>Estación:</strong> ${prod.estacion}</p>
        <p><strong>Bs ${prod.tarifa.toFixed(2)}/hora</strong></p>
      `;

      div.addEventListener('click', () => {
        localStorage.setItem('productoSeleccionado', JSON.stringify(prod));
        window.location.href = '../components/detalle.html';
      });

      lista.appendChild(div);
    });

    contenedor.style.display = 'block';

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
  });
}
