import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, addDoc, getDocs } from 'firebase/firestore';
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

export const getUserCredits = async (userId) => {
  try {
    const userRef = doc(db, 'userCredits', userId);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      await setDoc(userRef, { credits: 0, email: "" });
      return { credits: 0, email: "" };
    }
  } catch (error) {
    console.error("Error getting user credits: ", error);
    throw error;
  }
};

export const updateUserCredits = async (userId, credits) => {
  const userRef = doc(db, 'userCredits', userId);
  try {
    await updateDoc(userRef, { credits });
  } catch (error) {
    console.error("Error updating user credits: ", error);
    throw error;
  }
};

export const transferCredits = async (buyerId, sellerId, credits) => {
  const buyerRef = doc(db, 'userCredits', buyerId);
  const sellerRef = doc(db, 'userCredits', sellerId);

  try {
    // Run a transaction to ensure atomicity
    await db.runTransaction(async (transaction) => {
      const buyerDoc = await transaction.get(buyerRef);
      const sellerDoc = await transaction.get(sellerRef);

      if (!buyerDoc.exists) {
        throw "Buyer does not exist!";
      }

      if (!sellerDoc.exists) {
        throw "Seller does not exist!";
      }

      const newBuyerCredits = buyerDoc.data().credits - credits;
      if (newBuyerCredits < 0) {
        throw "Insufficient credits!";
      }

      const newSellerCredits = sellerDoc.data().credits + credits;

      transaction.update(buyerRef, { credits: newBuyerCredits });
      transaction.update(sellerRef, { credits: newSellerCredits });
    });

    console.log("Transaction successfully committed!");
  } catch (error) {
    console.error("Transaction failed: ", error);
    throw error;
  }
};

export const createUserCredits = async (userId, email) => {
  try {
    await setDoc(doc(db, "userCredits", userId), {
      credits: 0,
      email: email
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const addStation = async (email, stationData) => {
  try {
    const docRef = await addDoc(collection(db, "stations"), {
      ...stationData,
      email,
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

const extractLatLongFromLink = (link) => {
  const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
  const match = link.match(regex);
  if (match) {
    const [, latitude, longitude] = match;
    return { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
  }
  return null;
};
