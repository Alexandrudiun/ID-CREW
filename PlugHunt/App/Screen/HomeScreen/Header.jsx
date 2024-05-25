import { View, Text , Image, StyleSheet} from 'react-native'
import React from 'react'
import { useUser } from '@clerk/clerk-expo'
import { MaterialIcons } from '@expo/vector-icons';
import SignOutHome from './SignOutHome';

export default function Header() {
    const {user} =useUser();

  return (
    <View style={styles.Header}>
      <Image source={{uri:user?.imageUrl}}
      style={{width:45, height:45, borderRadius:99}}
      />

      <Text style={{
        fontSize:30,
        fontFamily:'Poppins-SemiBold'
      }}>
        
        Plug
      
      <Text style={{
        color:'#53b176',
        fontFamily:'Poppins-Medium'
      }}>Hunt</Text>
      
      </Text>
      <SignOutHome /> 
    </View>
  )
}

const styles = StyleSheet.create({
    Header:{
        display:'flex',
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems:'center',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10
    },
    LogoText:{
        fontSize: 24,
        fontFamily: 'Poppins-Medium',
        color: '#333'
    }

})
