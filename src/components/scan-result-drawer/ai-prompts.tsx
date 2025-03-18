import React, { useState } from "react";
import { Bot } from "lucide-react-native";
import { Button, ButtonText } from "@/src/components/ui/button";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { HStack } from "@/src/components/ui/hstack";
import { getCompletion } from "../../lib/ai/fetch";



export const RenderAiPrompts = ({ drawerState, setAiResponse }: { drawerState: any, setAiResponse: (response: string) => void }) => {

    const prompts = [
        "What are the possible treatments?",
        "How bad is this, and what should I expect?",
        "How can I avoid this in the future?"
    ]

    const generatePrompt = (prompt: string) => {
        const promptPrefix = "In a concise manner,";
        return `${promptPrefix} ${prompt} for ${drawerState.classification}`;
    }

    const handleAiPrompt = async (prompt: string) => {
        const response = await getCompletion(prompt);
        setAiResponse(response);
    };



    return (
        <VStack className="w-full mt-8">
            <HStack className="gap-2 items-center opacity-50">
                <Bot color="white" className="size-sm" />
                <Text className="font-bold">AI Responses</Text>
            </HStack>

            {prompts.map((prompt, index) =>
                <Button variant="link" key={prompt + index} onPress={() => handleAiPrompt(generatePrompt(prompt))} className="flex-1 w-full justify-start">
                    <ButtonText>{prompt}</ButtonText>
                </Button>
            )}
        </VStack>
    );
};

