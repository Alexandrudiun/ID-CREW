import { View, Text, StyleSheet, Image } from 'react-native'
import React, { useContext } from 'react'
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import MapViewStyle from './../../Utils/MapViewStyle.json';
import { UserLocationContext } from '../../Context/UserLocationContext';

export default function AppMapView() {

  const {location, setLocation} = useContext(UserLocationContext);

  return location?.latitude&&(
    <View>
      <MapView 
      style={styles.map} 
      provider={PROVIDER_DEFAULT}
      showsUserLocation={true}
      customMapStyle={MapViewStyle}
      region={{
        latitude: location?.latitude,
        longitude: location?.longitude,
        latitudeDelta: 0.055,
        longitudeDelta:  0.055,
      }}>
      <Marker 
        coordinate={{
          latitude: location?.latitude,
          longitude: location?.longitude
        }}
      >
        <Image source={require('./../../../assets/images/logo500.png')}
        style={{width:60, height:60}}
        />
      </Marker>
      
      </MapView>


    </View>
  )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    map: {
      width: '100%',
      height: '100%',
    },
  });