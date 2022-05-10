// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDFM576xfV6mnZvbjUTGJC83w5A6j37KPY",
  authDomain: "react-konva.firebaseapp.com",
  projectId: "react-konva",
  storageBucket: "react-konva.appspot.com",
  messagingSenderId: "198921114835",
  appId: "1:198921114835:web:82d86ad599e2a5851af026",
  measurementId: "G-ZRY1LDHG1Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const storage = getStorage(app);