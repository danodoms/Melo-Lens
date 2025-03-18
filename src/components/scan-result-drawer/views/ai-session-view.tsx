import { Box } from "@/src/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/src/components/ui/button";
import { DrawerBody, DrawerHeader } from "@/src/components/ui/drawer";
import { Heading } from "@/src/components/ui/heading";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { Bot, MoveLeft } from "lucide-react-native";
import React from "react";
import Markdown from "react-native-markdown-display";
import { HStack } from "../../ui/hstack";
import { AiSession, DrawerState } from "../types";


type AiSessionViewProps = {
    drawerState: DrawerState;
    aiSession: AiSession;
    onBack: () => void;
};

export const AiSessionView: React.FC<AiSessionViewProps> = ({ drawerState, aiSession, onBack }) => (
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
