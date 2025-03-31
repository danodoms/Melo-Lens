import { Tabs } from "expo-router";
import React from "react";
import { Dimensions, Platform, StyleSheet, View } from "react-native";

import { Colors } from "@/constants/Colors";
import { HapticTab } from "@/src/components/HapticTab";
import TabBarBackground from "@/src/components/ui/TabBarBackground";
import { useColorScheme } from "@/src/hooks/useColorScheme";
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { cssInterop } from "nativewind";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Box } from "@/src/components/ui/box";


export default function TabLayout() {
  const { width } = Dimensions.get("window"); // Get device width
  const colorScheme = useColorScheme();

  const styles = StyleSheet.create({
    tabBarAndroid: {
      position: "absolute", // Makes it float
      paddingLeft: 16,
      paddingRight: 16,
      bottom: 16, // Moves it up while keeping space
      backgroundColor: Colors[colorScheme ?? "light"].tint, // Fully transparent
      borderRadius: 24, // Rounded edges
      borderWidth: 0, // Ensure no border
      borderColor: "transparent", // Explicitly set to transparent
      height: 52, // Adjust height to fit rounded shape
      // justifyContent: "center",
      width: "60%", // 80% width for centering
      alignSelf: "center", // Centers it
      left: "60%",
      transform: [{ translateX: -(width * 0.40) }], // Move left by half its width

      // Ensure Android has no elevation
      elevation: 0,

      // Remove potential shadow effects
      shadowColor: "transparent",
      shadowOpacity: 0,
      shadowOffset: { width: 0, height: 0 },
      shadowRadius: 0,
    },
  });

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].background,
        headerShown: false,
        // tabBarShowLabel: true,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          android: styles.tabBarAndroid,
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarShowLabel: false,
          title: "Home",
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <MaterialIcons name="home-filled" size={24} color={color} />
            ) : (
              <MaterialCommunityIcons name="home-variant-outline" size={24} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          tabBarShowLabel: false,
          title: "Scan",
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <Ionicons name="scan" size={24} color={color} />
            ) : (
              <Ionicons name="scan-outline" size={24} color={color} />
            ),
        }}
      />
      < Tabs.Screen
        name="results"
        options={{
          tabBarShowLabel: false,
          title: "Results",
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <Ionicons name="file-tray" size={24} color={color} />
            ) : (
              <Ionicons name="file-tray-outline" size={24} color={color} />
            ),
        }}
      />

      {/* <Tabs.Screen
        name="account"
        options={{
          tabBarShowLabel: false,
          title: "Account",
          tabBarIcon: ({ color }) => <UserRound color={color} />,
        }}
      /> */}
    </Tabs >
  );
}
