import { supabase } from '../lib/supabaseClient';
import type { Asset, Style } from '../types';
import { AppError } from '../utils/errorHandler';

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
  try {
    const blob = dataUriToBlob(imageDataUrl);
    // Sanitize filename: remove/replace non-ASCII characters and spaces
    const sanitizedName = assetName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^\x00-\x7F]/g, '') // Remove non-ASCII characters
      .replace(/\s+/g, '-') // Replace spaces with dashes
      .replace(/[^a-zA-Z0-9-_]/g, '') // Remove special characters except dash and underscore
      .toLowerCase() || 'asset'; // Fallback to 'asset' if empty
    const fileName = `${sanitizedName}-${Date.now()}.png`;
    const filePath = `${fileName}`; // Remove 'public/' prefix - not needed if bucket is public

    console.log('Uploading image:', { fileName, filePath, blobSize: blob.size });

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('assets-storage')
      .upload(filePath, blob, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'image/png',
      });

    if (uploadError) {
      console.error('Error uploading image to Supabase:', {
        error: uploadError,
        message: uploadError.message,
        statusCode: uploadError.statusCode,
      });

      // Provide more specific error messages
      if (uploadError.message.includes('new row violates row-level security policy')) {
        throw new AppError(
          'Storage access denied. Please check if the "assets-storage" bucket exists and has proper policies configured.',
          'STORAGE_POLICY_ERROR',
          uploadError
        );
      }

      if (uploadError.message.includes('Bucket not found')) {
        throw new AppError(
          'Storage bucket "assets-storage" not found. Please create it in Supabase Dashboard.',
          'BUCKET_NOT_FOUND',
          uploadError
        );
      }

      throw new AppError(`Failed to upload image: ${uploadError.message}`, 'UPLOAD_ERROR', uploadError);
    }

    console.log('Upload successful:', uploadData);

    const { data: urlData } = supabase.storage.from('assets-storage').getPublicUrl(filePath);

    if (!urlData.publicUrl) {
      throw new AppError('Could not get public URL for uploaded image.', 'UPLOAD_ERROR');
    }

    console.log('Public URL generated:', urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    console.error('Unexpected error during image upload:', error);
    throw new AppError('Unexpected error during image upload.', 'UPLOAD_ERROR', error);
  }
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
        image_url: assetData.imageUrl,
        style: assetData.style,
        workspace_id: assetData.workspaceId,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error adding asset to Supabase:', error);
    throw new AppError('Failed to save asset metadata.', 'DATABASE_ERROR', error);
  }

  // Convert snake_case to camelCase
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    imageUrl: data.image_url,
    style: data.style,
    workspaceId: data.workspace_id,
    createdAt: data.created_at,
  } as Asset;
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
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching assets from Supabase:', error);
    throw new AppError('Failed to fetch assets.', 'DATABASE_ERROR', error);
  }

  // Convert snake_case to camelCase
  return (data || []).map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    imageUrl: item.image_url,
    style: item.style,
    workspaceId: item.workspace_id,
    createdAt: item.created_at,
  })) as Asset[];
};
