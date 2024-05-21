import { View } from 'react-native';
import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Entypo } from '@expo/vector-icons';


export default function SearchBar({searchedLocation}) {

  return (
    <View
    style={{
        display:'flex',
        flexDirection:'row',
        justifyContent: 'space-between',
        marginTop: 15,
        paddingHorizontal: 5,
        backgroundColor: '#fff',
        borderRadius: 6,
    }}
    >
      <Entypo name="location" size={24} color="#ccc"
      style={{paddingTop: 10}}
      
      />
      <GooglePlacesAutocomplete
        placeholder="Search ..."
        fetchDetails={true}
        enablePoweredByContainer={false}
        onPress={(data, details = null) => {
          searchedLocation(details?.geometry?.location)
        }}
        query={{
          key: 'AIzaSyBpEiDJKTXHdJ2PK1OXsOlNaivPT5H_xxk',
          language: 'en',
        }}
        onFail={(error) => console.error(error)}
        debounce={200}
      />
    </View>
  );
}
