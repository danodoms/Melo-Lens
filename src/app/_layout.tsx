import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import "@/global.css";
import { GluestackUIProvider } from "@/src/components/ui/gluestack-ui-provider";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/src/hooks/useColorScheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { globalStore } from "@/src/state/globalState";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();


      //FOR DEBUG ONLY REMOVE IF CUSTOM BACKEND ADDRESS IS NOT NEEDED
      (async () => {
        const storedAddress = await AsyncStorage.getItem('backendAddress');
        if (storedAddress) {
          globalStore.backendAddress.set(storedAddress);
        }
      })();
      //FOR DEBUG ONLY REMOVE IF CUSTOM BACKEND ADDRESS IS NOT NEEDED


    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }



  return (
    <GluestackUIProvider mode={(colorScheme ?? "light") as "light" | "dark"}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen
            name="screens/account"
            options={{
              title: "Account",
              headerShown: true // Optional: Show or hide the header
            }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GluestackUIProvider>
  );
}
