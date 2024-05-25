import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Linking, Pressable, Alert, Platform, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import GlobalApi from '../../Utils/GlobalApi';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { getFirestore, setDoc, doc, deleteDoc, updateDoc, getDoc, getDocs, collection, where, addDoc, query } from "firebase/firestore";
import { app } from '../../Utils/FirebaseConfig';
import { useUser } from '@clerk/clerk-expo';
import { deleteStation } from '../../Utils/FirebaseConfig'; // Import the delete function

export default function PlaceItem({ place, isFav, markedFav, isExpanded, toggleExpand, appointment }) {
  const PHOTO_BASE_URL = "https://places.googleapis.com/v1/";
  const { user } = useUser();
  const db = getFirestore(app);
  const [modalVisible, setModalVisible] = useState(false);
  const [appointmentModalVisible, setAppointmentModalVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [isStartTime, setIsStartTime] = useState(true);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    if (isStartTime) {
      setDate(currentDate);
    } else {
      setEndDate(currentDate);
    }
  };

  const showMode = (currentMode, start) => {
    setShow(true);
    setMode(currentMode);
    setIsStartTime(start);
  };

  const showDatepicker = (start) => {
    showMode('date', start);
  };

  const showTimepicker = (start) => {
    showMode('time', start);
  };

  const createAppointment = async () => {
    try {
      const appointmentQuery = query(collection(db, 'appointments'), where('placeId', '==', place.id));
      const existingAppointments = await getDocs(appointmentQuery);
      const overlappingAppointment = existingAppointments.docs.some(doc => {
        const appointment = doc.data();
        const existingStart = appointment.appointmentDate.toDate();
        const existingEnd = appointment.appointmentEndDate.toDate();
        return (date < existingEnd && endDate > existingStart);
      });

      if (overlappingAppointment) {
        Alert.alert('Error', 'Reservation already exists for the selected time period.');
        return;
      }

      await addDoc(collection(db, "appointments"), {
        placeId: place.id,
        userEmail: user.primaryEmailAddress.emailAddress,
        ownerEmail: place.email,
        appointmentDate: date,
        appointmentEndDate: endDate,
      });
      Alert.alert('Appointment Created', 'Your appointment has been created successfully.');
      setAppointmentModalVisible(false);
    } catch (e) {
      console.error("Error creating appointment: ", e);
      Alert.alert('Error', 'There was an error creating your appointment.');
    }
  };

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
          const posterQuerySnapshot = await getDocs(collection(db, 'userCredits'), where('email', '==', place.email));
          if (!posterQuerySnapshot.empty) {
            const posterDoc = posterQuerySnapshot.docs[0];
            const posterRef = doc(db, 'userCredits', posterDoc.id);
            const posterCredits = posterDoc.data().credits;

            await updateDoc(userRef, {
              credits: userCredits - credits
            });

            await updateDoc(posterRef, {
              credits: posterCredits + credits
            });

            Alert.alert('Purchase Successful', `You have bought the item for ${credits} credits. ${credits} credits have been transferred to the poster.`);
          } else {
            Alert.alert('Error', 'The poster does not exist.');
          }
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

  const handleDeleteStation = async () => {
    try {
      await deleteStation(place.id);
      Alert.alert('Station Deleted', 'Your station has been deleted successfully. Please refresh the app in the Terminal by pressing the "R" key to see the changes');
    } catch (e) {
      console.error("Error deleting station: ", e);
      Alert.alert('Error', 'There was an error deleting your station.');
    }
  };

  return (
    <TouchableOpacity onPress={toggleExpand} activeOpacity={1}>
      <View style={{
        backgroundColor: '#fff',
        margin: 10,
        borderRadius: 10,
        overflow: 'hidden',
        height:'500'
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

        {/* Delete button displayed only for the owner */}
        {place.email === user.primaryEmailAddress.emailAddress && (
          <Pressable style={{
            position: 'absolute',
            left: 0,
            margin: 5,
            shadowColor: '#171717',
            shadowOffset: { width: -2, height: 4 },
            shadowOpacity: 0.5,
            shadowRadius: 3,
            zIndex: 1
          }} onPress={handleDeleteStation}>
            <FontAwesome6 name="trash-alt" size={30} color="red" />
          </Pressable>
        )}

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
          {appointment && (
            <View style={{ marginTop: 10 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Poppins-Medium',
                  color: '#53b176'
                }}
              >
                Appointment: {appointment.start.toLocaleString()} - {appointment.end.toLocaleString()}
              </Text>
            </View>
          )}
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
                <View>
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
                  <TouchableOpacity onPress={() => setAppointmentModalVisible(true)} style={{
                    backgroundColor: '#f7b731',
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
                      Create Appointment
                    </Text>
                  </TouchableOpacity>
                </View>
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

      {appointmentModalVisible && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={appointmentModalVisible}
          onRequestClose={() => setAppointmentModalVisible(false)}
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
                Create an Appointment
              </Text>
              <View style={{ marginBottom: 20 }}>
                <TouchableOpacity onPress={() => showDatepicker(true)} style={{
                  backgroundColor: '#53b176',
                  padding: 10,
                  borderRadius: 10,
                  alignItems: 'center',
                  width: '100%',
                  marginBottom: 10
                }}>
                  <Text style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: 16,
                    color: '#fff'
                  }}>
                    Pick a Start Date
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => showTimepicker(true)} style={{
                  backgroundColor: '#53b176',
                  padding: 10,
                  borderRadius: 10,
                  alignItems: 'center',
                  width: '100%'
                }}>
                  <Text style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: 16,
                    color: '#fff'
                  }}>
                    Pick a Start Time
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => showDatepicker(false)} style={{
                  backgroundColor: '#53b176',
                  padding: 10,
                  borderRadius: 10,
                  alignItems: 'center',
                  width: '100%',
                  marginTop: 10
                }}>
                  <Text style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: 16,
                    color: '#fff',
                  }}>
                    Pick an End Date
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => showTimepicker(false)} style={{
                  backgroundColor: '#53b176',
                  padding: 10,
                  borderRadius: 10,
                  alignItems: 'center',
                  width: '100%',
                  marginTop: 10
                }}>
                  <Text style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: 16,
                    color: '#fff'
                  }}>
                    Pick an End Time
                  </Text>
                </TouchableOpacity>
              </View>
              {show && (
                <DateTimePicker
                  style={{marginBottom:10}}
                  testID="dateTimePicker"
                  value={isStartTime ? date : endDate}
                  mode={mode}
                  is24Hour={true}
                  display="default"
                  onChange={onChange}
                />
              )}
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%'
              }}>
                <TouchableOpacity onPress={() => setAppointmentModalVisible(false)} style={{
                  backgroundColor: '#f7b731',
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
                <TouchableOpacity onPress={createAppointment} style={{
                  backgroundColor: '#f7b731',
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
