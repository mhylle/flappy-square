// Import Firebase from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function saveHighScore(score) {
  try {
    await setDoc(doc(db, "highScores", "current"), { score });
  } catch (error) {
    console.error("Error saving high score: ", error);
  }
}

export async function getHighScore() {
  try {
    const docSnap = await getDoc(doc(db, "highScores", "current"));
    if (docSnap.exists()) {
      return docSnap.data().score;
    } else {
      return 0;
    }
  } catch (error) {
    console.error("Error getting high score: ", error);
    return 0;
  }
}
