import { View } from 'react-native';
import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Entypo } from '@expo/vector-icons';

export default function SearchBar({ searchedLocation }) {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        paddingHorizontal: 5,
        backgroundColor: '#fff',
        borderRadius: 25, // Increased borderRadius for rounder corners
        paddingVertical: 5,
        alignItems: 'center', // Ensure vertical alignment
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 2, // Adds shadow for Android
      }}
    >
      <Entypo
        name="location"
        size={24}
        color="#ccc"
        style={{ paddingLeft: 10 }}
      />
      <GooglePlacesAutocomplete
        placeholder="Search ..."
        fetchDetails={true}
        enablePoweredByContainer={false}
        onPress={(data, details = null) => {
          searchedLocation(details?.geometry?.location);
        }}
        query={{
          key: 'AIzaSyBpEiDJKTXHdJ2PK1OXsOlNaivPT5H_xxk',
          language: 'en',
        }}
        onFail={(error) => console.error(error)}
        debounce={200}
        styles={{
          textInputContainer: {
            flex: 1,
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            borderBottomWidth: 0,
          },
          textInput: {
            height: 38,
            color: '#5d5d5d',
            fontSize: 16,
            borderRadius: 20, // Rounder corners for the input field
            backgroundColor: '#f0f0f0',
            paddingHorizontal: 10,
          },
          predefinedPlacesDescription: {
            color: '#1faadb',
          },
        }}
      />
    </View>
  );
}
