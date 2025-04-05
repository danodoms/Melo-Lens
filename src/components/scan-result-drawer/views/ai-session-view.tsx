import { Box } from "@/src/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/src/components/ui/button";
import { DrawerBody, DrawerHeader } from "@/src/components/ui/drawer";
import { Heading } from "@/src/components/ui/heading";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { Bot, LoaderCircle, MoveLeft, Sparkles } from "lucide-react-native";
import React from "react";
import Markdown from "react-native-markdown-display";
import { HStack } from "../../ui/hstack";
import { AiSession, DrawerState } from "./../types";
import { Icon } from "../../ui/icon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/src/hooks/useColorScheme";
import LottieView from "lottie-react-native";
import { StyleSheet } from "react-native";
import { Center } from "../../ui/center";

type AiSessionViewProps = {
  drawerState: DrawerState;
  aiSession: AiSession;
  onBack: () => void;
};

export const AiSessionView: React.FC<AiSessionViewProps> = ({
  drawerState,
  aiSession,
  onBack,
}) => {
  const colorScheme = useColorScheme();

  return (
    <>
      <DrawerHeader className="flex flex-wrap gap-2 items-center  border-red-500">
        <VStack className="">
          <HStack className="gap-2 items-center opacity-50">
            <Icon as={Sparkles} className="text-primary-500" />
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
      <DrawerBody className="border-red-500 overflow-auto">
        {/* <Text>{aiSession.prompt}</Text> */}

        {aiSession.isGenerating ? (
          // <Box className="mt-4 w-full rounded-md border-gray-300 text-white border h-full">
          // <Icon as={LoaderCircle} className="border border-red-500 w-full" size="xl" />
          // </Box>
          <Center className=" border-red-500 h-96">
            <LottieView
              style={styles.animation}
              source={require("@/assets/animations/ai-loading.json")}
              autoPlay
              loop
            />
          </Center>
        ) : (
          <Box className="mt-4 w-full rounded-md border-gray-300 text-primary-500">
            <Markdown
              style={{
                body: {
                  fontSize: 16,
                  color: Colors[colorScheme ?? "light"].tint,
                },
              }}
            >
              {aiSession.response.trim()}
            </Markdown>
          </Box>
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
