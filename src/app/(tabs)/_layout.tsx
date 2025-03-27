import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet } from "react-native";

import { HapticTab } from "@/src/components/HapticTab";
import { IconSymbol } from "@/src/components/ui/IconSymbol";
import TabBarBackground from "@/src/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/src/hooks/useColorScheme";
import { House, Scan, History, UserRound } from "lucide-react-native";
import { cn } from "@gluestack-ui/nativewind-utils/cn";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const styles = StyleSheet.create({
    // tabBarIOS: {
    //   position: "absolute",
    //   backgroundColor: "transparent",
    //   shadowColor: "#000",
    //   shadowOpacity: 0.1,
    //   shadowOffset: { width: 0, height: -2 },
    //   shadowRadius: 8,
    //   borderTopLeftRadius: 16,
    //   borderTopRightRadius: 16,
    // },
    tabBarAndroid: {
      position: "absolute", // Makes it float
      bottom: 16, // Moves it up while keeping space
      left: 16,
      right: 16,
      backgroundColor: "white", // Fully transparent
      borderRadius: 24, // Rounded edges
      height: 60, // Adjust height to fit rounded shape
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 0 },
    }
  });


  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          // ios: styles.tabBarIOS,
          android: styles.tabBarAndroid,
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarShowLabel: false,
          title: "Home",
          tabBarIcon: ({ color }) => <House color={color} />,
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          tabBarShowLabel: false,
          title: "Scan",
          tabBarIcon: ({ color }) => <Scan color={color} />,
        }}
      />
      <Tabs.Screen
        name="results"
        options={{
          tabBarShowLabel: false,
          title: "Results",
          tabBarIcon: ({ color }) => <History color={color} />,
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
    </Tabs>
  );


}
