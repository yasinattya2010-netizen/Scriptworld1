import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc, query, orderBy, serverTimestamp, increment, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyA5tqUxDE8jnMUGLKMp701gihRbprUule0",
  authDomain: "worldscript-4ad3c.firebaseapp.com",
  projectId: "worldscript-4ad3c",
  storageBucket: "worldscript-4ad3c.firebasestorage.app",
  messagingSenderId: "456286797473",
  appId: "1:456286797473:web:cb4dda9df8520f720a3ae0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);