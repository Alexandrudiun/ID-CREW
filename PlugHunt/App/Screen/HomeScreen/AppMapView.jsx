import { View, StyleSheet, Image, Dimensions } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import MapViewStyle from './../../Utils/MapViewStyle.json';
import { UserLocationContext } from '../../Context/UserLocationContext';
import { SelectMarkerContext } from '../../Context/SelectMarkerContext';
import { fetchStations } from '../../Utils/FirebaseConfig';
import carMarker from './../../../assets/images/carmarker.png';
import Markers from './Markers';
import PlaceItem from './PlaceItem';

const extractLatLongFromLink = (link) => {
  if (!link) return null;
  const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
  const match = link.match(regex);
  if (match) {
    const [, latitude, longitude] = match;
    return { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
  }
  return null;
};

export default function AppMapView({ placeList }) {
  const { location } = useContext(UserLocationContext);
  const { setSelectedMarker } = useContext(SelectMarkerContext);
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const stationData = await fetchStations();
      setStations(stationData);
    };
    fetchData();
  }, []);

  return location?.latitude && (
    <View>
      <MapView 
        style={styles.map} 
        provider={PROVIDER_DEFAULT}
        customMapStyle={MapViewStyle}
        region={{
          latitude: location?.latitude,
          longitude: location?.longitude,
          latitudeDelta: 0.0522,
          longitudeDelta: 0.0521,
        }}>
        {location && (
          <Marker 
            coordinate={{
              latitude: location?.latitude,
              longitude: location?.longitude
            }}
          >
            <Image source={require('./../../../assets/images/searhmarker.png')}
              style={{ width: 40, height: 40, objectFit: 'cover' }}
            />
          </Marker>
        )}

        {placeList && placeList.map((item, index) => (
          <Markers key={index} index={index} place={item} />
        ))}

        {stations && stations.map((station, index) => {
          const coordinates = extractLatLongFromLink(station.link);
          if (coordinates) {
            return (
              <Marker 
                key={index} 
                coordinate={coordinates}
                title={station.name}
                description={station.address}
                onPress={() => setSelectedMarker(index + placeList.length)} // Adjust index for combined list
              >
                <Image source={require('./../../../assets/images/markerhuman.png')} style={{ width: 60, height: 60, objectFit: 'cover' }} />
              </Marker>
            );
          }
          return null;
        })}
      </MapView>

      {selectedStation && (
        <View style={styles.infoWindow}>
          <PlaceItem 
            place={selectedStation} 
            isFav={false} 
            markedFav={() => {}} 
            isExpanded={true} 
            toggleExpand={() => {}} 
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  infoWindow: {
    position: 'absolute',
    bottom: 0,
    width: Dimensions.get('window').width,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  }
});
