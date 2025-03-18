import axios from "axios";

const API_KEY = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY as string;

const model = "google/gemma-2-9b-it:free";

export async function getStreamingCompletion(
  userMessage: string,
  callback: (text: string) => void
) {
  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          stream: true, // ✅ Enables streaming
          messages: [{ role: "user", content: userMessage }],
        }),
      }
    );

    if (!response.ok || !response.body) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      while (true) {
        const lineEnd = buffer.indexOf("\n");
        if (lineEnd === -1) break;

        const line = buffer.slice(0, lineEnd).trim();
        buffer = buffer.slice(lineEnd + 1); // Remove processed line

        if (!line.startsWith("data: ")) continue; // ✅ Ignore unwanted messages

        const data = line.slice(6);
        if (data === "[DONE]") break; // ✅ Stop when streaming ends

        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) callback(content); // ✅ Send valid text to callback
        } catch (e) {
          console.warn("Invalid JSON chunk:", data, e);
        }
      }
    }
  } catch (error) {
    console.error("Streaming Error:", error);
  }
}

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
