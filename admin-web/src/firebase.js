// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCa5oLOkkWbuI9v5TaT9SxSMkkonXove_c",
  authDomain: "cricket-global-league.firebaseapp.com",
  databaseURL: "https://cricket-global-league-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "cricket-global-league",
  storageBucket: "cricket-global-league.firebasestorage.app",
  messagingSenderId: "735792511739",
  appId: "1:735792511739:web:31cf61179b8df299e6ce5e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ☁️ గూగుల్ క్లౌడ్ స్టోరేజ్ సర్వీస్ ని ఎక్స్‌పోర్ట్ చేస్తున్నాం (ఫారమ్ లలో వాడుకోవడానికి)
export const storage = getStorage(app);
