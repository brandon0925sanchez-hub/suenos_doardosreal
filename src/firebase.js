// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6QQgUqfnFjBFsUeUG4bJ3MJJYybIP-N4",
  authDomain: "suenos-dorados.firebaseapp.com",
  databaseURL: "https://suenos-dorados-default-rtdb.firebaseio.com",
  projectId: "suenos-dorados",
  storageBucket: "suenos-dorados.firebasestorage.app",
  messagingSenderId: "642982800255",
  appId: "1:642982800255:web:be66203fea7980a1f6084a",
  measurementId: "G-L5HH8MCZ3C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase services for your components
export const auth = getAuth(app);
export const db = getFirestore(app);