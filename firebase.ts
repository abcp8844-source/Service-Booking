import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import appletConfig from '../firebase-applet-config.json';

// Detect if we are on Vercel or production domains
const isProductionDomain = 
  window.location.hostname.includes('vercel.app') || 
  window.location.hostname.includes('service-booking-global') ||
  !!import.meta.env.VITE_FIREBASE_API_KEY;

// Your custom Firebase project config
const prodConfig = {
  apiKey: "AIzaSyBblM4IdE7mJcfG-UBqW54Ft-anOU69DLQ",
  authDomain: "service-booking-fac40.firebaseapp.com",
  projectId: "service-booking-fac40",
  storageBucket: "service-booking-fac40.firebasestorage.app",
  messagingSenderId: "751595311504",
  appId: "1:751595311504:web:6be475ed42e4390886e315",
  measurementId: "G-EL4YX0E0ZM"
};

const firebaseConfig = isProductionDomain ? prodConfig : {
  apiKey: appletConfig.apiKey,
  authDomain: appletConfig.authDomain,
  projectId: appletConfig.projectId,
  storageBucket: appletConfig.storageBucket,
  messagingSenderId: appletConfig.messagingSenderId,
  appId: appletConfig.appId,
};

const app = initializeApp(firebaseConfig);

// Use custom Firestore database ID for AI Studio Applet, default for Vercel production
export const db = isProductionDomain 
  ? getFirestore(app) 
  : getFirestore(app, appletConfig.firestoreDatabaseId);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
