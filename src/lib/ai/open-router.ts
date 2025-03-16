import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import { z } from "zod";

const apiKey = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY as string;

export const getAiResult = async (modelName: string) => {
  const openrouter = createOpenRouter({
    apiKey,
  });

  const result = await streamText({
    model: openrouter(modelName),
    prompt: "list four watermelon diseases in a concise manner",
  });

  console.log(result);
  return result.toDataStreamResponse();
};

export const getWeather = async (modelName: string) => {
  const openrouter = createOpenRouter({
    apiKey: "${API_KEY_REF}",
  });

  const result = await streamText({
    model: openrouter(modelName),
    prompt: "What is the weather in San Francisco, CA in Fahrenheit?",
    tools: {
      getCurrentWeather: {
        description: "Get the current weather in a given location",
        parameters: z.object({
          location: z
            .string()
            .describe("The city and state, e.g. San Francisco, CA"),
          unit: z.enum(["celsius", "fahrenheit"]).optional(),
        }),
        execute: async ({ location, unit = "celsius" }) => {
          // Mock response for the weather
          const weatherData = {
            "Boston, MA": {
              celsius: "15°C",
              fahrenheit: "59°F",
            },
            "San Francisco, CA": {
              celsius: "18°C",
              fahrenheit: "64°F",
            },
          };

          const weather = weatherData[location];
          if (!weather) {
            return `Weather data for ${location} is not available.`;
          }

          return `The current weather in ${location} is ${weather[unit]}.`;
        },
      },
    },
  });
  return result.toDataStreamResponse();
};
