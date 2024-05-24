import { View, FlatList, Dimensions } from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import PlaceItem from './PlaceItem';
import { SelectMarkerContext } from '../../Context/SelectMarkerContext';
import { getFirestore } from 'firebase/firestore';
import { app, fetchStations } from '../../Utils/FirebaseConfig';
import { collection, query, where, getDocs } from "firebase/firestore";
import { useUser } from '@clerk/clerk-expo';

export default function PlaceListView({ placeList = [] }) {
  const flatListRef = useRef(null);
  const { selectedMarker } = useContext(SelectMarkerContext);
  const { user } = useUser();
  const [favList, setFavList] = useState([]);
  const [allExpanded, setAllExpanded] = useState(false); // State to control if all items are expanded
  const [stationsList, setStationsList] = useState([]);

  const db = getFirestore(app);

  useEffect(() => {
    if (selectedMarker !== null && combinedList.length > 0) {
      scrollToIndex(selectedMarker);
    }
  }, [selectedMarker]);

  useEffect(() => {
    if (user) {
      getFav();
      fetchStationsData();
    }
  }, [user]);

  const getFav = async () => {
    const q = query(collection(db, "favorites"), where("email", "==", user?.primaryEmailAddress?.emailAddress));
    const querySnapshot = await getDocs(q);
    const newFavList = [];
    querySnapshot.forEach((doc) => {
      newFavList.push(doc.data());
    });
    setFavList(newFavList);
  };

  const fetchStationsData = async () => {
    const stationsData = await fetchStations();
    setStationsList(stationsData);
  };

  const isFav = (place) => {
    const result = favList.find(item => item.place.id === place.id);
    console.log(result);
    return result ? true : false;
  };

  const scrollToIndex = (index) => {
    if (index >= 0 && index < combinedList.length) {
      flatListRef.current?.scrollToIndex({ animated: true, index });
    }
  };

  const getItemLayout = (_, index) => ({
    length: Dimensions.get('window').width,
    offset: Dimensions.get('window').width * index,
    index,
  });

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

  // Ensure placeList and stationsList are arrays
  const safePlaceList = Array.isArray(placeList) ? placeList : [];
  const safeStationsList = Array.isArray(stationsList) ? stationsList : [];

  // Combine placeList with stationsList
  const combinedList = [...safePlaceList, ...safeStationsList];

  return (
    <View>
      <FlatList
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={combinedList}
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
