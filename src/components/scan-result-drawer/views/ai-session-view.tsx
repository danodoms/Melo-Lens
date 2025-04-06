import { Box } from "@/src/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/src/components/ui/button";
import { DrawerBody, DrawerHeader } from "@/src/components/ui/drawer";
import { Heading } from "@/src/components/ui/heading";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { Bot, LoaderCircle, MoveLeft, Sparkles } from "lucide-react-native";
import React, { useState } from "react";
import Markdown from "react-native-markdown-display";
import { HStack } from "../../ui/hstack";
import { AiSession, DrawerState } from "./../types";
import { Icon } from "../../ui/icon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/src/hooks/useColorScheme";
import LottieView from "lottie-react-native";
import { StyleSheet } from "react-native";
import { Center } from "../../ui/center";
import { getAiResponseStream2 } from "@/src/lib/ai/fetch";
import { AiPrompts } from "../components/ai-prompts";

type AiSessionViewProps = {
  drawerState: DrawerState;
  onBack: () => void;
};

export const AiSessionView: React.FC<AiSessionViewProps> = ({
  drawerState,
  onBack,
}) => {
  const colorScheme = useColorScheme();

  const [aiSession, setAiSession] = useState<AiSession>({
    prompt: "Select a prompt",
    response: "",
    isGenerating: false,
  });

  const [showPrompts, setShowPrompts] = useState(true); // NEW STATE

  const defaultPrompts = [
    "What treatments work best for this?",
    "How serious is this issue?",
    "How can I prevent this in the future?",
    "What early symptoms should I watch for?",
    "Are there effective organic treatments?",
    "How does weather affect this problem?",
    "How long does recovery take?",
    "Can this spread to other plants?",
    "How often should I monitor for this?",
    "What should be my first response?",
  ];

  const handleAiPrompt = (prompt: string) => {
    const promptPrefix = `You are an expert in plant pathology. Given that the user classified their watermelon as having "${drawerState.classification}", provide insights on symptoms, causes, and management strategies. Avoid giving medical or veterinary advice.`;
    const fullPrompt = `${promptPrefix} ${prompt}. Include specific symptoms, causes, treatments, and preventive measures. Keep the response clear and actionable.`;

    console.log("sdjsadjksdsas");
    setAiSession({
      prompt,
      response: "Generating response...",
      isGenerating: true,
    });

    setShowPrompts(false); // HIDE PROMPTS when starting generation

    let responseStream = "";
    getAiResponseStream2(fullPrompt, (chunk: string) =>
      setAiSession({
        prompt,
        response: (responseStream += chunk),
        isGenerating: false,
      })
    );
  };

  const resetSession = () => {
    setAiSession({
      prompt: "Select a prompt",
      response: "",
      isGenerating: false,
    });
    setShowPrompts(true);
  };

  return (
    <>
      <DrawerHeader className="flex flex-wrap gap-2 items-center">
        <VStack>
          {!showPrompts && (
            <HStack className="gap-2 items-center opacity-50">
              <Icon as={Sparkles} className="text-primary-500" />
              <Text className="font-bold">Ask AI</Text>
            </HStack>
          )}
          <Heading size="lg">{aiSession.prompt}</Heading>
        </VStack>

        <Button onPress={onBack}>
          <ButtonIcon as={MoveLeft} />
          <ButtonText>Back</ButtonText>
        </Button>
      </DrawerHeader>

      <DrawerBody className="overflow-auto">
        {showPrompts ? (
          <AiPrompts prompts={defaultPrompts} onAiPrompt={handleAiPrompt} />
        ) : aiSession.isGenerating ? (
          <Center className="h-96">
            <LottieView
              style={styles.animation}
              source={require("@/assets/animations/ai-loading.json")}
              autoPlay
              loop
            />
          </Center>
        ) : (
          <>
            <Box className="mt-4 w-full rounded-md border-gray-300 text-primary-500">
              <Markdown
                style={{
                  body: {
                    fontSize: 14,
                    color: Colors[colorScheme ?? "light"].tint,
                  },
                }}
              >
                {aiSession.response.trim()}
              </Markdown>
            </Box>

            <Button
              onPress={resetSession}
              className="mt-4 self-start bg-primary-500"
            >
              <ButtonIcon as={Sparkles} />
              <ButtonText>Ask Again</ButtonText>
            </Button>
          </>
        )}
      </DrawerBody>
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
