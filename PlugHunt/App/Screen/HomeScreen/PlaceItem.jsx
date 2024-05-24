import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Linking, Pressable, Alert, Platform, Modal } from 'react-native';
import GlobalApi from '../../Utils/GlobalApi';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { getFirestore, setDoc, doc, deleteDoc, updateDoc, getDoc } from "firebase/firestore";
import { app } from '../../Utils/FirebaseConfig';
import { useUser } from '@clerk/clerk-expo';

export default function PlaceItem({ place, isFav, markedFav, isExpanded, toggleExpand }) {
  const PHOTO_BASE_URL = "https://places.googleapis.com/v1/";
  const { user } = useUser();
  const db = getFirestore(app);
  const [modalVisible, setModalVisible] = useState(false);

  const onSetFav = async (place) => {
    if (place && place.id) {
      await setDoc(doc(db, "favorites", place.id.toString()), {
        place: place,
        email: user?.primaryEmailAddress?.emailAddress
      });
      markedFav();
      Alert.alert('Favorite Added', 'Added to Favorites!');
    } else {
      Alert.alert('Error', 'Favorite could not be added. Missing place ID.');
    }
  };

  const onRemoveFav = async (placeId) => {
    await deleteDoc(doc(db, "favorites", placeId.toString()));
    Alert.alert('Favorite Removed!', 'Favorite Removed!');
    markedFav();
  };

  const onDirectionClick = () => {
    let url;
    if (place?.link) {
      url = place.link;
    } else if (place?.location?.latitude && place?.location?.longitude) {
      url = Platform.select({
        ios: `maps:${place.location.latitude},${place.location.longitude}?q=${place.formattedAddress}`,
        android: `geo:${place.location.latitude},${place.location.longitude}?q=${place.formattedAddress}`,
      });
    }
    if (url) {
      Linking.openURL(url);
    } else {
      Alert.alert('Error', 'Unable to get the location link.');
    }
  };

  const getCredits = () => {
    if (place?.evChargeOptions?.connectorAggregation?.some(connector => connector.maxChargeRateKw >= 30)) {
      return 20;
    }
    return 10;
  };

  const credits = getCredits();

  const handleBuyCredits = async () => {
    try {
      const userRef = doc(db, 'userCredits', user.id);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userCredits = userDoc.data().credits;
        if (userCredits >= credits) {
          await updateDoc(userRef, {
            credits: userCredits - credits
          });
          Alert.alert('Purchase Successful', `You have bought the item for ${credits} credits.`);
        } else {
          Alert.alert('Insufficient Credits', 'You do not have enough credits to buy this item.');
        }
      }
    } catch (error) {
      console.error("Error updating credits: ", error);
      Alert.alert('Error', 'There was an error processing your purchase.');
    } finally {
      setModalVisible(false);
    }
  };

  return (
    <TouchableOpacity onPress={toggleExpand} activeOpacity={1}>
      <View style={{
        backgroundColor: '#fff',
        margin: 10,
        borderRadius: 10,
        height: isExpanded ? 390 : 290,  // Adjust height based on whether it's expanded or not
        overflow: 'hidden'
      }}>
        {!isFav ? <Pressable style={{
          position: 'absolute',
          right: 0,
          margin: 5,
          shadowColor: '#171717',
          shadowOffset: { width: -2, height: 4 },
          shadowOpacity: 0.5,
          shadowRadius: 3,
          zIndex: 1
        }} onPress={() => onSetFav(place)}>
          <FontAwesome6 name="heart-circle-bolt" size={30} color="#fff" />
        </Pressable> :
          <Pressable style={{
            position: 'absolute',
            right: 0,
            margin: 5,
            shadowColor: '#171717',
            shadowOffset: { width: -2, height: 4 },
            shadowOpacity: 0.5,
            shadowRadius: 3,
            zIndex: 1
          }} onPress={() => onRemoveFav(place.id)}>
            <FontAwesome6 name="heart-circle-bolt" size={30} color="red" />
          </Pressable>}
        <Image
          source={
            place?.photos && place.photos.length > 0
              ? { uri: `${PHOTO_BASE_URL}${place.photos[0]?.name}/media?key=${GlobalApi.API_KEY}&maxHeightPx=800&maxWidthPx=1200` }
              : place.imageUrl
                ? { uri: place.imageUrl }
                : require('./../../../assets/images/charger.jpg')
          }
          style={{
            width: '100%',
            borderRadius: 10,
            height: 150,
            zIndex: -1
          }}
        />
        <View style={{ padding: 15 }}>
          <Text
            style={{
              fontSize: 23,
              fontFamily: 'Poppins-Medium',
            }}
            numberOfLines={1}
            ellipsizeMode='tail'
          >
            {place?.displayName?.text || place?.name || 'No Name Available'}
          </Text>
          <Text
            style={{
              color: '#aaa',
              fontFamily: 'Poppins-ExtraLight',
            }}
            numberOfLines={1}
            ellipsizeMode='tail'
          >
            {place?.formattedAddress || place?.address || 'No Address Available'}
          </Text>
          <View style={{
            marginTop: 5,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <View>
              <Text
                style={{
                  fontFamily: 'Poppins-ExtraLight',
                  color: '#aaa',
                  fontSize: 13,
                }}
              >
                Connectors:
              </Text>
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: 20,
                  marginTop: 2,
                }}
                numberOfLines={1}
                ellipsizeMode='tail'
              >
                {place?.evChargeOptions?.connectorCount || place?.points || 'Unknown number'} Points
              </Text>
            </View>
            <Pressable onPress={onDirectionClick} style={{
              padding: 12,
              backgroundColor: '#7099BE',
              borderRadius: 10,
              paddingHorizontal: 14
            }}>
              <MaterialCommunityIcons name="send-circle-outline" size={24} color="#fff" />
            </Pressable>
          </View>
          {isExpanded && (
            <View>
              <View>
                <Text
                  style={{
                    fontFamily: 'Poppins-ExtraLight',
                    fontSize: 20,
                    marginTop: 2,
                  }}
                  numberOfLines={1}
                  ellipsizeMode='tail'
                >
                  POWER: {place?.evChargeOptions?.connectorCount || place?.power || 'Unknown'} KWH/H
                </Text>
                {place?.evChargeOptions?.connectorAggregation?.map((connector, index) => (
                  <Text
                    key={index}
                    style={{
                      fontFamily: 'Poppins-ExtraLight',
                      fontSize: 14,
                      marginTop: 2,
                    }}
                    numberOfLines={2}
                    ellipsizeMode='tail'
                  >
                    {connector.type}: {connector.maxChargeRateKw || 'Unknown'} KWH
                  </Text>
                ))}
              </View>
              
              {place.isFirebase && ( // Conditionally render the buy button only if the item is from Firebase
                <TouchableOpacity onPress={() => setModalVisible(true)} style={{
                  backgroundColor: '#53b176',
                  padding: 12,
                  borderRadius: 20,
                  alignItems: 'center',
                  width: '100%',
                  marginTop: 5
                }}>
                  <Text style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: 20,
                    color: '#fff'
                  }}>
                    Buy for {credits} credits
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>

      {modalVisible && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
            <View style={{
              width: 300,
              padding: 20,
              backgroundColor: 'white',
              borderRadius: 10,
              alignItems: 'center',
            }}>
              <Text style={{
                fontFamily: 'Poppins-Medium',
                fontSize: 18,
                marginBottom: 20
              }}>
                Are you sure you want to buy this for {credits} credits?
              </Text>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%'
              }}>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={{
                  backgroundColor: '#53b176',
                  padding: 10,
                  borderRadius: 10,
                  alignItems: 'center',
                  width: '45%',
                }}>
                  <Text style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: 16,
                    color: '#fff'
                  }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleBuyCredits} style={{
                  backgroundColor: '#53b176',
                  padding: 10,
                  borderRadius: 10,
                  alignItems: 'center',
                  width: '45%',
                }}>
                  <Text style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: 16,
                    color: '#fff'
                  }}>
                    Confirm
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </TouchableOpacity>
  );
}
