
import { GoogleGenAI } from "@google/genai";
import type { Style } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateIcon = async (
  assetName: string,
  assetDescription: string,
  style: Style
): Promise<string> => {
  const prompt = `Nano banana-themed icon asset. A high-quality, detailed icon of a ${assetName}, described as: ${assetDescription}. The icon should have a ${style.style} style, made of ${style.material} with a ${style.finish} finish and ${style.texture} texture. The background should be simple and clean.`;

  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png',
        aspectRatio: '1:1',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      return `data:image/png;base64,${base64ImageBytes}`;
    } else {
      throw new Error("Image generation failed, no images returned.");
    }
  } catch (error) {
    console.error("Error generating icon with Gemini API:", error);
    throw new Error("Failed to generate image. Please check the console for details.");
  }
};
