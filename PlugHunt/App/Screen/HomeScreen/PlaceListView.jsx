import { View, FlatList, Dimensions } from 'react-native';
import React, { useContext, useEffect, useRef } from 'react';
import PlaceItem from './PlaceItem';
import { SelectMarkerContext } from '../../Context/SelectMarkerContext';

export default function PlaceListView({ placeList }) {
  const flatListRef = useRef(null);
  const { selectedMarker } = useContext(SelectMarkerContext);

  useEffect(() => {
    if (selectedMarker !== null && selectedMarker !== undefined && placeList.length > 0) {
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

  const handleScrollToIndexFailed = (info) => {
    console.warn('Scroll to index failed: ', info);
    // Optional: Scroll to the nearest valid index
    flatListRef.current?.scrollToIndex({
      index: info.highestMeasuredFrameIndex,
      animated: true,
    });
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
            <PlaceItem place={item} />
          </View>
        )}
        onScrollToIndexFailed={handleScrollToIndexFailed}
      />
    </View>
  );
}
