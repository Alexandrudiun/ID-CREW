import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import FavoriteScreen from '../Screen/FavoriteScreen/FavoriteScreen';
import HomeScreen from '../Screen/HomeScreen/HomeScreen';
import ProfileScreen from '../Screen/ProfileScreen/ProfileScreen';
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function TabNavigation() {
  return (
    <Tab.Navigator 
    screenOptions={{headerShown:false,
    }}
    >
    <Tab.Screen name="home" component={HomeScreen} 
    options={{
        tabBarIcon:({color, size}) => (
            <FontAwesome5 name="search-location" size={27} color="black" />
        )
    }}
    />
    <Tab.Screen name="favorite" component={FavoriteScreen} 
    options={{
        tabBarIcon:({color, size}) => (
            <FontAwesome6 name="plug-circle-bolt" size={27} color="black" />
        )
    }}
    />
    <Tab.Screen name="profile" component={ProfileScreen} 
    options={{
        tabBarIcon:({color, size}) => (
            <FontAwesome name="user-circle-o" size={27} color="black" />
        )
    }}
    />
  </Tab.Navigator>
  )
}