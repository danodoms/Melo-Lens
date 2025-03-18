import React, { useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import Markdown from "react-native-markdown-display";
import { Box } from "@/src/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/src/components/ui/button";
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
import { Bot, MoveLeft } from "lucide-react-native";
import { HStack } from "../ui/hstack";

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

export type AiSession = {
    prompt: string;
    response: string;
}

const ScanResultDrawer: React.FC<ScanResultDrawerProps> = ({ drawerState }) => {
    const [aiSession, setAiSession] = useState<AiSession>({ prompt: "", response: "" });
    const [isAiPageShown, setIsAiPageShown] = useState(false);

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
        <Drawer
            isOpen={drawerState.isDrawerOpen}
            onClose={() => drawerState.setDrawerOpen(false)}
            size="lg"
            anchor="bottom"
        >
            <DrawerBackdrop />
            <DrawerContent>

                {/* Render AI Response Page if it's shown */}
                {isAiPageShown ? (
                    <AiResponseView drawerState={drawerState} aiSession={aiSession} onBack={() => setIsAiPageShown(false)} />
                ) : (
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

                        <DrawerBody>
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

                                    {/* AI Response Trigger */}
                                    {RenderAiPrompts({
                                        drawerState,
                                        setAiSession: (aiSession: AiSession) => {
                                            setIsAiPageShown(true);
                                            setAiSession(aiSession);
                                        }
                                    })}
                                </Center>
                            )}
                        </DrawerBody>

                        {
                            canSaveResult && (
                                <DrawerFooter>
                                    {renderSaveResultComponent(drawerState.saveResultCallback, drawerState.isResultSaved)}
                                </DrawerFooter>
                            )
                        }
                    </>
                )}
            </DrawerContent >
        </Drawer >
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


type AiResponseViewProps = {
    drawerState: DrawerState;
    aiSession: AiSession;
    onBack: () => void;
};

const AiResponseView: React.FC<AiResponseViewProps> = ({ drawerState, aiSession, onBack }) => (
    <>
        <DrawerHeader className="flex flex-wrap gap-2 items-center  border-red-500">

            <VStack className="">
                <HStack className="gap-2 items-center opacity-50">
                    <Bot color="white" className="size-sm" />
                    <Text className="font-bold">Ask AI</Text>
                </HStack>

                <Heading size="lg" className="">
                    {aiSession.prompt}
                </Heading>
            </VStack>


            <Button onPress={onBack} className="">
                <ButtonIcon as={MoveLeft} />
                <ButtonText>Back</ButtonText>
            </Button>
        </DrawerHeader>
        <DrawerBody>
            {/* <Text>{aiSession.prompt}</Text> */}
            <Box className="mt-4 w-full rounded-md border-gray-300 text-white">
                <Markdown style={{ body: { fontSize: 16, color: "white" } }}>
                    {aiSession.response.trim()}
                </Markdown>
            </Box>
        </DrawerBody>
    </>
);

export default ScanResultDrawer;
