// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD30rD1AqaRdI7yUKOQ8xAgREdwe5Cou2Q",
  authDomain: "pesto-to-do-c9170.firebaseapp.com",
  projectId: "pesto-to-do-c9170",
  storageBucket: "pesto-to-do-c9170.appspot.com",
  messagingSenderId: "277665641566",
  appId: "1:277665641566:web:ce05ab82832a2026b3f0cf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export default app;