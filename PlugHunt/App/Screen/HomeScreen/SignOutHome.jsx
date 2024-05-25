import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { AntDesign } from '@expo/vector-icons';

export default function SignOutHome() {
  
  const { signOut } = useAuth();

  const onSignOutPress = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error("Sign out error", err);
    }
  };

  return (
    <TouchableOpacity onPress={onSignOutPress}>
        <AntDesign name="export2" size={24} color="#f54e29" />
    </TouchableOpacity>
  )
}