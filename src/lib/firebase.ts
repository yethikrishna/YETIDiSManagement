// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyARwti_tEzxtR5Rxh9GErOpR365xY2xZX8",
  authDomain: "y-k-r-blogs.firebaseapp.com",
  projectId: "y-k-r-blogs",
  storageBucket: "y-k-r-blogs.firebasestorage.app",
  messagingSenderId: "930081790784",
  appId: "1:930081790784:web:86342b6e812c3434ec38a5",
  measurementId: "G-TGYKG23XVM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);