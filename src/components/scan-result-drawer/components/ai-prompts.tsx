import { Button, ButtonText } from "@/src/components/ui/button";
import { HStack } from "@/src/components/ui/hstack";
import { VStack } from "@/src/components/ui/vstack";
import React from "react";
import { Text } from "../../ui/text";
import { Icon } from "../../ui/icon";
import { BotMessageSquare } from "lucide-react-native";

type AiPromptsProps = {
  prompts: string[];
  onAiPromptPress: (prompt: string) => void;
  className?: string;
};

export const AiPrompts: React.FC<AiPromptsProps> = ({
  prompts,
  onAiPromptPress,
  className,
}) => {
  return (
    <VStack className={`w-full ${className} `}>
      <Text className="text-right w-full py-2 font-medium opacity-50">
        Select a prompt
      </Text>
      <HStack className="flex-wrap gap-1 justify-end">
        {prompts.map((prompt, index) => (
          <Button
            variant="link"
            key={prompt + index}
            onPress={() => onAiPromptPress(prompt)}
            className="whitespace-nowrap justify-end bg-background-muted px-4 rounded-full rounded-br-md"
          >
            <Icon as={BotMessageSquare} className="opacity-50"></Icon>
            <ButtonText className="font-normal">{prompt}</ButtonText>
          </Button>
        ))}
      </HStack>
    </VStack>
  );
};
