import { View, FlatList, Dimensions } from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import PlaceItem from './PlaceItem';
import { SelectMarkerContext } from '../../Context/SelectMarkerContext';
import { getFirestore } from 'firebase/firestore';
import { app } from '../../Utils/FirebaseConfig';
import { collection, query, where, getDocs } from "firebase/firestore";
import { useUser } from '@clerk/clerk-expo';

export default function PlaceListView({ placeList }) {
  const flatListRef = useRef(null);
  const { selectedMarker } = useContext(SelectMarkerContext);
  const { user } = useUser();
  const [favList, setFavList] = useState([]);
  const [allExpanded, setAllExpanded] = useState(false); // State to control if all items are expanded

  useEffect(() => {
    if (selectedMarker !== null && placeList.length > 0) {
      scrollToIndex(selectedMarker);
    }
  }, [selectedMarker]);

  const scrollToIndex = (index) => {
    if (index >= 0 && index < placeList.length) {
      flatListRef.current?.scrollToIndex({ animated: true, index });
    }
  };

  const getItemLayout = (_, index) => ({
    length: Dimensions.get('window').width,
    offset: Dimensions.get('window').width * index,
    index,
  });

  const db = getFirestore(app);

  useEffect(() => {
    if (user) {
      getFav();
    }
  }, [user]);

  const getFav = async () => {
    const q = query(collection(db, "favorites"), where("email", "==", user?.primaryEmailAddress.emailAddress));
    const querySnapshot = await getDocs(q);
    const newFavList = [];
    querySnapshot.forEach((doc) => {
      newFavList.push(doc.data());
    });
    setFavList(newFavList);
  };

  const isFav = (place) => {
    const result = favList.find(item => item.place.id === place.id);
    console.log(result);
    return result ? true : false;
  };

  const handleScrollToIndexFailed = (info) => {
    console.warn('Scroll to index failed: ', info);
    flatListRef.current?.scrollToIndex({
      index: info.highestMeasuredFrameIndex,
      animated: true,
    });
  };

  const toggleExpandAll = () => {
    setAllExpanded(!allExpanded); // Toggle the state to expand or collapse all items
  };

  return (
    <View>
      <FlatList
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={placeList}
        ref={flatListRef}
        getItemLayout={getItemLayout}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ width: Dimensions.get('window').width }}>
            <PlaceItem 
              place={item} 
              isFav={isFav(item)} 
              markedFav={() => getFav()} 
              isExpanded={allExpanded} // Apply the global expanded state
              toggleExpand={toggleExpandAll} // Use the function to toggle all items
            />
          </View>
        )}
        onScrollToIndexFailed={handleScrollToIndexFailed}
      />
    </View>
  );
}
