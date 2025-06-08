import { Colors } from "@/constants/Colors";
import { Box } from "@/src/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/src/components/ui/button";
import {
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
} from "@/src/components/ui/drawer";
import { Heading } from "@/src/components/ui/heading";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { useColorScheme } from "@/src/hooks/useColorScheme";
import { getAiResponseStream } from "@/src/lib/ai/fetch";
import LottieView from "lottie-react-native";
import {
  ArrowUp,
  MoveLeft,
  MoveRight,
  MoveUp,
  SendHorizonal,
  Sparkles,
} from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import Markdown from "react-native-markdown-display";
import { Center } from "../../ui/center";
import { HStack } from "../../ui/hstack";
import { Icon } from "../../ui/icon";
import { AiPrompts } from "../components/ai-prompts";
import { AiSession, DrawerState } from "./../types";
import { Textarea, TextareaInput } from "../../ui/textarea";
import { Input, InputField } from "@/src/components/ui/input";
import { FlashList } from "@shopify/flash-list";
import { set } from "zod";

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
    prompts: [],
    responses: [],
    isGenerating: false,
  });

  // const [showPrompts, setShowPrompts] = useState(true); // NEW STATE
  const [inputText, setInputText] = useState("");

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

  const handleAiPrompt = (prompt: string, usePrefix = true) => {
    const promptPrefix = `You are an expert in plant pathology. Given that the user classified their watermelon as having "${drawerState.classification}", provide insights on symptoms, causes, and management strategies. Avoid giving medical or veterinary advice.`;
    const fullPrompt = usePrefix
      ? `${promptPrefix} ${prompt}. Include specific symptoms, causes, treatments, and preventive measures. Keep the response clear and actionable. Make it very concise and easy to understand.`
      : prompt;

    // Initialize the prompt and empty response, and set isGenerating to true
    setAiSession((prev) => ({
      ...prev,
      prompts: [...prev.prompts, prompt],
      responses: [...prev.responses, ""],
      isGenerating: true,
    }));

    const responseBuffer = { text: "" };
    let updated = false;

    getAiResponseStream(
      fullPrompt,
      (chunk: string) => {
        responseBuffer.text += chunk;

        if (!updated) {
          updated = true;
          requestAnimationFrame(() => {
            setAiSession((prev) => {
              const responses = [...prev.responses];
              responses[responses.length - 1] = responseBuffer.text;

              return {
                ...prev,
                responses,
              };
            });
            updated = false;
          });
        }
      },
      () => {
        // Called when stream is finished
        setAiSession((prev) => ({
          ...prev,
          isGenerating: false,
        }));
      }
    );
  };

  const messageList = aiSession.prompts.map((prompt, index) => ({
    id: `pair-${index}`,
    prompt,
    response: aiSession.responses[index],
  }));

  const renderChatItem = ({ item }: { item: (typeof messageList)[number] }) => (
    <React.Fragment key={item.id}>
      <Box className="whitespace-nowrap justify-end bg-background-muted flex-1 py-2 px-4 rounded-full my-2 rounded-br-md self-end">
        <Text className="font-normal text-right">{item.prompt}</Text>
      </Box>

      {item.response && (
        <Box className="w-full my-2 rounded-md border-gray-300 text-primary-500 self-start">
          <Markdown
            style={{
              body: {
                fontSize: 14,
                color: Colors[colorScheme ?? "light"].tint,
              },
            }}
          >
            {item.response}
          </Markdown>
        </Box>
      )}
    </React.Fragment>
  );

  return (
    <VStack className="h-full">
      <DrawerHeader className="flex flex-wrap gap-2 items-center mt-4">
        <VStack>
          <HStack className="gap-2 items-center">
            <Icon as={Sparkles} className="text-primary-500" />
            <Text className="font-bold text-2xl">Ask AI</Text>
          </HStack>
          {/* <Heading size="lg">{aiSession.prompt}</Heading> */}
        </VStack>

        <Button onPress={onBack} className="rounded-full">
          <ButtonIcon as={MoveLeft} />
          <ButtonText>Back</ButtonText>
        </Button>
      </DrawerHeader>

      <DrawerBody className="overflow-y-auto flex-1">
        <FlashList
          data={messageList}
          keyExtractor={(item) => item.id}
          renderItem={renderChatItem}
          estimatedItemSize={100}
          contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 16 }}
          ListFooterComponent={
            aiSession.isGenerating ? (
              <Text className="opacity-50">AI is generating...</Text>
            ) : (
              <AiPrompts
                prompts={defaultPrompts}
                onAiPromptPress={handleAiPrompt}
                className="mt-4"
              />
            )
          }
        />

        {/* {aiSession.isGenerating && (
          <Center className="h-96">
            <LottieView
              style={styles.animation}
              source={require("@/assets/animations/ai-loading.json")}
              autoPlay
              loop
            />
          </Center>
        )} */}
      </DrawerBody>

      <DrawerFooter className="">
        <Textarea
          size="md"
          isReadOnly={false}
          isInvalid={false}
          isDisabled={false}
          className="rounded-xl p-4"
        >
          <Icon
            as={Sparkles}
            size="sm"
            className="absolute top-4 right-4 opacity-70"
          />
          <TextareaInput
            placeholder="Ask anything"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={() => {
              if (inputText.trim()) {
                handleAiPrompt(inputText.trim(), false);
                setInputText("");
              }
            }}
            // blurOnSubmit={true}
            returnKeyType="send"
          />
          <Button
            onPress={() => {
              if (inputText.trim()) {
                handleAiPrompt(inputText.trim(), false);
                setInputText("");
              }
            }}
            disabled={aiSession.isGenerating}
            className="mt-2 self-end rounded-full"
          >
            <ButtonText>Send</ButtonText>
            <ButtonIcon as={SendHorizonal} />
          </Button>
        </Textarea>
      </DrawerFooter>
    </VStack>
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
