import { View, Text , Image, StyleSheet} from 'react-native'
import React from 'react'
import { useUser } from '@clerk/clerk-expo'
import { MaterialIcons } from '@expo/vector-icons';

export default function Header() {
    const {user} =useUser();

  return (
    <View style={styles.Header}>
      <Image source={{uri:user?.imageUrl}}
      style={{width:45, height:45, borderRadius:99}}
      />
      <Text style={styles.LogoText}>PlugHunt</Text>
      <MaterialIcons name="filter-alt" size={27} color="#333" />
    </View>
  )
}

const styles = StyleSheet.create({
    Header:{
        display:'flex',
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    LogoText:{
        fontSize: 24,
        fontFamily: 'Poppins-Bold',
    }

})
