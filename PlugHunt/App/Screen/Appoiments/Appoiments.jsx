import { View, Text, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../../Utils/FirebaseConfig';
import { collection, query, where, getDocs } from "firebase/firestore";
import { useUser } from '@clerk/clerk-expo';
import PlaceItem from '../HomeScreen/PlaceItem';

export default function Appointments() {
  const db = getFirestore(app);
  const [appointmentsList, setAppointmentsList] = useState([]);
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      getAppointments();
    }
  }, [user]);

  const getAppointments = async () => {
    setLoading(true);
    const q = query(collection(db, "appointments"), where("userEmail", "==", user?.primaryEmailAddress.emailAddress));
    const querySnapshot = await getDocs(q);
    const appointments = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      appointments.push({ id: doc.id, ...data });
    });

    const newStationsList = [];
    for (const appointment of appointments) {
      const stationDoc = await getDoc(doc(db, "stations", appointment.placeId));
      if (stationDoc.exists()) {
        newStationsList.push({ 
          id: stationDoc.id, 
          ...stationDoc.data(),
          appointment: {
            start: appointment.appointmentDate.toDate(),
            end: appointment.appointmentEndDate.toDate(),
          }
        });
      }
    }

    setAppointmentsList(newStationsList);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Your<Text style={styles.highlightText}> Appointments</Text></Text>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={'large'} color={'#53b176'} />
          <Text style={styles.loadingText}>Loading ...</Text>
        </View>
      ) : (
        <FlatList
          data={appointmentsList}
          onRefresh={() => getAppointments()}
          refreshing={loading}
          contentContainerStyle={styles.listContent}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <PlaceItem place={item} isFav={false} markedFav={() => {}} appointment={item.appointment} />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#efefea',
    
  },
  headerText: {
    fontSize: 30,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    marginTop: 5,
  },
  highlightText: {
    color: '#53b176',
    fontFamily: 'Poppins-Medium',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Poppins-Medium',
  },
  listContent: {
    paddingBottom: 20,
  },
});
