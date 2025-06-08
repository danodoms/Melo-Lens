import axios from "axios";
import { fetch as expoFetch } from "expo/fetch";
import { throttle } from "lodash";
import { startTransition } from "react";

const API_KEY = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY as string;
const model = "google/gemma-2-9b-it:free";
const models = [
  "google/gemma-3-12b-it:free",
  "meta-llama/llama-3.3-8b-instruct:free",
  "google/gemma-2-9b-it:free",
];
// const model = "openrouter/auto";

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

// import { throttle } from "lodash";
// import { startTransition } from "react";

export async function getAiResponseStream(
  messages,
  onData,
  onDone: () => void
) {
  let accumulatedContent = "";

  const throttledOnData = throttle((content) => {
    onData(content);
    accumulatedContent = ""; // Reset after sending
  }, 300);

  let response;
  try {
    response = await expoFetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Accept: "text/event-stream",
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // model,
          models,
          messages,
          stream: true,
        }),
      }
    );

    if (response.status === 402) {
      console.warn(
        "OpenRouter 402: You may be out of credits or over your free limit."
      );
      onData(
        "⚠️ Error 402: You're out of credits or have exceeded your free request limit."
      );
      onDone?.();
      return;
    }

    if (!response.ok) {
      const errMsg = `❌ Request failed with status ${response.status}`;
      console.error(errMsg);
      onData(errMsg);
      onDone?.();
      return;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      onData("⚠️ Failed to read response body.");
      onDone?.();
      return;
    }

    const decoder = new TextDecoder();
    let buffer = "";

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
              accumulatedContent += content;
              startTransition(() => throttledOnData(accumulatedContent));
            }
          } catch (e) {
            console.error("Error parsing streamed JSON chunk:", e);
          }
        }
      }
    }

    if (accumulatedContent) {
      throttledOnData.flush();
    }

    onDone?.();
    console.log("✅ AI response stream complete");
  } catch (error) {
    console.error("❌ getAiResponseStream error:", error);
    onData("⚠️ An unexpected error occurred while connecting to AI.");
    onDone?.();
  }
}
