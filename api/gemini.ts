import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Only POST is supported.' });
  }

  try {
    // Get API key from environment variable (server-side only)
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key not configured on server.' });
    }

    // Extract request body
    const { model, prompt, config: imageConfig } = req.body;

    if (!model || !prompt) {
      return res.status(400).json({ error: 'Missing required fields: model and prompt.' });
    }

    // Initialize Gemini client
    const ai = new GoogleGenAI({ apiKey });

    // Call Gemini API
    const response = await ai.models.generateImages({
      model,
      prompt,
      config: imageConfig || {
        numberOfImages: 1,
        outputMimeType: 'image/png',
        aspectRatio: '1:1',
      },
    });

    // Return the response
    return res.status(200).json(response);
  } catch (error) {
    console.error('Error calling Gemini API:', error);

    // Handle different error types
    if (error instanceof Error) {
      return res.status(500).json({
        error: 'Failed to generate image',
        message: error.message
      });
    }

    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
}