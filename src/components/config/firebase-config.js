import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyCpK7krO5kWKD2m7LFT1nvcazMPAfJchK8",
  authDomain: "school-project-96431.firebaseapp.com",
  projectId: "school-project-96431",
  storageBucket: "school-project-96431.appspot.com",
  messagingSenderId: "837344667323",
  appId: "1:837344667323:web:cf3deeb3ca460b6527eb9e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore();
export const storage = getStorage(app);