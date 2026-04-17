import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function describeScene(base64Image: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            { text: "Analyze this image from a cyber-vision camera. Description should be in a cyberpunk aesthetic. Then, generate a creative 'Instagram prompt' or caption based on what you see. Keep it dramatic and tech-focused. Return in JSON format with 'description' and 'caption' fields." },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image,
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Error:", error);
    return { description: "ERROR: NEURAL LINK FAILED", caption: "SYSTEM_OFFLINE" };
  }
}
