import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Use environment variables if available, otherwise fallback to the provided config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBblM4IdE7mJcfG-UBqW54Ft-anOU69DLQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "service-booking-fac40.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "service-booking-fac40",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "service-booking-fac40.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "751595311504",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:751595311504:web:6be475ed42e4390886e315",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-EL4YX0E0ZM"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
