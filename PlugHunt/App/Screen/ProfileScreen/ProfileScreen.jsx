import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Linking, Modal, Animated, ActivityIndicator, ScrollView, TextInput, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import SignOutScreen from './SignOutScreen';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { getUserCredits, addStation, uploadImage } from '../../Utils/FirebaseConfig';
import styles from '../../Utils/profilestyle';
import { MaterialCommunityIcons } from '@expo/vector-icons';


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
      const userCredits = await getUserCredits(user.id, user.primaryEmailAddress.emailAddress);
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
        <View style={styles.creditsContainer}>
          <Text style={styles.EmailText}>Credits: {loading ? <ActivityIndicator size="small" color="#53b176" /> : credits}</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={fetchCredits}>
            <Ionicons name="refresh" size={24} color="white" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.CreditBtn} onPress={handlePress}>
        <MaterialCommunityIcons name="map-marker-plus" size={24} color="#fff" />
        <Text style={styles.creditButtonText}>Add station</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.CreditBtn} onPress={handleCreditPress}>
        <Ionicons name="add-circle-outline" size={24} color="white" style={styles.icon} />
        <Text style={styles.creditButtonText}>Add Credits</Text>
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
                placeholderTextColor="#999"
              />
              <TextInput
                style={styles.input}
                placeholder="EV Charger Points"
                value={stationPoints}
                onChangeText={setStationPoints}
                placeholderTextColor="#999"
              />
              <TextInput
                style={styles.input}
                placeholder="EV Charger Address"
                value={stationAddress}
                onChangeText={setStationAddress}
                placeholderTextColor="#999"
              />
              <TextInput
                style={styles.input}
                placeholder="EV Charger Google Maps Link"
                value={stationLink}
                onChangeText={setStationLink}
                placeholderTextColor="#999"
              />
              <TextInput
                style={styles.input}
                placeholder="Power (in KW/H)"
                value={stationPower}
                onChangeText={setStationPower}
                placeholderTextColor="#999"
              />
              <TextInput
                style={styles.input}
                placeholder="EV Connector Type"
                value={connectorType}
                placeholderTextColor="#999"
                onChangeText={setConnectorType}
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