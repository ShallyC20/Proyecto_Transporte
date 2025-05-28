const firebaseConfig = {
    apiKey: "AIzaSyCPyRTvy7EEvAxs1dZjwKk68IR4R-ZPlbQ",
    authDomain: "transportesgeolocalizacion.firebaseapp.com",
    projectId: "transportesgeolocalizacion",
    storageBucket: "transportesgeolocalizacion.firebasestorage.app",
    messagingSenderId: "200393220762",
    appId: "1:200393220762:web:0f9e9e1ed19b4ba5b4b523",
    measurementId: "G-PN7FB0RTDM"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = firebase.firestore();

let ubicaciones = db.collection ("ubicaciones");

usuarios.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data().nombre);
        });
    });