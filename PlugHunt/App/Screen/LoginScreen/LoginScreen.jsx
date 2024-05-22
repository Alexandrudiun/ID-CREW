import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useWarmUpBrowser } from '../../../hooks/useWarmUpBrowser';
import { useOAuth } from '@clerk/clerk-expo';
import * as WebBrowser from "expo-web-browser";


WebBrowser.maybeCompleteAuthSession();
export default function LoginScreen() {
    useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const onPress = async()=>{
    try {
        const { createdSessionId, signIn, signUp, setActive } =
          await startOAuthFlow();
  
        if (createdSessionId) {
          setActive({ session: createdSessionId });
        } else {
          // Use signIn or signUp for next steps such as MFA
        }
      } catch (err) {
        console.error("OAuth error", err);
      }
  }
  return (
    <View
        style={styles.imgdiv}
    >
       <Image source={require('./../../../assets/images/logo500.png')} 
            style={styles.logoImage}
       />
        
        <TouchableOpacity onPress={onPress}>
            <Text>Log in</Text>
        </TouchableOpacity>

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