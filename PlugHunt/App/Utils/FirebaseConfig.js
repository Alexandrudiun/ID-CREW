// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDt9d2c6oi8xwAq6sOGlLBBZ_h89NueQvo",
  authDomain: "plughunt-9477b.firebaseapp.com",
  projectId: "plughunt-9477b",
  storageBucket: "plughunt-9477b.appspot.com",
  messagingSenderId: "814411784853",
  appId: "1:814411784853:web:3295d9c1ff693c9f52b19c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const getUserCredits = async (userId) => {
  const userRef = doc(db, 'userCredits', userId);
  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    return docSnap.data().credits;
  } else {
    await setDoc(userRef, { credits: 0 });
    return 0;
  }
};

export const updateUserCredits = async (userId, credits) => {
  const userRef = doc(db, 'userCredits', userId);
  await updateDoc(userRef, {
    credits
  });
};

export const createUserCredits = async (userId) => {
  try {
    await setDoc(doc(db, "userCredits", userId), {
      credits: 0
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};