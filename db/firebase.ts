// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCUxipGkyKQjpBtH_hT_1rUn5izVyQehQ4",
  authDomain: "homeapp-f0b7a.firebaseapp.com",
  projectId: "homeapp-f0b7a",
  storageBucket: "homeapp-f0b7a.firebasestorage.app",
  messagingSenderId: "75334641184",
  appId: "1:75334641184:web:9c9c469aedad9f85b5fe45",
  measurementId: "G-9WCSK7WXRM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const realTimeDB = getDatabase(app);