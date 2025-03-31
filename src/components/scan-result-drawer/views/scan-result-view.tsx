
import { Center } from "@/src/components/ui/center";
import { DrawerBody, DrawerFooter, DrawerHeader } from "@/src/components/ui/drawer";
import { Heading } from "@/src/components/ui/heading";
import { Image } from "@/src/components/ui/image";
import { Skeleton, SkeletonText } from "@/src/components/ui/skeleton";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import LottieView from "lottie-react-native";
import React, { useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { AiPrompts } from "../ai-prompts";
import { renderConfidenceRemark } from "../confidence-remark";
import { renderSaveResultComponent } from "../save-result-button";
import { AiSession, DrawerState } from "../types";
import { Button, ButtonText } from "../../ui/button";



type ScanResultViewProps = {
    drawerState: DrawerState;
    setAiSession: (session: AiSession) => void;
    setIsAiPageShown: (shown: boolean) => void;
};




export const ScanResultView: React.FC<ScanResultViewProps> = ({ drawerState, setAiSession, setIsAiPageShown }) => {
    const [isXaiHeatmapShown, setIsXaiHeatmapShown] = useState(false);
    const isPredictionDone = drawerState.classification && drawerState.confidence && drawerState.imageUri;
    const canSaveResult = drawerState.confidence && drawerState.classification && drawerState.imageUri;
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
                            {drawerState.confidence}% {renderConfidenceRemark(drawerState.confidence ?? 0)} Confidence
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
                                source={{ uri: isXaiHeatmapShown && drawerState.xaiHeatmapUri ? drawerState.xaiHeatmapUri : drawerState.imageUri }}
                            />
                            {drawerState.xaiHeatmapUri && (
                                <Text className="mt-2 opacity-50 text-center">
                                    {isXaiHeatmapShown ? "Tap to view original Image" : "Tap to view XAI Heatmap"}
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

                        {hasResults &&
                            AiPrompts({
                                drawerState,
                                setAiSession: (aiSession: AiSession) => {
                                    setIsAiPageShown(true);
                                    setAiSession(aiSession);
                                }
                            }
                            )}

                    </Center>
                )}
            </DrawerBody>

            {canSaveResult && (
                <DrawerFooter className="flex flex-col flex-1 gap-4">
                    {renderSaveResultComponent(drawerState.saveResultCallback, drawerState.isResultSaved)}
                    {/* <Button className=" w-full" variant="link">
                        <ButtonText>Close</ButtonText>
                    </Button> */}
                </DrawerFooter>
            )}
        </>
    )
}


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