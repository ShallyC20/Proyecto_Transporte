const firebaseConfig = {
    apiKey: "AIzaSyCPyRTvy7EEvAxs1dZjwKk68IR4R-ZPlbQ",
    authDomain: "transportesgeolocalizacion.firebaseapp.com",
    projectId: "transportesgeolocalizacion",
    storageBucket: "transportesgeolocalizacion.firebasestorage.app",
    messagingSenderId: "200393220762",
    appId: "1:200393220762:web:0f9e9e1ed19b4ba5b4b523",
    measurementId: "G-PN7FB0RTDM"
};

// Inicia el Firebase
firebase.initializeApp(firebaseConfig);

// Obtiene la base de datos de Firebase, mas que todo el FireStore
const db = firebase.firestore();

let usuarios = db.collection("usuarios");
let transportes = db.collection("transporte");
let ubicaciones = db.collection("ubicaciones");

// Iconoss
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});


// Inicializar el mapa en una ubicación (lat, lng) y zoom
const map = L.map('map').setView([-16.527426, -68.106068], 13); // La Paz, Bolivia

// Agregar capa de mapa (tiles de OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 20,
}).addTo(map);

// Agregar marcadores personalizados
const puntos = [];

const iconoBici = L.icon({
    iconUrl: '/imag/estacionamiento-de-bicicletas.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -30]
});

ubicaciones.get().then((transaccion) => {
    transaccion.forEach((doc) => {
        console.log(doc.data().nombre, " => ", doc.data().geo[0]);
        console.log(doc.data().nombre, " => ", doc.data().geo[1]);
        const data = doc.data()
        const nuevo = {
            lat: data.geo[0],
            lng: data.geo[1],
            nombre: data.nombre
        };
        puntos.push(nuevo);
    });

    // Agregar cada punto al mapa
    puntos.forEach(p => {
        L.marker([p.lat, p.lng], { icon: iconoBici })
            .addTo(map)
            .bindPopup(`<b>${p.nombre}</b>`);
    });

    // Forzar redibujado luego de que el DOM haya cargado completamente
    setTimeout(() => {
        map.invalidateSize();
    }, 500);

});

// Evento para mostrar las coordenadas del mouse
map.on('mousemove', function (e) {
    const lat = e.latlng.lat.toFixed(6);
    const lng = e.latlng.lng.toFixed(6);
    document.getElementById("coordenadas").textContent = `Latitud: ${lat}, Longitud: ${lng}`;
});

console.log(puntos)


