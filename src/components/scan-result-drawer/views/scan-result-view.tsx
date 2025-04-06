import { Center } from "@/src/components/ui/center";
import {
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
} from "@/src/components/ui/drawer";
import { Heading } from "@/src/components/ui/heading";
import { Image } from "@/src/components/ui/image";
import { Skeleton, SkeletonText } from "@/src/components/ui/skeleton";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import LottieView from "lottie-react-native";
import React, { useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { AiPrompts } from "@/src/components/scan-result-drawer/components/ai-prompts";
import { renderConfidenceRemark } from "../confidence-remark";
import { renderSaveResultComponent } from "../components/save-result-button";
import { AiSession, DrawerState } from "../types";
import { Button, ButtonText, ButtonIcon } from "../../ui/button";
import { HStack } from "../../ui/hstack";
import { Icon } from "../../ui/icon";
import { Sparkles } from "lucide-react-native";

type ScanResultViewProps = {
  drawerState: DrawerState;
  onAskAiAction: () => void;
};

export const ScanResultView: React.FC<ScanResultViewProps> = ({
  drawerState,
  onAskAiAction,
}) => {
  const [isXaiHeatmapShown, setIsXaiHeatmapShown] = useState(false);
  const isPredictionDone =
    drawerState.classification &&
    drawerState.confidence &&
    drawerState.imageUri;
  const canSaveResult =
    drawerState.confidence &&
    drawerState.classification &&
    drawerState.imageUri;
  const hasResults = drawerState.classification && drawerState.confidence;

  function handleSetXaiHeatmapShown() {
    if (drawerState.xaiHeatmapUri) {
      setIsXaiHeatmapShown(!isXaiHeatmapShown);
    }
  }

  return (
    <>
      <DrawerHeader>
        {hasResults ? (
          <VStack>
            <Heading size="xl" className="text-left">
              {drawerState.classification}
            </Heading>
            <Text className="text-typography-400">
              {drawerState.confidence}%{" "}
              {renderConfidenceRemark(drawerState.confidence ?? 0)} Confidence
            </Text>
          </VStack>
        ) : (
          <SkeletonText _lines={2} speed={4} className="h-6 rounded-md" />
        )}
      </DrawerHeader>

      <DrawerBody className="overflow-auto">
        {!drawerState.imageUri ? (
          <Skeleton variant="rounded" className="h-full w-full" />
        ) : (
          <Center>
            <Pressable onPress={handleSetXaiHeatmapShown}>
              <Image
                size="2xl"
                className="rounded-md min-w-full"
                alt="classification-image"
                source={{
                  uri:
                    isXaiHeatmapShown && drawerState.xaiHeatmapUri
                      ? drawerState.xaiHeatmapUri
                      : drawerState.imageUri,
                }}
              />
              {drawerState.xaiHeatmapUri && (
                <Text className="mt-2 opacity-50 text-center">
                  {isXaiHeatmapShown
                    ? "Tap to view original Image"
                    : "Tap to view XAI Heatmap"}
                </Text>
              )}
            </Pressable>

            {!isPredictionDone && (
              <LottieView
                style={styles.animation}
                source={require("@/assets/animations/scan-animation.json")}
                autoPlay
                loop
              />
            )}

            {hasResults && (
              <Button
                className="gap-2 items-center mb-2 w-full mt-8 h-16 rounded-xl"
                variant="outline"
                onPress={() => onAskAiAction()}
              >
                <ButtonIcon as={Sparkles} className="text-primary-500" />
                <ButtonText className="font-bold">Ask AI</ButtonText>
              </Button>
            )}
          </Center>
        )}
      </DrawerBody>

      {canSaveResult && (
        <DrawerFooter className="flex flex-col flex-1 gap-4">
          {renderSaveResultComponent(
            drawerState.saveResultCallback,
            drawerState.isResultSaved
          )}
          {/* <Button className=" w-full" variant="link">
                        <ButtonText>Close</ButtonText>
                    </Button> */}
        </DrawerFooter>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  animation: {
    width: 500,
    height: 250,
    position: "absolute",
    alignSelf: "center",
    flex: 1,
    backgroundColor: "transparent",
  },
});
