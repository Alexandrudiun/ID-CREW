import React, { createContext, useState, useEffect } from 'react';
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from '../Utils/FirebaseConfig';
import { useUser } from '@clerk/clerk-expo';

export const UserCreditsContext = createContext();

export const UserCreditsProvider = ({ children }) => {
  const { user } = useUser();
  const [credits, setCredits] = useState(0);
  const db = getFirestore(app);

  useEffect(() => {
    const fetchCredits = async () => {
      if (user && user.id) {
        const userRef = doc(db, 'userCredits', user.id);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setCredits(userDoc.data().credits);
        }
      }
    };

    fetchCredits();
  }, [user]);

  return (
    <UserCreditsContext.Provider value={{ credits, setCredits }}>
      {children}
    </UserCreditsContext.Provider>
  );
};
