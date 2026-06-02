import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA_q5uu_BfKviHZtMYSXA12zCeCYjctiFQ",
  authDomain: "thecreators-94563.firebaseapp.com",
  projectId: "thecreators-94563",
  storageBucket: "thecreators-94563.firebasestorage.app",
  messagingSenderId: "967837264561",
  appId: "1:967837264561:web:8bf1bf074c858d5332d090"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export { db, app };