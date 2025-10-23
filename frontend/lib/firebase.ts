// Import the functions you need from the SDKs you need
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC9fmPQBDA8lzXqJuYTYBNEf-dBvcf1hyY",
  authDomain: "smartprep-347f2.firebaseapp.com",
  projectId: "smartprep-347f2",
  storageBucket: "smartprep-347f2.firebasestorage.app", 
  messagingSenderId: "327163603882",
  appId: "1:327163603882:web:5ae133cfca5ae9c9aa99d3",
  measurementId: "G-NF6X936FW5"
};

let app: FirebaseApp;
let db: Firestore;
let auth: Auth;

// Prevent re-initializing the app on Next.js hot reloads
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  console.log("Firebase (client) initialized");
} else {
  app = getApps()[0];
}

// Get the instances
db = getFirestore(app);
auth = getAuth(app);

// Export the db and auth instances for your components to use
export { db, app, auth };