import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getFirestore } from 'firebase/firestore';
import { app } from '../../Utils/FirebaseConfig';
import { collection, query, where, getDocs } from "firebase/firestore";
import { useUser } from '@clerk/clerk-expo';
import PlaceItem from '../HomeScreen/PlaceItem';

export default function FavoriteScreen() {
  const db = getFirestore(app);
  const [favList, setFavList] = useState([]);
  const { user } = useUser();
  const [loading, setLoading]= useState(false);

  useEffect(() => {
    if (user) {
      getFav();
    }
  }, [user])

  const getFav = async () => {
    setLoading(true);
    const q = query(collection(db, "favorites"), where("email", "==", user?.primaryEmailAddress.emailAddress));
    const querySnapshot = await getDocs(q);
    const newFavList = [];
    querySnapshot.forEach((doc) => {
      newFavList.push(doc.data());
    });
    setFavList(newFavList);
    setLoading(false);
  };
  

  return (
    <View>
      <Text style={{
        fontSize:30,
        fontFamily:'Poppins-SemiBold',
        textAlign:'center',
        marginTop:5
      }}>Favorite<Text style={{
        color:'#53b176',
        fontFamily:'Poppins-Medium'
      }}>Places</Text></Text>
      {loading ? (
        <View style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <ActivityIndicator size={'large'} color={'#53b176'} />
          <Text style={{ fontFamily: 'Poppins-Medium' }}>Loading ...</Text>
        </View>
      ) : (
        <FlatList
          data={favList}
          onRefresh={()=>getFav()}
          refreshing={loading}
          style={{height:'100%'}}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <PlaceItem place={item.place} isFav={true} 
            markedFav={()=>getFav()}
            />
          )}
        />
      )}
    </View>
  );
  
}
