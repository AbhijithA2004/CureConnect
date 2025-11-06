// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// import { getAnalytics } from "firebase/analytics"; // Uncomment if you want analytics

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDWWXwbBQTQFJ5MjrGGmvlUUPhQjFvPROw",
  authDomain: "cure-connect-bd470.firebaseapp.com",
  projectId: "cure-connect-bd470",
  storageBucket: "cure-connect-bd470.firebasestorage.app",
  messagingSenderId: "480186733949",
  appId: "1:480186733949:web:00a9677153945d824a2814",
  measurementId: "G-DBBLKECSDJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app); // Uncomment if you want analytics

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
