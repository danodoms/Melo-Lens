import { Button, ButtonText } from "@/src/components/ui/button";
import { HStack } from "@/src/components/ui/hstack";
import { VStack } from "@/src/components/ui/vstack";
import React from "react";
import { Text } from "../../ui/text";
import { Icon } from "../../ui/icon";
import { BotMessageSquare } from "lucide-react-native";
import { useState } from "react";

import {
  Radio,
  RadioGroup,
  RadioIndicator,
  RadioLabel,
  RadioIcon,
} from "@/src/components/ui/radio";
import { CircleIcon } from "@/src/components/ui/icon";

type Language = "en" | "fil" | "ceb";

type AiPromptsProps = {
  classification: string;
  // language: Language;
  onLanguageChange: (lang: Language) => void;
  onAiPromptPress: (prompt: string, fullPrompt: string) => void;
  className?: string;
};

const defaultPrompts = {
  en: [
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
  ],
  fil: [
    "Ano ang mga mabisang lunas dito?",
    "Gaano kaseryoso ang problemang ito?",
    "Paano ko ito maiiwasan sa hinaharap?",
    "Ano ang mga unang sintomas na dapat bantayan?",
    "May mga organic na lunas ba na epektibo?",
    "Paano nakakaapekto ang panahon sa problemang ito?",
    "Gaano katagal bago gumaling ang halaman?",
    "Pwede ba itong makahawa sa ibang halaman?",
    "Gaano kadalas dapat itong imonitor?",
    "Ano ang unang dapat kong gawin kapag nakita ko ito?",
  ],
  ceb: [
    "Unsa'y pinakaepektibong tambal ani?",
    "Unsa ka grabe ni nga problema?",
    "Unsaon nako paglikay ani sa umaabot?",
    "Unsa ang mga unang simtomas nga angay bantayan?",
    "Aduna bay epektibong organikong tambal?",
    "Giunsa pag-apekto sa panahon ning problemaha?",
    "Unsa kadugay ang pag-ayo sa tanom?",
    "Makabalhin ba ni sa ubang tanom?",
    "Pila ka beses kinahanglan i-monitor ni?",
    "Unsa akong buhaton una kung makita nako ni?",
  ],
};

const getPromptPrefix = (lang: Language, classification: string): string => {
  switch (lang) {
    case "fil":
      return `Isa kang eksperto sa sakit ng halaman. Ibinigay na ang pakwan ay may "${classification}", magbigay ng impormasyon tungkol sa mga sintomas, sanhi, at mga estratehiya sa paggamot. Iwasang magbigay ng medikal o beterinaryong payo.`;
    case "ceb":
      return `Usa ka eksperto sa sakit sa tanom. Gihatag nga ang pakwan adunay "${classification}", ihatag ang mga sintomas, hinungdan, ug mga pamaagi sa pagdumala. Likayi ang paghatag og medikal o beterinaryo nga tambag.`;
    default:
      return `You are an expert in plant pathology. Given that the user classified their watermelon as having "${classification}", provide insights on symptoms, causes, and management strategies. Avoid giving medical or veterinary advice.`;
  }
};

export const AiPrompts: React.FC<AiPromptsProps> = ({
  classification,
  // language,
  onLanguageChange,
  onAiPromptPress,
  className,
}) => {
  const [language, setLanguage] = useState<"en" | "fil" | "ceb">("en");
  const prompts = defaultPrompts[language];

  return (
    <VStack className={`w-full ${className}`}>
      <Text className="text-right w-full py-2 font-medium opacity-50">
        Select a prompt
      </Text>

      <HStack className="flex-wrap gap-1 justify-end">
        {prompts.map((prompt, index) => {
          const prefix = getPromptPrefix(language, classification);
          const fullPrompt = `${prefix} ${prompt}. Include specific symptoms, causes, treatments, and preventive measures. Keep the response clear and actionable. Make it very concise and easy to understand.`;

          return (
            <Button
              variant="link"
              key={prompt + index}
              onPress={() => onAiPromptPress(prompt, fullPrompt)}
              className="justify-end bg-background-muted px-4 rounded-full rounded-br-md py-2"
            >
              <Icon as={BotMessageSquare} className="opacity-70" />
              <ButtonText className="font-normal">{prompt}</ButtonText>
            </Button>
          );
        })}
      </HStack>

      <Text className="text-right w-full py-2 font-medium opacity-50 mt-4">
        Prompt Language
      </Text>

      <RadioGroup
        className="justify-end items-end"
        value={language}
        onChange={(value) => {
          onLanguageChange(value as Language);
          setLanguage(value);
        }}
      >
        <Radio value="en" size="md">
          <RadioLabel>English</RadioLabel>
          <RadioIndicator>
            <RadioIcon as={CircleIcon} />
          </RadioIndicator>
        </Radio>
        <Radio value="fil" size="md">
          <RadioLabel>Filipino</RadioLabel>
          <RadioIndicator>
            <RadioIcon as={CircleIcon} />
          </RadioIndicator>
        </Radio>
        <Radio value="ceb" size="md">
          <RadioLabel>Cebuano</RadioLabel>
          <RadioIndicator>
            <RadioIcon as={CircleIcon} />
          </RadioIndicator>
        </Radio>
      </RadioGroup>
    </VStack>
  );
};
