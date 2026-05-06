import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 더크리에이터즈AI 진단기 전용 마스터키 (하드코딩 이식 완료)
const firebaseConfig = {
  apiKey: "AIzaSyA_q5uu_BfKviHZtMYSXA12zCeCYjctiFQ",
  authDomain: "thecreators-94563.firebaseapp.com",
  projectId: "thecreators-94563",
  storageBucket: "thecreators-94563.firebasestorage.app",
  messagingSenderId: "967837264561",
  appId: "1:967837264561:web:8bf1bf074c858d5332d090"
};

// 파이어베이스 및 데이터베이스 엔진 시동
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };