import { GoogleGenAI } from "@google/genai";
import type { Style } from '../types';
import { config } from '../config/env';
import { AppError } from '../utils/errorHandler';

let ai: GoogleGenAI | null = null;

const getAiClient = (): GoogleGenAI => {
  if (ai) {
    return ai;
  }

  // Use API key from environment variable only
  const apiKey = config.gemini.apiKey;
  if (!apiKey) {
    throw new AppError("Gemini API key not configured. Please set VITE_GEMINI_API_KEY in your .env.local file.", 'CONFIG_ERROR');
  }

  ai = new GoogleGenAI({ apiKey });
  return ai;
};

export const resetAiClient = () => {
  ai = null;
};

export const generateIcon = async (
  assetName: string,
  assetDescription: string,
  style: Style
): Promise<string> => {
  const prompt = `Nano banana-themed icon asset. A high-quality, detailed icon of a ${assetName}, described as: ${assetDescription}. The icon should have a ${style.style} style, made of ${style.material} with a ${style.finish} finish and ${style.texture} texture. The background should be simple and clean.`;

  try {
    const client = getAiClient();
    const response = await client.models.generateImages({
      model: config.gemini.model,
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
      throw new AppError("Image generation failed, no images returned.", 'GENERATION_ERROR');
    }
  } catch (error) {
    console.error("Error generating icon with Gemini API:", error);

    // Reset client on auth error in case the key is bad
    if (error instanceof Error && error.message.includes('API key not valid')) {
       resetAiClient();
       throw new AppError("Invalid Gemini API key. Please check your VITE_GEMINI_API_KEY in .env.local file.", 'AUTH_ERROR', error);
    }

    // Re-throw if already an AppError
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      "Failed to generate image. Please check your API key and try again.",
      'GENERATION_ERROR',
      error
    );
  }
};