

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore

const firebaseConfig = {
  apiKey: "AIzaSyDruuIz-lnxistWx2VwFhaC9pwWgVF5bwI",
  authDomain: "bank-managemen.firebaseapp.com",
  projectId: "bank-managemen",
  storageBucket: "bank-managemen.firebasestorage.app",
  messagingSenderId: "240672914711",
  appId: "1:240672914711:web:e837a4a3a8676bf3cacb52",
  measurementId: "G-H1FY1VT7LF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore

export { auth, db }; // ✅ Ensure `db` is exported
