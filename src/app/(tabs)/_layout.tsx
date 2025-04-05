import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/src/hooks/useColorScheme";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import {
  TabList,
  TabSlot,
  TabTrigger,
  TabTriggerSlotProps,
  Tabs,
} from "expo-router/ui";
import React from "react";
import { Pressable, View } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme ?? "light"].background;

  return (
    <Tabs>
      <TabSlot />
      <TabList className="px-4 absolute bottom-4 bg-primary-500 rounded-full translate-x-20">
        <TabTrigger name="home" href="/" className="border-green-500" asChild>
          <CustomTabButton
            // className="border-red-500 border"
            isFocus={
              <MaterialIcons
                name="home-filled"
                size={24}
                color={backgroundColor}
              />
            }
            nonFocus={
              <MaterialCommunityIcons
                name="home-variant-outline"
                size={24}
                color={backgroundColor}
              />
            }
          />
        </TabTrigger>

        <TabTrigger
          name="scan"
          href="/scan"
          className="border-green-500"
          asChild
        >
          <CustomTabButton
            // className="border-red-500 border"
            isFocus={<Ionicons name="scan" size={24} color={backgroundColor} />}
            nonFocus={
              <Ionicons name="scan-outline" size={24} color={backgroundColor} />
            }
          />
        </TabTrigger>

        <TabTrigger name="results" href="/results" asChild>
          <CustomTabButton
            // className="border-red-500 border"
            isFocus={
              <Ionicons name="file-tray" size={24} color={backgroundColor} />
            }
            nonFocus={
              <Ionicons
                name="file-tray-outline"
                size={24}
                color={backgroundColor}
              />
            }
          />
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}

interface CustomTabButtonProps extends TabTriggerSlotProps {
  isFocus: React.ReactNode;
  nonFocus: React.ReactNode;
  className?: string;
}

export const CustomTabButton = React.forwardRef<View, CustomTabButtonProps>(
  ({ className, isFocused, isFocus, nonFocus, ...props }, ref) => {
    return (
      <Pressable
        ref={ref}
        {...props}
        className={`border-red-500 px-8 py-4 ${className}`}
      >
        {isFocused ? isFocus : nonFocus}
      </Pressable>
    );
  }
);

CustomTabButton.displayName = "CustomTabButton";

// <Tabs
//   screenOptions={{
//     tabBarActiveTintColor: Colors[colorScheme ?? "light"].background,
//     headerShown: false,
//     // tabBarShowLabel: true,
//     tabBarButton: HapticTab,
//     tabBarBackground: TabBarBackground,
//     tabBarStyle: Platform.select({
//       android: styles.tabBarAndroid,
//     }),
//   }}
// >
//   <Tabs.Screen
//     name="index"
//     options={{
//       tabBarShowLabel: false,
//       title: "Home",
//       tabBarIcon: ({ color, focused }) =>
//         focused ? (
//           <MaterialIcons name="home-filled" size={24} color={color} />
//         ) : (
//           <MaterialCommunityIcons name="home-variant-outline" size={24} color={color} />
//         ),
//     }}
//   />
//   <Tabs.Screen
//     name="scan"
//     options={{
//       tabBarShowLabel: false,
//       title: "Scan",
//       tabBarIcon: ({ color, focused }) =>
//         focused ? (
//           <Ionicons name="scan" size={24} color={color} />
//         ) : (
//           <Ionicons name="scan-outline" size={24} color={color} />
//         ),
//     }}
//   />
//   < Tabs.Screen
//     name="results"
//     options={{
//       tabBarShowLabel: false,
//       title: "Results",
//       tabBarIcon: ({ color, focused }) =>
//         focused ? (
//           <Ionicons name="file-tray" size={24} color={color} />
//         ) : (
//           <Ionicons name="file-tray-outline" size={24} color={color} />
//         ),
//     }}
//   />

//   {/* <Tabs.Screen
//     name="account"
//     options={{
//       tabBarShowLabel: false,
//       title: "Account",
//       tabBarIcon: ({ color }) => <UserRound color={color} />,
//     }}
//   /> */}
// </Tabs >
// <Tabs>
//   <TabSlot />
//   <TabList className="bg-tertiary-500">
//     <TabTrigger name="home" href="/">
//       <Button>
//         <ButtonText>Home</ButtonText>
//       </Button>
//       {/* <Text>Home</Text> */}
//     </TabTrigger>
//     <TabTrigger name="article" href="/scan">
//       <Text>Article</Text>
//     </TabTrigger>
//   </TabList>
// </Tabs>
