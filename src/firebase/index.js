import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "chat-app-dc31f.firebaseapp.com",
  projectId: "chat-app-dc31f",
  storageBucket: "chat-app-dc31f.appspot.com",
  messagingSenderId: "991097085808",
  appId: "1:991097085808:web:4991f33b7911b8f55e79b5",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { auth, firestore, storage };
