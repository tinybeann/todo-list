import { GoogleGenAI } from "@google/genai";

export const useGeminiAi = async (content) => {
  const ai = new GoogleGenAI({ apiKey: "AIzaSyDzOgPgOfg-1MP7Xn7XNJG-MrjD_RWNWKI" });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: content,
  });

  return response.text;
}