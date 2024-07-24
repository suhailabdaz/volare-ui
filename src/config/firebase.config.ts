// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB1zTawkxjp7z4vQ_fw9j7aNKAd-M29JEU",
  authDomain: "volare-mobile.firebaseapp.com",
  projectId: "volare-mobile",
  storageBucket: "volare-mobile.appspot.com",
  messagingSenderId: "167996512174",
  appId: "1:167996512174:web:cc9e8055395736576c1a3f",
  measurementId: "G-GTWK86WXTX"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, RecaptchaVerifier, signInWithPhoneNumber };