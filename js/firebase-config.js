import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCPyRTvy7EEvAxs1dZjwKk68IR4R-ZPlbQ",
  authDomain: "transportesgeolocalizacion.firebaseapp.com",
  projectId: "transportesgeolocalizacion",
  storageBucket: "transportesgeolocalizacion.appspot.com",
  messagingSenderId: "200393220762",
  appId: "1:200393220762:web:e62e6a4eab322b11b4b523"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
