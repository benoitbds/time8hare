import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAbEaAMUoxe-9scyddPA1uYkZTSVrGxUUU",
  authDomain: "timeshare-9c3e0.firebaseapp.com",
  projectId: "timeshare-9c3e0",
  storageBucket: "timeshare-9c3e0.firebasestorage.app",
  messagingSenderId: "249254292643",
  appId: "1:249254292643:web:713997739c2a509e99e316"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);