import { supabase } from '../lib/supabaseClient';
import type { Asset, Style } from '../types';

// Helper function to convert a data URI to a Blob
const dataUriToBlob = (dataURI: string): Blob => {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
};

/**
 * Uploads an image to Supabase Storage.
 * @param imageDataUrl The base64 data URL of the image.
 * @param assetName The name of the asset, used for the filename.
 * @returns The public URL of the uploaded image.
 */
export const uploadImage = async (imageDataUrl: string, assetName: string): Promise<string> => {
  const blob = dataUriToBlob(imageDataUrl);
  const fileName = `${assetName.replace(/\s+/g, '-')}-${Date.now()}.png`;
  const filePath = `public/${fileName}`;

  const { error } = await supabase.storage
    .from('assets')
    .upload(filePath, blob, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Error uploading image to Supabase:', error);
    throw new Error('Failed to upload image.');
  }

  const { data } = supabase.storage.from('assets').getPublicUrl(filePath);

  if (!data.publicUrl) {
    throw new Error('Could not get public URL for uploaded image.');
  }

  return data.publicUrl;
};

/**
 * Creates a new asset record in the Supabase database.
 * @param assetData The asset data to be stored.
 * @returns The newly created asset object from the database.
 */
export const addAsset = async (assetData: Omit<Asset, 'id' | 'createdAt'>): Promise<Asset> => {
  const { data, error } = await supabase
    .from('assets')
    .insert([
      {
        name: assetData.name,
        description: assetData.description,
        imageUrl: assetData.imageUrl,
        style: assetData.style,
        workspaceId: assetData.workspaceId,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error adding asset to Supabase:', error);
    throw new Error('Failed to save asset metadata.');
  }

  return data as Asset;
};

/**
 * Fetches all assets for a given workspace from the Supabase database.
 * @param workspaceId The ID of the workspace.
 * @returns A promise that resolves to an array of assets.
 */
export const getAssets = async (workspaceId: string): Promise<Asset[]> => {
  const { data, error } = await supabase
    .from('assets')
    .select('*')
    .eq('workspaceId', workspaceId)
    .order('createdAt', { ascending: false });

  if (error) {
    console.error('Error fetching assets from Supabase:', error);
    throw new Error('Failed to fetch assets.');
  }

  return data as Asset[];
};
