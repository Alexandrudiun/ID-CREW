import { View, Text, Image, StyleSheet, TouchableOpacity, Linking, Modal, Animated, ActivityIndicator, ScrollView, TextInput, Alert, Platform } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import SignOutScreen from './SignOutScreen';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { getUserCredits, addStation, uploadImage } from '../../Utils/FirebaseConfig';

export default function ProfileScreen() {
  const { user } = useUser();
  const [modalVisible, setModalVisible] = useState(false);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [stationName, setStationName] = useState('');
  const [stationAddress, setStationAddress] = useState('');
  const [stationPoints, setStationPoints] = useState('');
  const [stationLink, setStationLink] = useState('');
  const [stationPower, setStationPower] = useState('');
  const [connectorType, setConnectorType] = useState('');
  const [connectorPower, setConnectorPower] = useState('');
  const [stationImage, setStationImage] = useState(null);
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const fetchCredits = async () => {
    if (user && user.id) {
      setLoading(true);
      const userCredits = await getUserCredits(user.id);
      setCredits(userCredits);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredits();
  }, [user]);

  const handlePress = () => {
    setFormModalVisible(true);
  };

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setStationImage(result.uri);
    }
  };

  const handleFormSubmit = async () => {
    if (user && user.primaryEmailAddress && stationName && stationAddress && stationPoints && stationLink && stationPower) {
      setLoading(true);
      let imageUrl = '';
      if (stationImage) {
        imageUrl = await uploadImage(stationImage);
      }

      const station = {
        name: stationName,
        address: stationAddress,
        points: stationPoints,
        link: stationLink,
        power: stationPower,
        connectorType: connectorType,
        connectorPower: connectorPower,
        image: imageUrl,
      };

      await addStation(user.primaryEmailAddress.emailAddress, station);
      setFormModalVisible(false);
      setStationName('');
      setStationAddress('');
      setStationPoints('');
      setStationLink('');
      setStationPower('');
      setConnectorType('');
      setConnectorPower('');
      setStationImage(null);
      setLoading(false);
      Alert.alert('Success', 'Station added successfully');
    } else {
      Alert.alert('Error', 'Please fill in all required fields');
    }
  };

  const handleCreditPress = () => {
    setModalVisible(true);
    Animated.spring(animation, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleCloseModal = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
    });
  };

  const handleCloseFormModal = () => {
    setFormModalVisible(false);
  };

  const modalStyle = {
    transform: [
      {
        scale: animation,
      },
    ],
    opacity: animation,
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        My<Text style={styles.titleHighlight}>Profile</Text>
      </Text>
      <Image source={{ uri: user?.imageUrl }} style={styles.ProfileImage} />
      <View>
        <Text style={styles.NameText}>{user.fullName || 'No Name. Please Log In'}</Text>
        <Text style={styles.EmailText}>Credits: {loading ? <ActivityIndicator size="small" color="#53b176" /> : credits}</Text>
      </View>
      
      <TouchableOpacity style={styles.CreditBtn} onPress={handleCreditPress}>
        <Ionicons name="add-circle-outline" size={24} color="white" style={styles.icon} />
        <Text style={styles.creditButtonText}>Add Credits</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.refreshButton} onPress={fetchCredits}>
        <Ionicons name="refresh" size={24} color="white" style={styles.icon} />
        <Text style={styles.refreshButtonText}>Refresh Credits</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>Add station</Text>
      </TouchableOpacity>

      
      <View style={styles.signOutContainer}>
        <SignOutScreen />
      </View>

      {modalVisible && (
        <Modal transparent visible={modalVisible} animationType="none">
          <View style={styles.modalOverlay}>
            <Animated.View style={[styles.modalContainer, modalStyle]}>
              <Text style={styles.modalText}>Pentru a adauga Credite efectuati un transfer bancar in contul: [Contul Bancar], iar in detaliile ordinului de plata adaugati {user.primaryEmailAddress?.emailAddress || 'emailul dvs. //Andrei schimba aici'}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>
      )}

      {formModalVisible && (
        <Modal transparent visible={formModalVisible} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.formModalContainer}>
              <Text style={styles.modalTitle}>Add New Station</Text>
              <TextInput
                style={styles.input}
                placeholder="EV Station Name"
                value={stationName}
                onChangeText={setStationName}
              />
              <TouchableOpacity style={styles.imagePickerButton} onPress={handleImagePick}>
                <Text style={styles.imagePickerButtonText}>Pick an image</Text>
              </TouchableOpacity>
              {stationImage && <Image source={{ uri: stationImage }} style={styles.stationImage} />}
              <TextInput
                style={styles.input}
                placeholder="EV Charger Points"
                value={stationPoints}
                onChangeText={setStationPoints}
              />
              <TextInput
                style={styles.input}
                placeholder="EV Charger Address"
                value={stationAddress}
                onChangeText={setStationAddress}
              />
              <TextInput
                style={styles.input}
                placeholder="EV Charger Google Maps Link"
                value={stationLink}
                onChangeText={setStationLink}
              />
              <TextInput
                style={styles.input}
                placeholder="Power (in KW/H)"
                value={stationPower}
                onChangeText={setStationPower}
              />
              <TextInput
                style={styles.input}
                placeholder="EV Connector Type"
                value={connectorType}
                onChangeText={setConnectorType}
              />
              <TextInput
                style={styles.input}
                placeholder="EV Connector Power (in KW/H)"
                value={connectorPower}
                onChangeText={setConnectorPower}
              />
              <TouchableOpacity style={styles.submitButton} onPress={handleFormSubmit}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={handleCloseFormModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    padding: 20
  },
  title: {
    fontSize: 30,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    marginTop: 5
  },
  titleHighlight: {
    color: '#53b176',
    fontFamily: 'Poppins-Medium'
  },
  ProfileImage: {
    width: 200,
    height: 200,
    borderRadius: 99,
    marginTop: 20
  },
  NameText: {
    fontFamily: 'Poppins-Medium',
    color: '#333',
    fontSize: 23,
    textAlign: 'center',
    marginTop: 5
  },
  EmailText: {
    fontFamily: 'Poppins-Regular',
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 5
  },
  button: {
    backgroundColor: '#53b176',
    borderRadius: 27,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    textAlign: 'center'
  },
  signOutContainer: {
    marginTop: 2,
  },
  CreditBtn: {
    backgroundColor: '#53b176',
    borderRadius: 27,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  creditButtonText: {
    color: 'white',
    fontFamily: 'Poppins-Medium',
    fontSize: 20,
    marginLeft: 10
  },
  refreshButton: {
    backgroundColor: '#53b176',
    borderRadius: 27,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  refreshButtonText: {
    color: 'white',
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    marginLeft: 10
  },
  icon: {
    marginRight: 5
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center'
  },
  modalText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20
  },
  closeButton: {
    backgroundColor: '#53b176',
    borderRadius: 27,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10
  },
  closeButtonText: {
    color: 'white',
    fontFamily: 'Poppins-Medium',
    fontSize: 16
  },
  formModalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center'
  },
  modalTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 20,
    marginBottom: 20
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
    color: '#333', // This line changes the text color inside the input fields
  },
  imagePickerButton: {
    backgroundColor: '#53b176',
    borderRadius: 27,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 10
  },
  imagePickerButtonText: {
    color: 'white',
    fontFamily: 'Poppins-Medium',
    fontSize: 16
  },
  stationImage: {
    width: 100,
    height: 100,
    marginBottom: 20
  },
  submitButton: {
    backgroundColor: '#53b176',
    borderRadius: 27,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10
  },
  submitButtonText: {
    color: 'white',
    fontFamily: 'Poppins-Medium',
    fontSize: 16
  }
});
