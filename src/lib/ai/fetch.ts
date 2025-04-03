import axios from "axios";

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

export const getAiResponseStream = async (prompt, onData) => {
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model, // Adjust model if necessary
        messages: [{ role: "user", content: prompt }],
        stream: true,
      }),
      redirect: "follow",
    }
  );

  console.log("API KEY IS: ", API_KEY);
  // console.log(`Bearer ${API_KEY}`);

  console.log("RESPONSE: ", response);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let done = false;
  while (!done) {
    const { value, done: readerDone } = await reader.read();
    done = readerDone;
    if (value) {
      const chunk = decoder.decode(value);
      onData(chunk); // Process each chunk of data
    }
  }
};
