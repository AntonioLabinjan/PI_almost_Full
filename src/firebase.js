// OVO TU SI SAMO ISKOPIRATE IZ KONZOLE
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgN6GM4cgBWwddsALWSBa8giAMl4QTzQs",
  authDomain: "todolist-759af.firebaseapp.com",
  projectId: "todolist-759af",
  storageBucket: "todolist-759af.firebasestorage.app",
  messagingSenderId: "636004900807",
  appId: "1:636004900807:web:d86400f245bbd660bb03e2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// OVO MORATE DODATNO NADOPISAT...isto tako će bit za auth, storage za slike itd. Ali that's future stuff
// Initialize Firestore
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Export db so you can use it in your Vue app
// ovo exportate tako da se more dohvatit u svakoj komponenti
export { db, auth, storage };
