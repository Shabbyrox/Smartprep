// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);