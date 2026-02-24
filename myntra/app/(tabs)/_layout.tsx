import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from "@expo/vector-icons";
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ff3f6c',
        tabBarInactiveTintColor: '#3e3e3e',
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color ,size}) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          tabBarIcon: ({ color ,size}) => <Ionicons name="search-outline" size={size} color={color} />,
        }}
      />
        <Tabs.Screen
        name="wishlist"
        options={{
          title: 'Wishlist',
          tabBarIcon: ({ color ,size}) => <Ionicons name="heart-outline" size={size} color={color} />,
        }}
      />
        <Tabs.Screen
        name="bag"
        options={{
          title: 'Bag',
          tabBarIcon: ({ color ,size}) => <Ionicons name="bag-outline" size={size} color={color} />,
        }}
      />
        <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color ,size}) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
     
    </Tabs>
  );
}
