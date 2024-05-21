import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'

export default function LoginScreen() {
  return (
    <View
        style={styles.imgdiv}
    >
       <Image source={require('./../../../assets/images/logo500.png')} 
            style={styles.logoImage}
       />
    
        
    </View>
  )
}

const styles = StyleSheet.create({
    logoImage:{
        width: 200,
        height: 200,
        objectFit: 'contain',
    },
    imgdiv:{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50
    }
})