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
window.db = firebase.firestore();
window.auth = firebase.auth();

let usuarios = db.collection("usuarios");
let transportes = db.collection("transporte");
let ubicaciones = db.collection("ubicaciones");

window.leerDocumentos = async function () {
    const lista = document.getElementById("listaUsuarios");
    lista.innerHTML = "";
    usuarios.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data().nombre);
        });
    });
    ubicaciones.get().then((transaccion) => {
        transaccion.forEach((doc) => {
            console.log(doc.id, " => ", doc.data().datos);
            console.log(doc.data().nombre, " => ", doc.data().datos._lat);
            console.log(doc.data().nombre, " => ", doc.data().datos._long);
        });
    });
};