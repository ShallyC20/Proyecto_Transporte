const firebaseConfig = {
    apiKey: "AIzaSyCPyRTvy7EEvAxs1dZjwKk68IR4R-ZPlbQ",
    authDomain: "transportesgeolocalizacion.firebaseapp.com",
    projectId: "transportesgeolocalizacion",
    storageBucket: "transportesgeolocalizacion.appspot.com",
    messagingSenderId: "200393220762",
    appId: "1:200393220762:web:0f9e9e1ed19b4ba5b4b523"
};

const iconoBici = L.icon({
    iconUrl: '/imag/estacionamiento-de-bicicletas.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -30]
});


firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const ubicacionesRef = db.collection("ubicaciones");

let coordenadaSeleccionada = null;
const marcadores = [];

const map = L.map('map').setView([-16.532873, -68.081397], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

map.on('click', function (e) {
    coordenadaSeleccionada = e.latlng;
    document.getElementById("latitud").textContent = e.latlng.lat.toFixed(6);
    document.getElementById("longitud").textContent = e.latlng.lng.toFixed(6);
});

async function registrarUbicacion() {
    const nombre = document.getElementById("nombreInput").value.trim();
    const mensaje = document.getElementById("mensaje");
    mensaje.textContent = "";

    if (!coordenadaSeleccionada || !nombre) {
        mensaje.textContent = "Selecciona una coordenada y escribe un nombre.";
        return;
    }

    const duplicado = await ubicacionesRef.where("nombre", "==", nombre).get();
    if (!duplicado.empty) {
        mensaje.textContent = "Ya existe una ubicación con ese nombre.";
        return;
    }

    const nuevaUbicacion = {
        geo: [
            parseFloat(coordenadaSeleccionada.lat.toFixed(6)),
            parseFloat(coordenadaSeleccionada.lng.toFixed(6))
        ],
        nombre: nombre,
        estacion: nombre,
        imagen: "https://i.ibb.co/50dLpmc/defecto-Ubicacion.jpg"
    };
    await ubicacionesRef.add(nuevaUbicacion);
    document.getElementById("nombreInput").value = "";
    mensaje.textContent = "Ubicación registrada con éxito.";
    cargarUbicaciones();
}

async function cargarUbicaciones() {
    const tabla = document.getElementById("tablaUbicaciones");
    tabla.innerHTML = "";
    const snapshot = await ubicacionesRef.get();

    marcadores.forEach(m => map.removeLayer(m));
    marcadores.length = 0;

    snapshot.forEach(doc => {
        const data = doc.data();

        const marker = L.marker([data.geo[0], data.geo[1]], { icon: iconoBici }).addTo(map)
            .bindPopup(`<b>${data.nombre}</b>`);
        marcadores.push(marker);

        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td>${data.nombre}</td>
          <td>${data.geo[0].toFixed(5)}</td>
          <td>${data.geo[1].toFixed(5)}</td>
          <td>
            <button onclick="eliminarUbicacion('${doc.id}')">Eliminar</button>
            <button onclick="abrirModal('${doc.id}', '${data.nombre}', ${data.geo[0]}, ${data.geo[1]})">Editar</button>
          </td>
        `;
        tabla.appendChild(fila);
    });
}

async function eliminarUbicacion(id) {
    if (confirm("¿Deseas eliminar esta ubicación?")) {
        await ubicacionesRef.doc(id).delete();
        cargarUbicaciones();
    }
}

let idEditar = null;
function abrirModal(id, nombre, lat, lng) {
    idEditar = id;
    document.getElementById("editNombre").value = nombre;
    document.getElementById("editLat").value = lat;
    document.getElementById("editLng").value = lng;
    document.getElementById("modalEditar").style.display = "block";
}

function cerrarModal() {
    document.getElementById("modalEditar").style.display = "none";
}

async function guardarEdicion() {
    const mensaje = document.getElementById("mensaje");
    const nuevoNombre = document.getElementById("editNombre").value.trim();
    const nuevaLat = parseFloat(document.getElementById("editLat").value);
    const nuevaLng = parseFloat(document.getElementById("editLng").value);
    if (!nuevoNombre || isNaN(nuevaLat) || isNaN(nuevaLng)) return;

    ubicacionesRef.doc(idEditar).update({
        nombre: nuevoNombre,
        estacion: nuevoNombre,
        geo: [nuevaLat, nuevaLng]
    }).then(() => {
        mensaje.textContent = "Ubicación editada con éxito.";
        cerrarModal();
        cargarUbicaciones();
    });
    cargarUbicaciones();
}

cargarUbicaciones();