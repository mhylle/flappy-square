// Import Firebase from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJ9gm5gtY1mzf39UhmPbp-TXdTjvnpZBY",
  authDomain: "rotatingkids.firebaseapp.com",
  projectId: "rotatingkids",
  storageBucket: "rotatingkids.firebasestorage.app",
  messagingSenderId: "744521849525",
  appId: "1:744521849525:web:22457b19d906cde3c97cfc"
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
