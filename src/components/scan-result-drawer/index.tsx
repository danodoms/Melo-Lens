import React, { useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import Markdown from "react-native-markdown-display";
import { Box } from "@/src/components/ui/box";
import { Button, ButtonText } from "@/src/components/ui/button";
import { Center } from "@/src/components/ui/center";
import { Drawer, DrawerBackdrop, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader } from "@/src/components/ui/drawer";
import { Heading } from "@/src/components/ui/heading";
import { Image } from "@/src/components/ui/image";
import { Skeleton, SkeletonText } from "@/src/components/ui/skeleton";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { RenderAiPrompts } from "./ai-prompts";
import { renderSaveResultComponent } from "./save-result-button";
import { renderConfidenceRemark } from "./confidence-remark";

export type DrawerState = {
    isDrawerOpen: boolean;
    isError: boolean;
    setDrawerOpen: (open: boolean) => void;
    saveResultCallback: () => void;
    isResultSaved: boolean;
    imageUri: string | null;
    xaiHeatmapUri: string | null;
    classification: string | null;
    confidence: number | null;
}

type ScanResultDrawerProps = {
    drawerState: DrawerState;
}

const ScanResultDrawer: React.FC<ScanResultDrawerProps> = ({ drawerState }) => {
    const [aiResponse, setAiResponse] = useState<string>("test");
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
            onClose={() => drawerState.setDrawerOpen(false)}
            size="lg"
            anchor="bottom"
        >
            <DrawerBackdrop />
            <DrawerContent>
                <DrawerHeader>
                    {drawerState.classification && drawerState.confidence ? (
                        <VStack>
                            <Heading size="xl" className="text-left">
                                {drawerState.classification}
                            </Heading>
                            <Text className="text-typography-400">
                                {drawerState.confidence}% {renderConfidenceRemark(drawerState.confidence)} Confidence
                            </Text>
                        </VStack>
                    ) : (
                        <SkeletonText _lines={2} speed={4} className="h-6 rounded-md" />
                    )}
                </DrawerHeader>

                <DrawerBody>
                    {drawerState.imageUri ? (
                        <Center>
                            <Pressable onPress={handleSetXaiHeatmapShown}>
                                <Image
                                    size="2xl"
                                    className="rounded-md min-w-full"
                                    alt="classification-image"
                                    source={{
                                        uri: isXaiHeatmapShown && drawerState.xaiHeatmapUri ? drawerState.xaiHeatmapUri : drawerState.imageUri,
                                    }}
                                />
                                {!isPredictionDone && (
                                    <LottieView
                                        style={styles.animation}
                                        source={require("@/assets/animations/scan-animation.json")}
                                        autoPlay
                                        loop
                                    />
                                )}
                                {drawerState.xaiHeatmapUri && (
                                    <Text className="mt-2 opacity-50 text-center">
                                        {isXaiHeatmapShown ? "Tap to view original Image" : "Tap to view XAI Heatmap"}
                                    </Text>
                                )}
                            </Pressable>

                            {RenderAiPrompts({ drawerState, setAiResponse })}

                            <Box className="mt-4 w-full rounded-md border-gray-300 text-white">
                                <Markdown style={{ body: { fontSize: 16, color: "white" } }}>
                                    {aiResponse.trim()}
                                </Markdown>
                            </Box>
                        </Center>
                    ) : (
                        <Skeleton variant="rounded" className="h-full w-full" />
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

export default ScanResultDrawer;
