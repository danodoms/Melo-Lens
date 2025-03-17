import React, { useEffect, useState } from "react";
import {
  Drawer,
  DrawerBackdrop,
  DrawerContent,
  DrawerHeader,
  DrawerCloseButton,
  DrawerBody,
  DrawerFooter,
} from "@/src/components/ui/drawer";
import { Button, ButtonText } from "@/src/components/ui/button";
import { Heading } from "@/src/components/ui/heading";
import { Text } from "@/src/components/ui/text";
import { Image } from "@/src/components/ui/image";
import { Skeleton, SkeletonText } from "@/src/components/ui/skeleton";
import { VStack } from "@/src/components/ui/vstack";
import { Box } from "@/src/components/ui/box";
import LottieView from "lottie-react-native";
import { Pressable, StyleSheet } from "react-native";
import { Center } from "@/src/components/ui/center";
import { getAiResult } from "../lib/ai/open-router";
import { getCompletion, getStreamingCompletion } from "../lib/ai/fetch";
import { HStack } from "./ui/hstack";
import {
  Bot,
  ChartScatter,
  Leaf,
  Scan,
  Circle,
  Sparkles,
  Sparkle,
  Image as ImageLucide,
  GalleryHorizontal, UserRound,
} from "lucide-react-native";

interface ScanResultDrawerProps {
  drawerState: {
    isDrawerOpen: boolean;
    isError: boolean;
    setDrawerOpen: (open: boolean) => void;
    saveResultCallback: () => void;
    isResultSaved: boolean;
    imageUri: string | null;
    xaiHeatmapUri: string | null;
    classification: string | null;
    confidence: number | null;
  };
}

type ConfidenceRemark = "Weak" | "Moderate" | "Strong"

function renderConfidenceRemark(confidence: number): ConfidenceRemark {
  if (confidence >= 90) return "Strong";
  if (confidence >= 70 && confidence <= 89) return "Moderate";
  return "Weak"
}

function renderSaveResultComponent(saveResultCallback: () => void, isResultSaved: boolean) {
  if (isResultSaved) {
    return (
      <Button className="flex-1" variant='outline' >
        <ButtonText>Result Saved</ButtonText>
      </Button>
    )
  }

  return (
    <Button
      onPress={() => {
        saveResultCallback();
      }}
      className="flex-1"
    >
      <ButtonText>Save and close</ButtonText>
    </Button>
  )
}


const ScanResultDrawer: React.FC<ScanResultDrawerProps> = ({ drawerState }) => {
  const [isXaiHeatmapShown, setIsXaiHeatmapShown] = useState(false);
  const isPredictionDone = drawerState.classification && drawerState.confidence && drawerState.imageUri;

  function handleSetXaiHeatmapShown() {
    if (drawerState.xaiHeatmapUri) {
      setIsXaiHeatmapShown(!isXaiHeatmapShown);
    }
  }

  return (
    <Drawer
      isOpen={drawerState.isDrawerOpen}
      onClose={() => {
        drawerState.setDrawerOpen(false);
      }}
      size="lg"
      anchor="bottom"
    >
      <DrawerBackdrop />
      <DrawerContent>
        <DrawerHeader>
          {drawerState.classification && drawerState.confidence ? (
            <VStack className="">
              <Heading size="xl" className="text-left">
                {drawerState.classification}
              </Heading>

              <Text className="text-typography-400">
                {drawerState.confidence}% {renderConfidenceRemark(drawerState.confidence)} Confidence
              </Text>
            </VStack>
          ) : (
            /*<VStack className="flex overflow-visible">*/
            <SkeletonText _lines={2} speed={4} className="h-6 rounded-md" />
            /*<Skeleton variant="rounded" className="h-4 w-1/2" />*/
            /*</VStack>*/
          )}
        </DrawerHeader>
        <DrawerBody className=" border-red-500">
          {drawerState.imageUri ? (
            <Center className="border-green-500 min-w-full">
              <Pressable onPress={handleSetXaiHeatmapShown}>
                <Image
                  size="2xl"
                  className=" rounded-md min-w-full"
                  alt="classification-image"
                  source={{
                    uri: isXaiHeatmapShown && drawerState.xaiHeatmapUri ? drawerState.xaiHeatmapUri : drawerState.imageUri,
                  }}
                />

                {!isPredictionDone && (
                  <>
                    <LottieView
                      style={styles.animation}
                      source={require("@/assets/animations/scan-animation.json")}
                      autoPlay
                      loop
                    />


                  </>

                )}

                {drawerState.xaiHeatmapUri && (
                  <Text className="mt-2 opacity-50 text-center">
                    {isXaiHeatmapShown ? ("Tap to view original Image") : ("Tap to view XAI Heatmap")}
                  </Text>
                )}
              </Pressable>

              {renderAiPrompts()}


            </Center>
          ) : (
            <Skeleton variant="rounded" className="h-full w-full border  " />
          )}
        </DrawerBody>

        {drawerState.confidence && drawerState.classification && drawerState.imageUri && (
          <DrawerFooter>
            {renderSaveResultComponent(drawerState.saveResultCallback, drawerState.isResultSaved)}
          </DrawerFooter>
        )}

      </DrawerContent>
    </Drawer>
  );
};


const renderAiPrompts = () => {
  return (
    <VStack className="w-full mt-8">


      <HStack className="gap-2 items-center opacity-50">
        <Bot color="white" className="size-sm" />
        <Text className="font-bold">AI Responses</Text>
      </HStack>

      <Button
        variant="link"
        onPress={() => {
          console.log("fetchingggg")
          // getStreamingCompletion("Explain quantum physics", (text) => {
          //   console.log("Stream:", text);
          // });
          getCompletion()
        }}
        className="flex-1 w-full justify-start"
      >
        <ButtonText >What are the possible treatments?</ButtonText>
      </Button>

      <Button
        variant="link"
        onPress={() => {
          console.log("fetchingggg")
          // getStreamingCompletion("Explain quantum physics", (text) => {
          //   console.log("Stream:", text);
          // });
          getCompletion()
        }}
        className="flex-1 w-full justify-start"
      >
        <ButtonText>How bad is this, and what should I expect?</ButtonText>
      </Button>


      <Button
        variant="link"
        onPress={() => {
          console.log("fetchingggg")
          // getStreamingCompletion("Explain quantum physics", (text) => {
          //   console.log("Stream:", text);
          // });
          getCompletion()
        }}
        className="flex-1 w-full justify-start"
      >
        <ButtonText>How can I avoid this in the future?</ButtonText>
      </Button>
    </VStack>
  )
}

const styles = StyleSheet.create({
  animation: {
    width: 500,
    height: 250,
    position: "absolute",
    alignSelf: "center",
    flex: 1, // Allows the animation to fill the parent container
    backgroundColor: "transparent",
  },
});

export default ScanResultDrawer;
