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
      <View style={{marginTop:10,
      }}>
      <Text style={{
        fontSize:30,
        fontFamily:'Poppins-SemiBold'
      }}>Plug<Text style={{
        color:'#53b176',
        fontFamily:'Poppins-Medium'
      }}>Hunt</Text></Text>
      </View>
       <Image source={require('./../../../assets/images/charger.jpg')} 
            style={styles.logoImage}
       />
        
        <TouchableOpacity onPress={onPress} style={styles.LogInBtn}>
            <Text
            style={{color:'#fff',

            fontFamily:'Poppins-Medium',
            fontSize: 20
            }}
            >Sign in</Text>
        </TouchableOpacity>

        <Text style={{
          fontFamily:'Poppins-Italic',
          fontSize:13,
          color: '#808080',
          textAlign: 'center',
          paddingHorizontal: 15,
          marginTop: 20
        }}>
        Locate charging stations and earn money by sharing your own charger with others.
        </Text>

        <View>
        <Text style={{
          color:'#7099BE',
          fontFamily:'Poppins-ExtraLight',
          marginTop:20
        }}>Made By I&D Crew</Text>
        </View>

        

    </View>
  )
}

const styles = StyleSheet.create({
    logoImage:{
        width: 400,
        height: 300,
        objectFit: 'contain',
    },
    imgdiv:{
        display: 'flex',
        alignItems: 'center',
        height: '100%'
    },
    LogInBtn:{
      backgroundColor: '#53b176',
      paddingVertical:15,
      paddingHorizontal:50,
      color: '#fff',
      borderRadius: '10'
    }
})