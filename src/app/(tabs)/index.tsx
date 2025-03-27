import { Dimensions } from "react-native";
import { Text } from "@/src/components/ui/text";
import { Avatar } from "@/src/components/ui/avatar";
import { Box } from "@/src/components/ui/box";
import { Heading } from "@/src/components/ui/heading";
import { HStack } from "@/src/components/ui/hstack";
import { VStack } from "@/src/components/ui/vstack";
import { useColorScheme } from "@/src/hooks/useColorScheme";
import {
  ChartScatter,
  GalleryHorizontal,
  Image as ImageLucide,
  Scan,
  Sparkle,
  UserRound,
  Search,
  ArrowRight,
  BarChart3,
  Camera,
  Clock,
  Settings,
  Plus
} from "lucide-react-native";
import React, { useState } from "react";
import { Button, ButtonText, ButtonIcon } from "@/src/components/ui/button";
import { Center } from "@/src/components/ui/center";
import { Icon } from "@/src/components/ui/icon";
import { Image } from "@/src/components/ui/image";
import { Skeleton } from "@/src/components/ui/skeleton";
import { getScanResultImageUriFromResultId } from "@/src/lib/imageUtil";
import { useSupaLegend } from "@/src/utils/supalegend/useSupaLegend";
import { FlashList } from "@shopify/flash-list";
import { Link } from "expo-router";
import Carousel from "react-native-reanimated-carousel";
import { Pressable } from "react-native";

export default function HomeScreen() {
  const { width, height } = Dimensions.get("window");
  const { results, topClassifications } = useSupaLegend();

  return (
    <VStack className="h-full bg-background-0 border-red-500 flex flex-col gap-4 p-4 pt-12 pb-">
      {/* Header Layout */}
      <Box className=" border-green-500  flex">
        <HStack className="justify-between items-center border-teal-500">
          <VStack>
            {/* <Text className="text-sm">
              Welcome to
            </Text> */}
            <HStack className="items-center gap-1">
              <Heading size="2xl" className="text-tertiary-500">
                Melo
              </Heading>
              <Heading size="2xl" className="text-secondary-500">
                Lens
              </Heading>
              <Icon as={Sparkle} className="text-accent-500" />
            </HStack>
          </VStack>

          <HStack className="gap-3">
            <Link href="/screens/account">
              <Avatar
                size="md"
                className="bg-secondary rounded-xl"
              >
                <Icon as={UserRound}></Icon>
              </Avatar>
            </Link>
          </HStack>
        </HStack>
      </Box>

      {/* Stats Cards in Grid */}
      <Box className=" border-orange-500">
        <HStack className="justify-between items-center mb-3 ">
          <HStack className="items-center gap-2">
            <Icon as={BarChart3} />
            <Heading size="sm" className="">
              Analytics Overview
            </Heading>
          </HStack>

          <Button variant="link" size="sm">
            <ButtonText className="text-secondary">View All</ButtonText>
            <ButtonIcon as={ArrowRight} size={16} />
          </Button>
        </HStack>

        <HStack className="gap-4">
          {/* Stat Card 1 */}
          <Box className="flex-1 bg-background-50 rounded-2xl p-4">
            <VStack>
              <Text className="text-xs ">
                Total Scans
              </Text>
              <Heading
                size="xl"
                className=" my-1"
              >
                {results.length}
              </Heading>
              <HStack className="items-center">
                <Icon as={Clock} className="" size={12} />
                <Text className="text-[11px] ml-1">
                  Last 7 days
                </Text>
              </HStack>
            </VStack>
          </Box>

          {/* Stat Card 2 */}
          <Box className="flex-1 bg-background-50 rounded-2xl p-4">
            <VStack>
              <Text className=" text-xs">
                Average Confidence
              </Text>
              <Heading
                size="xl"
                className="my-1"
              >
                96%
              </Heading>
              <HStack className="items-center">
                <Box className="size-3 rounded-full bg-tertiary-500 mr-1" />
                <Text className=" text-[11px]">
                  High confidence
                </Text>
              </HStack>
            </VStack>
          </Box>
        </HStack>
      </Box>

      {/* Top Classifications Section */}
      <Box className="flex-1 flex justify-center  border-yellow-500">
        <HStack className="justify-between items-center mb-3">
          <HStack className="items-center gap-2">
            <Icon as={ChartScatter} />
            <Heading size="sm" className="text-primary-800">
              Top Classifications
            </Heading>
          </HStack>
        </HStack>

        <Box className="bg-background-50 rounded-2xl overflow-hidden border-sky-500 flex-auto">
          <FlashList
            data={topClassifications}
            renderItem={({ item, index }) => (
              <Box
                className={`p-3 ${index === topClassifications.length - 1 ? "" : ""
                  }`}
              >
                <HStack className="items-center justify-between">
                  <HStack className="items-center gap-3">
                    <Box
                      className="w-8 h-8 rounded-lg justify-center items-center"
                    >
                      <Text className="font-bold">
                        {index + 1}
                      </Text>
                    </Box>

                    <VStack>
                      <Text className=" font-medium">
                        {item.classification}
                      </Text>
                      <Text className=" text-xs">
                        {Math.round(item.count / results.length * 100)}% of total
                      </Text>
                    </VStack>
                  </HStack>

                  <Text
                    className="font-bold text-tertiary-500 text-base mr-1"
                  >
                    {item.count}
                  </Text>
                </HStack>
              </Box>
            )}
            estimatedItemSize={56}
            ListEmptyComponent={
              <Center className="p-4 border-red-500 h-full">
                <VStack className="items-center gap-2 justify-center  border-red-500 flex">
                  <Icon as={ChartScatter} className="" size={24} />
                  <Text className="">
                    No data to analyze
                  </Text>
                </VStack>
              </Center>
            }
          />
        </Box>
      </Box>

      {/* Recent Scans Section */}
      <Box className="flex-[2] flex">
        <HStack className="justify-between items-center mb-3">
          <HStack className="items-center gap-2">
            <Icon as={Scan} />
            <Heading size="sm" className="text-primary-800">
              Recent Scans
            </Heading>
          </HStack>

          <Text className=" text-xs">
            {results.length} Total
          </Text>
        </HStack>

        <Box className="bg-background-50 rounded-2xl overflow-hidden flex-1">
          {results.length > 0 ? (
            <Carousel
              loop
              width={width - 32} // Adjust for padding
              autoPlay={true}
              data={results}
              autoPlayInterval={4000}
              pagingEnabled={true}
              scrollAnimationDuration={1000}
              renderItem={({ item, index }) => (
                <Box className="relative h-full overflow-hidden">
                  <Image
                    source={{ uri: getScanResultImageUriFromResultId(item.id) }}
                    className="absolute top-0 left-0 w-full h-full"
                    resizeMode="cover"
                    alt="scan-result"
                  />

                  {/* Dark overlay for text visibility */}
                  <Box
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 80,
                    }}
                  />

                  <VStack
                    style={{
                      position: 'absolute',
                      bottom: 16,
                      left: 16,
                      right: 16
                    }}
                  >
                    <HStack className="justify-between items-center">
                      <VStack>
                        <Text className="text-white font-bold text-lg">
                          {item.classification}
                        </Text>
                        <HStack className="items-center">
                          <Box
                            className={`w-2 h-2 rounded-full mr-1.5 ${item.confidence > 90 ? "bg-secondary" :
                              item.confidence > 70 ? "bg-accent" :
                                "bg-primary"
                              }`}
                          />
                          <Text className="text-white text-xs">
                            {item.confidence}% Confidence
                          </Text>
                        </HStack>
                      </VStack>

                      <Button
                        size="sm"
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          borderRadius: 8
                        }}
                      >
                        <ButtonText className="text-white text-xs">Details</ButtonText>
                      </Button>
                    </HStack>
                  </VStack>
                </Box>
              )}
            />
          ) : (
            <Center className="h-full p-4">
              <VStack className="items-center gap-3">
                <Box
                  className={`w-[60px] h-[60px] rounded-[30px] justify-center items-center`}
                >
                  <Icon as={GalleryHorizontal} className="" size={24} />
                </Box>
                <Text className="">
                  No scan results yet
                </Text>
                <Button className="bg-primary rounded-lg">
                  <ButtonIcon as={Camera} className="text-white" />
                  <ButtonText className="text-white">Start Scanning</ButtonText>
                </Button>
              </VStack>
            </Center>
          )}
        </Box>
      </Box>
    </VStack>
  );
}