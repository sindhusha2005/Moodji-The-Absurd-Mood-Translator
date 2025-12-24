
import { GoogleGenAI } from "@google/genai";
import { TranslationResponse } from "../types";

export const translateMoodToEmojis = async (mood: string): Promise<TranslationResponse> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    
    // We want the model to be chaotic and not necessarily accurate
    const systemInstruction = `
      You are the "Absurd Mood Translator". 
      Your job is to take a user's mood or sentence and translate it into a sequence of 4 to 7 random emojis.
      DO NOT be accurate. BE WEIRD. 
      If they are sad, give them a dinosaur, a taco, and a top hat. 
      If they are happy, give them a ghost, a fire extinguisher, and a banana.
      Respond ONLY with emojis. No text, no explanations. 
      The goal is to be funny and nonsensical.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: mood,
      config: {
        systemInstruction,
        temperature: 1.5, // High temperature for maximum chaos
        topP: 0.95,
      },
    });

    const emojis = response.text?.trim() || "❓❓❓";
    return { emojis };
  } catch (error) {
    console.error("Gemini Translation Error:", error);
    return { 
      emojis: "💥💀🍄", 
      error: "The AI had an existential crisis. Try again!" 
    };
  }
};
