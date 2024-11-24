import {
  Image,
  StyleSheet,
  Platform,
  View,
  TouchableOpacity,
  Animated,
} from "react-native";

import { Text } from "@/src/components/ui/text";

import { ChartScatter, Leaf, Scan } from "lucide-react-native";
import { VStack } from "@/src/components/ui/vstack";
import { Box } from "@/src/components/ui/box";
import { Heading } from "@/src/components/ui/heading";
import LottieView from "lottie-react-native";
import React from "react";
import { HStack } from "@/src/components/ui/hstack";
import { useColorScheme } from "@/src/hooks/useColorScheme";
import { getPrimaryColor } from "@expo/config-plugins/build/android/PrimaryColor";

export default function HomeScreen() {
  const colorScheme = useColorScheme();

  return (
    <VStack className="p-4 gap-4 h-full bg-background-0">
      <Box className=" rounded-md mb-4">
        <Heading className="" size="3xl">
          XR Vision
        </Heading>
        <Text className="text-left">
          Classify Rice NPK deficiencies with your camera!
        </Text>
      </Box>

      <HStack className="flex gap-4">
        <ChartScatter color="white" className="size-sm" />
        <Heading className="" size="lg">
          Analytics
        </Heading>
      </HStack>

      <VStack className="flex gap-4 mb-4">
        <HStack className="flex gap-4">
          <Box className="flex flex-1 bg-background-50 rounded-lg p-4">
            <Text>Nitrogen</Text>
          </Box>
          <Box className="flex flex-1 bg-background-50 rounded-lg p-4">
            <Text>Potassium</Text>
          </Box>
        </HStack>
        <HStack className="flex gap-4">
          <Box className="flex flex-1 bg-background-50 rounded-lg p-4">
            <Text>Phosphorus</Text>
          </Box>
          <Box className="flex flex-1 bg-background-50 rounded-lg p-4">
            <Text>Healthy</Text>
          </Box>
        </HStack>
      </VStack>

      <HStack className="flex gap-4">
        <Scan color="white" className="size-sm" />
        <Heading className="" size="lg">
          Recent Scans
        </Heading>
      </HStack>

      <Box className="flex flex-auto bg-background-50 rounded-lg"></Box>

      <Box className="w-full flex align-middle bg-background-50 p-4 rounded-lg">
        <Text className="text-sm text-center">Developed by XtraRice Team</Text>
        <Text className="text-xs text-center">
          danodoms - henrytors - rexpons
        </Text>
      </Box>
    </VStack>
  );
}
