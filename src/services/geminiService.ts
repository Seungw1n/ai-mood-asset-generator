import type { Style } from '../types';
import { config } from '../config/env';
import { AppError } from '../utils/errorHandler';

export const generateIcon = async (
  assetName: string,
  assetDescription: string,
  style: Style
): Promise<string> => {
  const prompt = `Nano banana-themed icon asset. A high-quality, detailed icon of a ${assetName}, described as: ${assetDescription}. The icon should have a ${style.style} style, made of ${style.material} with a ${style.finish} finish and ${style.texture} texture. The background should be simple and clean.`;

  try {
    // Call our proxy API instead of direct Gemini API
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.gemini.model,
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
          aspectRatio: '1:1',
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new AppError(
        errorData.message || errorData.error || 'Failed to generate image',
        'GENERATION_ERROR'
      );
    }

    const data = await response.json();

    if (data.generatedImages && data.generatedImages.length > 0) {
      const base64ImageBytes = data.generatedImages[0].image.imageBytes;
      return `data:image/png;base64,${base64ImageBytes}`;
    } else {
      throw new AppError("Image generation failed, no images returned.", 'GENERATION_ERROR');
    }
  } catch (error) {
    console.error("Error generating icon with Gemini API:", error);

    // Re-throw if already an AppError
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      "Failed to generate image. Please try again.",
      'GENERATION_ERROR',
      error
    );
  }
};