import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB5IYXkfgFLc01_aYxsL9YggYxm8N1vH78",
  authDomain: "reactjs-d979f.firebaseapp.com",
  projectId: "reactjs-d979f",
  storageBucket: "reactjs-d979f.appspot.com",
  messagingSenderId: "97999360409",
  appId: "1:97999360409:web:92641e11f0222f70768308",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
