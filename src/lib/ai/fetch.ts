import axios from "axios";
import { fetch as expoFetch } from "expo/fetch";
import { throttle } from "lodash";
import { startTransition } from "react";

const API_KEY = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY as string;
const model = "google/gemma-2-9b-it:free";

export async function getAiResponse(prompt: string) {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // console.log(response.data.choices[0].message.content);

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
  }
}

export async function getAiResponseStream(prompt, onData, onDone: () => void) {
  // Track total accumulated content between throttled calls
  let accumulatedContent = "";

  // Create a throttled version of onData using lodash
  const throttledOnData = throttle((content) => {
    onData(content);
    accumulatedContent = ""; // Reset accumulated content after sending
  }, 300);

  const response = await expoFetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Accept: "text/event-stream",
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        stream: true,
      }),
    }
  );

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("Response body is not readable");
  }

  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      while (true) {
        const lineEnd = buffer.indexOf("\n");
        if (lineEnd === -1) break;

        const line = buffer.slice(0, lineEnd).trim();
        buffer = buffer.slice(lineEnd + 1);

        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") break;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices[0]?.delta?.content;
            if (content) {
              // Accumulate content
              accumulatedContent += content;

              // Call the throttled function with the accumulated content

              startTransition(() => throttledOnData(accumulatedContent));
            }
          } catch (e) {
            console.error("Error parsing JSON chunk:", e);
          }
        }
      }
    }

    // Ensure any remaining accumulated content is sent
    // Use .flush() to call any pending throttled callbacks
    if (accumulatedContent) {
      throttledOnData.flush();
    }

    // Final fallback in case [DONE] wasn't caught properly
    onDone?.();
  } finally {
    reader.cancel();
  }

  console.log("AI RESPONSE STREAM COMPLETE");
}
