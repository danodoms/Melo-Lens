import React, { useState } from "react";
import { Bot } from "lucide-react-native";
import { Button, ButtonText } from "@/src/components/ui/button";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { HStack } from "@/src/components/ui/hstack";
import { getAiResponse } from "../../lib/ai/fetch";
import { AiSession, DrawerState } from "./index";



type RenderAiPromptsProps = {
    drawerState: DrawerState;
    setAiSession: (aiSession: AiSession) => void;
};


export const RenderAiPrompts: React.FC<RenderAiPromptsProps> = ({ drawerState, setAiSession }) => {

    const prompts = [
        "What are the possible treatments?",
        "How bad is this, and what should I expect?",
        "How can I avoid this in the future?"
    ]


    const handleAiPrompt = async (prompt: string) => {
        function generatePrompt(prompt: string) {
            const promptPrefix = "In a concise manner,";
            return `${promptPrefix} ${prompt} for watermelon ${drawerState.classification}`;
        }

        const response = await getAiResponse(generatePrompt(prompt));

        setAiSession({ prompt, response });
    };



    return (
        <VStack className="w-full mt-8">
            <HStack className="gap-2 items-center opacity-50">
                <Bot color="white" className="size-sm" />
                <Text className="font-bold">Ask AI</Text>
            </HStack>

            {prompts.map((prompt, index) =>
                <Button variant="link" key={prompt + index} onPress={() => handleAiPrompt(prompt)} className="flex-1 w-full justify-start">
                    <ButtonText>{prompt}</ButtonText>
                </Button>
            )}
        </VStack>
    );
};

