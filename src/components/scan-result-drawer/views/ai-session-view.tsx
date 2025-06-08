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
import { FlashList } from "@shopify/flash-list";
import { MoveLeft, SendHorizonal, Sparkles } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import Markdown from "react-native-markdown-display";
import { Divider } from "../../ui/divider";
import { HStack } from "../../ui/hstack";
import { Icon } from "../../ui/icon";
import { Textarea, TextareaInput } from "../../ui/textarea";
import { AiPrompts } from "../components/ai-prompts";
import { AiSession, DrawerState, type Message } from "./../types";

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

  const [language, setLanguage] = useState<"en" | "fil" | "ceb">("en");

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

  function buildMessages(
    prompts: string[],
    responses: string[],
    limit: number
  ): Message[] {
    const messages: Message[] = [];

    // Ensure we don’t go below zero
    const start = Math.max(prompts.length - limit, 0);

    for (let i = start; i < prompts.length; i++) {
      messages.push({ role: "user", content: prompts[i] });

      if (responses[i]) {
        messages.push({ role: "assistant", content: responses[i] });
      }
    }

    return messages;
  }

  const handleAiPrompt = (prompt: string, fullPrompt: string) => {
    const newMessages = buildMessages(
      [...aiSession.prompts, fullPrompt],
      aiSession.responses,
      5
    );

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
      newMessages,
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
      <DrawerHeader className="flex flex-wrap items-start mt-4 flex-col">
        <HStack className="justify-between w-full">
          <HStack className="gap-2 items-center">
            <Icon as={Sparkles} className="text-primary-500" />
            <Heading className="font-bold">Ask AI</Heading>
          </HStack>

          <Button onPress={onBack} className="rounded-full">
            <ButtonIcon as={MoveLeft} />
            <ButtonText>Back</ButtonText>
          </Button>
        </HStack>

        {/* <HStack className="justify-start opacity-50 font-medium items-center">
          <Text className="font-medium">Classification - </Text>
          <Text className="font-medium">{drawerState.classification}</Text>
        </HStack> */}
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
                onAiPromptPress={(prompt, fullPrompt) =>
                  handleAiPrompt(prompt, fullPrompt)
                }
                // language={language}
                className="mt-4"
                onLanguageChange={() => {}}
                classification={drawerState.classification ?? ""}
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

      <DrawerFooter className="flex flex-col bg-background-50 rounded-xl">
        <Textarea
          size="md"
          isReadOnly={false}
          isInvalid={false}
          isDisabled={false}
          className="rounded-xl px-4 border-none outline-none border-0"
        >
          <TextareaInput
            placeholder={`Ask anything about ${drawerState.classification}`}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={() => {
              if (inputText.trim()) {
                handleAiPrompt(inputText.trim(), inputText.trim());
                setInputText("");
              }
            }}
            // blurOnSubmit={true}
            returnKeyType="send"
          />
        </Textarea>

        <Divider />

        <HStack className="flex justify-between w-full items-center p-4">
          <HStack className="flex gap-1 items-center text-primary-500">
            <Icon as={Sparkles} size="lg" className="mr-1 text-tertiary-500" />
            <Text className="font-bold text-tertiary-500">Melo</Text>
            <Text className="font-bold text-tertiary-500">Lens</Text>
          </HStack>

          <Button
            onPress={() => {
              if (inputText.trim()) {
                handleAiPrompt(inputText.trim(), inputText.trim());
                setInputText("");
              }
            }}
            disabled={aiSession.isGenerating}
            className="rounded-full"
          >
            <ButtonText>Send</ButtonText>
            <ButtonIcon as={SendHorizonal} />
          </Button>
        </HStack>
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
