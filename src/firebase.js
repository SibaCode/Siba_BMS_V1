
// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getFirestore } from "firebase/firestore";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBosWTZV8wyGN_jIgPqPCogoy2bss-BhE4",
//   authDomain: "businessmanagmentsystem-c3389.firebaseapp.com",
//   projectId: "businessmanagmentsystem-c3389",
//   storageBucket: "businessmanagmentsystem-c3389.firebasestorage.app",
//   messagingSenderId: "581978849125",
//   appId: "1:581978849125:web:acc3cbd2e62be494e3ab8c",
//   measurementId: "G-C6L7752QG4"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // Initialize Analytics (only in browser environment)
// let analytics = null;
// if (typeof window !== 'undefined') {
//   analytics = getAnalytics(app);
// }

// // Initialize Firestore
// const db = getFirestore(app);

// export { db, analytics };
// firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  
};
console.log("Firebase API Key:", import.meta.env.VITE_FIREBASE_API_KEY);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
