import React, { useState } from "react";
import { Bot, Sparkles } from "lucide-react-native";
import { Button, ButtonText } from "@/src/components/ui/button";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { HStack } from "@/src/components/ui/hstack";
import { getAiResponse } from "../../../lib/ai/fetch";
import { AiSession, DrawerState } from "../types";
import { Icon } from "../../ui/icon";

type RenderAiPromptsProps = {
    drawerState: DrawerState;
    setAiSession: (aiSession: AiSession) => void;
};

export const AiPrompts: React.FC<RenderAiPromptsProps> = ({ drawerState, setAiSession }) => {

    const prompts = [
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

        setAiSession({ prompt, response: "Generating response...", isGenerating: true });
        console.log("generatingggg response")

        const response = await getAiResponse(generatePrompt(prompt));

        setAiSession({ prompt, response, isGenerating: false });
    };

    return (
        <VStack className="w-full mt-8">
            <HStack className="gap-2 items-center opacity-50 mb-2">
                <Icon as={Sparkles} className="text-primary-500" />
                <Text className="font-bold">Ask AI</Text>
            </HStack>

            <HStack className="max-h-64 flex-wrap gap-2 pb-8 overflow-auto">
                {prompts.map((prompt, index) => (
                    <Button
                        variant="link"
                        key={prompt + index}
                        onPress={() => handleAiPrompt(prompt)}
                        className="whitespace-nowrap justify-start bg-tertiary-500 px-4 rounded-full rounded-tl-none"
                    >
                        <ButtonText className="text-background-0">{prompt}</ButtonText>
                    </Button>
                ))}
            </HStack>
        </VStack>
    );
};

