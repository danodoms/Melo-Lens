import React, { useState } from "react";
import { Bot } from "lucide-react-native";
import { Button, ButtonText } from "@/src/components/ui/button";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { HStack } from "@/src/components/ui/hstack";
import { getAiResponse } from "../../lib/ai/fetch";
import { AiSession, DrawerState } from "./types";

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
            // const promptPrefix = "In a concise manner,";
            // return `${promptPrefix} ${prompt} for watermelon ${drawerState.classification}`;

            //this prefix controls how the ai response, and is based on prompt engineering best practices
            // const promptPrefix = `You are an expert in plant pathology. Given that the user has classified their watermelon as having "${drawerState.classification}", provide detailed insights on the following:`;
            const promptPrefix = `You are an expert in plant pathology. Given that the user classified their watermelon as having "${drawerState.classification}", provide insights on symptoms, causes, and management strategies. Avoid giving medical or veterinary advice.`
            return `${promptPrefix} ${prompt}. Include specific symptoms, causes, treatments, and preventive measures.Keep the response clear and actionable.`;
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

