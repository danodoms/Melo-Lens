import { Button, ButtonText } from "@/src/components/ui/button";
import { HStack } from "@/src/components/ui/hstack";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { Sparkles } from "lucide-react-native";
import React from "react";
import { Icon } from "@/src/components/ui/icon";

type AiPromptsProps = {
  prompts: string[];
  onAiPrompt: (prompt: string) => void;
};

export const AiPrompts: React.FC<AiPromptsProps> = ({
  prompts,
  onAiPrompt,
}) => {
  return (
    <VStack className="w-full mt-8">
      <HStack className="max-h-64 flex-wrap gap-2 pb-16 overflow-y-auto">
        {prompts.map((prompt, index) => (
          <Button
            variant="link"
            key={prompt + index}
            onPress={() => onAiPrompt(prompt)}
            className="whitespace-nowrap justify-start bg-accent-0 px-4 rounded-full rounded-tl-none"
          >
            <ButtonText className="text-gray-900">{prompt}</ButtonText>
          </Button>
        ))}
      </HStack>
    </VStack>
  );
};
