// src/services/authService.js
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const auth = getAuth();

export const registerUser = async (email, password, name) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  // Simpan info tambahan ke Firestore
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    displayName: name,
    email: user.email,
    role: 'customer',
    createdAt: new Date(),
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
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Jika user login, ambil data lengkap dari Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        callback({ uid: user.uid, ...userDoc.data() });
      } else {
        callback(user);
      }
    } else {
      callback(null);
    }
  });
};
