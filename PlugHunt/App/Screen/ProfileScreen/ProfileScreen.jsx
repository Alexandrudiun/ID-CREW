import { View, Text, Image, StyleSheet, TouchableOpacity, Linking, Modal, Animated } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import SignOutScreen from './SignOutScreen';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { getUserCredits, updateUserCredits, createUserCredits } from '../../Utils/FirebaseConfig'; 

export default function ProfileScreen() {
  const { user } = useUser();
  const [modalVisible, setModalVisible] = useState(false);
  const [credits, setCredits] = useState(0);
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchCredits = async () => {
      if (user && user.id) {
        const userCredits = await getUserCredits(user.id);
        setCredits(userCredits);
      }
    };

    fetchCredits();
  }, [user]);

  const handlePress = () => {
    Linking.openURL('https://forms.gle/your-google-form-url'); // replace with your actual Google Form URL
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

  const modalStyle = {
    transform: [
      {
        scale: animation,
      },
    ],
    opacity: animation,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        My<Text style={styles.titleHighlight}>Profile</Text>
      </Text>
      <Image source={{ uri: user?.imageUrl }} style={styles.ProfileImage} />
      <View>
        <Text style={styles.NameText}>{user.fullName || 'No Name. Please Log In'}</Text>
        <Text style={styles.EmailText}>Credits: {credits}</Text>
      </View>
      
      <TouchableOpacity style={styles.CreditBtn} onPress={handleCreditPress}>
        <Ionicons name="add-circle-outline" size={24} color="white" style={styles.icon} />
        <Text style={styles.creditButtonText}>Add Credits</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>Daca vrei sa iti inchiriezi statia de incarcare click aici</Text>
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
    </View>
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
    fontSize: 20, // Increase font size for larger text
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
    paddingHorizontal: 20
  },
  closeButtonText: {
    color: 'white',
    fontFamily: 'Poppins-Medium',
    fontSize: 16
  }
});
