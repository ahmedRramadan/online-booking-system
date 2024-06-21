// firebase.js (or in a directory like /utils/firebase.js)

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXdb-u5mhZ4RX_Iuqdcukad8VBr9MV0wM",
  authDomain: "online-booking-system-1.firebaseapp.com",
  projectId: "online-booking-system-1",
  storageBucket: "online-booking-system-1.appspot.com",
  messagingSenderId: "255249528767",
  appId: "1:255249528767:web:3fed96a474a33603b2530a",
  measurementId: "G-M7XQ2D3X0X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth,db,storage };
