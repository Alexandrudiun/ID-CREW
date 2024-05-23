import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';

export default function SignOutScreen() {
  const { signOut } = useAuth();

  const onSignOutPress = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error("Sign out error", err);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.signOutButton} onPress={onSignOutPress}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 30, 
  },
  signOutButton: {
    backgroundColor: '#ff0000', 
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 27,

  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
