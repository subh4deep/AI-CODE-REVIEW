import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const SYSTEM_INSTRUCTION = `Your existing prompt...`;

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

async function generateContent(prompt) {
  const maxRetries = 3;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash", // ✅ stable + fast
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

      return response.text;

    } catch (error) {
      console.error(`Gemini Error (Attempt ${i + 1}):`, error.message);

      if (
        (error.message.includes("503") ||
         error.message.includes("UNAVAILABLE")) &&
        i < maxRetries - 1
      ) {
        console.log("Retrying...");
        await sleep(2000);
      } else {
        throw error;
      }
    }
  }
}

export default generateContent;