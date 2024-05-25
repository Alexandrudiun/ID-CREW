import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
const storage = getStorage(app);

export const getUserCredits = async (userId, email) => {
  try {
    const userRef = doc(db, 'userCredits', userId);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data().credits;
    } else {
      await setDoc(userRef, { credits: 100, email });
      return 100;
    }
  } catch (error) {
    console.error("Error getting user credits: ", error);
    throw error;
  }
};

export const updateUserCredits = async (userId, credits) => {
  const userRef = doc(db, 'userCredits', userId);
  await updateDoc(userRef, {
    credits
  });
};

export const createUserCredits = async (userId, email) => {
  try {
    await setDoc(doc(db, "userCredits", userId), {
      credits: 100,
      email
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const addStation = async (email, stationData) => {
  try {
    const docRef = await addDoc(collection(db, "stations"), {
      ...stationData,
      email, // Poster email
      createdAt: new Date(),
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};


export const uploadImage = async (uri) => {
  const response = await fetch(uri);
  const blob = await response.blob();
  const storageRef = ref(storage, `images/${Date.now()}`);
  await uploadBytes(storageRef, blob);
  return await getDownloadURL(storageRef);
};

export const fetchStations = async () => {
  const stationsCol = collection(db, 'stations');
  const stationsSnapshot = await getDocs(stationsCol);
  return stationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), isFirebase: true }));
};

// Add this function in your FirebaseConfig file
export const deleteStation = async (stationId) => {
  try {
    await deleteDoc(doc(db, "stations", stationId));
    console.log("Document successfully deleted!");
  } catch (e) {
    console.error("Error removing document: ", e);
  }
};

const extractLatLongFromLink = (link) => {
  const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
  const match = link.match(regex);
  if (match) {
    const [, latitude, longitude] = match;
    return { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
  }
  return null;
};
