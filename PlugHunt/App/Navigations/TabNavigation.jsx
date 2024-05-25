import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FavoriteScreen from '../Screen/FavoriteScreen/FavoriteScreen';
import HomeScreen from '../Screen/HomeScreen/HomeScreen';
import ProfileScreen from '../Screen/ProfileScreen/ProfileScreen';
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Appoiments from '../Screen/Appoiments/Appoiments';

const Tab = createBottomTabNavigator();

export default function TabNavigation() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <FontAwesome5
              name="search-location"
              size={27}
              color={focused ? '#53b176' : '#7099BE'}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text style={[styles.tabBarLabel, focused && styles.focusedTabBarLabel]}>
              Home
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="favorite"
        component={FavoriteScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <FontAwesome6
              name="plug-circle-bolt"
              size={27}
              color={focused ? '#53b176' : '#7099BE'}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text style={[styles.tabBarLabel, focused && styles.focusedTabBarLabel]}>
              Favorite
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="appoiments"
        component={Appoiments}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="calendar-search"
              size={27}
              color={focused ? '#53b176' : '#7099BE'}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text style={[styles.tabBarLabel, focused && styles.focusedTabBarLabel]}>
              Appointments
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <FontAwesome
              name="user-circle-o"
              size={27}
              color={focused ? '#53b176' : '#7099BE'}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text style={[styles.tabBarLabel, focused && styles.focusedTabBarLabel]}>
              Profile
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#ccc', // default color
  },
  focusedTabBarLabel: {
    color: '#808080', // color when tab is focused
  },
});
