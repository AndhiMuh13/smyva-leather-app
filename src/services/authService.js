// src/services/authService.js
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const auth = getAuth();

export const registerUser = async (email, password, name) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    displayName: name,
    email: user.email,
    role: 'customer',
    createdAt: new Date(), // Simpan sebagai Timestamp di Firestore
  });
  return userCredential;
};

export const loginUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logoutUser = () => {
  return signOut(auth);
};

// Fungsi untuk memantau status login
export const monitorAuthState = (callback) => {
  // onAuthStateChanged mengembalikan fungsi 'unsubscribe'
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Jika user login, ambil data lengkap dari Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // --- PERBAIKAN DI SINI ---
        // Ubah Timestamp menjadi string ISO sebelum dikirim ke Redux
        const serializableUserData = {
          ...userData,
          uid: user.uid, // Pastikan UID dari auth selalu ada
          createdAt: userData.createdAt.toDate().toISOString(),
        };
        // -------------------------

        callback(serializableUserData);
      } else {
        // Jika dokumen user tidak ditemukan, kirim data dasar
        callback({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            createdAt: new Date().toISOString() // Kirim sebagai string
        });
      }
    } else {
      callback(null);
    }
  });
};
