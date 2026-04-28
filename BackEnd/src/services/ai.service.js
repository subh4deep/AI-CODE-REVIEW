import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const SYSTEM_INSTRUCTION = `Your existing prompt...`;

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

// 🔹 Primary model
async function callPrimaryModel(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash", // ⚡ main model
    contents: [
      {
        role: "system",
        parts: [{ text: SYSTEM_INSTRUCTION }],
      },
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  });

  return response.response.text(); // ✅ correct
}

// 🔹 Fallback model (less quota usage)
async function callFallbackModel(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-lite", // 🪶 fallback
    contents: [
      {
        role: "system",
        parts: [{ text: SYSTEM_INSTRUCTION }],
      },
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  });

  return response.response.text(); // ✅ correct
}

// 🔹 Main service function
async function generateContent(prompt) {
  const maxRetries = 3;

  for (let i = 0; i < maxRetries; i++) {
    try {
      // Try primary model
      return await callPrimaryModel(prompt);

    } catch (error) {
      console.error(`Gemini Error (Attempt ${i + 1}):`, error.message);

      // 🔸 Handle quota exceeded (429)
      if (error.message.includes("429") || error.message.includes("RESOURCE_EXHAUSTED")) {
        console.log("⚠️ Quota exceeded → switching to fallback model");
        return await callFallbackModel(prompt);
      }

      // 🔸 Handle server busy (503)
      if (
        (error.message.includes("503") || error.message.includes("UNAVAILABLE")) &&
        i < maxRetries - 1
      ) {
        console.log("Retrying after delay...");
        await sleep(5000); // wait 5 sec
        continue;
      }

      // 🔸 Other errors
      throw error;
    }
  }
}

export default generateContent;