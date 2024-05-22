import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import SignOutScreen from './SignOutScreen'
import { useUser } from '@clerk/clerk-expo';


export default function ProfileScreen() {

  const {user} =useUser();


  return (
    <View
    style={{marginTop:20,
      display:'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}
    >
      <Image source={{uri:user?.imageUrl}}
      style={styles.ProfileImage}
      />
      <View>
      <Text style={styles.NameText}>{user.fullName || 'No Name. Please Log In'}</Text>
      
      </View>

      <SignOutScreen />
    </View>
  )
}

const styles = StyleSheet.create({
  ProfileImage:{
    width: 200,
    height: 200,
    borderRadius: 99,
    display: 'block',
    marginHorizontal: 'auto'
  },
  NameText:{
    fontFamily: 'Poppins-Medium',
    color: '#333',
    fontSize: 23,
    textAlign: 'center',
    marginTop: 5
  }
})