// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// PASTE KONFIGURASI FIREBASE ANDA DI SINI
const firebaseConfig = {
  apiKey: "AIzaSyDzaZmwu-By2Kd3xD5OztBtstIpa7S0OSs",
  authDomain: "smyva-leather-dev.firebaseapp.com",
  projectId: "smyva-leather-dev",
  storageBucket: "smyva-leather-dev.firebasestorage.app",
  messagingSenderId: "457822900431",
  appId: "1:457822900431:web:d6a59647c8ec9c880527ba"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Ekspor layanan Firebase yang akan digunakan di seluruh aplikasi
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);